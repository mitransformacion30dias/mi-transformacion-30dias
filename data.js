/* data.js
   Contenido original del programa "Mi Transformación — 30 días".
   Principios generales de meditación, journaling, tapping y acción diaria.
   No es un producto oficial de Joe Dispenza ni contiene material protegido. */

const MOODS = [
  { key: "muybien", emoji: "😀", label: "Muy bien" },
  { key: "bien", emoji: "🙂", label: "Bien" },
  { key: "normal", emoji: "😐", label: "Normal" },
  { key: "dificil", emoji: "🙁", label: "Difícil" },
  { key: "muydificil", emoji: "😔", label: "Muy difícil" }
];

const WEEKS = [
  { n: 1, title: "OBSERVAR", range: [1, 7] },
  { n: 2, title: "ROMPER EL PATRÓN", range: [8, 14] },
  { n: 3, title: "CREAR", range: [15, 21] },
  { n: 4, title: "CONVERTIRLO EN VIDA", range: [22, 30] }
];

function weekOf(day) {
  return WEEKS.find(w => day >= w.range[0] && day <= w.range[1]);
}

/* Cada día: meditationLabel (texto mostrado) + meditationMin (minutos para el temporizador).
   type: normal | goals | review | practices | plan90 | final */
const DAYS = [
{ day:1, title:"¿Dónde estoy?", type:"goals", meditationLabel:"10–15 min", meditationMin:15,
  prompts:[
    "¿Qué quiero cambiar realmente en mi vida?",
    "¿Qué estoy haciendo actualmente que mantiene las cosas igual?",
    "¿Qué quiero que sea diferente dentro de 30 días?"
  ],
  tapping:"5 min sobre cualquier resistencia que aparezca.",
  actionTitle:"Elegir 3 objetivos principales", actionDesc:"Define los tres objetivos con los que vas a trabajar durante el programa." },

{ day:2, title:"Mis patrones", type:"normal", meditationLabel:"15 min", meditationMin:15,
  prompts:[
    "¿Qué pensamiento aparece repetidamente cuando piensas en dinero o futuro?",
    "¿Qué haces cuando aparece?",
    "¿Qué comportamiento quieres dejar de repetir?"
  ],
  tapping:"Tapping sobre el patrón principal que has identificado.",
  actionTitle:"Detectar un comportamiento automático", actionDesc:"Anótalo en el momento en que ocurra, sin juzgarlo." },

{ day:3, title:"Pensamiento ≠ realidad", type:"normal", meditationLabel:"15 min", meditationMin:15,
  prompts:[
    "Completa varias veces hoy: «Estoy teniendo el pensamiento de que…»",
    "¿Qué cambia cuando lo nombras así en vez de darlo por hecho?"
  ],
  tapping:"5–10 min sobre cualquier pensamiento que hoy se haya sentido muy \"verdadero\".",
  actionTitle:"Hacer una tarea que normalmente pospones", actionDesc:"Elige algo concreto y hazlo hoy." },

{ day:4, title:"Emoción", type:"normal", meditationLabel:"15–20 min", meditationMin:20,
  prompts:[
    "¿Qué emociones aparecen cuando piensas en tu futuro?",
    "¿Cuál te impulsa?",
    "¿Cuál te paraliza?"
  ],
  tapping:"Tapping sobre la emoción dominante que has identificado.",
  actionTitle:"Actuar aunque no haya ganas", actionDesc:"Haz algo importante hoy aunque no tengas motivación." },

{ day:5, title:"El yo automático", type:"normal", meditationLabel:"20 min", meditationMin:20,
  prompts:[
    "¿Cómo reaccionas normalmente cuando algo no sale como quieres?",
    "¿Qué respuesta diferente quieres aprender?"
  ],
  tapping:"5–10 min sobre la reacción automática que has descrito.",
  actionTitle:"Responder de otra manera", actionDesc:"En una situación real de hoy, elige conscientemente una respuesta distinta a la habitual." },

{ day:6, title:"Gratitud consciente", type:"normal", meditationLabel:"20 min", meditationMin:20,
  prompts:[
    "Escribe 3 cosas que realmente valoras.",
    "¿Cómo quieres sentirte mientras construyes lo que todavía no tienes?"
  ],
  tapping:"5–10 min, libre, sobre lo que haya surgido hoy.",
  actionTitle:"Actuar desde esa emoción", actionDesc:"Durante una parte del día, compórtate desde la emoción que has descrito." },

{ day:7, title:"Primera revisión", type:"review", meditationLabel:"20–25 min", meditationMin:25,
  prompts:[
    "¿Qué hice?",
    "¿Qué no hice?",
    "¿Qué descubrí?",
    "¿Qué patrón apareció más?",
    "¿Qué me resultó fácil?",
    "¿Qué me costó?",
    "¿Estoy acumulando conocimiento o estoy cambiando comportamientos?"
  ],
  tapping:"5–10 min sobre lo que haya aparecido en la revisión.",
  actionTitle:"Revisar tu semana", actionDesc:"Lee tus respuestas de los días 1 a 6 antes de responder a la revisión." },

{ day:8, title:"Identificar el personaje antiguo", type:"normal", meditationLabel:"25 min", meditationMin:25,
  prompts:[
    "Completa: «La versión de mí que quiero dejar atrás suele…»",
    "Completa: «La versión de mí que estoy construyendo…»"
  ],
  tapping:"5–10 min sobre la resistencia a dejar atrás la versión antigua.",
  actionTitle:"Actuar como la nueva versión", actionDesc:"Haz algo hoy propio de la versión que estás construyendo." },

{ day:9, title:"Interrumpir", type:"normal", meditationLabel:"25 min", meditationMin:25,
  prompts:[
    "Practica hoy: PARAR → RESPIRAR → OBSERVAR → ELEGIR.",
    "¿En qué momento del día lo has aplicado? ¿Qué cambió?"
  ],
  tapping:"5–10 min sobre el impulso que intentaste interrumpir.",
  actionTitle:"Cambiar una respuesta habitual", actionDesc:"Elige un momento en el que normalmente reaccionas igual, y hazlo distinto." },

{ day:10, title:"Merecimiento", type:"normal", meditationLabel:"25 min", meditationMin:25,
  prompts:[
    "¿Qué sientes cuando imaginas tener mucho más dinero?",
    "¿Qué parte de ti lo acepta?",
    "¿Qué parte lo rechaza?",
    "¿Qué tendrías que creer sobre ti para recibirlo sin culpa?"
  ],
  tapping:"5–10 min sobre la resistencia a recibir.",
  actionTitle:"Aceptar algo sin minimizarlo", actionDesc:"Cuando alguien te dé algo hoy (un cumplido, ayuda, dinero), acéptalo sin quitarle importancia." },

{ day:11, title:"Escasez", type:"normal", meditationLabel:"25 min", meditationMin:25,
  prompts:[
    "¿Dónde reconoces hoy: miedo, preocupación, comparación, urgencia o «no puedo»?",
    "¿Qué harías hoy si no estuvieras actuando desde la escasez?"
  ],
  tapping:"5–10 min sobre el miedo o la urgencia identificados.",
  actionTitle:"Una acción financiera o productiva concreta", actionDesc:"Da un paso real, por pequeño que sea." },

{ day:12, title:"Futuro", type:"normal", meditationLabel:"25–30 min", meditationMin:30,
  prompts:[
    "Describe un día normal de tu vida futura: comportamiento, decisiones, entorno, rutina (no solo dinero o resultados).",
    "¿Qué detalle de ese día te ha resultado más vivo?"
  ],
  tapping:"5–10 min si ha aparecido resistencia durante la visualización.",
  actionTitle:"Hacer hoy algo que esa versión futura haría", actionDesc:"Elige una acción concreta, no solo una intención." },

{ day:13, title:"Ensayo mental", type:"normal", meditationLabel:"30 min", meditationMin:30,
  prompts:[
    "Elige una situación que quieras manejar mejor. Visualiza: 1) la situación, 2) tu antigua respuesta, 3) la nueva respuesta, 4) la emoción, 5) el nuevo comportamiento.",
    "¿Qué ha cambiado al ensayarlo mentalmente?"
  ],
  tapping:"5–10 min sobre la situación que has visualizado.",
  actionTitle:"Aplicar el nuevo comportamiento", actionDesc:"Cuando se presente esa situación (o una parecida), aplica lo ensayado." },

{ day:14, title:"Revisión", type:"review", meditationLabel:"30 min", meditationMin:30,
  prompts:[
    "¿Qué está cambiando realmente?",
    "Revisa: días completados, minutos de meditación, acciones completadas, patrones detectados.",
    "¿Qué patrón sigue repitiéndose?"
  ],
  tapping:"5–10 min sobre lo que haya aparecido en la revisión.",
  actionTitle:"Revisar tu progreso", actionDesc:"Abre la pestaña PROGRESO antes de responder a la revisión." },

{ day:15, title:"Nueva identidad", type:"normal", meditationLabel:"30 min", meditationMin:30,
  prompts:[
    "Completa 10 veces: «Soy una persona que…» — prioriza conductas reales, no fantasías."
  ],
  tapping:"5–10 min sobre la resistencia a esta nueva identidad.",
  actionTitle:"Comportarte como esa identidad", actionDesc:"Elige una de las 10 frases y actúa según ella hoy." },

{ day:16, title:"Disciplina", type:"normal", meditationLabel:"30 min", meditationMin:30,
  prompts:[
    "¿Qué haría hoy una persona disciplinada aunque no tuviera motivación?"
  ],
  tapping:"5–10 min sobre la resistencia a actuar sin motivación.",
  actionTitle:"Hacerlo", actionDesc:"Haz exactamente lo que has descrito." },

{ day:17, title:"Enfoque", type:"normal", meditationLabel:"30 min", meditationMin:30,
  prompts:[
    "¿Cuál es tu única prioridad ahora mismo?"
  ],
  tapping:"5–10 min sobre lo que te dispersa habitualmente.",
  actionTitle:"Bloque de tiempo exclusivo", actionDesc:"Dedica un bloque de tiempo únicamente a esa prioridad, sin nada más." },

{ day:18, title:"Recibir", type:"normal", meditationLabel:"30–35 min", meditationMin:35,
  prompts:[
    "¿Cómo respondes normalmente a oportunidades, ayuda, dinero, reconocimiento o cumplidos?",
    "¿Qué te costaría más aceptar sin rechazarlo automáticamente?"
  ],
  tapping:"5–10 min si aparece resistencia a recibir.",
  actionTitle:"Aceptar algo sin rechazarlo", actionDesc:"Cuando surja la oportunidad hoy, acéptala." },

{ day:19, title:"Expansión", type:"normal", meditationLabel:"35 min", meditationMin:35,
  prompts:[
    "Si no tuvieras miedo de equivocarte, ¿qué estarías intentando ahora?"
  ],
  tapping:"5–10 min sobre el miedo a equivocarte.",
  actionTitle:"Un pequeño paso hacia ello", actionDesc:"No hace falta que sea grande. Que sea real." },

{ day:20, title:"Emoción antes del resultado", type:"normal", meditationLabel:"35 min", meditationMin:35,
  prompts:[
    "Elige un estado para practicar hoy: seguridad, enfoque, tranquilidad, disciplina, gratitud o apertura.",
    "¿Cómo se siente ese estado en el cuerpo?"
  ],
  tapping:"5–10 min si aparece resistencia a sentir ese estado antes de tener el resultado.",
  actionTitle:"Actuar desde ese estado", actionDesc:"Elige una tarea importante de hoy y hazla desde ese estado." },

{ day:21, title:"Revisión profunda", type:"review", meditationLabel:"35 min", meditationMin:35,
  prompts:[
    "¿Qué pensabas el Día 1?",
    "¿Qué piensas ahora?",
    "¿Qué haces diferente?",
    "¿Qué todavía no ha cambiado?",
    "¿Qué estás evitando?"
  ],
  tapping:"5–10 min sobre lo que estás evitando.",
  actionTitle:"Comparar Día 1 y Día 21", actionDesc:"Relee tu respuesta del Día 1 antes de escribir hoy." },

{ day:22, title:"Decisión", type:"normal", meditationLabel:"35–40 min", meditationMin:40,
  prompts:[
    "¿Qué decisión llevas demasiado tiempo posponiendo?"
  ],
  tapping:"5–10 min sobre lo que te frena a decidir.",
  actionTitle:"Dar un paso concreto", actionDesc:"Da un paso real hacia esa decisión hoy, aunque sea pequeño." },

{ day:23, title:"Acción incómoda", type:"normal", meditationLabel:"40 min", meditationMin:40,
  prompts:[
    "¿Qué es necesario y a la vez incómodo?"
  ],
  tapping:"5–10 min sobre la incomodidad anticipada.",
  actionTitle:"Hacerlo", actionDesc:"Hazlo hoy, aunque no tengas ganas." },

{ day:24, title:"Dinero", type:"normal", meditationLabel:"40 min", meditationMin:40,
  prompts:[
    "¿Qué habilidad puedes convertir en dinero?",
    "¿Qué activo estás construyendo?",
    "¿Qué actividad realmente puede generar ingresos y cuál solo te mantiene ocupada?"
  ],
  tapping:"5–10 min sobre la resistencia a esta pregunta.",
  actionTitle:"Una acción directamente relacionada con ingresos", actionDesc:"Elige algo concreto que mueva una fuente real de ingresos." },

{ day:25, title:"Oportunidades", type:"normal", meditationLabel:"40 min", meditationMin:40,
  prompts:[
    "¿Qué no estás viendo?"
  ],
  tapping:"5–10 min sobre lo que te cuesta ver.",
  actionTitle:"Explorar una oportunidad concreta", actionDesc:"Investiga o da un paso sobre algo que hayas estado dejando de lado." },

{ day:26, title:"Identidad futura", type:"normal", meditationLabel:"40 min", meditationMin:40,
  prompts:[
    "Describe un día normal de tu vida futura: cómo piensa, cómo decide, qué tolera, qué ya no tolera, qué hace a diario."
  ],
  tapping:"5–10 min si aparece resistencia al describirlo.",
  actionTitle:"Copiar una conducta de esa identidad", actionDesc:"Elige una sola conducta de la descripción y hazla hoy." },

{ day:27, title:"Integración", type:"normal", meditationLabel:"40 min", meditationMin:40,
  prompts:[
    "Repasa: tapping, gratitud, meditación, journaling, visualización, acción.",
    "¿Cuál de estas prácticas te está ayudando realmente a mantenerte centrada?"
  ],
  tapping:"5–10 min libre.",
  actionTitle:"Elegir la práctica que más te sostiene", actionDesc:"Identifícala con claridad; la necesitarás para el Día 28." },

{ day:28, title:"Mi sistema", type:"practices", meditationLabel:"40–45 min", meditationMin:45,
  prompts:[
    "De todas las prácticas del programa, ¿cuáles son las 3 que vas a mantener después del Día 30?"
  ],
  tapping:"5–10 min libre.",
  actionTitle:"Elegir máximo 3 prácticas diarias", actionDesc:"Esta será tu rutina posterior al programa." },

{ day:29, title:"Mi futuro", type:"plan90", meditationLabel:"≈45 min", meditationMin:45,
  prompts:[
    "Visualiza: resultado, camino, hábitos, decisiones, oportunidades, obstáculos, respuestas.",
    "Completa: «Durante los próximos 90 días voy a…» (máximo 3 objetivos)"
  ],
  tapping:"5–10 min sobre cualquier resistencia al plan de 90 días.",
  actionTitle:"Definir el plan de 90 días", actionDesc:"Escribe los 3 objetivos con los que sigues después de este programa." },

{ day:30, title:"Cierre", type:"final", meditationLabel:"45 min", meditationMin:45,
  prompts:[
    "¿Qué hice que antes no hacía?",
    "¿Qué pensamiento cambió?",
    "¿Qué avance real conseguí?",
    "¿Qué aprendí sobre mí?",
    "¿Qué sigue frenándome?",
    "¿Qué voy a seguir haciendo?"
  ],
  tapping:"5–10 min de cierre, libre.",
  actionTitle:"Generar tu informe final", actionDesc:"Revisa tu progreso completo en la pestaña PROGRESO antes de cerrar el programa." }
];

const BLOCKS = ["intencion","meditacion","journaling","tapping","accion","cierre"];
