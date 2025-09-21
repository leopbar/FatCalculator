
-- Migration: Add tables for menu generation functionality
-- Tables: categorias_alimentos, menus, comidas, alimentos

CREATE TABLE "categorias_alimentos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_alimentos_nombre_unique" UNIQUE("nombre")
);

CREATE TABLE "menus" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"calorias_totales" real DEFAULT 0 NOT NULL,
	"proteina_total_gramos" real DEFAULT 0 NOT NULL,
	"carbohidratos_total_gramos" real DEFAULT 0 NOT NULL,
	"grasas_total_gramos" real DEFAULT 0 NOT NULL,
	"proteina_porcentaje" real DEFAULT 0 NOT NULL,
	"carbohidratos_porcentaje" real DEFAULT 0 NOT NULL,
	"grasas_porcentaje" real DEFAULT 0 NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "comidas" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_id" varchar NOT NULL,
	"tipo_comida" text NOT NULL,
	"calorias_comida" real DEFAULT 0 NOT NULL,
	"proteina_comida_gramos" real DEFAULT 0 NOT NULL,
	"carbohidratos_comida_gramos" real DEFAULT 0 NOT NULL,
	"grasas_comida_gramos" real DEFAULT 0 NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE "alimentos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comida_id" varchar NOT NULL,
	"categoria_id" varchar NOT NULL,
	"nombre" text NOT NULL,
	"cantidad_gramos" real NOT NULL,
	"medida_casera" text,
	"calorias" real NOT NULL,
	"proteina_gramos" real NOT NULL,
	"carbohidratos_gramos" real NOT NULL,
	"grasas_gramos" real NOT NULL,
	"fecha_creacion" timestamp DEFAULT now() NOT NULL
);

-- Add foreign key constraints
ALTER TABLE "comidas" ADD CONSTRAINT "comidas_menu_id_menus_id_fk" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "alimentos" ADD CONSTRAINT "alimentos_comida_id_comidas_id_fk" FOREIGN KEY ("comida_id") REFERENCES "comidas"("id") ON DELETE cascade ON UPDATE no action;

ALTER TABLE "alimentos" ADD CONSTRAINT "alimentos_categoria_id_categorias_alimentos_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "categorias_alimentos"("id") ON DELETE no action ON UPDATE no action;

-- Insert initial food categories
INSERT INTO "categorias_alimentos" ("nombre", "descripcion") VALUES
('proteínas', 'Carnes, pescados, huevos, legumbres y fuentes de proteína'),
('carbohidratos', 'Cereales, tubérculos, frutas y fuentes de energía'),
('grasas', 'Aceites, frutos secos, aguacate y fuentes de grasas saludables'),
('vegetales', 'Verduras y hortalizas'),
('frutas', 'Frutas frescas y deshidratadas'),
('lácteos', 'Leche, yogur, quesos y derivados lácteos'),
('condimentos', 'Especias, hierbas y condimentos');
