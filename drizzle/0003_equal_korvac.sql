CREATE TABLE "mantenimientos" (
	"id" text PRIMARY KEY NOT NULL,
	"vehiculo_id" text NOT NULL,
	"fecha_inicio" timestamp NOT NULL,
	"fecha_fin" timestamp,
	"estado" text DEFAULT 'en_proceso',
	"nombre_taller" text,
	"contacto_taller" text,
	"descripcion_problema" text,
	"trabajos_realizados" text,
	"partes_interiores" text[],
	"partes_exteriores" text[],
	"costo_total" numeric,
	"moneda" text DEFAULT 'PEN',
	"fichas_urls" text[],
	"datos_ocr" text,
	"registrado_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp
);
--> statement-breakpoint
ALTER TABLE "mantenimientos" ADD CONSTRAINT "mantenimientos_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mantenimientos" ADD CONSTRAINT "mantenimientos_registrado_por_users_id_fk" FOREIGN KEY ("registrado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;