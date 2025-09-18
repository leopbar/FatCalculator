import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure connection pool with better error handling and timeouts
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduce max connections to avoid overwhelming Neon
  maxUses: 1000, // Rotate connections periodically
  allowExitOnIdle: true, // Allow pool to close when idle
  idleTimeoutMillis: 30000, // 30 second idle timeout
});

// Add error handler for pool events
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  // Don't exit the process, let it continue with new connections
});

pool.on('connect', () => {
  console.log('Database pool connected');
});

export const db = drizzle({ client: pool, schema });

// Initialize database tables
async function initializeTables() {
  try {
    // Create the alimentos_hispanos table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS alimentos_hispanos (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        nombre text NOT NULL,
        categoria text NOT NULL,
        calorias_por_100g real NOT NULL,
        carbohidratos_por_100g real NOT NULL,
        proteinas_por_100g real NOT NULL,
        grasas_por_100g real NOT NULL
      );
    `);

    // Create the template_menus table if it doesn't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS template_menus (
        id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        gender text NOT NULL CHECK (gender IN ('masculino', 'feminino')),
        calorie_level integer NOT NULL,
        total_calories real NOT NULL,
        protein_grams real NOT NULL,
        carb_grams real NOT NULL,
        fat_grams real NOT NULL,
        meals jsonb NOT NULL,
        smart_substitutions text NOT NULL,
        created_at text DEFAULT CURRENT_TIMESTAMP
      );
    `);</old_str>
    
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Initialize tables when the module is loaded
initializeTables();
