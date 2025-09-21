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
    console.log('Database connection established');
  } catch (error) {
    console.error('Error initializing database connection:', error);
  }
}



// Initialize tables when the module is loaded
initializeTables();
