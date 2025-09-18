
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Target, 
  Zap, 
  Shield, 
  Compass, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Heart,
  Flame,
  Gauge,
  Users,
  Star,
  Trophy,
  Clock,
  BookOpen,
  Map,
  Wrench,
  Settings
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

export default function MindStrengthening() {
  const [, navigate] = useLocation();
  const [currentSection, setCurrentSection] = useState(1);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const { user } = useAuth();

  const sections: Section[] = [
    {
      id: 1,
      title: "La Arquitectura Mental del Éxito",
      icon: Brain,
      color: "bg-purple-500",
      estimatedTime: "15 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-4 translate-y-4"></div>
            <div className="relative z-10">
              <Brain className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">La Supremacía de la Mente en la Transformación Corporal</h2>
              <p className="text-lg opacity-90">Una expedición al interior de la mente</p>
            </div>
          </div>

          {/* Key Concept Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-l-4 border-l-purple-500 bg-purple-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-purple-600" />
                  <CardTitle className="text-lg">Introspección</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  El punto de partida para cualquier cambio externo es entender los detonantes, 
                  patrones de comportamiento y narrativas internas que nos llevaron al estado actual.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <CardTitle className="text-lg">Decisión Consciente</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  La simple conciencia es inerte. Es la decisión irrevocable de cambiar lo que 
                  acciona el catalizador de la transformación.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  El camino hacia la transformación corporal y la conquista de una salud plena es, antes que nada, una expedición al interior de la mente. Es un proceso que va mucho más allá de la simple aplicación de fórmulas dietéticas o del conteo riguroso de las horas dedicadas al ejercicio. En su esencia, representa una profunda reingeniería de nuestra mentalidad, una recalibración de creencias, hábitos y de la identidad misma.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Concepto Clave</h4>
                      <p className="text-yellow-700">
                        El éxito duradero no se encuentra en soluciones rápidas ni en picos efímeros de entusiasmo. 
                        Se forja en la construcción de una base psicológica sólida, una estructura interna robusta.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  Esta guía fue concebida como un mapa detallado para esa expedición. Su propósito es proporcionar las herramientas conceptuales y las estrategias prácticas necesarias para navegar en este viaje, no solo durante el impulso inicial, sino en cada etapa del camino, garantizando que la transformación sea sostenible y, en última instancia, permanente.
                </p>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  El punto de partida para cualquier cambio externo es la introspección. Entender los detonantes, los patrones de comportamiento y las narrativas internas que nos llevaron al estado físico y emocional actual es el primer paso crítico. Este autoanálisis, sin embargo, es solo el diagnóstico; ilumina el problema, pero no lo resuelve. La simple conciencia, por sí sola, es inerte. Es la decisión consciente e irrevocable de cambiar, seguida de la definición cristalina de los motivos y el establecimiento de metas estratégicas, lo que verdaderamente acciona el catalizador de la transformación.
                </p>

                {/* Mind vs Body Comparison */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Mente vs Cuerpo: La Batalla Decisiva</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="text-center">
                      <Brain className="w-16 h-16 mx-auto mb-4 text-purple-600" />
                      <h4 className="text-xl font-semibold mb-4 text-purple-800">La Mente</h4>
                      <ul className="text-left space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Campo de batalla del éxito</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Determina la autoeficacia</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Filtra oportunidades vs obstáculos</span>
                        </li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
                      <h4 className="text-xl font-semibold mb-4 text-red-800">El Cuerpo</h4>
                      <ul className="text-left space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Sirviente obediente de la mente</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Capacidad de resiliencia subestimada</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span>Responde a la convicción mental</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-6">
                  El cuerpo humano, en su complejidad biológica, es un sirviente obediente de dos amos: la genética y, de forma más inmediata y moldeable, la mente. La mente es el campo de batalla donde el éxito o el fracaso son, en gran medida, predeterminados. Nuestro organismo posee una capacidad de resiliencia, adaptación y superación que frecuentemente subestimamos.
                </p>

                <div className="bg-red-50 border-l-4 border-red-400 p-6 my-8">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800 mb-2">El Verdadero Adversario</h4>
                      <p className="text-red-700">
                        La creencia limitante de que uno no es capaz levanta una barrera psicológica más infranqueable 
                        que cualquier obstáculo físico. Ese autosabotaje sutil, la voz interna que susurra "no puedo", 
                        "es demasiado difícil" o "yo siempre abandono", es el verdadero enemigo.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg leading-relaxed text-gray-700 mb-8">
                  Por otro lado, una convicción inquebrantable en la propia capacidad de alcanzar un objetivo —un estado conocido en la psicología como autoeficacia— tiene el poder de movilizar enormes recursos internos y externos. Cuando crees genuinamente que puedes lograr algo, tu cerebro comienza a operar de forma diferente. Filtra el mundo en busca de oportunidades y soluciones, en lugar de amenazas y obstáculos.
                </p>

                {/* Empowerment Cycle */}
                <div className="bg-green-50 rounded-xl p-8 my-8">
                  <h3 className="text-2xl font-bold mb-6 text-center text-green-800">El Ciclo de Empoderamiento</h3>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">1</div>
                      <span className="text-sm font-medium text-center">Convicción</span>
                    </div>
                    <ArrowRight className="text-green-600" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">2</div>
                      <span className="text-sm font-medium text-center">Acción</span>
                    </div>
                    <ArrowRight className="text-green-600" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">3</div>
                      <span className="text-sm font-medium text-center">Resultados</span>
                    </div>
                    <ArrowRight className="text-green-600" />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">4</div>
                      <span className="text-sm font-medium text-center">Refuerza Convicción</span>
                    </div>
                  </div>
                  <p className="text-center text-green-700 mt-6">
                    Un poderoso ciclo de empoderamiento que se alimenta a sí mismo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsibility Paradigm Section */}
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <CardTitle className="text-2xl text-orange-800">El Paradigma de la Responsabilidad Radical</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Para que esta reingeniería mental ocurra, es preciso adoptar un paradigma de responsabilidad radical. 
                Esto significa abandonar la narrativa de víctima de las circunstancias —"mi genética es mala", "no tengo tiempo", 
                "la comida saludable es muy cara"— y asumir la propiedad completa sobre tus elecciones y tus resultados.
              </p>

              <div className="bg-white rounded-lg p-6 border border-orange-200">
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-semibold text-orange-800 mb-3">Metáfora del Juego de Cartas</h4>
                    <p className="text-gray-700 mb-4">
                      Aunque los factores externos y las predisposiciones genéticas ciertamente existen y ejercen influencia, 
                      no determinan el destino. Son el juego de cartas que recibimos; la forma en que jugamos esas cartas 
                      es una elección nuestra.
                    </p>
                    <div className="bg-orange-100 p-4 rounded-lg">
                      <p className="text-orange-800 font-medium">
                        "Cada decisión, por más pequeña que sea, es un voto que das por el tipo de persona en la que te quieres convertir."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-red-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Mentalidad de "Estar a Dieta"
                  </h4>
                  <ul className="text-red-700 space-y-2">
                    <li>• Temporal y restrictiva</li>
                    <li>• Vive en estado de privación</li>
                    <li>• Las elecciones son sacrificios</li>
                  </ul>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Mentalidad de "Ser Saludable"
                  </h4>
                  <ul className="text-green-700 space-y-2">
                    <li>• Cambio de identidad fundamental</li>
                    <li>• Expresión natural de quien es</li>
                    <li>• Las elecciones son coherentes</li>
                  </ul>
                </div>
              </div>

              <p className="text-lg leading-relaxed text-gray-700">
                Este cambio de perspectiva es el cimiento sobre el cual todos los demás pilares —disciplina, planeación, 
                nutrición, ejercicio— serán construidos. Sin él, cualquier estructura está condenada a derrumbarse bajo 
                el peso del primer desafío significativo. La transformación corporal no comienza en la cocina o en el 
                gimnasio; comienza en el espacio silencioso entre tus pensamientos, en la decisión de convertirte en 
                el arquitecto de tu propia mente y, en consecuencia, de tu cuerpo.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 2,
      title: "El Mito de la Motivación",
      icon: Flame,
      color: "bg-red-500",
      estimatedTime: "12 min",
      content: (
        <div className="space-y-8">
          {/* Hero Visual */}
          <div className="relative bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full transform translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full transform -translate-x-8 translate-y-8"></div>
            <div className="relative z-10">
              <Flame className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">El Ascenso de la Disciplina Neuroconsciente</h2>
              <p className="text-lg opacity-90">Destruyendo la falacia de la motivación perenne</p>
            </div>
          </div>

          {/* The Paradox */}
          <Card className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-800">La Paradoja Universal</h3>
              </div>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Es una paradoja tan común como desoladora, especialmente en momentos que simbolizan un nuevo comienzo, 
                como el inicio de un año o después de un evento de vida impactante: observar una explosión de promesas 
                y una implosión de resultados.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-700 font-medium">"Ahora sí va en serio"</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-700 font-medium">"Voy a cambiar mi vida"</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-red-700 font-medium">"Me voy a poner en forma"</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">El Problema Fundamental</h4>
                    <p className="text-yellow-700">
                      El problema reside en la naturaleza intrínsecamente efímera de la motivación. Es una chispa, 
                      un impulso inicial, pero jamás el combustible que mantiene el motor funcionando a largo plazo.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Movie vs Reality */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-red-300 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-red-800">Percepción de Película</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full bg-red-200 rounded-full h-4">
                    <div className="bg-red-600 h-4 rounded-full w-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">Línea Recta</span>
                    </div>
                  </div>
                  <p className="text-red-700 text-sm">
                    Visualizan la trayectoria como una línea recta y consistentemente ascendente de entusiasmo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <CardTitle className="text-green-800">Realidad Neurológica</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="w-full h-16 relative">
                    <svg viewBox="0 0 200 60" className="w-full h-full">
                      <path 
                        d="M 10 50 Q 30 10 50 30 Q 70 50 90 20 Q 110 40 130 15 Q 150 35 170 25 Q 180 45 190 20" 
                        stroke="#059669" 
                        strokeWidth="3" 
                        fill="none"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                  <p className="text-green-700 text-sm">
                    La motivación fluctúa como un electrocardiograma impredecible con altas y bajas inevitables.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Motivation Factors */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-indigo-800">Factores que Afectan la Motivación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: "🛏️", label: "Calidad del sueño" },
                  { icon: "💼", label: "Estrés laboral" },
                  { icon: "👥", label: "Interacciones sociales" },
                  { icon: "🧬", label: "Fluctuaciones hormonales" },
                  { icon: "📈", label: "Percepción del progreso" },
                  { icon: "🌦️", label: "Estado del clima" },
                  { icon: "💭", label: "Estado emocional" },
                  { icon: "⚡", label: "Niveles de energía" }
                ].map((factor, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-2xl mb-2">{factor.icon}</div>
                    <p className="text-sm font-medium text-indigo-700">{factor.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discipline Section */}
          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Gauge className="w-8 h-8 text-emerald-600" />
                <CardTitle className="text-2xl text-emerald-800">Disciplina: La Acción Deliberada en Ausencia de Ganas</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-lg p-6 border border-emerald-200">
                <h4 className="text-xl font-semibold text-emerald-800 mb-4">Decodificando "Motivación"</h4>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="bg-emerald-100 px-4 py-2 rounded-lg font-semibold text-emerald-800">MOTIVO</div>
                  <span className="text-2xl text-emerald-600">+</span>
                  <div className="bg-emerald-100 px-4 py-2 rounded-lg font-semibold text-emerald-800">ACCIÓN</div>
                  <span className="text-2xl text-emerald-600">=</span>
                  <div className="bg-emerald-500 px-4 py-2 rounded-lg font-semibold text-white">MOTIVACIÓN</div>
                </div>
                <p className="text-gray-700">
                  La sabiduría popular invierte esta ecuación, esperando que el sentimiento preceda la acción. 
                  La dinámica real es más compleja.
                </p>
              </div>

              {/* The Three Scenarios */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                  <h5 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Motivo sin Acción
                  </h5>
                  <p className="text-red-700 text-sm">
                    Deseo ardiente de cambiar, pero sin pasos prácticos = Estancamiento y parálisis por análisis
                  </p>
                </div>
                
                <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <h5 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Acción sin Motivo
                  </h5>
                  <p className="text-yellow-700 text-sm">
                    Acciones sin propósito profundo = Frágiles, se abandonan fácilmente
                  </p>
                </div>
                
                <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Motivo + Acción
                  </h5>
                  <p className="text-green-700 text-sm">
                    Motivo poderoso + acción diaria disciplinada = Fórmula del éxito sostenible
                  </p>
                </div>
              </div>

              <div className="bg-emerald-100 border-l-4 border-emerald-400 p-6">
                <h4 className="font-semibold text-emerald-800 mb-3">La Disciplina es una Habilidad Entrenable</h4>
                <p className="text-emerald-700 mb-4">
                  La disciplina no es un rasgo de carácter innato. Es una habilidad, un músculo que puede y debe ser entrenado. 
                  El entrenamiento comienza con acciones minúsculas.
                </p>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium text-emerald-800 mb-2">El Ciclo de Retroalimentación Positiva:</h5>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full">Disciplina</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full">Acción</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full">Resultados</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full">Motivación</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600" />
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full">Más Disciplina</span>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Muchos individuos se embarcan en sus viajes con una percepción equivocada, casi de película, del proceso. 
                Visualizan la trayectoria del punto A (el estado actual no deseado) al punto B (el objetivo anhelado) como 
                una línea recta y consistentemente ascendente de entusiasmo y fuerza de voluntad. Esta es la gran y 
                peligrosa falacia de la motivación.
              </p>

              <p className="text-lg text-gray-700 leading-relaxed">
                La realidad psicológica y neurológica del proceso de cambio es mucho más turbulenta. La motivación no es 
                una constante; es un recurso volátil, un estado emocional que fluctúa drásticamente en respuesta a un 
                sinfín de factores internos y externos: la calidad del sueño, el estrés en el trabajo, las interacciones 
                sociales, las fluctuaciones hormonales y, de manera crucial, la percepción del progreso.
              </p>
            </CardContent>
          </Card>

          {/* Habit Formation Section */}
          <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Settings className="w-8 h-8 text-violet-600" />
                <CardTitle className="text-2xl text-violet-800">La Neurociencia de la Formación de Hábitos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Para hacer que la disciplina dependa menos de la fuerza de voluntad —un recurso finito—, necesitamos 
                entender cómo el cerebro forma hábitos. Un hábito es, en esencia, un comportamiento que ha sido repetido 
                tantas veces que se ha vuelto automático, una respuesta que el cerebro ejecuta con el mínimo esfuerzo cognitivo.
              </p>

              {/* Habit Loop */}
              <div className="bg-white rounded-xl p-8 border-2 border-violet-200">
                <h4 className="text-xl font-bold text-center text-violet-800 mb-6">El Círculo del Hábito</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h5 className="font-semibold text-violet-800 mb-2">La Señal</h5>
                    <p className="text-sm text-gray-600">
                      Estímulo que dice al cerebro qué hábito usar. Lugar, hora, emoción, personas o acción precedente.
                    </p>
                    <div className="mt-3 p-3 bg-violet-100 rounded-lg">
                      <p className="text-xs text-violet-700 font-medium">
                        Ejemplo: Sentirse estresado después del trabajo
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h5 className="font-semibold text-violet-800 mb-2">La Rutina</h5>
                    <p className="text-sm text-gray-600">
                      La acción física, mental o emocional que sigue a la señal. El comportamiento que queremos cambiar.
                    </p>
                    <div className="mt-3 p-3 bg-violet-100 rounded-lg">
                      <p className="text-xs text-violet-700 font-medium">
                        Ejemplo: Comer algo dulce del refrigerador
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h5 className="font-semibold text-violet-800 mb-2">La Recompensa</h5>
                    <p className="text-sm text-gray-600">
                      Estímulo positivo que dice al cerebro: "vale la pena memorizar este círculo para el futuro".
                    </p>
                    <div className="mt-3 p-3 bg-violet-100 rounded-lg">
                      <p className="text-xs text-violet-700 font-medium">
                        Ejemplo: Pico de azúcar y sensación de confort
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-6">
                  <h5 className="font-semibold text-green-800 mb-3">La Clave del Cambio</h5>
                  <p className="text-green-700">
                    Para cambiar un mal hábito, mantén la misma señal y recompensa, pero reemplaza la rutina. 
                    No ignores la señal ni resistas el anhelo; rediseña la respuesta.
                  </p>
                </div>
              </div>

              {/* Practical Example */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Ejemplo Práctico: Rediseñando el Hábito de Estrés</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Nueva Rutina 1</h5>
                    <p className="text-sm text-gray-600 mb-2">Ponerse los tenis y caminar 15 minutos</p>
                    <p className="text-xs text-blue-700"><strong>Recompensa:</strong> Endorfinas y cambio de ambiente</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Nueva Rutina 2</h5>
                    <p className="text-sm text-gray-600 mb-2">Preparar té de hierbas y meditar 10 min</p>
                    <p className="text-xs text-blue-700"><strong>Recompensa:</strong> Ritual calmante y pausa mental</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Nueva Rutina 3</h5>
                    <p className="text-sm text-gray-600 mb-2">Llamar a un amigo o familiar</p>
                    <p className="text-xs text-blue-700"><strong>Recompensa:</strong> Conexión social anti-estrés</p>
                  </div>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed">
                Al experimentar conscientemente con nuevas rutinas y observar si satisfacen el anhelo subyacente, 
                podemos gradualmente reescribir las vías neuronales. Cada vez que ejecutamos la nueva rutina en respuesta 
                a la señal, fortalecemos esa nueva conexión. Con el tiempo, la nueva rutina se convierte en la respuesta 
                automática, y el comportamiento saludable se ejecuta sin la necesidad de una batalla interna de fuerza de voluntad.
              </p>

              <div className="bg-violet-100 p-6 rounded-lg">
                <h5 className="font-semibold text-violet-800 mb-2 text-center">Resultado Final</h5>
                <p className="text-violet-700 text-center font-medium">
                  La disciplina se transforma en hábito, y el éxito se convierte en el camino de menor resistencia para el cerebro.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    // Continúo con las otras secciones...
    {
      id: 3,
      title: "La Claridad del Propósito",
      icon: Compass,
      color: "bg-blue-500",
      estimatedTime: "18 min",
      content: (
        <div className="space-y-8">
          <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Compass className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">La Ingeniería de Metas Estratégicas</h2>
              <p className="text-lg opacity-90">El poder de la Tarjeta de Motivos y el método SMART</p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Con el entendimiento de que la disciplina, y no la motivación, es el motor del cambio, y que los hábitos son la automatización de esa disciplina, la siguiente pregunta lógica es: ¿de dónde sale la energía para ser disciplinado día tras día, especialmente cuando los resultados aún no son visibles? La respuesta reside en la claridad del propósito.
              </p>
              
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                Para cultivar la disciplina necesaria para reescribir décadas de hábitos arraigados, es imperativo tener una claridad absoluta y visceral sobre el "porqué" del cambio. No se trata de un deseo vago de "ser más sano" o "bajar de peso", sino de una conexión profunda con los dolores actuales y los placeres futuros asociados a este viaje.
              </p>

              {/* Tarjeta de Motivos Section */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 mb-8 border-2 border-amber-200">
                <div className="flex items-center gap-4 mb-6">
                  <Target className="w-8 h-8 text-amber-600" />
                  <h3 className="text-2xl font-bold text-amber-800">La Tarjeta de Motivos</h3>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  La herramienta más poderosa para excavar y articular este propósito es la "Tarjeta de Motivos". Este no es un mero ejercicio de pensamiento positivo; es un acto de confrontación honesta y de visualización deliberada. Se trata de un documento personal, un manifiesto intransferible que servirá como tu brújula emocional y tu puerto seguro en los momentos de tormenta.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Dolor Section */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h4 className="text-xl font-bold text-red-800">1. El Diagnóstico del Dolor</h4>
                    </div>
                    <p className="text-red-700 mb-4 text-sm">El costo de no hacer nada</p>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-2">Sentimientos Actuales</h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• ¿Cómo te sientes exactamente hoy?</li>
                          <li>• Ve más allá del "mal"</li>
                          <li>• Usa palabras específicas y evocadoras</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-2">Limitaciones Prácticas</h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Incomodidades físicas diarias</li>
                          <li>• Situaciones sociales evitadas</li>
                          <li>• "Pequeñas muertes" cotidianas</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-2">Proyección del Dolor</h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          <li>• Escenario en 5, 10, 20 años</li>
                          <li>• Consecuencias para la salud</li>
                          <li>• Impacto en relaciones</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Placer Section */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-6 h-6 text-green-600" />
                      <h4 className="text-xl font-bold text-green-800">2. La Visualización del Placer</h4>
                    </div>
                    <p className="text-green-700 mb-4 text-sm">La recompensa de la acción</p>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">Nuevos Sentimientos</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Confiado(a) y orgulloso(a)</li>
                          <li>• Energizado(a) todo el día</li>
                          <li>• Libre de ansiedad corporal</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">Nuevas Experiencias</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Comprar ropa por estilo, no talla</li>
                          <li>• Decir "sí" a aventuras</li>
                          <li>• Mirarse al espejo con respeto</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-2">Impacto Holístico</h5>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Mejor desempeño laboral</li>
                          <li>• Relaciones más conectadas</li>
                          <li>• Mentalidad resiliente</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-amber-100 border-l-4 border-amber-400 p-6">
                  <h5 className="font-semibold text-amber-800 mb-2">La Pregunta Poderosa</h5>
                  <p className="text-amber-700 italic">
                    "¿Qué es más difícil? ¿Hacer esta acción disciplinada ahora o seguir viviendo con el dolor y las limitaciones que describí y enfrentar el futuro de arrepentimiento que proyecté?"
                  </p>
                </div>
              </div>

              {/* SMART Goals Section */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-200">
                <div className="flex items-center gap-4 mb-6">
                  <Wrench className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-2xl font-bold text-indigo-800">La Ingeniería de Metas: El Método SMART</h3>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  Con los motivos profundos sirviendo como combustible, el siguiente paso es canalizar esa energía en un plan de acción concreto. Metas vagas como "quiero bajar de peso" son como decirle a un capitán de barco que "navegue hacia el oeste"; son inútiles, pues no ofrecen un destino claro ni un medio para medir el progreso.
                </p>

                <div className="grid md:grid-cols-5 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">S</span>
                    </div>
                    <h5 className="font-bold text-indigo-800 mb-1">Specific</h5>
                    <p className="text-xs text-indigo-600">Específica</p>
                    <p className="text-xs text-gray-600 mt-2">Clara e inequívoca</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <h5 className="font-bold text-indigo-800 mb-1">Measurable</h5>
                    <p className="text-xs text-indigo-600">Medible</p>
                    <p className="text-xs text-gray-600 mt-2">Cuantificable</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <h5 className="font-bold text-indigo-800 mb-1">Achievable</h5>
                    <p className="text-xs text-indigo-600">Alcanzable</p>
                    <p className="text-xs text-gray-600 mt-2">Realista para ti</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">R</span>
                    </div>
                    <h5 className="font-bold text-indigo-800 mb-1">Relevant</h5>
                    <p className="text-xs text-indigo-600">Relevante</p>
                    <p className="text-xs text-gray-600 mt-2">Alineada con motivos</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-indigo-200">
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <h5 className="font-bold text-indigo-800 mb-1">Time-bound</h5>
                    <p className="text-xs text-indigo-600">Temporal</p>
                    <p className="text-xs text-gray-600 mt-2">Con plazo definido</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-2">Importante: Las Metas como Herramientas</h5>
                      <p className="text-yellow-700">
                        Las metas no son un contrato firmado con sangre, sino una herramienta de dirección. Su objetivo principal 
                        no es ser alcanzada con 100% de precisión, sino proporcionar un destino claro que permita trazar el camino.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed">
                  Mucha gente duda en establecer metas SMART por miedo al fracaso. "¿Y si no lo logro?". Es crucial internalizar que las metas no son un contrato firmado con sangre, sino una herramienta de dirección. El objetivo principal de una meta no es ser alcanzada con 100% de precisión, sino proporcionar un destino claro que permita trazar el camino. Sin un destino, cualquier camino sirve, lo que generalmente no lleva a ninguna parte. El proceso de luchar por una meta ambiciosa, incluso si alcanzas "solo" el 80% de ella, produce resultados infinitamente superiores a no tener ninguna meta.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 4,
      title: "Casos de Estudio SMART",
      icon: Map,
      color: "bg-green-500",
      estimatedTime: "20 min",
      content: (
        <div className="space-y-8">
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Map className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">De la Teoría a la Práctica</h2>
              <p className="text-lg opacity-90">Planes SMART y rutinas ganadoras</p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                La estructura SMART proporciona el esqueleto para un objetivo eficaz, pero el verdadero arte reside en darle cuerpo a ese esqueleto con detalles que sean simultáneamente ambiciosos y realistas para tu contexto individual. Una meta que es perfectamente alcanzable para una persona puede ser desmotivadora para otra. Por lo tanto, la personalización es fundamental.
              </p>

              {/* Case Study 1: Ana */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 mb-8 border-2 border-pink-200">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="w-8 h-8 text-pink-600" />
                  <h3 className="text-2xl font-bold text-pink-800">Caso de Estudio 1: El Perfil Principiante</h3>
                </div>
                
                <div className="bg-white rounded-lg p-6 mb-6 border border-pink-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-pink-800">Perfil: "Ana"</h4>
                      <p className="text-pink-600 text-sm">45 años, sedentaria, madre de dos hijos</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><strong>Situación:</strong> IMC 29, sedentaria 10+ años</p>
                      <p><strong>Trabajo:</strong> Oficina</p>
                      <p><strong>Familia:</strong> 2 hijos</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Dolor principal:</strong> Falta de energía para los hijos</p>
                      <p><strong>Miedo:</strong> Desarrollar enfermedades como sus padres</p>
                      <p><strong>Meta vaga:</strong> "Quiero bajar de peso y ser más sana"</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <h5 className="font-bold text-pink-800 text-sm mb-2">Específica</h5>
                    <p className="text-xs text-gray-600">
                      "Reducir 8 kg de peso corporal y caminar 5 km sin parar"
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <h5 className="font-bold text-pink-800 text-sm mb-2">Medible</h5>
                    <p className="text-xs text-gray-600">
                      Peso semanal, cintura quincenal, distancia por app, fotos mensuales
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <h5 className="font-bold text-pink-800 text-sm mb-2">Alcanzable</h5>
                    <p className="text-xs text-gray-600">
                      8 kg en 4 meses (0.5 kg/semana) es seguro y realista
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <h5 className="font-bold text-pink-800 text-sm mb-2">Relevante</h5>
                    <p className="text-xs text-gray-600">
                      Alivia presión articular, reduce riesgo diabetes, energía para hijos
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <h5 className="font-bold text-pink-800 text-sm mb-2">Temporal</h5>
                    <p className="text-xs text-gray-600">
                      4 meses con hitos: 2kg/mes 1, 3km/mes 2
                    </p>
                  </div>
                </div>
              </div>

              {/* Case Study 2: Bruno */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 border-2 border-blue-200">
                <div className="flex items-center gap-4 mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-blue-800">Caso de Estudio 2: El Perfil Intermedio</h3>
                </div>
                
                <div className="bg-white rounded-lg p-6 mb-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">B</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-blue-800">Perfil: "Bruno"</h4>
                      <p className="text-blue-600 text-sm">32 años, entrena inconsistentemente</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p><strong>Situación:</strong> "Gordiflaco" - peso normal, alta grasa</p>
                      <p><strong>Entrenamiento:</strong> Pesas 3-4x/semana inconsistente</p>
                      <p><strong>Nutrición:</strong> Sin plan claro</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Objetivo:</strong> Autoestima y definición</p>
                      <p><strong>Deseo:</strong> Sentirse seguro sin camisa</p>
                      <p><strong>Meta vaga:</strong> "Quiero ponerme más fuerte y marcado"</p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <h5 className="font-bold text-blue-800 text-sm mb-2">Específica</h5>
                    <p className="text-xs text-gray-600">
                      "Reducir grasa de 20% a 15% y aumentar 20kg en sentadilla"
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">M</span>
                    </div>
                    <h5 className="font-bold text-blue-800 text-sm mb-2">Medible</h5>
                    <p className="text-xs text-gray-600">
                      % grasa mensual (plicómetro), cargas en bitácora de entrenamiento
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">A</span>
                    </div>
                    <h5 className="font-bold text-blue-800 text-sm mb-2">Alcanzable</h5>
                    <p className="text-xs text-gray-600">
                      5% grasa en 5 meses (1%/mes) + 20kg carga es desafiante pero factible
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">R</span>
                    </div>
                    <h5 className="font-bold text-blue-800 text-sm mb-2">Relevante</h5>
                    <p className="text-xs text-gray-600">
                      15% grasa = definición visible = autoconfianza + rendimiento atlético
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <h5 className="font-bold text-blue-800 text-sm mb-2">Temporal</h5>
                    <p className="text-xs text-gray-600">
                      5 meses: 3 déficit calórico + 2 mantenimiento/superávit
                    </p>
                  </div>
                </div>
              </div>

              {/* Modeling Section */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-6">
                  <Trophy className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-purple-800">La Implementación de Rutinas y el Poder de la Modelación</h3>
                </div>
                
                <p className="text-lg text-gray-700 mb-6">
                  Con motivos claros y metas definidas, la ejecución diaria sucede a través de la implementación de rutinas estratégicas. Son los pequeños hábitos, ejecutados con una consistencia de hierro, los que pavimentan el camino hacia la meta final. En lugar de intentar reinventar la rueda o descubrir todo por prueba y error, una de las estrategias de aprendizaje e implementación más eficaces es la "modelación".
                </p>

                <div className="bg-white rounded-lg p-6 mb-6 border border-purple-200">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">¿Qué es la Modelación?</h4>
                  <p className="text-gray-700 mb-4">
                    La modelación es el proceso consciente de identificar a individuos que ya han alcanzado el resultado que anhelas y, luego, analizar y adaptar sus comportamientos, estrategias y, crucialmente, su mentalidad a tu propia realidad. No se trata de una comparación superficial o de un intento de copiar ciegamente la vida de otra persona. Se trata de una ingeniería inversa del éxito.
                  </p>
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-purple-800 font-medium text-center">
                      "El éxito deja pistas y podemos aprender de los aciertos y errores de quienes ya han recorrido el camino."
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white p-6 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h5 className="font-bold text-purple-800 text-center mb-3">Identifica Modelos</h5>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• 2-3 personas con tu resultado deseado</li>
                      <li>• Punto de partida similar al tuyo</li>
                      <li>• Figuras públicas, autores o conocidos</li>
                      <li>• Transformación sostenible comprobada</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h5 className="font-bold text-purple-800 text-center mb-3">Analiza Sistemas</h5>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Rutinas de ejercicio</li>
                      <li>• Sistemas nutricionales</li>
                      <li>• Gestión del entorno social</li>
                      <li>• Mentalidad y resiliencia</li>
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-purple-200">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h5 className="font-bold text-purple-800 text-center mb-3">Adapta, No Copies</h5>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li>• Toma principios, no detalles</li>
                      <li>• Ajusta a tu realidad única</li>
                      <li>• Considera tu contexto de vida</li>
                      <li>• Mantén la esencia, cambia la forma</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-violet-100 rounded-lg p-6">
                  <h5 className="font-bold text-violet-800 mb-4">Ejemplo de Adaptación Inteligente</h5>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-semibold text-violet-700 mb-2">Tu Modelo:</h6>
                      <p className="text-sm text-gray-700 mb-3">Se levanta a las 5am para entrenar</p>
                      <h6 className="font-semibold text-violet-700 mb-2">Tu Realidad:</h6>
                      <p className="text-sm text-gray-700">Tienes un bebé que se despierta de noche</p>
                    </div>
                    <div>
                      <h6 className="font-semibold text-violet-700 mb-2">Principio a Modelar:</h6>
                      <p className="text-sm text-gray-700 mb-3">No negociabilidad del entrenamiento</p>
                      <h6 className="font-semibold text-violet-700 mb-2">Tu Adaptación:</h6>
                      <p className="text-sm text-gray-700">Entrenar en tu hora de comida o por la noche</p>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-700 leading-relaxed mt-6">
                  La modelación te permite tomar un atajo, evitando los errores más comunes e implementando estrategias ya validadas. Acelera tu curva de aprendizaje y proporciona una hoja de ruta clara, aumentando drásticamente tus posibilidades de construir rutinas que no solo funcionen, sino que sean sostenibles para ti a largo plazo.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 5,
      title: "El Guardián y la Consolidación",
      icon: Shield,
      color: "bg-orange-500",
      estimatedTime: "16 min",
      content: (
        <div className="space-y-8">
          <div className="relative bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Shield className="w-16 h-16 mb-4 text-yellow-300" />
              <h2 className="text-3xl font-bold mb-4">El Guardián de la Responsabilidad</h2>
              <p className="text-lg opacity-90">Consolidación de la nueva identidad</p>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed text-gray-700 mb-8">
                El viaje de la transformación, aunque profundamente personal, no tiene por qué ser solitario. De hecho, el intento de confiar exclusivamente en la autodisciplina, sin crear sistemas de apoyo externos, es una falla estratégica que deja la puerta abierta al autosabotaje. La psicología humana es fundamentalmente social. Somos influenciados, para bien y para mal, por las expectativas y observaciones de quienes nos rodean.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Reconocimiento Estratégico</h4>
                    <p className="text-amber-700">
                      La creación de un sistema de rendición de cuentas inteligente no es una señal de debilidad; 
                      es un reconocimiento estratégico de esta faceta de nuestra naturaleza, utilizándola como 
                      una poderosa fuerza a nuestro favor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guardian Concept */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-8 mb-8 border-2 border-teal-200">
                <div className="flex items-center gap-4 mb-6">
                  <Shield className="w-8 h-8 text-teal-600" />
                  <h3 className="text-2xl font-bold text-teal-800">El Concepto del Guardián</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6 border border-teal-200">
                    <h4 className="text-lg font-bold text-teal-800 mb-4">¿Qué NO es el Guardián?</h4>
                    <ul className="space-y-2 text-red-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Un amigo que solo ofrece aliento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Un hombro para lamentaciones</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Alguien que juzga o critica</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-teal-200">
                    <h4 className="text-lg font-bold text-teal-800 mb-4">¿Qué SÍ es el Guardián?</h4>
                    <ul className="space-y-2 text-green-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Socio de responsabilidad</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Espejo honesto y objetivo</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Aplicador de reglas preacordadas</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-gray-700 mt-6">
                  El Guardián es una persona de tu confianza —pareja, familiar, amigo cercano o mentor— que recibe 
                  el permiso explícito para ser firme y objetivo, garantizando que cumplas el compromiso que hiciste 
                  contigo mismo. Su función es transformar tus intenciones en un contrato social.
                </p>
              </div>

              {/* Habit Tracker */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-8 mb-8 border-2 border-violet-200">
                <div className="flex items-center gap-4 mb-6">
                  <CheckCircle className="w-8 h-8 text-violet-600" />
                  <h3 className="text-2xl font-bold text-violet-800">La Planilla de Hábitos: Tu Tablero de Control</h3>
                </div>

                <p className="text-gray-700 mb-6">
                  Con base en tu meta SMART y en tu investigación de modelación, crearás una lista de 5 a 7 hábitos clave, 
                  no negociables, que son los principales impulsores de tu éxito. La clave es la simplicidad y el enfoque 
                  en el proceso, no en el resultado.
                </p>

                <div className="bg-white rounded-lg p-6 border border-violet-200 mb-6">
                  <h4 className="text-lg font-bold text-violet-800 mb-4">Ejemplo para "Ana" (Principiante)</h4>
                  <div className="space-y-3">
                    {[
                      { habit: "Caminar mínimo 30 minutos", frequency: "4 veces/semana" },
                      { habit: "Incluir proteína en 3 comidas principales", frequency: "Diariamente" },
                      { habit: "Beber 2 litros de agua", frequency: "Diariamente" },
                      { habit: "Evitar bebidas azucaradas", frequency: "Diariamente" },
                      { habit: "Dormir mínimo 7 horas", frequency: "5 veces/semana" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-violet-50 rounded-lg">
                        <span className="font-medium text-violet-800">{item.habit}</span>
                        <Badge variant="secondary">{item.frequency}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-violet-100 p-6 rounded-lg">
                  <h5 className="font-semibold text-violet-800 mb-2">Funcionamiento</h5>
                  <p className="text-violet-700">
                    La planilla es una lista de verificación semanal. Al final de cada día o semana, marcas lo que 
                    se cumplió. El objetivo es alcanzar un porcentaje de cumplimiento que tú y tu Guardián definirán juntos.
                  </p>
                </div>
              </div>

              {/* Guardian Contract */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl p-8 mb-8 border-2 border-rose-200">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="w-8 h-8 text-rose-600" />
                  <h3 className="text-2xl font-bold text-rose-800">El Contrato con el Guardián</h3>
                </div>

                <p className="text-gray-700 mb-6">
                  Con la planilla en mano, te sientas con tu Guardián y establecen un contrato claro, basado en los 
                  dos mayores motivadores del comportamiento humano: la aversión al dolor y la búsqueda del placer.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Consequences */}
                  <div className="bg-white rounded-lg p-6 border-2 border-red-200">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h4 className="text-lg font-bold text-red-800">La Consecuencia (El Dolor)</h4>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-sm">
                      Si cumplo menos del 80% de mis hábitos, habrá una consecuencia inmediata y significativa.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-1">💰 Financiera</h5>
                        <p className="text-xs text-red-700">Donar $500 a organización con la que no estás de acuerdo</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-1">📱 Social</h5>
                        <p className="text-xs text-red-700">Sin redes sociales todo el fin de semana</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-1">🎮 Material</h5>
                        <p className="text-xs text-red-700">Entregar objeto valioso hasta cumplimiento total</p>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <h5 className="font-semibold text-red-800 mb-1">💪 Esfuerzo</h5>
                        <p className="text-xs text-red-700">Tarea extra: limpieza profunda o entrenamiento adicional</p>
                      </div>
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="bg-white rounded-lg p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-6 h-6 text-green-600" />
                      <h4 className="text-lg font-bold text-green-800">La Recompensa (El Placer)</h4>
                    </div>
                    
                    <p className="text-gray-700 mb-4 text-sm">
                      Si cumplo el 95% o más de mis hábitos, tendré derecho a una recompensa genuinamente valiosa.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-1">🍽️ Experiencial</h5>
                        <p className="text-xs text-green-700">Cena especial, masaje relajante, ida al cine</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-1">🛍️ Material</h5>
                        <p className="text-xs text-green-700">Ropa deportiva, libro deseado, ahorro para compra mayor</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <h5 className="font-semibold text-green-800 mb-1">😴 Descanso</h5>
                        <p className="text-xs text-green-700">Día libre de entrenamiento o dormir hasta tarde</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mt-6">
                  <h5 className="font-semibold text-amber-800 mb-2">Poder Psicológico del Sistema</h5>
                  <p className="text-amber-700">
                    El Guardián tiene la libertad y responsabilidad de aplicar consecuencias y conceder recompensas 
                    sin dudar. La simple existencia de este sistema crea una capa externa y poderosa de motivación. 
                    El pensamiento de tener que hacer una donación no deseada puede ser el empujón final necesario 
                    para ponerte los tenis en un día lluvioso.
                  </p>
                </div>
              </div>

              {/* Evolution */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-200">
                <div className="flex items-center gap-4 mb-6">
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-emerald-800">La Evolución Natural del Sistema</h3>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Con el tiempo, a medida que las vías neuronales de los nuevos hábitos se fortalecen, la necesidad 
                  del Guardián disminuye. Los comportamientos se vuelven automáticos y la motivación intrínseca, 
                  nacida de la nueva identidad, toma el control.
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-emerald-200 text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">1</span>
                    </div>
                    <h5 className="font-bold text-emerald-800 mb-2">Fase Inicial</h5>
                    <p className="text-sm text-gray-600">
                      Dependencia del Guardián para mantener accountability y ejecutar consecuencias/recompensas
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-emerald-200 text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                    <h5 className="font-bold text-emerald-800 mb-2">Fase Intermedia</h5>
                    <p className="text-sm text-gray-600">
                      Fortalecimiento de vías neuronales, hábitos se vuelven más automáticos y naturales
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-emerald-200 text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <h5 className="font-bold text-emerald-800 mb-2">Fase Avanzada</h5>
                    <p className="text-sm text-gray-600">
                      Motivación intrínseca toma control, nueva identidad consolidada, independencia del sistema
                    </p>
                  </div>
                </div>
              </div>

              {/* Conclusion Section */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 text-white">
                <div className="flex items-center gap-4 mb-6">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <h3 className="text-2xl font-bold">Conclusión: La Transformación como un Viaje Infinito</h3>
                </div>
                
                <p className="text-lg leading-relaxed mb-6 text-gray-200">
                  Llegamos al final de esta guía, pero al inicio de tu verdadero viaje. Lo que se ha presentado aquí 
                  no es una fórmula mágica, sino una arquitectura, un sistema operativo para el cambio. Cubrimos la 
                  necesidad de asumir responsabilidad radical, la falacia de depender de la motivación, el poder de 
                  la disciplina neuroconsciente, la claridad visceral de la Tarjeta de Motivos, la ingeniería precisa 
                  de las metas SMART, la estrategia de la modelación y, finalmente, la fuerza de la rendición de cuentas.
                </p>

                <div className="bg-yellow-900 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-yellow-200 mb-3">La Verdadera Victoria</h4>
                  <p className="text-yellow-100 mb-4">
                    La transformación corporal, cuando es exitosa, nunca se trata del punto de llegada. El cuerpo 
                    que conquistas es, en realidad, un subproducto, un trofeo físico que representa una victoria 
                    mucho más profunda: la victoria sobre la procrastinación, el autosabotaje y las creencias limitantes.
                  </p>
                  <p className="text-yellow-100">
                    Es la prueba material de que eres capaz de hacer cosas difíciles, de comprometerte contigo mismo 
                    y de construir, ladrillo por ladrillo, a la persona que deseas ser.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h5 className="font-bold text-yellow-300 mb-2">Meta Finita</h5>
                    <p className="text-sm text-gray-300">Perder X kilos o alcanzar Y% de grasa</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h5 className="font-bold text-yellow-300 mb-2">Logro Infinito</h5>
                    <p className="text-sm text-gray-300">Persona disciplinada, resiliente, segura y consciente</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h5 className="font-bold text-yellow-300 mb-2">Transferencia</h5>
                    <p className="text-sm text-gray-300">Principios aplicables a carrera, relaciones, habilidades</p>
                  </div>
                </div>

                <div className="bg-green-900 rounded-lg p-6 mb-6">
                  <h4 className="text-xl font-bold text-green-200 mb-3">Abraza el Proceso</h4>
                  <ul className="space-y-2 text-green-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Enamórate del esfuerzo diario</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Celebra pequeñas victorias: entrenamiento hecho, comida saludable, hora extra de sueño</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Entiende que días malos y estancamientos son parte natural del viaje</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>En momentos de duda: relee tu Tarjeta de Motivos, revisa tu meta SMART, llama a tu Guardián</span>
                    </li>
                  </ul>
                </div>

                <div className="text-center">
                  <h4 className="text-2xl font-bold text-yellow-400 mb-4">Ya no estás a la deriva</h4>
                  <p className="text-lg text-gray-200 mb-6">
                    Esperando una ola de motivación. Eres el arquitecto, el ingeniero y el piloto. 
                    Tienes el mapa, la brújula y el timón.
                  </p>
                  <div className="text-3xl font-bold text-yellow-400">
                    El viaje es tuyo para comandar.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
  const IconComponent = currentSectionData?.icon || Brain;

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
                  <h1 className="text-lg sm:text-xl font-bold text-foreground truncate">Fortaleciendo su Mente</h1>
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
                Parte {currentSection}
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
