CREATE TABLE "dispositivos_gps" (
	"id" text PRIMARY KEY NOT NULL,
	"imei" text NOT NULL,
	"modelo" text,
	"fabricante" text,
	"numero_serie" text,
	"vehiculo_id" text,
	"estado" text DEFAULT 'activo',
	"conectado" boolean DEFAULT false,
	"ultima_senal" timestamp,
	"ultima_latitud" numeric,
	"ultima_longitud" numeric,
	"intervalo_reporte" numeric DEFAULT '30',
	"alerta_velocidad" numeric,
	"alerta_combustible" numeric,
	"fecha_instalacion" timestamp,
	"fecha_activacion" timestamp,
	"observaciones" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp,
	CONSTRAINT "dispositivos_gps_imei_unique" UNIQUE("imei")
);
--> statement-breakpoint
ALTER TABLE "dispositivos_gps" ADD CONSTRAINT "dispositivos_gps_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;