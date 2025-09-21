
import { db } from '../server/db.js';
import { menus, comidas, alimentos, categorias_alimentos } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function insertSampleMenu() {
  try {
    console.log('🔄 Iniciando inserção do cardápio de exemplo...');

    // 1. Primeiro, buscar as categorias existentes
    const categorias = await db.select().from(categorias_alimentos);
    const categoriasMap = {};
    categorias.forEach(cat => {
      categoriasMap[cat.nombre] = cat.id;
    });

    console.log('📋 Categorias encontradas:', Object.keys(categoriasMap));

    // 2. Inserir o menu principal
    const [menu] = await db.insert(menus).values({
      nombre: 'Menú 1200 kcal – Pérdida de peso, alta proteína',
      calorias_totales: 1200,
      proteina_total_gramos: 126,
      carbohidratos_total_gramos: 126,
      grasas_total_gramos: 39,
      proteina_porcentaje: 42,
      carbohidratos_porcentaje: 35,
      grasas_porcentaje: 23
    }).returning();

    console.log('✅ Menu creado:', menu.nombre);

    // 3. Definir las comidas con sus alimentos
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
          },
          {
            nombre: 'Aguacate',
            cantidad_gramos: 40,
            medida_casera: '1/5 pieza mediana',
            calorias: 64,
            proteina_gramos: 1,
            carbohidratos_gramos: 2,
            grasas_gramos: 6,
            categoria: 'grasas'
          },
          {
            nombre: 'Frijoles de la olla',
            cantidad_gramos: 60,
            medida_casera: '1/3 taza',
            calorias: 60,
            proteina_gramos: 5,
            carbohidratos_gramos: 10,
            grasas_gramos: 0,
            categoria: 'legumbres'
          }
        ]
      },
      {
        tipo: 'almuerzo',
        calorias: 340,
        proteina: 40,
        carbohidratos: 22,
        grasas: 10,
        alimentos: [
          {
            nombre: 'Pechuga de pollo a la plancha',
            cantidad_gramos: 120,
            medida_casera: '1 pieza chica',
            calorias: 165,
            proteina_gramos: 37,
            carbohidratos_gramos: 0,
            grasas_gramos: 2,
            categoria: 'proteínas'
          },
          {
            nombre: 'Arroz integral cocido',
            cantidad_gramos: 80,
            medida_casera: '1/2 taza',
            calorias: 80,
            proteina_gramos: 2,
            carbohidratos_gramos: 17,
            grasas_gramos: 1,
            categoria: 'carbohidratos'
          },
          {
            nombre: 'Ensalada mixta (lechuga, jitomate, pepino)',
            cantidad_gramos: 120,
            medida_casera: '1 taza',
            calorias: 20,
            proteina_gramos: 1,
            carbohidratos_gramos: 5,
            grasas_gramos: 0,
            categoria: 'vegetales'
          },
          {
            nombre: 'Aceite de oliva',
            cantidad_gramos: 7,
            medida_casera: '1/2 cucharada',
            calorias: 63,
            proteina_gramos: 0,
            carbohidratos_gramos: 0,
            grasas_gramos: 7,
            categoria: 'grasas'
          }
        ]
      },
      {
        tipo: 'merienda',
        calorias: 230,
        proteina: 15,
        carbohidratos: 26,
        grasas: 9,
        alimentos: [
          {
            nombre: 'Yogurt griego natural sin azúcar',
            cantidad_gramos: 120,
            medida_casera: '1/2 taza',
            calorias: 85,
            proteina_gramos: 12,
            carbohidratos_gramos: 6,
            grasas_gramos: 3,
            categoria: 'lácteos'
          },
          {
            nombre: 'Plátano',
            cantidad_gramos: 80,
            medida_casera: '1/2 pieza mediana',
            calorias: 70,
            proteina_gramos: 1,
            carbohidratos_gramos: 18,
            grasas_gramos: 0,
            categoria: 'frutas'
          },
          {
            nombre: 'Almendras',
            cantidad_gramos: 10,
            medida_casera: '7 piezas',
            calorias: 58,
            proteina_gramos: 2,
            carbohidratos_gramos: 2,
            grasas_gramos: 6,
            categoria: 'grasas'
          }
        ]
      },
      {
        tipo: 'cena',
        calorias: 330,
        proteina: 32,
        carbohidratos: 34,
        grasas: 11,
        alimentos: [
          {
            nombre: 'Filete de pescado blanco (tilapia/robalo)',
            cantidad_gramos: 120,
            medida_casera: '1 pieza chica',
            calorias: 110,
            proteina_gramos: 25,
            carbohidratos_gramos: 0,
            grasas_gramos: 2,
            categoria: 'proteínas'
          },
          {
            nombre: 'Arepa de maíz',
            cantidad_gramos: 60,
            medida_casera: '1 pieza pequeña',
            calorias: 130,
            proteina_gramos: 4,
            carbohidratos_gramos: 26,
            grasas_gramos: 2,
            categoria: 'carbohidratos'
          },
          {
            nombre: 'Verduras al vapor (brócoli + zanahoria)',
            cantidad_gramos: 120,
            medida_casera: '1 taza',
            calorias: 35,
            proteina_gramos: 3,
            carbohidratos_gramos: 8,
            grasas_gramos: 0,
            categoria: 'vegetales'
          },
          {
            nombre: 'Aceite de oliva',
            cantidad_gramos: 7,
            medida_casera: '1/2 cucharada',
            calorias: 63,
            proteina_gramos: 0,
            carbohidratos_gramos: 0,
            grasas_gramos: 7,
            categoria: 'grasas'
          }
        ]
      },
      {
        tipo: 'colación',
        calorias: 110,
        proteina: 13,
        carbohidratos: 7,
        grasas: 2,
        alimentos: [
          {
            nombre: 'Queso cottage bajo en grasa',
            cantidad_gramos: 100,
            medida_casera: '1/2 taza',
            calorias: 80,
            proteina_gramos: 12,
            carbohidratos_gramos: 4,
            grasas_gramos: 2,
            categoria: 'lácteos'
          },
          {
            nombre: 'Pepino en rodajas',
            cantidad_gramos: 100,
            medida_casera: '1/2 pieza grande',
            calorias: 16,
            proteina_gramos: 1,
            carbohidratos_gramos: 3,
            grasas_gramos: 0,
            categoria: 'vegetales'
          }
        ]
      }
    ];

    // 4. Insertar cada comida y sus alimentos
    for (const comidaData of comidasData) {
      console.log(`🍽️ Insertando comida: ${comidaData.tipo}`);
      
      // Insertar la comida
      const [comida] = await db.insert(comidas).values({
        menu_id: menu.id,
        tipo_comida: comidaData.tipo,
        calorias_comida: comidaData.calorias,
        proteina_comida_gramos: comidaData.proteina,
        carbohidratos_comida_gramos: comidaData.carbohidratos,
        grasas_comida_gramos: comidaData.grasas
      }).returning();

      // Insertar los alimentos de esta comida
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
    console.log(`📊 Totales: ${menu.calorias_totales} kcal, ${menu.proteina_total_gramos}g proteína, ${menu.carbohidratos_total_gramos}g carbos, ${menu.grasas_total_gramos}g grasas`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error al insertar el cardápio:', error);
    process.exit(1);
  }
}

// Ejecutar la función
insertSampleMenu();
