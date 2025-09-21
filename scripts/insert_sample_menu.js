
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { pgTable, text, varchar, real, timestamp } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

// Define tables inline to avoid import issues
const categorias_alimentos = pgTable("categorias_alimentos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull().unique(),
  descripcion: text("descripcion"),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

const menus = pgTable("menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  calorias_totales: real("calorias_totales").notNull().default(0),
  proteina_total_gramos: real("proteina_total_gramos").notNull().default(0),
  carbohidratos_total_gramos: real("carbohidratos_total_gramos").notNull().default(0),
  grasas_total_gramos: real("grasas_total_gramos").notNull().default(0),
  proteina_porcentaje: real("proteina_porcentaje").notNull().default(0),
  carbohidratos_porcentaje: real("carbohidratos_porcentaje").notNull().default(0),
  grasas_porcentaje: real("grasas_porcentaje").notNull().default(0),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

const comidas = pgTable("comidas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menu_id: varchar("menu_id").notNull().references(() => menus.id, { onDelete: "cascade" }),
  tipo_comida: text("tipo_comida").notNull(),
  calorias_comida: real("calorias_comida").notNull().default(0),
  proteina_comida_gramos: real("proteina_comida_gramos").notNull().default(0),
  carbohidratos_comida_gramos: real("carbohidratos_comida_gramos").notNull().default(0),
  grasas_comida_gramos: real("grasas_comida_gramos").notNull().default(0),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

const alimentos = pgTable("alimentos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  comida_id: varchar("comida_id").notNull().references(() => comidas.id, { onDelete: "cascade" }),
  categoria_id: varchar("categoria_id").notNull().references(() => categorias_alimentos.id),
  nombre: text("nombre").notNull(),
  cantidad_gramos: real("cantidad_gramos").notNull(),
  medida_casera: text("medida_casera"),
  calorias: real("calorias").notNull(),
  proteina_gramos: real("proteina_gramos").notNull(),
  carbohidratos_gramos: real("carbohidratos_gramos").notNull(),
  grasas_gramos: real("grasas_gramos").notNull(),
  fecha_creacion: timestamp("fecha_creacion").defaultNow().notNull(),
});

async function insertSampleMenu() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle({ client: pool, schema: { categorias_alimentos, menus, comidas, alimentos } });

  try {
    console.log('🔄 Iniciando inserção do cardápio...');

    // 1. Criar categorias básicas
    const categoriasBasicas = [
      { nombre: 'proteínas', descripcion: 'Alimentos ricos em proteína' },
      { nombre: 'carbohidratos', descripcion: 'Alimentos ricos em carboidratos' },
      { nombre: 'grasas', descripcion: 'Alimentos ricos em gorduras' },
      { nombre: 'vegetales', descripcion: 'Verduras e legumes' },
      { nombre: 'frutas', descripcion: 'Frutas frescas' },
      { nombre: 'lácteos', descripcion: 'Produtos lácteos' }
    ];

    const categoriasMap = {};

    for (const cat of categoriasBasicas) {
      try {
        const [newCat] = await db.insert(categorias_alimentos).values(cat).returning();
        categoriasMap[newCat.nombre] = newCat.id;
        console.log(`✅ Categoria criada: ${newCat.nombre}`);
      } catch (error) {
        if (error.message.includes('duplicate key')) {
          const existing = await db.select().from(categorias_alimentos).where(sql`nombre = ${cat.nombre}`);
          if (existing.length > 0) {
            categoriasMap[cat.nombre] = existing[0].id;
            console.log(`📋 Categoria existente: ${cat.nombre}`);
          }
        } else {
          throw error;
        }
      }
    }

    // 2. Inserir o menu principal
    const [menu] = await db.insert(menus).values({
      nombre: 'Menú 1200 kcal – Pérdida de peso, alta proteína',
      calorias_totales: 1290,
      proteina_total_gramos: 126,
      carbohidratos_total_gramos: 126,
      grasas_total_gramos: 39,
      proteina_porcentaje: 39,
      carbohidratos_porcentaje: 39,
      grasas_porcentaje: 27
    }).returning();

    console.log(`✅ Menu criado: ${menu.nombre}`);

    // 3. Inserir comidas
    const comidasData = [
      {
        tipo: 'desayuno',
        calorias: 290,
        proteina: 26,
        carbohidratos: 37,
        grasas: 7,
        alimentos: [
          {
            nombre: 'Claras de huevo',
            cantidad_gramos: 150,
            medida_casera: '5 claras',
            calorias: 85,
            proteina_gramos: 16,
            carbohidratos_gramos: 1,
            grasas_gramos: 0,
            categoria: 'proteínas'
          },
          {
            nombre: 'Tortilla de maíz',
            cantidad_gramos: 60,
            medida_casera: '2 piezas',
            calorias: 120,
            proteina_gramos: 4,
            carbohidratos_gramos: 24,
            grasas_gramos: 1,
            categoria: 'carbohidratos'
          }
        ]
      }
    ];

    for (const comidaData of comidasData) {
      console.log(`🍽️ Insertando comida: ${comidaData.tipo}`);

      const [comida] = await db.insert(comidas).values({
        menu_id: menu.id,
        tipo_comida: comidaData.tipo,
        calorias_comida: comidaData.calorias,
        proteina_comida_gramos: comidaData.proteina,
        carbohidratos_comida_gramos: comidaData.carbohidratos,
        grasas_comida_gramos: comidaData.grasas
      }).returning();

      for (const alimentoData of comidaData.alimentos) {
        const categoriaId = categoriasMap[alimentoData.categoria];

        if (!categoriaId) {
          console.error(`❌ Categoría no encontrada: ${alimentoData.categoria}`);
          continue;
        }

        await db.insert(alimentos).values({
          comida_id: comida.id,
          categoria_id: categoriaId,
          nombre: alimentoData.nombre,
          cantidad_gramos: alimentoData.cantidad_gramos,
          medida_casera: alimentoData.medida_casera,
          calorias: alimentoData.calorias,
          proteina_gramos: alimentoData.proteina_gramos,
          carbohidratos_gramos: alimentoData.carbohidratos_gramos,
          grasas_gramos: alimentoData.grasas_gramos
        });

        console.log(`  ✅ Alimento insertado: ${alimentoData.nombre}`);
      }
    }

    console.log('🎉 ¡Cardápio insertado exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

insertSampleMenu();
