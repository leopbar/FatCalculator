import { readFileSync } from 'fs';
import { join } from 'path';
import type { InsertFood } from '@shared/schema';

// Classify food by macro content using thresholds
function classifyMacroType(protein: number, carb: number, fat: number, kcal: number): 'protein' | 'carb' | 'fat' | 'vegetable' | 'mixed' {
  // Protein-rich foods: high protein, moderate calories
  if (protein >= 15 && kcal >= 80) {
    return 'protein';
  }
  
  // Fat-rich foods: high fat content
  if (fat >= 30) {
    return 'fat';
  }
  
  // Carb-rich foods: high carb, low fat
  if (carb >= 15 && fat < 5) {
    return 'carb';
  }
  
  // Vegetables: low calorie density, typically < 50 kcal/100g
  if (kcal < 50) {
    return 'vegetable';
  }
  
  // Mixed foods: everything else
  return 'mixed';
}

// Parse hispanic nutritional table markdown
export function parseHispanicTable(): InsertFood[] {
  try {
    const filePath = join(__dirname, '../attached_assets/tabla_nutricional_hispanica_1757996013417.md');
    const content = readFileSync(filePath, 'utf8');
    
    const foods: InsertFood[] = [];
    const lines = content.split('\n');
    
    let currentCategory = '';
    let categoryCode = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect category headers (e.g., "## A - CEREALES Y DERIVADOS")
      if (line.startsWith('## ')) {
        const categoryMatch = line.match(/## ([A-Z]) - (.+)/);
        if (categoryMatch) {
          categoryCode = categoryMatch[1];
          currentCategory = categoryMatch[2];
        }
        continue;
      }
      
      // Skip table headers and separators
      if (line.startsWith('|') && (line.includes('Alimento') || line.includes('---'))) {
        continue;
      }
      
      // Parse food data rows
      if (line.startsWith('| **') && currentCategory) {
        const columns = line.split('|').map(col => col.trim()).filter(col => col);
        
        if (columns.length >= 5) {
          try {
            // Extract food name (remove ** markdown)
            const name = columns[0].replace(/\*\*/g, '').trim();
            
            // Extract macro values
            const kcal = parseFloat(columns[1]);
            const carb = parseFloat(columns[2]);
            const protein = parseFloat(columns[3]);
            const fat = parseFloat(columns[4]);
            
            // Skip if any value is NaN
            if (isNaN(kcal) || isNaN(carb) || isNaN(protein) || isNaN(fat)) {
              continue;
            }
            
            // Calculate energy density (kcal per gram)
            const energy_density = kcal / 100;
            
            // Classify macro type
            const macro_class = classifyMacroType(protein, carb, fat, kcal);
            
            foods.push({
              name,
              category: `${categoryCode}-${currentCategory}`,
              protein_per_100g: protein,
              carb_per_100g: carb,
              fat_per_100g: fat,
              kcal_per_100g: kcal,
              fiber_per_100g: 0, // Not available in source data
              energy_density,
              macro_class
            });
            
          } catch (error) {
            console.warn(`Failed to parse food row: ${line}`, error);
          }
        }
      }
    }
    
    console.log(`Parsed ${foods.length} foods from hispanic table`);
    return foods;
    
  } catch (error) {
    console.error('Error parsing hispanic table:', error);
    throw new Error('Failed to parse hispanic nutritional table');
  }
}

// Add common adjustment foods for macro correction
export function getAdjustmentFoods(): InsertFood[] {
  return [
    {
      name: "Clara de huevo (ajuste proteína)",
      category: "J-Huevos y derivados",
      protein_per_100g: 10.9,
      carb_per_100g: 0.7,
      fat_per_100g: 0.2,
      kcal_per_100g: 52,
      fiber_per_100g: 0,
      energy_density: 0.52,
      macro_class: "protein"
    },
    {
      name: "Azúcar blanca (ajuste carbohidrato)",
      category: "K-Productos azucarados",
      protein_per_100g: 0.0,
      carb_per_100g: 99.8,
      fat_per_100g: 0.0,
      kcal_per_100g: 387,
      fiber_per_100g: 0,
      energy_density: 3.87,
      macro_class: "carb"
    },
    {
      name: "Aceite de oliva (ajuste grasa)",
      category: "D-Grasas, aceites y oleaginosas",
      protein_per_100g: 0.0,
      carb_per_100g: 0.0,
      fat_per_100g: 100.0,
      kcal_per_100g: 884,
      fiber_per_100g: 0,
      energy_density: 8.84,
      macro_class: "fat"
    }
  ];
}

// Get all foods including parsed + adjustment foods
export function getAllFoodsForSeed(): InsertFood[] {
  const hispFoods = parseHispanicTable();
  const adjFoods = getAdjustmentFoods();
  return [...hispFoods, ...adjFoods];
}