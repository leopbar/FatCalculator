CREATE TABLE "alimentos_hispanos" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"categoria" text NOT NULL,
	"calorias_por_100g" real NOT NULL,
	"carbohidratos_por_100g" real NOT NULL,
	"proteinas_por_100g" real NOT NULL,
	"grasas_por_100g" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "body_metrics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"gender" text NOT NULL,
	"age" integer NOT NULL,
	"height" real NOT NULL,
	"weight" real NOT NULL,
	"neck" real NOT NULL,
	"waist" real NOT NULL,
	"hip" real,
	"activity_level" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "calculations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"body_fat_percent" real NOT NULL,
	"category" text NOT NULL,
	"bmr" real NOT NULL,
	"tdee" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"category" text NOT NULL,
	"tdee" real NOT NULL,
	"target_calories" real NOT NULL,
	"macro_target" json NOT NULL,
	"meals" json NOT NULL,
	"ai_menu_content" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "body_metrics" ADD CONSTRAINT "body_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calculations" ADD CONSTRAINT "calculations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_plans" ADD CONSTRAINT "menu_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;