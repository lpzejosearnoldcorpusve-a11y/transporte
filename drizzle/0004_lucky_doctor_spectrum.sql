CREATE TABLE "conductores" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"ci" text NOT NULL,
	"licencia" text NOT NULL,
	"categoria" text NOT NULL,
	"vencimiento_licencia" timestamp NOT NULL,
	"telefono" text,
	"direccion" text,
	"creado_en" timestamp DEFAULT now() NOT NULL,
	"actualizado_en" timestamp,
	CONSTRAINT "conductores_ci_unique" UNIQUE("ci")
);
