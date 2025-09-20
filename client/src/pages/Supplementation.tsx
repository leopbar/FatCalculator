
import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pill, CheckCircle, XCircle, AlertTriangle, Info, Clock, Zap, Shield, Heart, Brain } from "lucide-react";

interface Supplement {
  name: string;
  category: "ÚTIL" | "INÚTIL" | "POUCO ÚTIL";
  function: string;
  benefits: string[];
  contraindications?: string[];
  usage: string;
  attention?: string;
  image: string;
  icon: any;
}

const supplements: Supplement[] = [
  {
    name: "WHEY PROTEIN",
    category: "ÚTIL",
    function: "Proteínas solubles extraídas del suero de la leche. Contiene todos los aminoácidos esenciales, siendo rápidamente absorbidas por el organismo.",
    benefits: [
      "Alcanzar las necesidades diarias de proteínas",
      "Prevenir sarcopenia en adultos mayores, caracterizada por pérdida de fuerza y masa muscular",
      "Recuperación y ganancia de masa muscular"
    ],
    contraindications: [
      "Individuos con intolerancia a la lactosa o caseína pueden sentir molestias abdominales",
      "Personas con alergia a la proteína de la leche"
    ],
    usage: "Puede mezclarse con agua o usarse en recetas. La dosis adecuada debe ser indicada por un nutriólogo profesional.",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "CREATINA",
    category: "ÚTIL",
    function: "La creatina es un compuesto orgánico, extraído de carne roja y pescados, además de ser producido en el organismo. Sin embargo, por la baja cantidad ingerida a través de la alimentación, para alcanzar efectos ergogénicos, su suplementación es necesaria.",
    benefits: [
      "La creatina ayuda al ADP a convertirse en ATP de nuevo, proporcionando así más energía para los músculos, contribuyendo a mejorar el rendimiento durante el ejercicio",
      "Aumento de potencia y rendimiento en actividades anaeróbicas",
      "Mejora de la fatiga muscular"
    ],
    contraindications: ["Contraindicado para pacientes con lesión renal aguda o crónica"],
    usage: "Fase de saturación (opcional): usar 20 gramos por 3 a 5 días para \"llenar\" los depósitos de creatina. Fase de mantenimiento: ingerir de 3 a 5 gramos por día o 0.3 g/kg de peso corporal.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "BETA ALANINA",
    category: "ÚTIL",
    function: "La beta-alanina es un aminoácido no esencial, siendo el único de tipo beta producido naturalmente por nuestro organismo. Es un dipeptido producido por el hígado, que también puede obtenerse por el consumo de carnes.",
    benefits: [
      "Ayuda a mejorar el rendimiento deportivo en ejercicios de alta intensidad y corta duración",
      "Previene la fatiga",
      "Ayuda en la intensidad y duración del ejercicio",
      "Promueve el aumento de resistencia principalmente en ejercicios que duran de 60 a 240 segundos"
    ],
    usage: "4 a 6 gramos por día, fraccionados en al menos 4 dosis de 2 gramos o menos.",
    attention: "Dosis mayores pueden causar sensación de hormigueo, que suele desaparecer después de 60 a 90 minutos.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "CAFEÍNA",
    category: "ÚTIL",
    function: "La cafeína es una sustancia considerada estimulante, absorbida en el torrente sanguíneo y llevada hasta el cerebro, actuando en el sistema nervioso central, aumentando el estado de alerta y la capacidad de razonamiento.",
    benefits: [
      "Practicantes de pruebas de resistencia, actividades como fútbol y deportes de alta intensidad con duración de 1 a 60 minutos pueden beneficiarse del uso de cafeína",
      "Disminuye la sensación de fatiga y dolor y aumenta el estado de alerta",
      "Mejora del rendimiento aeróbico",
      "Acción termogénica, favoreciendo la reducción de tejido adiposo"
    ],
    contraindications: [
      "Contraindicada para niños menores de 12 años, alérgicos a la cafeína, hipertensión, úlceras en el estómago o portadores de enfermedades cardiovasculares"
    ],
    usage: "3 a 7 mg/kg/día, 45 minutos antes de iniciar la actividad física. Con uso crónico, puede haber mayor tolerancia a la cafeína.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    icon: Brain
  },
  {
    name: "ÓMEGA 3",
    category: "ÚTIL",
    function: "Son ácidos grasos poliinsaturados que se encuentran en peces de agua fría (atún, bacalao, salmón, sardina) o en aceites vegetales (semilla de linaza, nueces, chía). El omega 3 es un tipo de grasa saludable, capaz de regular el colesterol y con acción anti-inflamatoria.",
    benefits: [
      "Antiinflamatorio",
      "Mejora de la sensibilidad a la insulina",
      "Mejora del dolor y rigidez matinal en individuos con artritis reumatoide",
      "Mejora del humor y memoria",
      "Reducción de ansiedad y depresión"
    ],
    contraindications: ["Personas con problemas de coagulación sanguínea"],
    usage: "La dosis recomendada de omega 3 varía por individuo, pudiendo recomendarse hasta 4 gramos por día en portadores de hipertrigliceridemia.",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    icon: Heart
  },
  {
    name: "ALBUMINA",
    category: "ÚTIL",
    function: "Principal proteína de la clara del huevo. Tiene alto valor biológico, en 24g de proteína presenta 5g de BCAA.",
    benefits: [
      "Alcanzar las necesidades de proteínas diarias",
      "Mejor recuperación muscular post-entrenamiento",
      "Favorece hipertrofia",
      "Actúa como antiinflamatorio"
    ],
    usage: "En general, se utilizan 20 a 40 gramos por día, pudiendo ser diluido en líquidos como agua, jugos o leche.",
    attention: "En exceso, puede causar síntomas gastrointestinales, como diarrea y gases. No debe ser usada por individuos con insuficiencia renal.",
    image: "https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "BICARBONATO DE SODIO",
    category: "ÚTIL",
    function: "Principal tampón extracelular, impidiendo grandes reducciones del pH que llevarían a la fatiga durante el ejercicio. La ingesta de bicarbonato de sodio aumenta la concentración extracelular de iones bicarbonato, elevando el pH sanguíneo, tamponando la acidez de las células musculares y retrasando la fatiga.",
    benefits: [
      "Reducción de la fatiga",
      "Mejor recuperación muscular",
      "Menos dolor muscular"
    ],
    usage: "300 mg/kg de peso corporal. De preferencia asociar el consumo a alimentos ricos en carbohidratos. Fraccionar la dosis y consumir a partir de 120 a 150 minutos antes del ejercicio.",
    attention: "Pueden haber síntomas gastrointestinales, como diarrea, gases, cólicos, náuseas y vómitos.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=300&fit=crop",
    icon: Shield
  },
  {
    name: "SUPLEMENTOS DE CARBOHIDRATOS",
    category: "ÚTIL",
    function: "Los suplementos a base de carbohidratos tienen un papel primordial como sustrato energético para la actividad física. La diferencia de los productos está en la velocidad de absorción y en el índice glucémico. Dextrosa, Waxy maize, Palatinosa, Maltodextrina.",
    benefits: [
      "Puede usarse durante o después del entrenamiento, pues recupera rápidamente los depósitos de glucógeno depletados en el ejercicio",
      "Posee miles de moléculas de glucosa y su degradación ocurre en diferentes puntos, lo que facilita la digestión",
      "Es el más estable y con menor velocidad de absorción, pudiendo usarse antes o durante el entrenamiento. Por tener bajo índice glucémico, también puede ser indicado para portadores de diabetes mellitus"
    ],
    usage: "*para entrenamientos de larga duración",
    attention: "Causa aumento expresivo de insulina. Puede causar fatiga y pérdida de rendimiento. No recomendado como pre-entrenamiento inmediato.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "MULTIVITAMÍNICO",
    category: "POUCO ÚTIL",
    function: "Los multivitamínicos están compuestos por diversas vitaminas y minerales, que se encuentran en todos los tipos de alimentos y no contienen calorías. Proporcionar vitaminas y minerales.",
    benefits: [
      "Fortalecer inmunidad",
      "Prevención de enfermedades",
      "Reducir inflamación",
      "Antioxidantes",
      "Aumentar disposición y memoria",
      "Fortalecer uñas, cabello y huesos, entre otros"
    ],
    usage: "La recomendación de dosis para multivitamínicos difiere entre individuos, edad, sexo, embarazo, patologías específicas, entre otros.",
    attention: "La suplementación de vitaminas y minerales solo contribuye a la mejora del rendimiento del atleta cuando presenta deficiencias en los niveles de estos nutrientes. La ingesta mayor a la necesaria diaria no trae beneficios adicionales para la salud.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    icon: Pill
  },
  {
    name: "HIPERCALÓRICO",
    category: "POUCO ÚTIL",
    function: "Suplemento rico en calorías y carbohidratos, utilizado para aumentar la ingesta energética durante el día.",
    benefits: [
      "Contribuye al ganancia de masa muscular y suministro de energía durante el ejercicio",
      "Ayuda en el ganancia de masa muscular",
      "Mejora de la recuperación muscular",
      "Disminución del catabolismo",
      "Mejora del rendimiento"
    ],
    usage: "Diluir una dosis en agua, leche, batidos o vitaminas. La cantidad de dosis depende de la necesidad de cada individuo.",
    attention: "Por ser rico especialmente en carbohidratos simples, su uso no debe hacerse de forma indiscriminada y, siempre que sea posible, dar preferencia a alimentos de mayor densidad energética.",
    image: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=400&h=300&fit=crop",
    icon: Zap
  },
  {
    name: "HMB",
    category: "POUCO ÚTIL",
    function: "También conocido como beta-hidroxi-beta-metilbutirato, es producido de forma natural en el organismo a través de la leucina y puede encontrarse en algunos alimentos. HMB se usa como intento de elevar los niveles de fuerza, acentuar ganancias en dimensión y fuerza muscular y prevenir colapso en el tejido muscular, que puede ocurrir justo después de los ejercicios arduos.",
    benefits: [
      "Efecto anticatabólico en atletas en pre-competencia",
      "En adultos mayores, leve aumento de fuerza y masa muscular"
    ],
    usage: "Consumir 3 gramos, 1 hora antes del entrenamiento, si se ingiere con alimento fuente de glucosa, esperar de 2 a 3 horas para ejercitarse.",
    attention: "Los resultados de la suplementación parecen ser más eficientes cuando se inicia 2 semanas antes del inicio del entrenamiento, o de la modificación del tipo de entrenamiento. No compensa el costo-beneficio en individuos sanos y con buena alimentación.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Shield
  },
  {
    name: "COENZIMA Q10",
    category: "POUCO ÚTIL",
    function: "Conocida también como ubiquinona, es una sustancia similar a una vitamina y esencial en la cadena transportadora de electrones. Se encuentra principalmente en el corazón, hígado, cerebro y músculo esquelético. Esencial para el funcionamiento del organismo y, consecuentemente, para la práctica de ejercicios.",
    benefits: [
      "Antioxidante",
      "Mejora la producción de energía",
      "Aumenta el rendimiento debido a la reducción de la fatiga",
      "Disminuye el riesgo de aterosclerosis",
      "Mejora la función cerebral"
    ],
    usage: "Dosis: 50 a 200 mg/día. Mejor absorción cuando se ingiere en horarios cercanos a una comida que contenga grasas.",
    attention: "Hay pocos estudios concluyentes en relación a la eficacia de la suplementación de coenzima Q10 cuando el objetivo es reducir dolores musculares derivados del entrenamiento.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    icon: Heart
  },
  {
    name: "CASEÍNA",
    category: "POUCO ÚTIL",
    function: "Es una proteína de alto valor biológico conteniendo todos los aminoácidos esenciales. Se encuentra en la leche de vaca y derivados y en la leche materna en pequeña cantidad. Tiene una digestión más lenta que otras proteínas.",
    benefits: [
      "Suministrar la cantidad de proteína diaria",
      "Anticatabólico",
      "Ayuda en el ganancia de masa muscular"
    ],
    usage: "Cerca de la hora de dormir, para proveer la liberación gradual de aminoácidos durante el sueño.",
    attention: "Tiene potencial alergénico y de desencadenar cuadros autoinmunes, no siendo un suplemento de proteína de primera elección.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    icon: Clock
  },
  {
    name: "VASODILATADORES",
    category: "POUCO ÚTIL",
    function: "La arginina es un sustrato para la síntesis de óxido nítrico. La citrulina consigue aumentar los niveles de arginina en el organismo, ejerciendo el efecto ergogénico de vasodilatación, garantizando buena oxigenación de los tejidos. Actúa en la mejora de la inmunidad, regulando la síntesis de anticuerpos y mejorando la cicatrización.",
    benefits: [
      "Promueve el aumento de los niveles de energía",
      "Mejora de la resistencia al ejercicio físico",
      "Ayuda en la recuperación de los músculos y fatiga post-entrenamiento"
    ],
    usage: "Dosis indicada: 6 a 10 gramos por día, 40 a 60 minutos antes del entrenamiento, divididas en 3 a 4 dosis/día.",
    attention: "Las investigaciones muestran falta de resultados en relación a la mejora de la capacidad de resistencia aeróbica.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Heart
  },
  {
    name: "GLUTAMINA",
    category: "INÚTIL",
    function: "Aminoácido libre más abundante en el plasma y los músculos. Considerado condicionalmente esencial, pues aunque es producido por el cuerpo, en condiciones de hipercatabolismo, el cuerpo no logra producir cantidad suficiente. La glutamina ayuda en el aumento de las reservas de glucógeno muscular, ayudando a evitar que el organismo queme masa muscular para generar energía.",
    benefits: [
      "Optimizar el balance nitrogenado y mantener la síntesis proteica muscular",
      "Mantenimiento de la integridad intestinal",
      "Ayuda en el combate a infecciones que llevan a un estado hipermetabólico"
    ],
    usage: "5 a 20 gramos por día. Usar antes de dormir o antes del desayuno.",
    attention: "La gran mayoría de los individuos producen cantidades suficientes de glutamina simplemente con una buena alimentación, haciendo inútil la compra del suplemento.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    icon: XCircle
  },
  {
    name: "BCAA",
    category: "INÚTIL",
    function: "Son aminoácidos de cadena ramificada, compuestos por 3 aminoácidos esenciales (leucina, isoleucina y valina).",
    benefits: [
      "Reducir la lesión muscular causada por el ejercicio, aumentar la síntesis de proteínas y son fuentes de nitrógeno para la formación de alanina y glutamina",
      "Estimular la síntesis proteica",
      "Tiene efecto terapéutico en enfermedades hepáticas y individuos con fenilcetonuria"
    ],
    usage: "Isoleucina: 20 mg/kg, Valina: 26 mg/kg, Leucina: 39 mg/kg. Dosis: 4 a 20 gramos diarios.",
    attention: "Si la dieta está adecuada en relación a la cantidad de proteínas, su uso no es necesario.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: XCircle
  }
];

export default function Supplementation() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ÚTIL" | "POUCO ÚTIL" | "INÚTIL">("all");
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);

  const filteredSupplements = selectedCategory === "all" 
    ? supplements 
    : supplements.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "ÚTIL": return "bg-green-100 text-green-800 border-green-200";
      case "POUCO ÚTIL": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INÚTIL": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ÚTIL": return <CheckCircle className="w-4 h-4" />;
      case "POUCO ÚTIL": return <AlertTriangle className="w-4 h-4" />;
      case "INÚTIL": return <XCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  if (selectedSupplement) {
    const IconComponent = selectedSupplement.icon;
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-white border-b border-border sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSupplement(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <IconComponent className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">
                  {selectedSupplement.name}
                </h1>
                <Badge className={`${getCategoryColor(selectedSupplement.category)} border`}>
                  {getCategoryIcon(selectedSupplement.category)}
                  <span className="ml-1">{selectedSupplement.category}</span>
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-6">
          <div className="space-y-8">
            {/* Hero Image */}
            <div className="relative h-64 rounded-xl overflow-hidden">
              <img 
                src={selectedSupplement.image} 
                alt={selectedSupplement.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{selectedSupplement.name}</h1>
                <Badge className={`${getCategoryColor(selectedSupplement.category)} border`}>
                  {getCategoryIcon(selectedSupplement.category)}
                  <span className="ml-1">{selectedSupplement.category}</span>
                </Badge>
              </div>
            </div>

            {/* Function */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Función
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedSupplement.function}</p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedSupplement.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Modo de uso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{selectedSupplement.usage}</p>
              </CardContent>
            </Card>

            {/* Contraindications */}
            {selectedSupplement.contraindications && selectedSupplement.contraindications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Contraindicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {selectedSupplement.contraindications.map((contraindication, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{contraindication}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Attention */}
            {selectedSupplement.attention && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    Atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-yellow-700 leading-relaxed">{selectedSupplement.attention}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <Pill className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Suplementación sin Secretos
                  </h1>
                  <p className="text-muted-foreground">
                    Guía completa sobre suplementos: lo que realmente funciona
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="flex items-center gap-2"
            >
              <Pill className="w-4 h-4" />
              Todos ({supplements.length})
            </Button>
            <Button
              variant={selectedCategory === "ÚTIL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("ÚTIL")}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Útil ({supplements.filter(s => s.category === "ÚTIL").length})
            </Button>
            <Button
              variant={selectedCategory === "POUCO ÚTIL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("POUCO ÚTIL")}
              className="flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Poco Útil ({supplements.filter(s => s.category === "POUCO ÚTIL").length})
            </Button>
            <Button
              variant={selectedCategory === "INÚTIL" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("INÚTIL")}
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Inútil ({supplements.filter(s => s.category === "INÚTIL").length})
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {/* Intro Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <Pill className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">
                    Total de páginas: 17
                  </h2>
                  <p className="text-blue-700 leading-relaxed">
                    Esta guía completa de suplementación te ayudará a entender qué suplementos realmente funcionan, 
                    cuáles son innecesarios y cómo usar cada uno de manera efectiva y segura. Cada suplemento está 
                    clasificado según su utilidad basada en evidencia científica.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplements Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSupplements.map((supplement, index) => {
            const IconComponent = supplement.icon;
            return (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedSupplement(supplement)}
              >
                <div className="relative">
                  <img 
                    src={supplement.image} 
                    alt={supplement.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getCategoryColor(supplement.category)} border`}>
                      {getCategoryIcon(supplement.category)}
                      <span className="ml-1">{supplement.category}</span>
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {supplement.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {supplement.function}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {supplement.benefits.length} beneficios
                    </span>
                    <Button size="sm" variant="ghost" className="h-auto p-0 text-primary">
                      Ver detalles →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSupplements.length === 0 && (
          <div className="text-center py-12">
            <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No se encontraron suplementos
            </h3>
            <p className="text-muted-foreground">
              Cambia el filtro para ver más opciones
            </p>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Resumen de Clasificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">
                    {supplements.filter(s => s.category === "ÚTIL").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Útiles</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-yellow-600">
                    {supplements.filter(s => s.category === "POUCO ÚTIL").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Poco Útiles</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-red-600">
                    {supplements.filter(s => s.category === "INÚTIL").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Inútiles</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
