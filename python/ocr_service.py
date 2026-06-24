import os
import re
import sys
import json
import requests
from datetime import datetime
from io import BytesIO

import pytesseract
from PIL import Image, ImageFilter, ImageEnhance, ImageOps

# Intentar importar OpenCV para procesamiento avanzado
try:
    import cv2
    import numpy as np
    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

# Configurar ruta de Tesseract en Windows
if sys.platform == 'win32':
    _tesseract_paths = [
        r'C:\Program Files\Tesseract-OCR\tesseract.exe',
        r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
        os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Tesseract-OCR', 'tesseract.exe'),
        os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Programs', 'Tesseract-OCR', 'tesseract.exe'),
    ]
    for _path in _tesseract_paths:
        if os.path.isfile(_path):
            pytesseract.pytesseract.tesseract_cmd = _path
            break

class OCRService:
    TOTAL_PATTERNS = [
        r'TOTAL\s*[.:]\s*Bs\.?\s*([\d]{1,3}(?:\.[\d]{3})*(?:\.[\d]{1,2})?)',
        r'TOTAL\s*[.:]\s*BOB\s*([\d]{1,3}(?:\.[\d]{3})*(?:\.[\d]{1,2})?)',
        r'TOTAL\s*(?:GENERAL|A\s*PAGAR|FACTURA|VENTA|NETO)?\s*[:\s=>\-]*\s*(?:Bs\.?|BOB|USD|\$)?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)',
        r'TOTAL[.:\s]*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)',
        r'(?:Bs\.?|BOB)\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)\s*(?:TOTAL)',
        r'(?:^|\n)\s*TOTAL\s*(?:Bs\.?|BOB)?\s*[.:]?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)\s*$',
        r'(?:IMPORTE|MONTO)\s*TOTAL\s*[:\s=>\-]*\s*(?:Bs\.?|BOB|USD|\$)?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)',
        r'TOTAL\s*[:\s=>\-]*\s*(?:Bs\.?|BOB|USD|\$)?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)',
        r'Bs\.?\s*([\d]{1,3}(?:\.[\d]{3})*(?:\.[\d]{1,2})?)',
        r'BOB\s*([\d]{1,3}(?:\.[\d]{3})*(?:\.[\d]{1,2})?)',
    ]

    SUBTOTAL_PATTERNS = [
        r'SUB\s*-?\s*TOTAL\s*[:\s=>\-]*\s*(?:Bs\.?|BOB|USD|\$)?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)',
        r'SUBTOTAL[.:\s]*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)',
    ]

    IMPUESTO_PATTERNS = [
        r'(?:IVA|I\.?V\.?A\.?|IMPUESTO|ICE|I\.?T\.?)\s*(?:\(\d+%?\))?\s*[:\s=>\-]*\s*(?:Bs\.?|BOB|USD|\$)?\s*([\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)',
        r'IMPUESTO[.:\s]*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})?)',
    ]

    FECHA_PATTERNS = [
        r'(?:FECHA|Fecha|fecha)\s*(?:de\s*)?(?:emisi[oó]n|factura)?\s*[:\s=>\-]*\s*(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4})',
        r'(?:FECHA|Fecha|fecha)\s*[:\s=>\-]*\s*(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4})',
        r'(\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{4})',
    ]

    NRO_FACTURA_PATTERNS = [
        r'(?:FACTURA|Factura)\s*(?:N[°ºo.]\s*|NRO\.?\s*|#\s*)[:\s]*(\d[\d\-/]*\d)',
        r'N[°ºo.]\s*(?:de\s*)?(?:FACTURA|Factura|factura)\s*[:\s]*(\d[\d\-/]*\d)',
        r'(?:NRO|NUMERO|N[°ºo])\s*[:\s]*(\d[\d\-/]*\d)',
        r'(?:FACTURA|Factura)\s*[:\s]*(\d{3,})',
    ]

    NIT_PATTERNS = [
        r'(?:NIT|N\.?I\.?T\.?|R\.?U\.?C\.?)\s*[:\s=>\-]*\s*(\d[\d\.\-]+\d)',
        r'NIT[.:\s]*(\d[\d\-]+)',
    ]

    PROVEEDOR_PATTERNS = [
        r'(?:RAZ[OÓ]N\s*SOCIAL|EMPRESA|NOMBRE\s*(?:O\s*)?COMERCIAL|PROVEEDOR|EMISOR|SE[ÑN]OR(?:\(A\)|ES)?)\s*[:\s=>\-]*\s*([^\n]{3,80})',
        r'(?:PROVEEDOR|EMISOR)[.:\s]*([^\n]{3,80})',
    ]

    MONEDA_PATTERNS = [
        r'(BOB|Bs\.?|Bolivianos)',
        r'(USD|\$US|D[oó]lares)',
    ]

    def process_factura(self, url: str) -> dict:
        try:
            image = self._download_image(url)
            if image is None:
                raise Exception("No se pudo descargar o abrir la imagen")

            all_texts = self._multi_pass_ocr(image)

            if not all_texts:
                raise Exception("No se pudo extraer texto legible de la imagen")

            parsed_data = self._parse_invoice_data_multi(all_texts)

            if parsed_data.get('total'):
                parsed_data['total'] = self._validate_and_correct_total(
                    parsed_data['total'], all_texts
                )

            best_text = max(all_texts, key=len)
            
            # Serialize dates for JSON output
            fecha_parsed_str = None
            if parsed_data.get('fecha_parsed'):
                fecha_parsed_str = parsed_data['fecha_parsed'].isoformat()
            
            datos_ocr = {
                'texto_crudo': best_text[:2000],
                'total': parsed_data.get('total'),
                'subtotal': parsed_data.get('subtotal'),
                'impuestos': parsed_data.get('impuestos'),
                'moneda': parsed_data.get('moneda', 'BOB'),
                'numero_factura_extraido': parsed_data.get('numero_factura'),
                'fecha_factura_extraida': parsed_data.get('fecha'),
                'fecha_parsed': fecha_parsed_str,
                'proveedor_extraido': parsed_data.get('proveedor'),
                'nit': parsed_data.get('nit'),
                'confianza': parsed_data.get('confianza', 0),
                'lineas_detalle': parsed_data.get('lineas_detalle', []),
            }

            return {"success": True, "data": datos_ocr}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def _download_image(self, url: str) -> Image.Image:
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            
            # simple check for pdf
            if url.lower().endswith('.pdf') or 'application/pdf' in response.headers.get('content-type', ''):
                try:
                    from pdf2image import convert_from_bytes
                    images = convert_from_bytes(
                        response.content, first_page=1, last_page=1, dpi=300
                    )
                    if images:
                        return images[0]
                except ImportError:
                    raise Exception("Para procesar PDFs se requiere pdf2image y poppler.")
            else:
                return Image.open(BytesIO(response.content))

        except requests.RequestException as e:
            raise Exception(f"Error al descargar imagen: {str(e)}")

    def _multi_pass_ocr(self, image: Image.Image) -> list:
        results = []

        img_hires = self._upscale_image(image)
        text = self._run_ocr_optimized(img_hires)
        if text and len(text.strip()) >= 5:
            results.append(text)

        img_gray = self._preprocess_grayscale_contrast(image)
        text = self._run_ocr_optimized(img_gray)
        if text and len(text.strip()) >= 5:
            results.append(text)

        img_bin_med = self._preprocess_binary(image, threshold=140)
        text = self._run_ocr_optimized(img_bin_med)
        if text and len(text.strip()) >= 5:
            results.append(text)

        img_bin_low = self._preprocess_binary(image, threshold=100)
        text = self._run_ocr_optimized(img_bin_low)
        if text and len(text.strip()) >= 5:
            results.append(text)

        img_bin_high = self._preprocess_binary(image, threshold=180)
        text = self._run_ocr_optimized(img_bin_high)
        if text and len(text.strip()) >= 5:
            results.append(text)

        img_adaptive = self._preprocess_adaptive(image)
        text = self._run_ocr_optimized(img_adaptive)
        if text and len(text.strip()) >= 5:
            results.append(text)

        if HAS_OPENCV:
            img_low_ink = self._preprocess_low_ink(image)
            text = self._run_ocr_optimized(img_low_ink)
            if text and len(text.strip()) >= 5:
                results.append(text)

            img_morph = self._preprocess_morphological(image)
            text = self._run_ocr_optimized(img_morph)
            if text and len(text.strip()) >= 5:
                results.append(text)

        img_inverted = ImageOps.invert(self._preprocess_grayscale_contrast(image))
        text = self._run_ocr_optimized(img_inverted)
        if text and len(text.strip()) >= 5:
            results.append(text)

        text_data = self._run_ocr_with_data(img_gray)
        if text_data:
            results.append(text_data)

        return results

    def _upscale_image(self, image: Image.Image) -> Image.Image:
        img = image.copy()
        width, height = img.size
        if width < 2000:
            scale = 2000 / width
            new_size = (int(width * scale), int(height * scale))
            img = img.resize(new_size, Image.LANCZOS)
        return img

    def _preprocess_grayscale_contrast(self, image: Image.Image) -> Image.Image:
        img = self._upscale_image(image)
        img = img.convert('L')
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.5)
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(3.0)
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.2)
        return img

    def _preprocess_binary(self, image: Image.Image, threshold: int = 140) -> Image.Image:
        img = self._upscale_image(image)
        img = img.convert('L')
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.0)
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.0)
        img = img.point(lambda x: 0 if x < threshold else 255, '1')
        return img

    def _preprocess_adaptive(self, image: Image.Image) -> Image.Image:
        img = self._upscale_image(image)
        img = img.convert('L')
        from PIL import ImageStat
        stat = ImageStat.Stat(img)
        avg_brightness = stat.mean[0] if stat.mean else 128
        if avg_brightness < 100:
            img = ImageOps.invert(img)
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(2.5)
        img = img.filter(ImageFilter.MedianFilter(size=3))
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(2.0)
        return img

    def _preprocess_low_ink(self, image: Image.Image) -> Image.Image:
        if not HAS_OPENCV:
            return self._preprocess_grayscale_contrast(image)
        img = self._upscale_image(image)
        img = img.convert('L')
        img_np = np.array(img)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        img_np = clahe.apply(img_np)
        img = Image.fromarray(img_np)
        img = img.filter(ImageFilter.MedianFilter(size=3))
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(3.0)
        return img

    def _preprocess_morphological(self, image: Image.Image) -> Image.Image:
        if not HAS_OPENCV:
            return self._preprocess_binary(image, threshold=100)
        img = self._upscale_image(image)
        img = img.convert('L')
        img_np = np.array(img)
        _, binary = cv2.threshold(img_np, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        kernel = np.ones((2, 2), np.uint8)
        dilated = cv2.dilate(binary, kernel, iterations=1)
        return Image.fromarray(dilated)

    def _get_available_langs(self):
        try:
            langs = pytesseract.get_languages()
            return [l for l in langs if l != 'osd']
        except Exception:
            return ['eng']

    def _get_lang_string(self):
        available = self._get_available_langs()
        if 'spa' in available and 'eng' in available:
            return 'spa+eng'
        elif 'spa' in available:
            return 'spa'
        elif 'eng' in available:
            return 'eng'
        return available[0] if available else 'eng'

    def _run_ocr_optimized(self, image: Image.Image) -> str:
        lang = self._get_lang_string()
        configs = [
            f'--oem 3 --psm 6 -c tessedit_char_whitelist="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzñÑáéíóúÁÉÍÓÚ.,:;()[]/\\- BsTOTALFAURSUBIMPUESVANIT "',
            f'--oem 3 --psm 3 -l {lang}',
            f'--oem 3 --psm 4 -l {lang}',
            f'--oem 3 --psm 11 -l {lang}',
        ]
        for config in configs:
            try:
                text = pytesseract.image_to_string(image, config=config)
                if text and len(text.strip()) >= 10:
                    return text
            except Exception:
                continue
        try:
            return pytesseract.image_to_string(image)
        except Exception:
            return ''

    def _run_ocr(self, image: Image.Image) -> str:
        return self._run_ocr_optimized(image)

    def _run_ocr_with_data(self, image: Image.Image) -> str:
        lang = self._get_lang_string()
        try:
            config = f'--oem 3 --psm 6 -l {lang}'
            data = pytesseract.image_to_data(
                image, config=config, output_type=pytesseract.Output.DICT
            )
            high_conf_words = []
            current_line = -1
            for i, word in enumerate(data['text']):
                conf = int(data['conf'][i]) if data['conf'][i] != '-1' else -1
                line_num = data['line_num'][i]
                if line_num != current_line and current_line != -1:
                    high_conf_words.append('\n')
                current_line = line_num
                if conf >= 40 and word.strip():
                    high_conf_words.append(word)
            return ' '.join(high_conf_words)
        except Exception:
            return ''

    def _parse_invoice_data_multi(self, texts: list) -> dict:
        data = {
            'confianza': 0,
            'lineas_detalle': [],
        }
        fields_found = 0
        total_fields = 5

        total = self._extract_best_total(texts)
        if total is not None:
            data['total'] = total
            fields_found += 1

        for text in texts:
            subtotal = self._extract_pattern(text, self.SUBTOTAL_PATTERNS)
            if subtotal:
                data['subtotal'] = self._parse_number(subtotal)
                break

        for text in texts:
            impuesto = self._extract_pattern(text, self.IMPUESTO_PATTERNS)
            if impuesto:
                data['impuestos'] = self._parse_number(impuesto)
                break

        for text in texts:
            fecha = self._extract_pattern(text, self.FECHA_PATTERNS)
            if fecha:
                parsed_date = self._parse_date(fecha)
                if parsed_date:
                    data['fecha'] = fecha
                    data['fecha_parsed'] = parsed_date
                    fields_found += 1
                    break

        for text in texts:
            numero = self._extract_pattern(text, self.NRO_FACTURA_PATTERNS)
            if numero:
                data['numero_factura'] = numero.strip()
                fields_found += 1
                break

        for text in texts:
            nit = self._extract_pattern(text, self.NIT_PATTERNS)
            if nit:
                data['nit'] = nit.strip()
                fields_found += 1
                break

        for text in texts:
            proveedor = self._extract_pattern(text, self.PROVEEDOR_PATTERNS)
            if proveedor:
                clean = proveedor.strip().rstrip(':').strip()
                if len(clean) >= 3:
                    data['proveedor'] = clean[:200]
                    fields_found += 1
                    break

        for text in texts:
            moneda_match = self._extract_pattern(text, self.MONEDA_PATTERNS)
            if moneda_match:
                m = moneda_match.strip()
                if m in ('BOB', 'Bs', 'Bs.', 'Bolivianos'):
                    data['moneda'] = 'BOB'
                elif m in ('USD', '$US', 'Dólares', 'Dolares'):
                    data['moneda'] = 'USD'
                else:
                    data['moneda'] = 'BOB'
                break
        if 'moneda' not in data:
            data['moneda'] = 'BOB'

        best_text = max(texts, key=len) if texts else ''
        data['lineas_detalle'] = self._extract_line_items(best_text)

        if data.get('total') and data.get('subtotal') and data.get('impuestos'):
            expected = round(data['subtotal'] + data['impuestos'], 2)
            if abs(expected - data['total']) < 1.0:
                fields_found = min(fields_found + 1, total_fields)

        data['confianza'] = round((fields_found / total_fields) * 100, 1)
        return data

    def _extract_best_total(self, texts: list) -> float:
        candidates = []
        for text in texts:
            for pattern in self.TOTAL_PATTERNS:
                matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    value = self._parse_number(match.group(1))
                    if value > 0:
                        line = self._get_line_containing(text, match.start())
                        priority = 10
                        upper_line = line.upper()
                        if 'TOTAL GENERAL' in upper_line or 'TOTAL A PAGAR' in upper_line:
                            priority = 50
                        elif 'TOTAL' in upper_line and 'SUB' not in upper_line:
                            priority = 40
                        elif 'IMPORTE' in upper_line:
                            priority = 30
                        candidates.append({'value': value, 'priority': priority})

            for line in text.split('\n'):
                upper = line.upper().strip()
                if 'TOTAL' in upper and 'SUB' not in upper:
                    numbers = re.findall(r'[\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?', line)
                    for num_str in numbers:
                        value = self._parse_number(num_str)
                        if value > 0:
                            candidates.append({'value': value, 'priority': 35})

            lines = [l for l in text.split('\n') if l.strip()]
            last_lines = lines[-10:] if len(lines) > 10 else lines
            for line in last_lines:
                numbers = re.findall(r'[\d]{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?', line)
                for num_str in numbers:
                    value = self._parse_number(num_str)
                    if value >= 10:
                        candidates.append({'value': value, 'priority': 5})

        if not candidates:
            return None

        candidates.sort(key=lambda c: (c['priority'], c['value']), reverse=True)
        best = candidates[0]
        if best['priority'] >= 30:
            return best['value']

        all_values = [c['value'] for c in candidates if c['value'] >= 10]
        if all_values:
            return max(all_values)

        return candidates[0]['value'] if candidates else None

    def _get_line_containing(self, text: str, pos: int) -> str:
        start = text.rfind('\n', 0, pos) + 1
        end = text.find('\n', pos)
        if end == -1:
            end = len(text)
        return text[start:end]

    def _extract_pattern(self, text: str, patterns: list) -> str:
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
            if match:
                return match.group(1)
        return None

    def _parse_number(self, value: str) -> float:
        if not value:
            return 0.0
        try:
            cleaned = re.sub(r'[^\d.,\s]', '', value.strip()).replace(' ', '')
            if not cleaned: return 0.0

            if cleaned.count('.') >= 2:
                parts = cleaned.split('.')
                if len(parts[-1]) <= 2:
                    cleaned = f"{''.join(parts[:-1])}.{parts[-1]}"
                else:
                    cleaned = cleaned.replace('.', '')
            elif '.' in cleaned and ',' in cleaned:
                last_dot = cleaned.rindex('.')
                last_comma = cleaned.rindex(',')
                if last_comma > last_dot:
                    cleaned = cleaned.replace('.', '').replace(',', '.')
                else:
                    cleaned = cleaned.replace(',', '')
            elif ',' in cleaned and '.' not in cleaned:
                parts = cleaned.split(',')
                if len(parts) >= 2 and len(parts[-1]) <= 2:
                    cleaned = f"{''.join(parts[:-1])}.{parts[-1]}"
                else:
                    cleaned = cleaned.replace(',', '')
            elif '.' in cleaned and ',' not in cleaned:
                parts = cleaned.split('.')
                if len(parts) == 2 and len(parts[1]) == 3:
                    cleaned = cleaned.replace('.', '')
                elif len(parts) > 2:
                    cleaned = cleaned.replace('.', '')

            result = float(cleaned)
            return round(result, 2)
        except (ValueError, TypeError):
            return 0.0

    def _validate_and_correct_total(self, total: float, texts: list) -> float:
        if total <= 0: return total
        for text in texts:
            alt_patterns = [
                r'(?:TOTAL|Bs\.?|BOB)\s*[.:]?\s*([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))',
                r'([\d]{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))\s*(?:Bs\.?|BOB)?\s*$',
            ]
            for pattern in alt_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                for match in matches:
                    alt_total = self._parse_number(match)
                    if alt_total > 0 and 0 < abs(alt_total - total) < total * 0.1:
                        if len(match.replace('.', '').replace(',', '')) >= 4:
                            return alt_total
        return total

    def _parse_date(self, date_str: str) -> datetime:
        if not date_str: return None
        formats = [
            '%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y',
            '%d/%m/%y', '%d-%m-%y', '%d.%m.%y',
            '%Y/%m/%d', '%Y-%m-%d',
            '%m/%d/%Y', '%m-%d-%Y',
        ]
        for fmt in formats:
            try:
                parsed = datetime.strptime(date_str.strip(), fmt)
                if parsed.year > 2030 or parsed.year < 2000: continue
                return parsed
            except ValueError:
                continue
        return None

    def _extract_line_items(self, text: str) -> list:
        items = []
        pattern = r'([A-Za-záéíóúñÁÉÍÓÚÑ\s]{3,})\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)'
        matches = re.findall(pattern, text)
        for match in matches[:20]:
            try:
                desc = match[0].strip()
                if len(desc) < 3 or desc.upper() in ['TOTAL', 'SUBTOTAL', 'IVA', 'DESCUENTO']:
                    continue
                items.append({
                    'descripcion': desc,
                    'cantidad': self._parse_number(match[1]),
                    'precio_unitario': self._parse_number(match[2]),
                    'total': self._parse_number(match[3]),
                })
            except (IndexError, ValueError):
                continue
        return items


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No url provided"}))
        sys.exit(1)
        
    image_url = sys.argv[1]
    service = OCRService()
    result = service.process_factura(image_url)
    print(json.dumps(result))
