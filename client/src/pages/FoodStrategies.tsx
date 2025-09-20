
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Heart,
  Utensils,
  Gauge,
  Users,
  Star,
  Trophy,
  Clock,
  BookOpen,
  Map,
  Wrench,
  Settings,
  Coffee,
  Calendar,
  Home,
  Plane,
  Timer,
  Brain
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface Section {
  id: number;
  title: string;
  icon: React.ElementType;
  color: string;
  estimatedTime: string;
  content: React.ReactNode;
}

export default function FoodStrategies() {
  const [, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const { user } = useAuth();

  const sections: Section[] = [
    {
      id: 1,
      title: "La Base de Todo - Mentalidad y Planeación",
      icon: Brain,
      color: "bg-purple-500",
      estimatedTime: "15 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-4 translate-y-4"></div>
            <div className="relative z-10">
              <Brain className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">La Base de Todo - Mentalidad y Planeación</h2>
              <p className="text-lg opacity-90">Construyendo los cimientos para una alimentación exitosa</p>
            </div>
          </div>

          {/* Introducción */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  ¡Hola! Qué bueno que estás aquí, con todas esas ganas de aprender y transformar tu relación con la comida. Puedes llamarme Manu. Soy nutrióloga y maestra, y mi pasión es justamente esta: traducir la ciencia de la nutrición a una plática clara, práctica y que haga sentido en tu día a día.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Vamos a empezar juntos un viaje para descubrir las "Estrategias de Alimentación para tu dieta". Y ojo, cuando digo "dieta", no quiero que pienses en restricción, en sufrimiento o en una lista de alimentos prohibidos. Para mí, dieta es sinónimo de estilo de vida, de decisiones conscientes que nutren tu cuerpo y tu mente. El objetivo aquí no es crear un manual de reglas súper estrictas, sino una guía con estrategias inteligentes para que tengas autonomía y sepas cómo manejarte en las situaciones más diversas, manteniendo el equilibrio y el placer de comer.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  En este primer bloque, vamos a construir los cimientos, la base para que todas las demás estrategias funcionen. A fin de cuentas, de nada sirve tener el plan más detallado si nuestra mentalidad y nuestro entorno no están alineados con nuestros objetivos. ¿Le entramos?
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sección 1: Todo o Nada vs Equilibrio */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-200">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-2xl font-bold text-red-800">1. La Mentalidad del "Todo o Nada" vs. la Mentalidad del Equilibrio</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              ¿Te suena familiar este escenario? Empiezas el lunes con todo: ensalada, pollo a la plancha, cero azúcar. Todo perfecto. Pero llega el miércoles en la noche y te comes una rebanada de pizza en un cumpleaños. ¡Listo! El pensamiento que llega es: "Ya rompí la dieta, ahora sí, a darle con todo. El lunes empiezo de nuevo". Esa es la mentalidad del "todo o nada", una trampa peligrosísima que crea un círculo vicioso de restricción y atracón.
            </p>

            <div className="bg-white rounded-lg p-6 mb-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-orange-600" />
                <h4 className="text-xl font-bold text-orange-800">La Verdad Científica</h4>
              </div>
              <p className="text-gray-700">
                La verdad, científicamente comprobada, es que la constancia le gana a la perfección. Una sola comida "fuera del plan" no tiene el poder de arruinar tu progreso, así como una sola ensalada no tiene el poder de hacerte bajar de peso por arte de magia. Lo que importa es el panorama completo, lo que haces la mayor parte del tiempo.
              </p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <h5 className="font-semibold text-green-800 mb-3">La Estrategia del Cambio Mental</h5>
              <p className="text-green-700 mb-4">
                La estrategia aquí es cambiar ese diálogo interno. En lugar de "ya lo eché a perder todo", piensa: "Fue una comida deliciosa y un momento social importante. Ahora, en mi siguiente comida, simplemente regreso a mi plan normal". Sin culpas, sin castigos.
              </p>
              <p className="text-green-700 font-medium">
                Abraza la flexibilidad. Un plan de alimentación exitoso contempla las excepciones. Está hecho para una vida real, con eventos sociales, antojos e imprevistos. La clave es que la excepción no se convierta en la regla.
              </p>
            </div>
          </div>

          {/* Sección 2: Planeación */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-800">2. La Importancia de Planear tu Semana</h3>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">El Consejo de Oro</h4>
                  <p className="text-yellow-700">
                    Si pudiera darte un solo consejo práctico para transformar tu alimentación, sería este: planea. La falta de planeación es la puerta de entrada a las malas decisiones. Cuando el hambre aprieta y no hay nada saludable y rápido a la mano, la tendencia es pedir lo primero que se te cruce en la app de comida o comprar el antojito más cercano.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Planear no tiene por qué ser algo del otro mundo. Aparta una o dos horas de tu fin de semana para esto. Verás qué fácil puede ser:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h5 className="font-bold text-blue-800 text-center mb-3">Define el Menú</h5>
                <p className="text-sm text-gray-600">
                  Piensa en las comidas principales de tu semana (desayuno, comida y cena). No tiene que ser nada gourmet. Piensa en combinaciones sencillas: una fuente de proteína (pollo, pescado, huevos, lentejas), una de carbohidratos complejos (arroz integral, camote, quinoa) y muchas verduras.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h5 className="font-bold text-blue-800 text-center mb-3">Haz la Lista del Súper</h5>
                <p className="text-sm text-gray-600">
                  Ya con el menú en mano, crea una lista de todo lo que vas a necesitar. Esto evita que compres por impulso en el supermercado y te asegura tener todos los ingredientes a la mano.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h5 className="font-bold text-blue-800 text-center mb-3">Prepara la Comida (Meal Prep)</h5>
                <p className="text-sm text-gray-600">
                  ¡Este es el truco que lo cambia todo! Puedes cocinar para varios días. Deja el arroz integral cocido, las verduras picadas o incluso ya asadas, el pollo deshebrado, los huevos cocidos. Guarda todo en recipientes en el refri. Durante la semana, armar un plato saludable te tomará solo unos minutos.
                </p>
              </div>
            </div>

            <div className="bg-blue-100 p-6 rounded-lg mt-6">
              <p className="text-blue-800 font-medium text-center">
                Esta práctica te ahorra tiempo, dinero y, sobre todo, te mantiene enfocado.
              </p>
            </div>
          </div>

          {/* Sección 3: Ambiente */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
            <div className="flex items-center gap-4 mb-6">
              <Home className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-green-800">3. Construyendo un Ambiente a tu Favor</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Te guste o no, el ambiente que te rodea influye en ti. Si tu alacena está llena de galletas, papitas y dulces, la probabilidad de que te los comas en un momento de estrés o aburrimiento es altísima. La estrategia aquí es simple, pero poderosa: pon difícil el acceso a lo que no te ayuda y facilita el acceso a lo que te nutre.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4">"Limpia" tu Alacena</h4>
                <p className="text-gray-700 mb-4">
                  No digo que tires todo a la basura (a menos que quieras), pero en tu próxima ida al súper, dale prioridad a la comida de verdad.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4">Deja lo Saludable a la Vista y al Alcance</h4>
                <ul className="text-gray-700 space-y-2 text-sm">
                  <li>• Ten un frutero lleno y visible</li>
                  <li>• Pon frascos con nueces y semillas a la altura de los ojos</li>
                  <li>• Cuando abras el refrigerador, que los yogures naturales, las verduras picadas y los huevos cocidos estén al frente, fáciles de agarrar</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-100 p-6 rounded-lg mt-6">
              <p className="text-green-800">
                <strong>Esconde (o mejor, no compres) los alimentos ultraprocesados.</strong> Si se te antoja un dulce, que tengas que salir a comprarlo o tomarte el trabajo de preparar una versión más saludable. Muchas veces, esa pequeña dificultad es suficiente para que lo pienses dos veces.
              </p>
            </div>
          </div>

          {/* Sección 4: Regla 80/20 */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-orange-200">
            <div className="flex items-center gap-4 mb-6">
              <Gauge className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-800">4. La Regla 80/20: Flexibilidad con Estructura</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Para hacer este camino más ligero y sostenible, me encanta aplicar la regla 80/20. La idea es que el 80% del tiempo te dediques a tomar decisiones alineadas con tus objetivos de salud: alimentos nutritivos, preparaciones más limpias, control de porciones. En el otro 20%, te permites tener más flexibilidad.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">80%</span>
                  </div>
                  <h4 className="font-bold text-orange-800">Decisiones Saludables</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Alimentos nutritivos</li>
                  <li>• Preparaciones más limpias</li>
                  <li>• Control de porciones</li>
                  <li>• Enfoque en objetivos de salud</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-xl">20%</span>
                  </div>
                  <h4 className="font-bold text-yellow-800">Flexibilidad</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• Pizza con los amigos el sábado</li>
                  <li>• Pastel en la fiesta familiar</li>
                  <li>• Una copa de vino</li>
                  <li>• Vida social y placer</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-100 p-6 rounded-lg mt-6">
              <p className="text-orange-800 font-medium">
                Ese 20% no es "romper la dieta", es incluir la vida social y el placer en tu dieta. Al planear estos momentos, los disfrutas sin culpa y mantienes el control, porque sabes que son parte de tu estrategia y no representan un fracaso.
              </p>
            </div>
          </div>

          {/* Conclusión del bloque */}
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Bases Sólidas Establecidas</h3>
            <p className="text-lg leading-relaxed text-purple-100 text-center">
              Este primer paso, enfocado en ajustar la mentalidad y organizar la rutina, es la base sólida que necesitábamos. Con esto bien puesto, estamos listos para avanzar y aprender a lidiar con situaciones más específicas que suelen ser un reto para la mayoría.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Descomplicando el Fin de Semana",
      icon: Calendar,
      color: "bg-blue-500",
      estimatedTime: "18 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Calendar className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">Descomplicando el Fin de Semana</h2>
              <p className="text-lg opacity-90">Estrategias para mantener el equilibrio sin sacrificar la diversión</p>
            </div>
          </div>

          {/* Introducción */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  "De lunes a viernes me la rifo, Manu. Mi problema es el fin de semana". ¡Si me dieran un peso por cada vez que escucho esa frase, ya estaría retirada! El fin de semana llega con un paquete completo: invitaciones a salir, más tiempo libre (que puede llevar al aburrimiento y a buscar comida), la sensación de "me lo merezco" después de una semana de friega en el trabajo y, claro, el rompimiento total de la rutina.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  La buena noticia es que es totalmente posible disfrutar del sábado y el domingo sin tirar por la borda todo el esfuerzo de la semana. El secreto no es encerrarte en tu casa, sino usar estrategias inteligentes para navegar estos días con equilibrio y placer.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sección 1: Me lo Merezco Inteligente */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border-2 border-pink-200">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-8 h-8 text-pink-600" />
              <h3 className="text-2xl font-bold text-pink-800">1. La Mentalidad del "Me lo Merezo" Inteligente</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              La primera trampa es la del "me lo merezco". Y sí, ¡claro que te lo mereces! Mereces descansar, divertirte, relajarte. Pero es importante preguntarte: ¿qué es exactamente lo que te mereces? ¿Mereces sentirte súper lleno, con agruras y arrepentido el lunes? ¿O mereces nutrir tu cuerpo, tener energía para disfrutar tu descanso y sentirte a gusto contigo mismo?
            </p>

            <div className="bg-white rounded-lg p-6 mb-6 border border-pink-200">
              <h4 className="text-xl font-bold text-pink-800 mb-4">Redefine tus "Merecimientos"</h4>
              <p className="text-gray-700 mb-4">
                La comida puede y debe ser una fuente de placer, pero no puede ser tu única recompensa. La estrategia aquí es ampliar tu abanico de "merecimientos". ¿Qué tal si asocias el fin de semana con otras actividades placenteras que no involucren comida?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-3">Merecimientos Alternativos</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Me merezco un paseo por el parque</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Me merezco leer un libro con calma</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Me merezco echarme un maratón de esa serie que tanto me gusta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Me merezco un baño largo y relajante</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Me merezco ver a mis amigos para echar chismecito</span>
                  </li>
                </ul>
              </div>

              <div className="bg-pink-100 p-4 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-3">El Resultado</h5>
                <p className="text-sm text-pink-700">
                  Cuando llenas tu tiempo con actividades que te dan placer, la comida deja de ser el centro de atención y vuelve a ocupar su lugar: el de nutrir y, de vez en cuando, celebrar.
                </p>
              </div>
            </div>
          </div>

          {/* Sección 2: Comida Libre vs Día de Atracón */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
            <div className="flex items-center gap-4 mb-6">
              <Utensils className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-green-800">2. La Estrategia de la Comida Libre (y no el "Día de Atracón")</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              ¿Te acuerdas de nuestra regla 80/20? El fin de semana es el momento perfecto para usar tu 20% de flexibilidad. Sin embargo, hay una gran diferencia entre tener una comida libre y un "día de atracón" (o "cheat day").
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <h4 className="text-lg font-bold text-red-800">❌ "Cheat Day" (Pésimo)</h4>
                </div>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Crea relación negativa con la comida</li>
                  <li>• Etiqueta alimentos como "chatarra" o "prohibidos"</li>
                  <li>• Permiso para exagerar sin límites</li>
                  <li>• Puede anular el déficit calórico de toda la semana</li>
                  <li>• Causa malestar físico y mental</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-bold text-green-800">✅ Comida Libre (Estratégico)</h4>
                </div>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Estratégico y saludable</li>
                  <li>• Control y planificación</li>
                  <li>• Sin culpa, con disfrute</li>
                  <li>• Mantiene el progreso general</li>
                  <li>• Bienestar físico y mental</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-green-200">
              <h4 className="text-xl font-bold text-green-800 mb-4">Cómo Funciona la Comida Libre</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h5 className="font-semibold text-green-800">Elige UNA o DOS comidas</h5>
                    <p className="text-sm text-gray-700">En tu fin de semana para que sean tus comidas libres. Por ejemplo, la cena del sábado y la comida del domingo.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h5 className="font-semibold text-green-800">Come con atención plena (mindful eating)</h5>
                    <p className="text-sm text-gray-700">¿Quieres unos tacos al pastor? Échate tus tacos. ¿Quieres una hamburguesa? Cómete la hamburguesa. Pero hazlo con atención plena. Siéntate, saborea cada mordida, disfruta el momento. Come despacio y para cuando te sientas satisfecho, no a reventar.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h5 className="font-semibold text-green-800">Mantén la base saludable</h5>
                    <p className="text-sm text-gray-700">Fuera de esas comidas, mantén la base de tu alimentación saludable. No porque la cena del sábado vaya a ser pizza significa que el desayuno y la comida tienen que ser un descontrol. Empieza el día con tus huevos a la mexicana o tu fruta con avena. Haz una comida nutritiva.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-100 p-6 rounded-lg mt-6">
              <p className="text-green-800 font-medium text-center">
                Esta estrategia te da libertad, elimina la culpa y te mantiene en control de la situación.
              </p>
            </div>
          </div>

          {/* Sección 3: Eventos Sociales */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-800">3. Moviéndote en Eventos Sociales: Restaurantes, Fiestas y Bares</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Salir con los amigos y la familia es parte esencial de la vida. Y la comida casi siempre está presente. Aquí te digo cómo manejarlo:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Antes de salir, come un snack</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Nunca vayas a un evento social con muchísima hambre. El hambre es la peor consejera.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Ejemplos: yogur griego, un puñito de almendras, o hasta un omelette
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Échale un ojo al menú antes</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  La mayoría de los restaurantes hoy tienen su menú en línea. Revísalo antes de ir.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Busca: platillos a la plancha, asados, al vapor y con verduras o ensalada
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Aguas con las bebidas</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Las calorías líquidas son traicioneras. El alcohol, los refrescos y las aguas de sabor con mucha azúcar pueden sumar muchísimas calorías sin que te des cuenta.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Estrategia: Intercala. Por cada vaso de bebida alcohólica, tómate un vaso de agua mineral con limón y hielo.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Comparte el postre</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  ¿Se te antoja muchísimo ese pastel de chocolate? ¡Compártelo con alguien!
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Te quitas el antojo con unas cuantas cucharadas, sin necesidad de pedir una porción entera para ti solo.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-yellow-800 mb-2">Tip de Bebidas Alcohólicas</h5>
                  <p className="text-yellow-700">
                    Si vas a tomar, prefiere destilados como tequila o mezcal con agua mineral o refresco de dieta, o una copa de vino tinto. Esto te mantiene hidratado, disminuye el consumo de alcohol y calorías, y hasta ayuda a prevenir la cruda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 4: Mantente Activo */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border-2 border-orange-200">
            <div className="flex items-center gap-4 mb-6">
              <Star className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-800">4. Mantente Activo</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              El fin de semana es una gran oportunidad para moverte de forma placentera. No significa que tengas que pasar horas en el gimnasio. Una caminata en el parque, un paseo en bici, una clase de baile, jugar fútbol con tus hijos... ¡cualquier actividad cuenta!
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">Actividades Divertidas</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Caminata en el parque</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Paseo en bicicleta</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Clase de baile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Jugar fútbol con los hijos</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-100 p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">Beneficios del Ejercicio</h4>
                <ul className="space-y-2 text-sm text-orange-800">
                  <li>• Quema calorías</li>
                  <li>• Mejora tu humor</li>
                  <li>• Regula el apetito</li>
                  <li>• Te mantiene en mentalidad de autocuidado</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusión del bloque */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">El Fin de Semana Dominado</h3>
            <p className="text-lg leading-relaxed text-blue-100 text-center mb-4">
              Dominar el fin de semana es un parteaguas. Es la prueba de que tu nuevo estilo de vida es sostenible y se adapta a tu vida real, y no al revés. Se trata de encontrar el punto medio entre la disciplina y el placer.
            </p>
            <p className="text-blue-200 text-center font-medium">
              ¡Venga! Me alegra que sigamos adelante. Después de aprender a dominar los fines de semana, estamos listos para un desafío que para muchos parece aún mayor: ¿cómo mantener el enfoque y las elecciones saludables durante los viajes?
            </p>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "Estrategias Durante los Viajes",
      icon: Plane,
      color: "bg-green-500",
      estimatedTime: "20 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Plane className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">Estrategias de Alimentación Durante los Viajes</h2>
              <p className="text-lg opacity-90">Mantén el equilibrio explorando nuevos sabores</p>
            </div>
          </div>

          {/* Introducción */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Ya sea por trabajo o por placer, viajar es sinónimo de romper la rutina. Estamos fuera de nuestra cocina, lejos del súper de confianza y expuestos a un mundo de nuevas (y a menudo tentadoras) opciones. Pero, al igual que en el fin de semana, la solución no es dejar de viajar o privarse de las experiencias locales. La solución es, una vez más, tener estrategia.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  Viajar es uno de los mayores placeres de la vida. Se trata de explorar, descubrir nuevas culturas y, por supuesto, ¡nuevos sabores! La idea aquí no es que te lleves tu tupper de pollo y camote a Chichén Itzá. Se trata de disfrutar la gastronomía local de forma inteligente, tomando decisiones que te permitan regresar a casa sintiéndote bien, y no con kilos extra de equipaje en el cuerpo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sección 1: Kit de Supervivencia */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <Map className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-800">1. El Kit de Supervivencia para el Traslado</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              La primera etapa de cualquier viaje es el trayecto, ya sea en coche, autobús o avión. Y es aquí donde aparecen las primeras trampas: paradas en la carretera con opciones limitadas y caras, o el servicio a bordo del avión, generalmente lleno de productos ultraprocesados.
            </p>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">La Estrategia es Simple</h4>
                  <p className="text-yellow-700">
                    Lleva tus propias botanas. Tener un "kit de supervivencia" en tu bolsa o mochila te da autonomía y evita que caigas en tentaciones por falta de opciones.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-4">🥜 Fuentes de Proteína y Grasas Buenas</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Un mix de nueces y almendras</li>
                  <li>• Semillas de girasol o calabaza</li>
                  <li>• Barritas de proteína (lee la etiqueta y elige las que tengan menos azúcar y aditivos)</li>
                  <li>• Cubitos de quesos duros (como el parmesano o provolone, que aguantan bien fuera del refri por un rato)</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-4">🍎 Frutas Prácticas</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Manzana, plátano, pera</li>
                  <li>• Uvas, mandarinas</li>
                  <li>• Frutos secos como dátiles o chabacanos (con moderación, son más concentrados en azúcar)</li>
                </ul>
                <p className="text-xs text-blue-600 mt-3">Son fáciles de transportar y no hacen un cochinero.</p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-4">🌾 Carbohidratos de Calidad</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Galletas de arroz inflado</li>
                  <li>• Palitos de pan integral</li>
                  <li>• Snacks de garbanzos horneados</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-bold text-blue-800 mb-4">💧 Hidratación</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Lleva siempre una botella de agua vacía para pasar la seguridad del aeropuerto y luego llénala en los bebederos.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    Mantenerte hidratado es clave, especialmente en vuelos largos, pues ayuda a disminuir la hinchazón, el cansancio y hasta el hambre.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Hotel */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-orange-200">
            <div className="flex items-center gap-4 mb-6">
              <Home className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-800">2. El Reto del Hotel: Desayuno Buffet y Frigobar</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Llegamos al hotel. El primer campo minado es el desayuno, a menudo un buffet infinito de pan dulce, pasteles, jugos y embutidos. El segundo es el frigobar de la habitación, una trampa cara y calórica.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">🍳 Estrategias para el Desayuno</h4>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                    <div>
                      <h5 className="font-semibold text-orange-800 text-sm">Haz un recorrido de reconocimiento</h5>
                      <p className="text-xs text-gray-600">Antes de agarrar el plato, dale una vuelta completa al buffet. Identifica primero las opciones más saludables.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                    <div>
                      <h5 className="font-semibold text-orange-800 text-sm">Empieza con la proteína</h5>
                      <p className="text-xs text-gray-600">Busca los huevos (revueltos, a la mexicana, rancheros), yogur natural, queso panela o cottage. Empezar con la proteína te dará más saciedad.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                    <div>
                      <h5 className="font-semibold text-orange-800 text-sm">Sírvele a las frutas</h5>
                      <p className="text-xs text-gray-600">Agarra una porción generosa de fruta fresca. Te aportan fibra, vitaminas y un dulzor natural.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                    <div>
                      <h5 className="font-semibold text-orange-800 text-sm">Elige el carbohidrato con sabiduría</h5>
                      <p className="text-xs text-gray-600">En lugar de atascarte de conchas y cuernitos, fíjate si hay opciones integrales, avena, o incluso chilaquiles (pídelos con poca crema y queso).</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
                    <div>
                      <h5 className="font-semibold text-orange-800 text-sm">Aléjate de los jugos de máquina</h5>
                      <p className="text-xs text-gray-600">Generalmente son pura azúcar. Prefiere agua, café, té o, como mucho, un jugo de fruta natural recién hecho (y aun así, con moderación).</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">🏨 Estrategia para el Frigobar</h4>
                
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                  <h5 className="font-semibold text-red-800 mb-2">❌ El Problema</h5>
                  <p className="text-sm text-red-700">El frigobar de la habitación es una trampa cara y calórica.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                  <h5 className="font-semibold text-green-800 mb-2">✅ La Solución</h5>
                  <p className="text-sm text-green-700 mb-3">Pide que lo vacíen a tu llegada o simplemente ignóralo.</p>
                  <p className="text-sm text-green-700">Lánzate a un supermercado o a una tiendita local en cuanto llegues y surte tu cuarto con tus propias opciones.</p>
                </div>

                <div className="bg-orange-100 p-4 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-2">🛒 Qué Comprar</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Agua</li>
                    <li>• Yogures</li>
                    <li>• Fruta</li>
                    <li>• Nueces</li>
                  </ul>
                  <p className="text-xs text-orange-600 mt-2 font-medium">Te sale más barato y te mantiene en control.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Comida Local */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <Utensils className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-800">3. Explorando la Comida Local con Equilibrio</h3>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">¡La mejor parte de viajar es probar la comida local!</h4>
                  <p className="text-green-700">Y no debes privarte de eso.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">La Regla de Una Comida</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Intenta hacer al menos una comida "limpia" y controlada al día. Puede ser el desayuno estratégico en el hotel o una comida más ligera, como una buena ensalada con alguna proteína a la plancha.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Esto te da "crédito" para explorar un platillo más típico y quizás más pesado en la cena, sin remordimientos.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Comparte y Prueba de Todo</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Al salir a comer, especialmente en grupo, propongan pedir platillos diferentes para compartir.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Así, todos pueden probar un poco de todo sin necesidad de comerse una porción entera de cada cosa. Es la mejor forma de probar pozole, mole, cochinita pibil y todo lo demás.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Aprende a Armar tu Plato</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  En los restaurantes, hasta en la fondita más tradicional, siempre hay opciones. La estructura de un buen plato es universal:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <h5 className="font-semibold text-purple-800 text-sm mb-1">🍖 Proteína</h5>
                    <p className="text-xs text-purple-600">Pescado a la talla, arrachera, pollo con mole</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <h5 className="font-semibold text-purple-800 text-sm mb-1">🥗 Vegetales</h5>
                    <p className="text-xs text-purple-600">Ensalada de nopales, guacamole, verduras al vapor</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <h5 className="font-semibold text-purple-800 text-sm mb-1">🌽 Carbohidratos</h5>
                    <p className="text-xs text-purple-600">Tortillas de maíz, arroz a la mexicana, frijoles de la olla</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200 md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                  <h4 className="text-lg font-bold text-purple-800">Camina, camina y camina</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Viajar es la oportunidad perfecta para estar más activo sin darte cuenta. ¡Explora la ciudad a pie! Sube pirámides, recorre pueblitos mágicos, piérdete en las calles.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Esta actividad física constante ayuda a equilibrar las calorías extra que puedas llegar a consumir.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusión del bloque */}
          <div className="bg-gradient-to-br from-green-900 to-teal-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Viajar de Forma Saludable</h3>
            <p className="text-lg leading-relaxed text-green-100 text-center mb-4">
              Viajar de forma saludable se trata de ser intencional. Es disfrutar de las experiencias sin abandonar el autocuidado. Es la prueba final de que comer de forma equilibrada no es una cárcel, sino un pasaporte para una vida con más energía y bienestar, estés donde estés.
            </p>
            <p className="text-green-200 text-center font-medium">
              Ya construimos una base sólida de mentalidad y planeación, aprendimos a navegar los fines de semana y a mantener el equilibrio durante los viajes. Ahora, vamos a explorar una estrategia que está muy de moda y que, cuando se aplica bien, puede ser una herramienta muy poderosa: el ayuno intermitente.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Descifrando el Ayuno Intermitente",
      icon: Timer,
      color: "bg-orange-500",
      estimatedTime: "22 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Timer className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">Descifrando el Ayuno Intermitente</h2>
              <p className="text-lg opacity-90">Una herramienta estratégica, no una solución mágica</p>
            </div>
          </div>

          {/* Introducción */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Seguramente ya has oído hablar de él. chance un compa lo hizo, o viste a algún famoso hablando de sus beneficios. Pero, ¿qué es exactamente el ayuno intermitente? ¿Es seguro? ¿Es para todos? Y, lo más importante, ¿cómo se aplica de la manera correcta para obtener sus beneficios sin riesgos? Vamos a aclarar todo eso ahora mismo.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Pongamos las cosas en claro</h4>
                      <p className="text-blue-700">
                        El ayuno intermitente no es una dieta mágica, ni un permiso para atascarte de lo que quieras en las horas de comida. Es un patrón de alimentación, una estrategia que organiza cuándo comes, y no necesariamente qué comes. La idea es alternar periodos en los que comes con periodos de ayuno voluntario.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  Nuestros antepasados ya practicaban el ayuno de forma natural, no por elección, sino por la disponibilidad de comida. Nuestro cuerpo, por lo tanto, tiene mecanismos fisiológicos para lidiar con periodos sin alimento. El ayuno intermitente moderno busca rescatar y organizar esta práctica, trayendo varios beneficios potenciales que la ciencia ha estado estudiando, como mejorar la sensibilidad a la insulina, estimular la autofagia (un proceso de "limpieza" de las células), ayudar en la pérdida de peso y grasa corporal, e incluso beneficios para la salud del cerebro.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia de Seguridad */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-200">
            <div className="flex items-center gap-4 mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <h3 className="text-2xl font-bold text-red-800">⚠️ Importante: El Ayuno No Es Para Todos</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Sin embargo, es fundamental entender que el ayuno no es para todos.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border-2 border-red-200">
                <h4 className="text-lg font-bold text-red-800 mb-4">❌ No Deben Hacer Ayuno:</h4>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Mujeres embarazadas o lactando</li>
                  <li>• Personas con historial de trastornos alimenticios</li>
                  <li>• Diabéticos tipo 1</li>
                  <li>• Personas con cualquier condición de salud crónica</li>
                </ul>
                <div className="bg-red-100 p-3 rounded-lg mt-4">
                  <p className="text-xs text-red-800 font-medium">
                    Deben, a fuerza, consultar a un médico y a un nutriólogo antes de siquiera pensar en empezar esta práctica.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border-2 border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4">✅ Para Los Demás:</h4>
                <div className="space-y-3">
                  <p className="text-sm text-green-700">La clave es empezar despacio y escuchar a tu propio cuerpo.</p>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="text-xs text-green-800 font-medium">
                      Siempre es recomendable consultar con un profesional de la salud antes de comenzar cualquier protocolo de ayuno.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 1: Protocolos */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-800">1. Los Protocolos Más Comunes (y cómo elegir el tuyo)</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Hay varias formas de practicar el ayuno intermitente. Te voy a presentar los tres protocolos más conocidos y prácticos:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">16/8</span>
                  </div>
                  <h4 className="font-bold text-purple-800">Protocolo 16/8 (Leangains)</h4>
                  <Badge variant="secondary" className="mt-2">Más Popular</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Este es el más popular y, en mi opinión, el mejor para los que van empezando. Consiste en ayunar por 16 horas y concentrar todas tus comidas en una "ventana de alimentación" de 8 horas.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-700 font-medium">
                    Ejemplo: Te puedes saltar el desayuno, hacer tu primera comida al mediodía y la última antes de las 8 de la noche. El tiempo que pasas dormido ya cuenta como gran parte del ayuno.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">12/12</span>
                  </div>
                  <h4 className="font-bold text-green-800">Protocolo 12/12</h4>
                  <Badge variant="outline" className="mt-2">Para Principiantes</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Este es el punto de partida ideal. Ayunas 12 horas y tienes una ventana para comer de 12 horas.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-700 font-medium">
                    Ejemplo: cenas a las 8 p.m. y desayunas a las 8 a.m. del día siguiente. Técnicamente, mucha gente ya hace esto sin darse cuenta. Es una excelente manera de acostumbrarte a la idea de tener horarios más definidos.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">24h</span>
                  </div>
                  <h4 className="font-bold text-orange-800">Come-Para-Come</h4>
                  <Badge variant="destructive" className="mt-2">Avanzado</Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Este implica un ayuno completo de 24 horas, una o dos veces por semana.
                </p>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-700 font-medium">
                    Ejemplo: cenas el lunes a las 7 p.m. y no vuelves a comer hasta la cena del martes, también a las 7 p.m. Este es un método más avanzado y puede ser más retador social y físicamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-6">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">¿Cuál elegir?</h4>
                  <p className="text-yellow-700 mb-3">
                    Empieza siempre por el más sencillo, el 12/12. Practícalo por una semana. ¿Te sentiste bien? Intenta extenderlo a 14 horas de ayuno (14/10). Si sigues a gusto, avanza al 16/8.
                  </p>
                  <p className="text-yellow-700 font-medium">
                    No hay necesidad de hacer ayunos más largos que eso para obtener la mayoría de los beneficios. La constancia es más importante que la duración del ayuno.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Cómo Aplicarlo */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
            <div className="flex items-center gap-4 mb-6">
              <Settings className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-blue-800">2. Cómo Aplicarlo de la Mejor Manera: El Paso a Paso</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              La forma en que manejas el ayuno es tan importante como el ayuno en sí.
            </p>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Coffee className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">Durante el Periodo de Ayuno</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Puedes y debes tomar líquidos sin calorías. Agua (natural o mineral), tés (sin azúcar ni endulzantes) y café negro (también sin nada) están permitidos y hasta ayudan a controlar el hambre y a mantenerte hidratado.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    ⚠️ Olvídate de los "jugos detox" o cualquier cosa que tenga calorías, porque eso "rompe" el ayuno.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Utensils className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">La Ruptura del Ayuno</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Tu primera comida después del ayuno es muy importante. Evita la tentación de comerte un plato gigante y lleno de carbohidratos simples y grasas malas. Eso puede causar un pico de glucosa y malestar estomacal.
                </p>
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h5 className="font-semibold text-green-800 mb-2">✅ La mejor estrategia:</h5>
                  <p className="text-sm text-green-700 mb-2">Romper el ayuno con una comida balanceada:</p>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Una buena fuente de proteína (huevos, pollo, pescado)</li>
                    <li>• Grasas buenas (aguacate, aceite de oliva)</li>
                    <li>• Fibra (muchas verduras y hojas verdes)</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    Ejemplo: un omelette con espinacas y champiñones, o un filete de pollo a la plancha con una ensalada grande y colorida.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">Durante la Ventana de Alimentación</h4>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                  <p className="text-sm text-red-700 font-medium">
                    ¡Aquí está el truco! La ventana de alimentación no es un pase libre para comer garnachas y dulces.
                  </p>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  La calidad de tu comida sigue siendo el factor principal. Si tu objetivo es bajar de peso, todavía necesitas estar en un déficit calórico. Si tu objetivo es la salud, necesitas nutrientes.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    Usa tu ventana de 8 horas para hacer 2 o 3 comidas nutritivas y completas, ricas en proteínas, fibra, vitaminas y minerales. El ayuno funciona mejor cuando se combina con una alimentación basada en comida de verdad.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">Escucha a tu Cuerpo</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  ¿Te sentiste mareado, con dolor de cabeza fuerte, debilidad excesiva o muy irritable? Puede ser una señal de que el ayuno no te está cayendo bien, o que necesitas ajustar el protocolo.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-xs text-yellow-700 font-medium">
                    No insistas. Come algo y prueba con un periodo más corto al día siguiente. El ayuno debe hacerte sentir bien, no hacerte sufrir.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-blue-600" />
                  <h4 className="text-lg font-bold text-blue-800">Combínalo con el Ejercicio</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Entrenar en ayunas es posible, pero requiere adaptación.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-green-800 text-sm mb-1">✅ Entrenamientos en Ayunas</h5>
                    <p className="text-xs text-green-700">Para la mayoría, los entrenamientos de intensidad baja a moderada, como una caminata o pesas más ligeras, se toleran bien.</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-semibold text-blue-800 text-sm mb-1">💪 Entrenamientos Intensos</h5>
                    <p className="text-xs text-blue-700">Los entrenamientos de alta intensidad, como un HIIT, se aprovechan mejor dentro de la ventana de alimentación, cuando tienes más energía disponible.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusión del bloque */}
          <div className="bg-gradient-to-br from-orange-900 to-red-800 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">El Ayuno Intermitente es una Herramienta</h3>
            <p className="text-lg leading-relaxed text-orange-100 text-center mb-4">
              El ayuno intermitente es una herramienta, no una regla. Puede ser fantástico para algunas personas, ayudando a regular el apetito, mejorando la relación con el hambre y optimizando la quema de grasa. Para otras, puede que no se adapte a su rutina o a su perfil biológico.
            </p>
            <p className="text-orange-200 text-center font-medium">
              Lo importante es experimentar con cuidado, respetando tus límites.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Construyendo un Estilo de Vida Sostenible",
      icon: Trophy,
      color: "bg-emerald-500",
      estimatedTime: "25 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Trophy className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">Amarrando Cabos y Construyendo un Estilo de Vida Sostenible</h2>
              <p className="text-lg opacity-90">De la información a la acción: tu plan personalizado</p>
            </div>
          </div>

          {/* Introducción */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Estoy muy contenta con el camino que hemos recorrido juntos hasta aquí.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Construimos una base sólida, entendiendo que la mentalidad y la planeación son los pilares de cualquier cambio duradero. Aprendimos a ver el fin de semana no como un enemigo, sino como una oportunidad para practicar el equilibrio. Vimos que es totalmente posible viajar, explorar el mundo y sus sabores sin abandonar el autocuidado. Y, finalmente, desciframos el ayuno intermitente, entendiéndolo como una herramienta estratégica y no como una solución mágica.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  Ahora, en nuestro último bloque, vamos a unir todas estas piezas. La meta es transformar todo este conocimiento en un plan de acción concreto, una guía práctica para tu día a día. Vamos a crear un resumen estratégico y a asegurarnos de que tengas todas las herramientas no solo para empezar, sino para seguir en este viaje, construyendo un estilo de vida que sea verdaderamente tuyo, saludable y, sobre todo, placentero.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">El Objetivo de Esta Conversación</h4>
                      <p className="text-blue-700">
                        El conocimiento sin acción es solo información. El objetivo de toda nuestra conversación es que te sientas con el poder de tomar decisiones conscientes y sostenibles a largo plazo. No quiero que termines de leer esto y pienses "¿Y ahora qué hago?". Quiero que tengas claro cuáles son los siguientes pasos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección 1: El Ciclo del Cambio */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200">
            <div className="flex items-center gap-4 mb-6">
              <Settings className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-purple-800">1. El Ciclo del Cambio: Empieza en Pequeño, Piensa en Grande</h3>
            </div>

            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">La Principal Causa de Fracaso</h4>
                  <p className="text-red-700">
                    La principal causa por la que la gente tira la toalla en cualquier proceso de cambio de hábitos es intentar cambiar todo de golpe. La emoción del principio nos hace querer ir al gimnasio todos los días, cortar todo el azúcar, meditar por una hora y planear todas las comidas, todo al mismo tiempo. En una semana, el agotamiento nos pega y la tendencia es mandar todo a volar.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-purple-200 mb-6">
              <h4 className="text-xl font-bold text-purple-800 mb-4">La Estrategia Más Efectiva</h4>
              <p className="text-gray-700 mb-4">
                La estrategia más efectiva es la de los pequeños pasos consistentes. El cambio de hábitos funciona como un músculo: necesitas entrenarlo poco a poco para que se fortalezca.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h5 className="font-bold text-purple-800 text-center mb-3">Elige UNA Estrategia</h5>
                <p className="text-sm text-gray-700 mb-3">
                  De todo lo que hemos platicado, ¿cuál te parece la más fácil o la que tendría más impacto para ti en este momento?
                </p>
                <div className="space-y-2 text-xs text-purple-700">
                  <p>• Cambiar el refresco de la comida por agua mineral con limón</p>
                  <p>• Incluir una fruta en tu snack de la tarde</p>
                  <p>• Dedicar una hora del domingo para meal prep</p>
                  <p>• Empezar con el ayuno de 12 horas</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h5 className="font-bold text-purple-800 text-center mb-3">Practica por 21 Días</h5>
                <p className="text-sm text-gray-700">
                  Elige esa única meta y comprométete a cumplirla por tres semanas. Este es un tiempo razonable para que una nueva acción comience a convertirse en un hábito.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h5 className="font-bold text-purple-800 text-center mb-3">Automatiza y Suma</h5>
                <p className="text-sm text-gray-700">
                  Una vez que ese primer cambio se vuelva automático, parte de tu rutina, y ya casi no tengas que pensar para hacerlo. Ahora sí, estás listo para elegir la siguiente pequeña meta y sumarla a tu repertorio.
                </p>
              </div>
            </div>

            <div className="bg-purple-100 p-6 rounded-lg mt-6">
              <h5 className="font-semibold text-purple-800 mb-2 text-center">Apilamiento de Hábitos</h5>
              <p className="text-purple-700 text-center">
                Este método es poderoso porque te da una sensación de victoria y capacidad con cada paso, manteniendo la motivación alta y evitando que te satures.
              </p>
            </div>
          </div>

          {/* Sección 2: Diario de Comidas */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-8 border-2 border-orange-200">
            <div className="flex items-center gap-4 mb-6">
              <BookOpen className="w-8 h-8 text-orange-600" />
              <h3 className="text-2xl font-bold text-orange-800">2. El Diario de Comidas como Herramienta de Autoconocimiento</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              Si te sientes perdido y no sabes por dónde empezar, te sugiero una herramienta simple pero muy reveladora: el diario de comidas. Durante una semana, anota todo lo que comes y bebes, sin juzgarte. Anota también la hora, el lugar y cómo te sentías (con hambre, aburrido, estresado, feliz).
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">No es para contar calorías</h4>
                  <p className="text-blue-700">
                    Este no es un ejercicio para contar calorías, sino para tomar conciencia. Al final de la semana, al leer tu diario, vas a identificar patrones que quizás nunca habías notado.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">💭 Patrón de Estrés</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 italic">
                    "Órale, siempre me como algo dulce como a las 4 de la tarde, cuando estoy estresado con la chamba."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">💧 Patrón de Hidratación</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 italic">
                    "Me di cuenta de que los días que no tomo suficiente agua, siento mucha más hambre y dolor de cabeza."
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-orange-200">
                <h4 className="text-lg font-bold text-orange-800 mb-4">📺 Patrón de Atención</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-700 italic">
                    "Como súper rápido frente a la tele y ni cuenta me doy de lo que estoy comiendo."
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6 mt-6">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-2">El Poder del Autoconocimiento</h4>
                  <p className="text-green-700">
                    Identificar estos "gatillos" es el primer paso para crear estrategias específicas para ellos. Si el problema es el antojo de dulce por estrés, quizás la solución sea tomarte un descanso de 5 minutos para un té o una caminata corta, en lugar de buscar el azúcar. El diario te da el diagnóstico; las estrategias que aprendimos te dan el tratamiento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 3: Red de Apoyo */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-green-800">3. La Importancia de tu Red de Apoyo y la Ayuda Profesional</h3>
            </div>

            <p className="text-lg text-gray-700 mb-6">
              No tienes que hacer esto solo. Comparte tus objetivos con amigos y familiares que te echen porras. Tener a alguien con quien compartir las victorias y los retos hace que el camino sea mucho más ligero.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4">🤝 Red de Apoyo Social</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>¿Qué tal si invitas a un amigo a caminar por el parque el fin de semana en lugar de ir a comer garnachas?</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Intercambiar recetas saludables con un colega del trabajo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Compartir victorias y retos con personas que te apoyen</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg border border-green-200">
                <h4 className="text-lg font-bold text-green-800 mb-4">👩‍⚕️ Ayuda Profesional</h4>
                <p className="text-sm text-gray-700 mb-4">
                  Y, por supuesto, recuerda que el nutriólogo es el profesional más calificado para guiarte.
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 text-sm mb-2">Cuándo Buscar Ayuda:</h5>
                  <ul className="text-xs text-green-700 space-y-1">
                    <li>• Objetivos específicos (bajar de peso, ganar masa muscular)</li>
                    <li>• Tratar alguna condición de salud</li>
                    <li>• Necesitas un plan totalmente individualizado</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-6">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-2">Buscar Ayuda es Inteligente</h4>
                  <p className="text-blue-700">
                    Buscar ayuda profesional no es señal de debilidad, sino de inteligencia y autocuidado. Nosotros, los nutriólogos, estamos aquí para traducir la ciencia en un plan que se ajuste perfectamente a tu vida, respetando tus gustos, tu rutina y tu individualidad.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Conclusión Final */}
          <div className="bg-gradient-to-br from-emerald-900 to-green-800 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-3xl font-bold mb-4">Conclusión: La Dieta es Tuya, la Vida es Ahora</h3>
            </div>

            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-emerald-100">
                A lo largo de esta plática, espero haberte convencido de que "hacer dieta" no tiene por qué ser sinónimo de sufrimiento. Todo lo contrario. Tener estrategias de alimentación inteligentes se trata de conquistar la libertad.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 p-6 rounded-lg">
                  <h4 className="font-bold text-yellow-300 mb-3">🎉 Libertad Social</h4>
                  <p className="text-sm text-emerald-100">Es la libertad de ir a una fiesta y saber exactamente cómo manejar la situación.</p>
                </div>

                <div className="bg-white/10 p-6 rounded-lg">
                  <h4 className="font-bold text-yellow-300 mb-3">🌍 Libertad de Viajar</h4>
                  <p className="text-sm text-emerald-100">La libertad de viajar por el mundo y disfrutar cada momento sin culpa.</p>
                </div>

                <div className="bg-white/10 p-6 rounded-lg">
                  <h4 className="font-bold text-yellow-300 mb-3">💪 Libertad Interior</h4>
                  <p className="text-sm text-emerald-100">La libertad de entender las señales de tu cuerpo, de saber cuándo tienes hambre de verdad y cuándo estás buscando consuelo en la comida.</p>
                </div>
              </div>

              <div className="bg-white/10 p-6 rounded-lg">
                <h4 className="font-bold text-yellow-300 mb-3 text-center">🎯 La Libertad de Elegir</h4>
                <p className="text-emerald-100 text-center">
                  Es la libertad de elegir lo que te nutre, lo que te da energía y lo que te hace sentir bien, la mayor parte del tiempo.
                </p>
              </div>

              <div className="bg-green-900 p-6 rounded-lg">
                <h4 className="font-bold text-green-200 mb-3">🏃‍♀️ No es una Carrera, es un Maratón</h4>
                <p className="text-green-100 mb-4">
                  El viaje hacia un estilo de vida más saludable no es una carrera de 100 metros, sino un maratón. Habrá días fáciles y días difíciles. Habrá momentos de mucho enfoque y momentos en los que te resbalarás. Y no pasa nada.
                </p>
                <p className="text-green-100 font-medium">
                  Acuérdate de la mentalidad del equilibrio: acepta el tropiezo, aprende de él y, en la siguiente comida, simplemente retoma tu camino.
                </p>
              </div>

              <div className="text-center">
                <h4 className="text-2xl font-bold text-yellow-400 mb-4">💝 Mensaje Final</h4>
                <p className="text-lg text-emerald-100 mb-4">
                  Gracias por acompañarme hasta aquí. Fue un placer ser tu guía. Ahora, el viaje es tuyo. Usa este conocimiento como tu mapa, pero recuerda que el que maneja eres tú.
                </p>
                <div className="bg-yellow-900 p-6 rounded-lg">
                  <h5 className="font-bold text-yellow-200 mb-3">Tus Próximos Pasos:</h5>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">Empieza en pequeño</span>
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">Sé constante</span>
                    <span className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">Sé amable contigo mismo</span>
                  </div>
                </div>
                <p className="text-emerald-200 mt-4 font-medium">
                  Tu salud y tu bienestar te lo agradecerán.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const totalSections = sections.length;
  const progressPercentage = ((currentSection - 1) / totalSections) * 100;
  const completedPercentage = (completedSections.length / totalSections) * 100;

  const handleNext = () => {
    if (currentSection < totalSections) {
      if (!completedSections.includes(currentSection)) {
        setCompletedSections([...completedSections, currentSection]);
      }
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSectionComplete = () => {
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
  };

  const currentSectionData = sections.find(s => s.id === currentSection);
  const IconComponent = currentSectionData?.icon || Target;

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Panel</span>
              </Button>
              <div className="h-6 w-px bg-border sm:h-8 sm:mx-2" />
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`p-1.5 sm:p-2 ${currentSectionData?.color} rounded-lg flex-shrink-0`}>
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Estrategias Alimentarias</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    Sección {currentSection} de {totalSections} • {currentSectionData?.estimatedTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {completedSections.length}/{totalSections} completadas
              </div>
              <div className="w-24 sm:w-32">
                <Progress value={completedPercentage} className="h-1.5 sm:h-2" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Navigation */}
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isCompleted = completedSections.includes(section.id);
              const isCurrent = currentSection === section.id;

              return (
                <div key={section.id} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setCurrentSection(section.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      isCurrent 
                        ? `${section.color} text-white` 
                        : isCompleted 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="hidden md:inline text-xs sm:text-sm">{section.title}</span>
                    <span className="md:hidden font-medium">{section.id}</span>
                    {isCompleted && <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />}
                  </button>
                  {index < sections.length - 1 && (
                    <div className="w-3 sm:w-4 h-px bg-border mx-1 sm:mx-2 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
            <div className={`p-2 sm:p-3 ${currentSectionData?.color} rounded-xl self-start`}>
              <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant="secondary" className="mb-2">
                Bloque {currentSection}
              </Badge>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {currentSectionData?.title}
              </h2>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 sm:h-2">
            <div 
              className={`h-1.5 sm:h-2 ${currentSectionData?.color} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Section Content */}
        <div className="mb-6 sm:mb-8">
          {currentSectionData?.content}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 1}
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="outline"
              onClick={handleSectionComplete}
              className="flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
              disabled={completedSections.includes(currentSection)}
            >
              {completedSections.includes(currentSection) ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="hidden sm:inline">Completada</span>
                  <span className="sm:hidden">✓ Leída</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Marcar como Leída</span>
                  <span className="sm:hidden">Marcar Leída</span>
                </>
              )}
            </Button>

            {currentSection < totalSections ? (
              <Button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/dashboard")}
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                variant="default"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Finalizar Guía</span>
                <span className="sm:hidden">Finalizar</span>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
