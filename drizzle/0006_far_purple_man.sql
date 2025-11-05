CREATE TABLE "gps_tracking" (
	"id" text PRIMARY KEY NOT NULL,
	"vehiculo_id" text NOT NULL,
	"latitud" numeric NOT NULL,
	"longitud" numeric NOT NULL,
	"altitud" numeric,
	"satelites" numeric,
	"velocidad" numeric,
	"direccion" numeric,
	"estado_motor" text DEFAULT 'encendido',
	"nivel_combustible" numeric,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"precision" numeric,
	"proveedor" text DEFAULT 'gps'
);
--> statement-breakpoint
ALTER TABLE "gps_tracking" ADD CONSTRAINT "gps_tracking_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;