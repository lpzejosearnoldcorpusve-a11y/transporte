# OpenStreetMap Integration

Este proyecto utiliza **OpenStreetMap (OSM)** como servicio de mapas, que es completamente gratuito y de código abierto.

## Servicios Utilizados

### 1. OpenStreetMap Tiles
- **Uso**: Visualización de mapas interactivos
- **URL**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Costo**: Gratuito
- **Límites**: Uso justo (fair use policy)

### 2. Nominatim (Geocoding)
- **Uso**: Convertir direcciones a coordenadas geográficas
- **URL**: `https://nominatim.openstreetmap.org/search`
- **Costo**: Gratuito
- **Límites**: 1 solicitud por segundo
- **Requisito**: User-Agent personalizado

### 3. OSRM (Open Source Routing Machine)
- **Uso**: Cálculo de rutas, distancias y tiempos
- **URL**: `https://router.project-osrm.org/route/v1/driving/`
- **Costo**: Gratuito
- **Límites**: Uso justo

### 4. StaticMap
- **Uso**: Imágenes estáticas de mapas
- **URL**: `https://staticmap.openstreetmap.de/staticmap.php`
- **Costo**: Gratuito

## Ventajas de OpenStreetMap

1. **Completamente gratuito** - No requiere API key ni tarjeta de crédito
2. **Sin límites de cuota** - Solo políticas de uso justo
3. **Código abierto** - Datos mantenidos por la comunidad
4. **Sin restricciones** - No hay límites de dominio o IP
5. **Datos actualizados** - Constantemente mejorados por contribuidores

## Políticas de Uso Justo

Para mantener el servicio gratuito, sigue estas recomendaciones:

1. **Cachea los resultados** cuando sea posible
2. **No hagas solicitudes excesivas** (respeta el límite de 1 req/seg para Nominatim)
3. **Incluye un User-Agent** identificable en tus solicitudes
4. **Considera donar** a OpenStreetMap si tu uso es intensivo

## Alternativas para Uso Intensivo

Si necesitas mayor capacidad, considera:

1. **Hospedar tu propio servidor OSRM**
2. **Usar servicios comerciales** basados en OSM:
   - MapBox (tiene plan gratuito generoso)
   - Thunderforest
   - Stadia Maps

## Más Información

- [OpenStreetMap](https://www.openstreetmap.org/)
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)
- [OSRM Documentation](http://project-osrm.org/)
- [Leaflet.js](https://leafletjs.com/)
