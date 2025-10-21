CREATE TABLE "documentos_conductor" (
	"id" text PRIMARY KEY NOT NULL,
	"conductor_id" text NOT NULL,
	"tipo_documento" text NOT NULL,
	"nombre_archivo" text NOT NULL,
	"url_archivo" text NOT NULL,
	"tipo_archivo" text NOT NULL,
	"tamano_bytes" numeric,
	"validado" boolean DEFAULT false,
	"validado_por" text,
	"fecha_validacion" timestamp,
	"observaciones_validacion" text,
	"descripcion" text,
	"fecha_emision" timestamp,
	"fecha_vencimiento" timestamp,
	"subido_por" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp
);
--> statement-breakpoint
ALTER TABLE "documentos_conductor" ADD CONSTRAINT "documentos_conductor_conductor_id_conductores_id_fk" FOREIGN KEY ("conductor_id") REFERENCES "public"."conductores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_conductor" ADD CONSTRAINT "documentos_conductor_validado_por_users_id_fk" FOREIGN KEY ("validado_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_conductor" ADD CONSTRAINT "documentos_conductor_subido_por_users_id_fk" FOREIGN KEY ("subido_por") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;