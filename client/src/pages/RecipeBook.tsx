
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Clock, 
  Users, 
  ChefHat,
  Flame,
  Heart,
  BookOpen,
  Star,
  Filter,
  Utensils,
  Zap,
  Beef,
  Apple
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Recipe {
  id: number;
  title: string;
  category: 'con-suplementacion' | 'sin-suplementacion';
  ingredients: string[];
  preparation: string;
  macros: {
    carbs: string;
    protein: string;
    fat: string;
    fiber: string;
    calories: string;
  };
  notes?: string;
  image: string;
  prepTime: string;
  difficulty: 'Fácil' | 'Intermedio' | 'Avanzado';
}

export default function RecipeBook() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { user } = useAuth();

  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Hotcakes de Proteína (Whey)",
      category: "con-suplementacion",
      ingredients: [
        "40g de Avena (harina)",
        "80g de Plátano (1 mediano)",
        "2 Huevos",
        "30g de Proteína de Suero (Whey Protein)",
        "Canela al gusto"
      ],
      preparation: "Bate todos los ingredientes en una licuadora hasta obtener una mezcla no muy líquida. Esta receta rinde aproximadamente 2 hotcakes medianos. Usa un sartén antiadherente o engrásalo ligeramente con un poco de aceite de coco. A fuego bajo, cocina cada hotcake por 3 minutos con una tapa. Cuando veas que le salen burbujas en la parte de arriba y los bordes se vean cocidos, voltéalo con una espátula y espera otros 2-3 minutos. Repite el proceso para el segundo hotcake. ¡Listo para disfrutar!",
      macros: {
        carbs: "42g",
        protein: "30g",
        fat: "14g",
        fiber: "6g",
        calories: "414kcal"
      },
      notes: "* Puedes cambiar 2 huevos enteros por 4 claras, pero ajusta los macros. * La proteína de suero puede ser del sabor que más te guste.",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      prepTime: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 2,
      title: "Avena con Proteína (Whey)",
      category: "con-suplementacion",
      ingredients: [
        "50g de Avena (hojuelas)",
        "24g de Crema de Cacahuate",
        "1 Plátano Mediano (80g) o cualquier otra fruta al gusto",
        "30g de Proteína de Suero (Whey Protein)",
        "Canela y Cacao al gusto"
      ],
      preparation: "En un tazón, pon la avena y cúbrela con agua (un dedo arriba de la avena), métela al microondas por 2-3 minutos, dependiendo de la potencia de tu equipo. Mezcla la proteína de suero, la canela, el cacao y la crema de cacahuate, ya que después será más difícil de incorporar con la fruta. Corta el plátano en rebanadas y mezcla con la avena. ¡Listo! Ahora solo queda disfrutar de esta avena súper nutritiva.",
      macros: {
        carbs: "52g",
        protein: "40g",
        fat: "17g",
        fiber: "9g",
        calories: "521kcal"
      },
      image: "https://images.unsplash.com/photo-1571167530149-c72971b39cea?w=400&h=300&fit=crop",
      prepTime: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 3,
      title: "Nieve de Proteína",
      category: "con-suplementacion",
      ingredients: [
        "100g de Frutas Congeladas (fresas, frutos rojos, plátano)",
        "30g de Proteína de Suero (Whey Protein)",
        "100ml de Agua o Leche Vegetal (almendra, coco)"
      ],
      preparation: "Pon todos los ingredientes en una licuadora o procesador de alimentos. Bate hasta obtener una consistencia cremosa, como la de un helado suave. Si queda muy espeso, puedes añadir un poco más de agua o leche vegetal hasta alcanzar la textura deseada. Sirve inmediatamente y disfruta de esta deliciosa y nutritiva nieve.",
      macros: {
        carbs: "25g",
        protein: "28g",
        fat: "3g",
        fiber: "5g",
        calories: "235kcal"
      },
      image: "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop",
      prepTime: "5 min",
      difficulty: "Fácil"
    },
    {
      id: 4,
      title: "Galleta de Proteína",
      category: "con-suplementacion",
      ingredients: [
        "30g de Avena (harina)",
        "15g de Proteína de Suero (Whey Protein)",
        "1 Huevo",
        "10g de Crema de Cacahuate",
        "5g de Chocolate Amargo (troceado)",
        "Endulzante al gusto (opcional)"
      ],
      preparation: "En un tazón, mezcla la harina de avena, la proteína de suero, el huevo, la crema de cacahuate y el endulzante (si lo usas) hasta obtener una masa homogénea. Incorpora el chocolate amargo troceado. Forma una galleta con la masa y colócala en un plato apto para microondas. Cocina en el microondas por 1-2 minutos, o hasta que esté cocida a tu gusto. También puedes hornearla en un horno precalentado a 180°C (350°F) por unos 8-10 minutos. ¡Disfruta de tu galleta proteica!",
      macros: {
        carbs: "20g",
        protein: "25g",
        fat: "12g",
        fiber: "3g",
        calories: "288kcal"
      },
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop",
      prepTime: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 5,
      title: "Panecillo de Proteína",
      category: "con-suplementacion",
      ingredients: [
        "30g de Avena (harina)",
        "15g de Proteína de Suero (Whey Protein)",
        "1 Huevo",
        "50ml de Leche (o bebida vegetal)",
        "5g de Polvo para Hornear",
        "Endulzante al gusto (opcional)"
      ],
      preparation: "En un tazón, mezcla la harina de avena, la proteína de suero, el huevo, la leche, el polvo para hornear y el endulzante (si lo usas) hasta obtener una masa homogénea. Vierte la mezcla en un molde pequeño apto para microondas (puede ser una taza). Cocina en el microondas por 1-2 minutos, o hasta que el panecillo esté cocido y esponjoso. También puedes hornearlo en un horno precalentado a 180°C (350°F) por unos 10-15 minutos. ¡Ideal para un desayuno o snack rápido!",
      macros: {
        carbs: "20g",
        protein: "25g",
        fat: "8g",
        fiber: "3g",
        calories: "248kcal"
      },
      image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
      prepTime: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 6,
      title: "Hamburguesa de Pollo",
      category: "sin-suplementacion",
      ingredients: [
        "150g de Pechuga de Pollo Molida",
        "1/4 de Cebolla Picada",
        "1 Diente de Ajo Picado",
        "Perejil Fresco Picado al gusto",
        "Sal y Pimienta al gusto",
        "Pan para Hamburguesa Integral (opcional)",
        "Lechuga, Tomate y Cebolla para acompañar"
      ],
      preparation: "En un tazón, mezcla la pechuga de pollo molida con la cebolla, el ajo, el perejil, la sal y la pimienta. Amasa bien hasta que todos los ingredientes estén incorporados. Forma una hamburguesa con la mezcla. Cocina la hamburguesa en un sartén antiadherente o a la parrilla hasta que esté bien cocida por ambos lados y dorada. Sirve en pan integral (si lo deseas) con lechuga, tomate y cebolla. ¡Una opción saludable y deliciosa!",
      macros: {
        carbs: "5g (sin pan)",
        protein: "35g",
        fat: "10g",
        fiber: "1g",
        calories: "250kcal (sin pan)"
      },
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      prepTime: "20 min",
      difficulty: "Fácil"
    },
    {
      id: 7,
      title: "Puré de Coliflor",
      category: "sin-suplementacion",
      ingredients: [
        "200g de Coliflor (floretes)",
        "50ml de Leche (o bebida vegetal)",
        "1 Cucharada de Mantequilla (o aceite de oliva)",
        "Sal y Pimienta al gusto",
        "Nuez Moscada al gusto (opcional)"
      ],
      preparation: "Cocina los floretes de coliflor al vapor o hervidos hasta que estén muy suaves. Escúrrelos bien. En una olla, machaca la coliflor cocida con un tenedor o un machacador de papas. Agrega la leche, la mantequilla (o aceite de oliva), la sal, la pimienta y la nuez moscada (si la usas). Mezcla bien hasta obtener un puré cremoso y sin grumos. Si prefieres una textura más fina, puedes usar una licuadora de inmersión. Sirve caliente como acompañamiento. ¡Una alternativa deliciosa y baja en carbohidratos al puré de papa!",
      macros: {
        carbs: "10g",
        protein: "5g",
        fat: "8g",
        fiber: "5g",
        calories: "132kcal"
      },
      image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop",
      prepTime: "25 min",
      difficulty: "Fácil"
    },
    {
      id: 8,
      title: "Wrap de Pollo",
      category: "sin-suplementacion",
      ingredients: [
        "1 Tortilla de Harina Integral (grande)",
        "100g de Pechuga de Pollo Cocida y Deshebrada",
        "2 Cucharadas de Yogur Griego Natural (sin azúcar)",
        "1/4 de Pepino Picado",
        "1/4 de Zanahoria Rallada",
        "Hojas de Lechuga al gusto",
        "Sal y Pimienta al gusto"
      ],
      preparation: "En un tazón, mezcla el pollo deshebrado con el yogur griego, el pepino, la zanahoria, la sal y la pimienta. Extiende la tortilla integral y coloca las hojas de lechuga en el centro. Rellena con la mezcla de pollo. Enrolla la tortilla firmemente, doblando los lados hacia adentro para que el relleno no se salga. Puedes cortarlo por la mitad para facilitar el consumo. ¡Ideal para una comida rápida y nutritiva!",
      macros: {
        carbs: "25g",
        protein: "30g",
        fat: "8g",
        fiber: "5g",
        calories: "302kcal"
      },
      image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop",
      prepTime: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 9,
      title: "Crepioca Fit",
      category: "sin-suplementacion",
      ingredients: [
        "2 Cucharadas de Goma de Tapioca (hidratada)",
        "1 Huevo",
        "Sal al gusto",
        "Relleno al gusto (pollo deshebrado, queso panela, verduras)"
      ],
      preparation: "En un tazón, mezcla la goma de tapioca, el huevo y la sal hasta obtener una masa homogénea. Calienta un sartén antiadherente a fuego medio. Vierte la mezcla en el sartén y extiéndela para formar un círculo. Cocina por unos 2-3 minutos por cada lado, o hasta que esté dorada y cocida. Rellena con tus ingredientes favoritos, como pollo deshebrado, queso panela o verduras salteadas. Dobla por la mitad y sirve caliente. ¡Una opción versátil y rápida para cualquier comida!",
      macros: {
        carbs: "15g",
        protein: "8g",
        fat: "5g",
        fiber: "0g",
        calories: "137kcal"
      },
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      prepTime: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 10,
      title: "Egg Burger",
      category: "sin-suplementacion",
      ingredients: [
        "2 Huevos",
        "1 Pan para Hamburguesa Integral (opcional)",
        "1 Rebanada de Queso Panela (o bajo en grasa)",
        "Lechuga, Tomate y Cebolla al gusto",
        "Sal y Pimienta al gusto"
      ],
      preparation: "Calienta un sartén antiadherente y cocina los huevos al gusto (estrellados, revueltos o como tortilla). Si usas pan, tuéstalo ligeramente. Arma tu \"egg burger\" colocando la lechuga, tomate y cebolla en el pan (si lo usas), luego el queso y finalmente los huevos. Sazona con sal y pimienta. ¡Una opción rápida y llena de proteína para cualquier momento del día!",
      macros: {
        carbs: "2g",
        protein: "15g",
        fat: "12g",
        fiber: "0g",
        calories: "172kcal"
      },
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
      prepTime: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 11,
      title: "Escondidinho de Pollo",
      category: "sin-suplementacion",
      ingredients: [
        "150g de Pechuga de Pollo Cocida y Deshebrada",
        "150g de Puré de Camote (o papa)",
        "50g de Queso Panela (o bajo en grasa), rallado",
        "1/4 de Cebolla Picada",
        "1 Diente de Ajo Picado",
        "Tomate Picado al gusto",
        "Sal y Pimienta al gusto",
        "Aceite de Oliva (para cocinar)"
      ],
      preparation: "En un sartén con un poco de aceite de oliva, sofríe la cebolla y el ajo hasta que estén transparentes. Agrega el pollo deshebrado y el tomate picado. Sazona con sal y pimienta y cocina por unos minutos. En un refractario pequeño, coloca una capa de puré de camote (o papa), luego el relleno de pollo y cubre con otra capa de puré. Espolvorea el queso rallado por encima. Hornea en un horno precalentado a 180°C (350°F) por unos 15-20 minutos, o hasta que el queso esté gratinado y burbujeante. ¡Un platillo reconfortante y nutritivo!",
      macros: {
        carbs: "30g",
        protein: "35g",
        fat: "15g",
        fiber: "5g",
        calories: "405kcal"
      },
      image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop",
      prepTime: "45 min",
      difficulty: "Intermedio"
    },
    {
      id: 12,
      title: "Pastel Horneado",
      category: "sin-suplementacion",
      ingredients: [
        "150g de Pechuga de Pollo Cocida y Deshebrada",
        "100g de Requesón (o queso cottage)",
        "1 Huevo",
        "1/4 de Cebolla Picada",
        "1 Diente de Ajo Picado",
        "Perejil Fresco Picado al gusto",
        "Sal y Pimienta al gusto",
        "Pan Molido Integral (para espolvorear, opcional)"
      ],
      preparation: "En un tazón, mezcla el pollo deshebrado con el requesón, el huevo, la cebolla, el ajo, el perejil, la sal y la pimienta. Integra bien todos los ingredientes. Vierte la mezcla en un molde pequeño apto para horno, previamente engrasado y enharinado (o espolvoreado con pan molido integral). Hornea en un horno precalentado a 180°C (350°F) por unos 25-30 minutos, o hasta que esté dorado y firme. Deja enfriar un poco antes de desmoldar y servir. ¡Una opción ligera y sabrosa!",
      macros: {
        carbs: "10g",
        protein: "38g",
        fat: "12g",
        fiber: "2g",
        calories: "308kcal"
      },
      image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop",
      prepTime: "40 min",
      difficulty: "Intermedio"
    },
    {
      id: 13,
      title: "Sándwich de Pollo",
      category: "sin-suplementacion",
      ingredients: [
        "2 Rebanadas de Pan Integral",
        "100g de Pechuga de Pollo Cocida y Deshebrada",
        "1 Cucharada de Yogur Griego Natural (sin azúcar) o Mayonesa Ligera",
        "Hojas de Lechuga al gusto",
        "Rodajas de Tomate al gusto",
        "Sal y Pimienta al gusto"
      ],
      preparation: "En un tazón, mezcla el pollo deshebrado con el yogur griego (o mayonesa), sal y pimienta. Tuesta ligeramente las rebanadas de pan integral. Arma el sándwich colocando una capa de lechuga, luego el pollo preparado y finalmente las rodajas de tomate. Cubre con la otra rebanada de pan. Puedes cortarlo por la mitad. ¡Un clásico rápido y nutritivo!",
      macros: {
        carbs: "25g",
        protein: "30g",
        fat: "8g",
        fiber: "4g",
        calories: "300kcal"
      },
      image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop",
      prepTime: "10 min",
      difficulty: "Fácil"
    },
    {
      id: 14,
      title: "Berenjena a la Parmesana",
      category: "sin-suplementacion",
      ingredients: [
        "1 Berenjena Mediana",
        "100g de Salsa de Tomate Natural",
        "50g de Queso Panela (o bajo en grasa), rallado",
        "20g de Queso Parmesano (rallado, opcional)",
        "Albahaca Fresca al gusto",
        "Sal y Pimienta al gusto",
        "Aceite de Oliva (para rociar)"
      ],
      preparation: "Corta la berenjena en rodajas de aproximadamente 1 cm de grosor. Colócalas en un colador, espolvorea con sal y déjalas reposar por 15-20 minutos para que suelten el exceso de agua. Enjuaga y seca bien las rodajas de berenjena. En un refractario apto para horno, coloca una capa de salsa de tomate, luego una capa de rodajas de berenjena, espolvorea con queso panela y un poco de albahaca. Repite las capas hasta terminar con berenjena. Cubre con el resto de la salsa de tomate y espolvorea con queso parmesano (si lo usas). Rocía con un poco de aceite de oliva. Hornea en un horno precalentado a 180°C (350°F) por unos 25-30 minutos, o hasta que la berenjena esté suave y el queso gratinado. ¡Un platillo clásico en versión ligera!",
      macros: {
        carbs: "15g",
        protein: "18g",
        fat: "10g",
        fiber: "8g",
        calories: "222kcal"
      },
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      prepTime: "50 min",
      difficulty: "Intermedio"
    },
    {
      id: 15,
      title: "Stroganoff",
      category: "sin-suplementacion",
      ingredients: [
        "150g de Pechuga de Pollo en Cubos (o carne de res magra)",
        "1/4 de Cebolla Picada",
        "1 Diente de Ajo Picado",
        "50g de Champiñones Rebanados",
        "100g de Puré de Tomate Natural",
        "50g de Yogur Griego Natural (sin azúcar) o Crema Ligera",
        "Sal y Pimienta al gusto",
        "Aceite de Oliva (para cocinar)",
        "Arroz Integral o Puré de Coliflor para acompañar"
      ],
      preparation: "En un sartén con un poco de aceite de oliva, sella los cubos de pollo (o carne) hasta que estén dorados. Retira y reserva. En el mismo sartén, sofríe la cebolla y el ajo hasta que estén transparentes. Agrega los champiñones y cocina hasta que suelten su agua. Incorpora el puré de tomate y cocina por unos minutos. Regresa el pollo (o carne) al sartén. Baja el fuego y añade el yogur griego (o crema ligera), mezclando bien. Sazona con sal y pimienta. Cocina a fuego bajo por unos 5-7 minutos, hasta que la salsa espese ligeramente. Sirve caliente, acompañado de arroz integral o puré de coliflor. ¡Una versión saludable de un clásico!",
      macros: {
        carbs: "15g",
        protein: "35g",
        fat: "12g",
        fiber: "3g",
        calories: "318kcal"
      },
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      prepTime: "35 min",
      difficulty: "Intermedio"
    },
    {
      id: 16,
      title: "Kibe Low Carb",
      category: "sin-suplementacion",
      ingredients: [
        "150g de Carne Molida Magra",
        "50g de Coliflor Rallada (o brócoli)",
        "1/4 de Cebolla Picada",
        "Menta Fresca Picada al gusto",
        "Sal y Pimienta al gusto",
        "Aceite de Oliva (para cocinar)"
      ],
      preparation: "En un tazón, mezcla la carne molida con la coliflor rallada, la cebolla, la menta, la sal y la pimienta. Amasa bien hasta que todos los ingredientes estén incorporados. Forma los kibes (pueden ser en forma de balón o croqueta). Calienta un sartén con un poco de aceite de oliva y cocina los kibes a fuego medio hasta que estén dorados por fuera y cocidos por dentro. También puedes hornearlos a 180°C (350°F) por unos 20-25 minutos. ¡Una opción deliciosa y baja en carbohidratos!",
      macros: {
        carbs: "5g",
        protein: "30g",
        fat: "15g",
        fiber: "3g",
        calories: "285kcal"
      },
      image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400&h=300&fit=crop",
      prepTime: "30 min",
      difficulty: "Intermedio"
    },
    {
      id: 17,
      title: "Pan de Queso de Sartén",
      category: "sin-suplementacion",
      ingredients: [
        "2 Cucharadas de Goma de Tapioca (hidratada)",
        "1 Huevo",
        "50g de Queso Panela (o bajo en grasa), rallado",
        "Sal al gusto"
      ],
      preparation: "En un tazón, mezcla la goma de tapioca, el huevo, el queso rallado y la sal hasta obtener una masa homogénea. Calienta un sartén antiadherente a fuego medio. Vierte la mezcla en el sartén y extiéndela para formar un círculo. Cocina por unos 2-3 minutos por cada lado, o hasta que esté dorado y cocido. Puedes doblarlo por la mitad si lo deseas. ¡Una versión rápida y saludable del clásico pan de queso brasileño!",
      macros: {
        carbs: "15g",
        protein: "12g",
        fat: "8g",
        fiber: "0g",
        calories: "188kcal"
      },
      image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&h=300&fit=crop",
      prepTime: "15 min",
      difficulty: "Fácil"
    },
    {
      id: 18,
      title: "Pizza de Tapioca",
      category: "sin-suplementacion",
      ingredients: [
        "3 Cucharadas de Goma de Tapioca (hidratada)",
        "1 Huevo",
        "Sal al gusto",
        "Salsa de Tomate Natural al gusto",
        "50g de Queso Panela (o bajo en grasa), rallado",
        "Orégano al gusto",
        "Relleno al gusto (pollo deshebrado, champiñones, pimientos)"
      ],
      preparation: "En un tazón, mezcla la goma de tapioca, el huevo y la sal hasta obtener una masa homogénea. Calienta un sartén antiadherente a fuego medio. Vierte la mezcla en el sartén y extiéndela para formar una base de pizza. Cocina por unos 2-3 minutos por un lado. Voltea la base, baja el fuego y extiende la salsa de tomate sobre ella. Agrega el queso rallado y tus ingredientes favoritos para el relleno. Tapa el sartén y cocina a fuego bajo por unos 5-7 minutos, o hasta que el queso se derrita y la base esté cocida. Espolvorea orégano y sirve caliente. ¡Una pizza ligera y deliciosa!",
      macros: {
        carbs: "20g",
        protein: "15g",
        fat: "10g",
        fiber: "1g",
        calories: "230kcal"
      },
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
      prepTime: "20 min",
      difficulty: "Intermedio"
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ingredients.some(ingredient => 
                            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                          );
    const matchesCategory = selectedCategory === "all" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (recipeId: number) => {
    setFavorites(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRecipe(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Recetas
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{selectedRecipe.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Libro de Recetas Flexibles
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Recipe Detail */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Recipe Header */}
            <div className="relative">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-xl"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className="bg-white/90 hover:bg-white"
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(selectedRecipe.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Recipe Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant={selectedRecipe.category === 'con-suplementacion' ? 'default' : 'secondary'}>
                      {selectedRecipe.category === 'con-suplementacion' ? 'Con Suplementación' : 'Sin Suplementación'}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {selectedRecipe.prepTime}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {selectedRecipe.difficulty}
                    </div>
                  </div>
                </div>

                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="w-5 h-5" />
                      Ingredientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{ingredient}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Preparation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChefHat className="w-5 h-5" />
                      Modo de Preparación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-gray-700">{selectedRecipe.preparation}</p>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedRecipe.notes && (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <Zap className="w-5 h-5" />
                        Notas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-yellow-700">{selectedRecipe.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Macros */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Flame className="w-5 h-5" />
                      Macronutrientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedRecipe.macros.carbs}</div>
                        <div className="text-sm text-blue-700">Carbohidratos</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedRecipe.macros.protein}</div>
                        <div className="text-sm text-green-700">Proteínas</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{selectedRecipe.macros.fat}</div>
                        <div className="text-sm text-orange-700">Grasas</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{selectedRecipe.macros.fiber}</div>
                        <div className="text-sm text-purple-700">Fibra</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border">
                      <div className="text-3xl font-bold text-red-600">{selectedRecipe.macros.calories}</div>
                      <div className="text-sm text-red-700">Calorías Totales</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Panel
              </Button>
              <div className="h-6 w-px bg-border mx-2" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Libro de Recetas</h1>
                  <p className="text-sm text-muted-foreground">
                    Recetas Flexibles con Macros Calculados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">RECETAS FLEXIBLES</h2>
            <p className="text-xl text-gray-600 mb-6">con Macros calculados</p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {recipes.filter(r => r.category === 'con-suplementacion').length} Recetas con Suplementación
              </span>
              <span className="flex items-center gap-2">
                <Beef className="w-4 h-4" />
                {recipes.filter(r => r.category === 'sin-suplementacion').length} Recetas sin Suplementación
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar recetas o ingredientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                Todas
              </Button>
              <Button
                variant={selectedCategory === "con-suplementacion" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("con-suplementacion")}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Con Suplementos
              </Button>
              <Button
                variant={selectedCategory === "sin-suplementacion" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("sin-suplementacion")}
                className="flex items-center gap-2"
              >
                <Beef className="w-4 h-4" />
                Sin Suplementos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recipe Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card 
              key={recipe.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(recipe.id);
                    }}
                    className="bg-white/90 hover:bg-white"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(recipe.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant={recipe.category === 'con-suplementacion' ? 'default' : 'secondary'}>
                    {recipe.category === 'con-suplementacion' ? 'Whey' : 'Natural'}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight">{recipe.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.prepTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {recipe.difficulty}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-semibold text-blue-600">{recipe.macros.carbs}</div>
                    <div className="text-blue-700">Carbs</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-semibold text-green-600">{recipe.macros.protein}</div>
                    <div className="text-green-700">Prot</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-semibold text-orange-600">{recipe.macros.fat}</div>
                    <div className="text-orange-700">Grasas</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-semibold text-red-600">{recipe.macros.calories}</div>
                    <div className="text-red-700">Kcal</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No se encontraron recetas</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </main>
    </div>
  );
}
