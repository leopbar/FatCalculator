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

// Initialize database tables and seed data
async function initializeTables() {
  try {
    // Add email and name columns to users table if they don't exist
    await db.execute(sql`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email text,
      ADD COLUMN IF NOT EXISTS name text;
    `);

    // Create unique index on email if it doesn't exist
    await db.execute(sql`
      CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);
    `);

    // Update existing users to have email = username for compatibility
    await db.execute(sql`
      UPDATE users SET email = username WHERE email IS NULL;
    `);

    // Make email NOT NULL after populating it
    await db.execute(sql`
      ALTER TABLE users ALTER COLUMN email SET NOT NULL;
    `);

    console.log('User table migration completed successfully');

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
    `);
    
    console.log('Database tables initialized successfully');

    // Seed templates if they don't exist
    await seedTemplatesIfNeeded();
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
}

// Seed template menus if table is empty
async function seedTemplatesIfNeeded() {
  try {
    // Check if templates already exist
    const existingTemplates = await db.select().from(schema.templateMenus).limit(1);
    
    if (existingTemplates.length > 0) {
      console.log('Templates already exist, skipping seeding');
      return;
    }

    console.log('Seeding template menus...');

    // Template data - all 30 templates
    const templatesData = [
      // MULHERES - 1200 kcal (5 cardápios)
      {
        name: "Cardápio 1 – Mulheres – 1200 kcal",
        gender: "feminino" as const,
        calorie_level: 1200,
        total_calories: 1200,
        protein_grams: 87,
        carb_grams: 120,
        fat_grams: 40,
        meals: [
          {
            name: "Café da Manhã",
            approximate_calories: 280,
            items: [
              { name: "Ovos", grams: 100, categoria: "J-Huevos" },
              { name: "Tomate", grams: 50, categoria: "B-Verduras" },
              { name: "Cebola", grams: 20, categoria: "B-Verduras" },
              { name: "Arepa de milho integral", grams: 40, categoria: "A-Cereales" },
              { name: "Abacate", grams: 30, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Almoço",
            approximate_calories: 350,
            items: [
              { name: "Peito de frango", grams: 120, categoria: "F-Carnes" },
              { name: "Arroz integral cozido", grams: 80, categoria: "A-Cereales" },
              { name: "Feijão preto cozido", grams: 70, categoria: "T-Leguminosas" },
              { name: "Alface e pepino", grams: 100, categoria: "B-Verduras" },
              { name: "Azeite de oliva", grams: 5, categoria: "D-Grasas" }
            ]
          },
          {
            name: "Lanche da Tarde",
            approximate_calories: 180,
            items: [
              { name: "Iogurte grego natural sem açúcar", grams: 150, categoria: "G-Lacteos" },
              { name: "Morangos ou goiaba picada", grams: 80, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Jantar",
            approximate_calories: 290,
            items: [
              { name: "Tilápia", grams: 130, categoria: "E-Pescados" },
              { name: "Batata-doce cozida", grams: 100, categoria: "U-Tuberculos" },
              { name: "Brócolis no vapor", grams: 100, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Ceia",
            approximate_calories: 100,
            items: [
              { name: "Queijo cottage", grams: 50, categoria: "G-Lacteos" },
              { name: "Sementes de abóbora", grams: 10, categoria: "D-Grasas" }
            ]
          }
        ],
        smart_substitutions: "Arepa de milho integral ↔ Tortilla de maíz integral (2 unidades) ↔ 1 fatia de pão integral. Feijão preto (frijoles negros) ↔ Lentilhas (lentejas) ↔ Grão-de-bico (garbanzos). Peito de frango ↔ Pescado branco ↔ Carne bovina magra. Arroz integral ↔ Quinoa ↔ Cuscuz integral. Batata-doce ↔ Mandioca cozida ↔ Plátano macho verde cozido. Iogurte grego ↔ Queijo cottage ↔ Kefir natural. Abacate ↔ Azeite de oliva."
      },
      {
        name: "Cardápio 2 – Mulheres – 1200 kcal",
        gender: "feminino" as const,
        calorie_level: 1200,
        total_calories: 1200,
        protein_grams: 85,
        carb_grams: 125,
        fat_grams: 38,
        meals: [
          {
            name: "Café da Manhã",
            approximate_calories: 275,
            items: [
              { name: "Ovo", grams: 50, categoria: "J-Huevos" },
              { name: "Goma de tapioca", grams: 30, categoria: "A-Cereales" },
              { name: "Frango desfiado", grams: 50, categoria: "F-Carnes" },
              { name: "Tomate picado", grams: 30, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Almoço",
            approximate_calories: 360,
            items: [
              { name: "Carne bovina magra", grams: 100, categoria: "F-Carnes" },
              { name: "Quinoa cozida", grams: 90, categoria: "A-Cereales" },
              { name: "Lentilhas cozidas", grams: 60, categoria: "T-Leguminosas" },
              { name: "Espinafre refogado", grams: 80, categoria: "B-Verduras" },
              { name: "Azeite", grams: 5, categoria: "D-Grasas" }
            ]
          },
          {
            name: "Lanche da Tarde",
            approximate_calories: 170,
            items: [
              { name: "Queijo cottage", grams: 100, categoria: "G-Lacteos" },
              { name: "Mamão papaya", grams: 100, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Jantar",
            approximate_calories: 280,
            items: [
              { name: "Salmão grelhado", grams: 120, categoria: "E-Pescados" },
              { name: "Mandioca cozida", grams: 80, categoria: "U-Tuberculos" },
              { name: "Abobrinha refogada", grams: 100, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Ceia",
            approximate_calories: 115,
            items: [
              { name: "Iogurte grego", grams: 80, categoria: "G-Lacteos" },
              { name: "Amêndoas", grams: 10, categoria: "D-Grasas" }
            ]
          }
        ],
        smart_substitutions: "Mesmas substituições do cardápio anterior"
      },
      {
        name: "Cardápio 3 – Mulheres – 1200 kcal",
        gender: "feminino" as const,
        calorie_level: 1200,
        total_calories: 1200,
        protein_grams: 88,
        carb_grams: 118,
        fat_grams: 42,
        meals: [
          {
            name: "Café da Manhã",
            approximate_calories: 270,
            items: [
              { name: "Clara de ovos", grams: 120, categoria: "J-Huevos" },
              { name: "Aveia", grams: 30, categoria: "A-Cereales" },
              { name: "Banana", grams: 80, categoria: "C-Frutas" },
              { name: "Leite desnatado", grams: 100, categoria: "G-Lacteos" }
            ]
          },
          {
            name: "Almoço",
            approximate_calories: 340,
            items: [
              { name: "Peito de frango grelhado", grams: 110, categoria: "F-Carnes" },
              { name: "Arroz integral", grams: 75, categoria: "A-Cereales" },
              { name: "Grão-de-bico", grams: 65, categoria: "T-Leguminosas" },
              { name: "Salada mista", grams: 120, categoria: "B-Verduras" },
              { name: "Azeite", grams: 5, categoria: "D-Grasas" }
            ]
          },
          {
            name: "Lanche da Tarde",
            approximate_calories: 185,
            items: [
              { name: "Kefir natural", grams: 150, categoria: "G-Lacteos" },
              { name: "Abacaxi", grams: 100, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Jantar",
            approximate_calories: 295,
            items: [
              { name: "Merluza assada", grams: 140, categoria: "E-Pescados" },
              { name: "Batata doce", grams: 90, categoria: "U-Tuberculos" },
              { name: "Brócolis e couve-flor", grams: 100, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Ceia",
            approximate_calories: 110,
            items: [
              { name: "Queijo fresco", grams: 40, categoria: "G-Lacteos" },
              { name: "Nozes", grams: 8, categoria: "D-Grasas" }
            ]
          }
        ],
        smart_substitutions: "Mesmas substituições do cardápio anterior"
      },
      {
        name: "Cardápio 4 – Mulheres – 1200 kcal",
        gender: "feminino" as const,
        calorie_level: 1200,
        total_calories: 1200,
        protein_grams: 86,
        carb_grams: 122,
        fat_grams: 39,
        meals: [
          {
            name: "Café da Manhã",
            approximate_calories: 285,
            items: [
              { name: "Ovo inteiro", grams: 100, categoria: "J-Huevos" },
              { name: "Tortilla de milho integral", grams: 40, categoria: "A-Cereales" },
              { name: "Abacate", grams: 25, categoria: "C-Frutas" },
              { name: "Tomate", grams: 40, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Almoço",
            approximate_calories: 345,
            items: [
              { name: "Carne magra bovina", grams: 105, categoria: "F-Carnes" },
              { name: "Quinoa", grams: 85, categoria: "A-Cereales" },
              { name: "Feijão preto", grams: 70, categoria: "T-Leguminosas" },
              { name: "Vegetais salteados", grams: 100, categoria: "B-Verduras" },
              { name: "Azeite", grams: 5, categoria: "D-Grasas" }
            ]
          },
          {
            name: "Lanche da Tarde",
            approximate_calories: 175,
            items: [
              { name: "Iogurte natural", grams: 120, categoria: "G-Lacteos" },
              { name: "Manga", grams: 80, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Jantar",
            approximate_calories: 285,
            items: [
              { name: "Pescado branco", grams: 135, categoria: "E-Pescados" },
              { name: "Inhame cozido", grams: 85, categoria: "U-Tuberculos" },
              { name: "Aspargos grelhados", grams: 100, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Ceia",
            approximate_calories: 110,
            items: [
              { name: "Queijo cottage", grams: 60, categoria: "G-Lacteos" },
              { name: "Sementes de girassol", grams: 8, categoria: "D-Grasas" }
            ]
          }
        ],
        smart_substitutions: "Mesmas substituições do cardápio anterior"
      },
      {
        name: "Cardápio 5 – Mulheres – 1200 kcal",
        gender: "feminino" as const,
        calorie_level: 1200,
        total_calories: 1200,
        protein_grams: 89,
        carb_grams: 116,
        fat_grams: 41,
        meals: [
          {
            name: "Café da Manhã",
            approximate_calories: 275,
            items: [
              { name: "Clara de ovos", grams: 100, categoria: "J-Huevos" },
              { name: "Pão integral", grams: 30, categoria: "A-Cereales" },
              { name: "Queijo fresco", grams: 30, categoria: "G-Lacteos" },
              { name: "Tomate", grams: 50, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Almoço",
            approximate_calories: 355,
            items: [
              { name: "Frango desfiado", grams: 115, categoria: "F-Carnes" },
              { name: "Arroz integral", grams: 80, categoria: "A-Cereales" },
              { name: "Lentilhas", grams: 65, categoria: "T-Leguminosas" },
              { name: "Salada verde", grams: 100, categoria: "B-Verduras" },
              { name: "Azeite", grams: 5, categoria: "D-Grasas" }
            ]
          },
          {
            name: "Lanche da Tarde",
            approximate_calories: 180,
            items: [
              { name: "Smoothie de iogurte", grams: 120, categoria: "G-Lacteos" },
              { name: "Frutas vermelhas", grams: 80, categoria: "C-Frutas" }
            ]
          },
          {
            name: "Jantar",
            approximate_calories: 280,
            items: [
              { name: "Atum grelhado", grams: 130, categoria: "E-Pescados" },
              { name: "Batata doce assada", grams: 90, categoria: "U-Tuberculos" },
              { name: "Vagem refogada", grams: 100, categoria: "B-Verduras" }
            ]
          },
          {
            name: "Ceia",
            approximate_calories: 110,
            items: [
              { name: "Kefir", grams: 100, categoria: "G-Lacteos" },
              { name: "Castanhas", grams: 8, categoria: "D-Grasas" }
            ]
          }
        ],
        smart_substitutions: "Mesmas substituições do cardápio anterior"
      }
    ];

    // Insert templates in batches
    console.log(`Inserting ${templatesData.length} templates...`);
    
    for (const template of templatesData) {
      await db.insert(schema.templateMenus).values(template);
    }

    console.log(`✅ Successfully inserted ${templatesData.length} template menus`);
  } catch (error) {
    console.error('Error seeding templates:', error);
  }
}

// Initialize tables when the module is loaded
initializeTables();
