CREATE TABLE "rutas" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"vehiculo_id" text,
	"origen" text NOT NULL,
	"origen_lat" numeric,
	"origen_lng" numeric,
	"destino" text NOT NULL,
	"destino_lat" numeric,
	"destino_lng" numeric,
	"distancia_km" numeric,
	"duracion_minutos" numeric,
	"fecha_salida" timestamp,
	"fecha_llegada_estimada" timestamp,
	"estado" text DEFAULT 'planificada',
	"inicio_real" timestamp,
	"fin_real" timestamp,
	"observaciones" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp
);
--> statement-breakpoint
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;