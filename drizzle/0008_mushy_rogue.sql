CREATE TABLE "viajes" (
	"id" text PRIMARY KEY NOT NULL,
	"vehiculo_id" text NOT NULL,
	"conductor_id" text NOT NULL,
	"ruta_id" text,
	"numero_viaje" text NOT NULL,
	"numero_factura" text,
	"producto" text NOT NULL,
	"cantidad" numeric NOT NULL,
	"unidad" text DEFAULT 'litros',
	"lugar_carga" text NOT NULL,
	"lugar_descarga" text NOT NULL,
	"lugar_carga_lat" numeric,
	"lugar_carga_lng" numeric,
	"lugar_descarga_lat" numeric,
	"lugar_descarga_lng" numeric,
	"fecha_inicio" timestamp NOT NULL,
	"hora_inicio" text,
	"fecha_fin" timestamp,
	"hora_fin" text,
	"fecha_estimada_llegada" timestamp,
	"estado" text DEFAULT 'planificado',
	"observaciones" text,
	"referencia" text,
	"codigo_qr" text,
	"url_hoja_ruta" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp,
	"creado_por" text,
	CONSTRAINT "viajes_numero_viaje_unique" UNIQUE("numero_viaje")
);
--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_conductor_id_conductores_id_fk" FOREIGN KEY ("conductor_id") REFERENCES "public"."conductores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_ruta_id_rutas_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."rutas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "viajes" ADD CONSTRAINT "viajes_creado_por_users_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;