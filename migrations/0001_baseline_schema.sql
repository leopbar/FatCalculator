
-- Baseline migration - Current database state
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"email" text,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

CREATE TABLE IF NOT EXISTS "body_metrics" (
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

CREATE TABLE IF NOT EXISTS "calculations" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"body_fat_percent" real NOT NULL,
	"category" text NOT NULL,
	"bmr" real NOT NULL,
	"tdee" real NOT NULL
);

CREATE TABLE IF NOT EXISTS "menu_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"category" text NOT NULL,
	"tdee" real NOT NULL,
	"target_calories" real NOT NULL,
	"macro_target" json NOT NULL,
	"meals" json NOT NULL,
	"daily_totals" json NOT NULL
);

-- Add foreign key constraints
DO $$ BEGIN
 ALTER TABLE "body_metrics" ADD CONSTRAINT "body_metrics_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "calculations" ADD CONSTRAINT "calculations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "menu_plans" ADD CONSTRAINT "menu_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
