/* data.js — Mi Transformación
   ============================================================
   FUENTES (investigación realizada antes de escribir el contenido)
   ============================================================

   ESTRUCTURA DEL PROGRAMA — basada en el proceso de 7 pasos descrito en:
   "Breaking the Habit of Being Yourself: How to Lose Your Mind and Create
   a New One" (ed. en español: "Deja de ser tú"), Dr. Joe Dispenza, Hay House.
   Índice del libro (confirmado de forma cruzada en varias fuentes
   independientes, incluida la ficha del propio producto):
     Semana 1 → Paso 1: Inducción (abrir la puerta al estado creativo)
     Semana 2 → Pasos 2-4: Reconocer / Admitir y declarar / Entregar
                 ("Prune Away the Habit of Being Yourself")
     Semana 3 → Pasos 5-6: Observar y recordar / Redirigir
                 ("Dismantle the Memory of the Old You")
     Semana 4 → Paso 7: Crear y ensayar
                 ("Create a New Mind for Your New Future")
   Esta app NO reproduce texto del libro: cada instrucción de esta app
   está resumida y parafraseada con palabras propias a partir de esa
   estructura pública (índice, reseñas, fichas de producto), nunca
   copiada del libro ni de las meditaciones oficiales.

   PROGRESIÓN OFICIAL DE DURACIONES (documentación de atención al cliente
   de Dr Joe Dispenza): existe, y aumenta cada semana (aprox. 24/28 min en
   semana 1 hasta 71/74 min en semana 4), pero corresponde al producto de
   audio OFICIAL DE PAGO, en inglés. No existe una versión gratuita en
   español con esos minutos exactos — comprobado de nuevo en esta revisión.
   Por eso esta app NO usa esas cifras: usa una progresión real distinta,
   en español, con sus propias duraciones confirmadas (ver tabla abajo).

   MEDITACIÓN — recurso principal, uno por semana (no 30 distintos, no
   uno solo repetido sin variación):
     Canal: "Meditaciones Sol Murias" (podcast de Spotify, español, autora
     real y activa, contacto público solmurias@gmail.com). Serie titulada
     "Meditaciones Deja de Ser Tú — Joe Dispenza — Inducciones y
     meditaciones de la 1 a la 4ta semana", con un episodio por semana:

       Semana 1 — "Inducción de las partes del cuerpo — Semana 1"
         Duración confirmada: 11:21. Es SOLO inducción (así la titula la
         propia autora) — no la práctica completa de la semana.
         URL: https://creators.spotify.com/pod/profile/solmurias/episodes/Induccin-de-las-partes-del-cuerpo---Semana-1---Joe-Dispenza---Meditaciones-Deja-de-ser-t-e1auqr8

       Semana 2 — "Meditación guiada — Semana 2"
         Duración confirmada: 11:59. Meditación completa (incluye inducción).
         URL: https://open.spotify.com/episode/31IcoTnKhTgviM0CYAyCke

       Semana 3 — "Meditación guiada — Semana 3"
         Duración confirmada: 8:11. Meditación completa.
         URL directa al episodio NO verificada (mismo bloqueo técnico de
         siempre al intentar abrir la página). Se enlaza a la lista de
         reproducción real donde está publicado, con el título exacto:
         https://open.spotify.com/playlist/7bIZ7De2O7DCKh1wgeDybp

       Semana 4 — "Meditación guiada — Semana 4"
         Duración confirmada: 18:03. Meditación completa.
         URL directa al episodio NO verificada (mismo motivo). Mismo
         enlace de la lista de reproducción, buscar "Semana 4".

     Tipo: TERCERO en las 4 — inspiradas en el libro, NO son grabaciones
     oficiales de Joe Dispenza.

     Alternativa (Semana 1, inducción del "agua ascendiendo", canal
     distinto, YouTube, español, tercero, duración no confirmada):
     https://www.youtube.com/watch?v=6Heps-97ZUI

     Alternativa OFICIAL (inglés, gratuita): el canal oficial de Joe
     Dispenza (youtube.com/@drjoedispenza) tiene la lista "Free
     Meditations by Dr Joe Dispenza":
     https://www.youtube.com/playlist?list=PLrQd2Le6J_NpOdHO74rWzWfqkWlqdTjEg

   TÉCNICA "ROMPER HÁBITOS FÍSICOS" (acción, semana 1) — es una
   recomendación ampliamente documentada y de dominio público asociada
   a Dispenza (cambiar rutinas físicas simples para debilitar los
   circuitos automáticos del "viejo yo"): cambiar de mano, de ruta, de
   silla, etc. Descrita aquí con palabras propias.

   TÉCNICA "OBSERVAR Y DECIR ¡CAMBIO!" (semana 3, pasos 5-6) — resumida
   a partir de reseñas detalladas del libro: al notar el patrón antiguo,
   interrumpirlo conscientemente con una palabra/señal antes de redirigir
   la respuesta. La conexión "meditación sentada → vida real" se hace
   explícita en el nuevo bloque "Durante el día" de esta etapa.

   EMOCIÓN ELEVADA Y GRATITUD (semana 4, paso 7) — Dispenza vincula el
   ensayo mental del futuro a sentir por adelantado una emoción elevada
   (gratitud, por ejemplo) como si el resultado ya hubiera ocurrido; por
   eso la gratitud entra formalmente en la etapa 4, aunque puedes seguir
   anotándola libremente en el cierre de cualquier día si ya es tu hábito.

   CONTINUIDAD DESPUÉS DEL DÍA 30 — la documentación de atención al
   cliente de Dr Joe Dispenza indica que, tras "Breaking the Habit of
   Being Yourself", suele recomendarse continuar con: You Are the
   Placebo Meditation #1, The Generous Present Moment y Blessing of the
   Energy Centers I; y más adelante Tuning in to New Potentials,
   Reconditioning the Body to a New Mind y Changing Beliefs and
   Perceptions. Son nombres de productos oficiales — no se verificaron
   enlaces gratuitos para ellos, así que se citan solo por nombre en la
   pantalla "Más", como referencia para después del programa.

   TAPPING — no forma parte del método de Joe Dispenza. Se incluye aquí
   solo como complemento puntual (Días 9, 13 y 18), usando la secuencia
   estándar de puntos de EFT que ya conoces, aplicada al patrón que hayas
   reconocido ese mismo día.
   ============================================================ */

const MOODS = [
  { key: "muybien", emoji: "😀", label: "Muy bien" },
  { key: "bien", emoji: "🙂", label: "Bien" },
  { key: "normal", emoji: "😐", label: "Normal" },
  { key: "dificil", emoji: "🙁", label: "Difícil" },
  { key: "muydificil", emoji: "😔", label: "Muy difícil" }
];

const RESOURCES = {
  "semana1-induccion": {
    nombre: "Inducción de las partes del cuerpo — Semana 1",
    autor: "Meditaciones Sol Murias (Spotify)",
    tipo: "tercero",
    tipoLabel: "Tercero — inspirada en el libro, no es oficial de Joe Dispenza",
    idioma: "Español",
    duracion: "11:21",
    alcance: "Solo inducción (no la práctica completa de la semana)",
    url: "https://creators.spotify.com/pod/profile/solmurias/episodes/Induccin-de-las-partes-del-cuerpo---Semana-1---Joe-Dispenza---Meditaciones-Deja-de-ser-t-e1auqr8",
    objetivo: "Pasar de Beta a Alfa/Theta llevando la atención a las partes del cuerpo \"en el espacio\", tal como describe el libro."
  },
  "semana2-meditacion": {
    nombre: "Meditación guiada — Semana 2",
    autor: "Meditaciones Sol Murias (Spotify)",
    tipo: "tercero",
    tipoLabel: "Tercero — inspirada en el libro, no es oficial de Joe Dispenza",
    idioma: "Español",
    duracion: "11:59",
    alcance: "Meditación completa (incluye la inducción)",
    url: "https://open.spotify.com/episode/31IcoTnKhTgviM0CYAyCke",
    objetivo: "Añade el trabajo de reconocer, admitir/declarar y entregar sobre la base de la inducción de la semana 1."
  },
  "semana3-meditacion": {
    nombre: "Meditación guiada — Semana 3",
    autor: "Meditaciones Sol Murias (Spotify)",
    tipo: "tercero",
    tipoLabel: "Tercero — inspirada en el libro, no es oficial de Joe Dispenza",
    idioma: "Español",
    duracion: "8:11",
    alcance: "Meditación completa",
    url: "https://open.spotify.com/playlist/7bIZ7De2O7DCKh1wgeDybp",
    urlNota: "No se pudo verificar el enlace directo a este episodio individual — el botón abre la lista de reproducción real donde está publicado; busca \"Semana 3\".",
    objetivo: "Añade observar la respuesta automática mientras ocurre y empezar a redirigirla."
  },
  "semana4-meditacion": {
    nombre: "Meditación guiada — Semana 4",
    autor: "Meditaciones Sol Murias (Spotify)",
    tipo: "tercero",
    tipoLabel: "Tercero — inspirada en el libro, no es oficial de Joe Dispenza",
    idioma: "Español",
    duracion: "18:03",
    alcance: "Meditación completa",
    url: "https://open.spotify.com/playlist/7bIZ7De2O7DCKh1wgeDybp",
    urlNota: "No se pudo verificar el enlace directo a este episodio individual — el botón abre la lista de reproducción real donde está publicado; busca \"Semana 4\".",
    objetivo: "Crear y ensayar la nueva identidad: la etapa más larga, con la mayor duración de las cuatro."
  },
  "induccion-agua": {
    nombre: "Meditación \"Deja de ser tú\" — inducción del agua ascendiendo (alternativa, solo semana 1)",
    autor: "Encontrando el balance en mi vida (YouTube)",
    tipo: "tercero",
    tipoLabel: "Tercero — inspirada en el libro, no es oficial de Joe Dispenza",
    idioma: "Español",
    duracion: "No confirmada — compruébalo al abrir el vídeo",
    alcance: "Inducción alternativa",
    url: "https://www.youtube.com/watch?v=6Heps-97ZUI",
    objetivo: "Misma función que la inducción de partes del cuerpo: entrar en Alfa/Theta. Úsala si un día de la semana 1 quieres variar."
  },
  "oficial-playlist": {
    nombre: "Free Meditations by Dr Joe Dispenza (lista oficial)",
    autor: "Dr Joe Dispenza (canal oficial de YouTube)",
    tipo: "oficial",
    tipoLabel: "Oficial",
    idioma: "Inglés",
    duracion: "Variable según el vídeo elegido",
    alcance: "Meditaciones oficiales completas",
    url: "https://www.youtube.com/playlist?list=PLrQd2Le6J_NpOdHO74rWzWfqkWlqdTjEg",
    objetivo: "Meditaciones gratuitas grabadas por el propio Joe Dispenza. En inglés. Úsala si prefieres practicar con su voz original."
  }
};

const WEEKS = [
  { n: 1, title: "INDUCCIÓN", subtitle: "Paso 1 del método", range: [1, 7] },
  { n: 2, title: "RECONOCER, ADMITIR, ENTREGAR", subtitle: "Pasos 2 a 4", range: [8, 14] },
  { n: 3, title: "OBSERVAR Y REDIRIGIR", subtitle: "Pasos 5 y 6", range: [15, 21] },
  { n: 4, title: "CREAR Y ENSAYAR", subtitle: "Paso 7", range: [22, 30] }
];

function weekOf(day) {
  return WEEKS.find(w => day >= w.range[0] && day <= w.range[1]);
}

/* Cada día declara qué bloques tiene, en orden, y el contenido de cada uno.
   blocks: subconjunto ordenado de
   ["intencion","meditacion","journaling","duranteeldia","tapping","gratitud","visualizacion","accion","cierre"] */
const DAYS = [

// ============ ETAPA 1 — INDUCCIÓN (días 1-7) ============
{ day:1, title:"Primer contacto con la inducción", resumen:"Esta semana trabajas solo el Paso 1 del método: aprender a entrar en calma llevando la atención al cuerpo. Es normal que cueste los primeros días — es una habilidad, no un talento.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"Antes de meditar, dedica 5 minutos a responder por escrito:", prompts:[
    "¿Qué pensamiento se repite más en tu cabeza en un día normal?",
    "¿En qué momento del día aparece con más fuerza?"
  ]},
  accion:{ titulo:"Romper un hábito físico simple", instruccion:"Elige uno y hazlo hoy: cepíllate los dientes con la otra mano, cambia de ruta para ir a algún sitio, o siéntate en un lugar distinto al habitual. El objetivo es debilitar el piloto automático del cuerpo, no la comodidad." } },

{ day:2, title:"Observar sin corregir", resumen:"Sigues con la misma inducción. Hoy el journaling se centra en las emociones habituales, no en los pensamientos.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"5 minutos, sin corregir lo que escribas:", prompts:[
    "¿Qué emoción sientes con más frecuencia en un día normal?",
    "¿Qué la suele disparar?"
  ]},
  accion:{ titulo:"Romper un hábito físico simple", instruccion:"Otro distinto al de ayer: cambia el orden en que te vistes, come con la mano contraria, o llega 10 minutos antes a algo sin necesidad." } },

{ day:3, title:"El cuerpo como memoria", resumen:"El cuerpo repite reacciones aunque la mente no esté pensando en ello activamente. Hoy observas eso.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué haces automáticamente cuando estás estresada, sin decidirlo (comer, revisar el móvil, callar, etc.)?",
    "¿Desde cuándo recuerdas hacerlo?"
  ]},
  accion:{ titulo:"Romper un hábito físico simple", instruccion:"Elige uno nuevo hoy y sostenlo: la mano con la que abres puertas, el lado de la cama, la postura al sentarte." } },

{ day:4, title:"El entorno que sostiene el patrón", resumen:"Personas, lugares y rutinas refuerzan quién eres sin que te des cuenta.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué persona o situación te hace volver más rápido a tu forma de ser habitual?",
    "¿Qué parte de tu entorno diario refuerza el patrón que quieres cambiar?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Pasa 20 minutos de tu día en un entorno distinto al habitual (otra habitación, otra cafetería, sin el móvil cerca)." } },

{ day:5, title:"El beneficio oculto", resumen:"Seguimos igual muchas veces porque, aunque no queramos admitirlo, hay algo que ganamos con ello.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"5 minutos, con honestidad:", prompts:[
    "¿Qué ganas (comodidad, seguridad, evitar algo) manteniéndote como estás ahora?",
    "¿Qué te costaría dejar de ganar eso?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Haz hoy una tarea que llevas posponiendo por comodidad, aunque sea pequeña." } },

{ day:6, title:"El coste de seguir igual", resumen:"La otra cara: qué te está costando no cambiar.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué te está costando (tiempo, dinero, salud, relaciones) seguir siendo quien eres ahora?",
    "¿Qué te gustaría poder decir dentro de 30 días que hoy no puedes decir?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Escribe en una nota visible (móvil o papel) la frase que has respondido en la segunda pregunta. Déjala a la vista toda la semana." } },

{ day:7, title:"Revisión — Paso 1 integrado", resumen:"Cierre de la primera semana de inducción antes de pasar al Paso 2.",
  blocks:["intencion","meditacion","journaling","cierre"],
  meditacionRef:"semana1-induccion",
  journaling:{ instruccion:"Revisa tus respuestas de los días 1 a 6 antes de escribir hoy:", prompts:[
    "¿Te resulta más fácil entrar en calma que el primer día?",
    "¿Qué patrón ha aparecido más veces esta semana en tus respuestas?",
    "¿Qué te llevas de esta semana al empezar la siguiente?"
  ]} },

// ============ ETAPA 2 — RECONOCER, ADMITIR, ENTREGAR (días 8-14) ============
{ day:8, title:"Paso 2: Reconocer", resumen:"Esta semana añades tres pasos tras la inducción: reconocer el patrón, admitirlo y declararlo, y entregar el control sobre él. Hoy trabajas solo el primero: reconocer.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, dedica 2-3 minutos a reconocer conscientemente el pensamiento repetitivo que identificaste el Día 1: obsérvalo sin actuar sobre él, solo nombrándolo.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué patrón concreto vas a trabajar esta semana (el que más se repite de lo que anotaste en la semana 1)?",
    "¿En qué situación de esta semana lo esperas ver aparecer?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"La próxima vez que notes ese patrón hoy, simplemente nómbralo en tu cabeza (\"esto es X\"), sin intentar cambiarlo todavía." } },

{ day:9, title:"Reconocer una emoción que te secuestra", resumen:"Sigues en el Paso 2, ahora sobre una emoción concreta.",
  blocks:["intencion","meditacion","journaling","tapping","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, reconoce sin juzgar la emoción que anotaste el Día 2.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué emoción te \"secuestra\" con más facilidad?",
    "¿Qué pierdes de vista cuando esa emoción toma el control?"
  ]},
  tapping:{ instruccion:"5-10 minutos de tapping, con tu secuencia habitual de puntos EFT, centrada en esa emoción concreta.", pregunta:"¿Qué apareció durante el tapping?" },
  accion:{ titulo:"Acción de hoy", instruccion:"Cuando sientas esa emoción hoy, haz una pausa de 10 segundos antes de reaccionar." } },

{ day:10, title:"Reconocer un comportamiento automático", resumen:"Paso 2 aplicado a un comportamiento, no a un pensamiento o emoción.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, reconoce el comportamiento automático que anotaste el Día 3.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué haces automáticamente que te gustaría dejar de hacer?",
    "¿Qué señal previa (pensamiento o sensación) aparece justo antes de hacerlo?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Identifica esa señal previa en tiempo real al menos una vez hoy, aunque no cambies el comportamiento todavía." } },

{ day:11, title:"Paso 3: Admitir y declarar", resumen:"Admitir es reconocer en voz alta (o por escrito) el patrón. Declarar es afirmar el cambio que quieres.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, completa mentalmente: \"Admito que...\" y después \"Declaro que a partir de ahora...\", con el patrón que has trabajado esta semana.",
  journaling:{ instruccion:"5 minutos, completa las frases por escrito:", prompts:[
    "Admito que...",
    "Declaro que a partir de ahora..."
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Di en voz alta, aunque sea a solas, la frase que has declarado por escrito." } },

{ day:12, title:"Paso 4: Entregar", resumen:"Entregar es soltar el control sobre cómo o cuándo va a cambiar algo, en vez de forzarlo.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, dedica un momento a soltar conscientemente la necesidad de controlar cómo se va a resolver el patrón que trabajas.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué te cuesta más soltar: el control sobre el cómo, sobre el cuándo, o sobre lo que piensen los demás?",
    "¿Qué pasaría si dejaras de intentar controlar ese aspecto durante una semana?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Elige una decisión pequeña de hoy y no le des más de una vuelta: decide y sigue." } },

{ day:13, title:"Reconocer, admitir, entregar — juntos", resumen:"Aplicas los tres pasos seguidos, en una situación real de hoy.",
  blocks:["intencion","meditacion","journaling","tapping","accion","cierre"],
  meditacionRef:"semana2-meditacion",
  meditacionExtra:"Tras la inducción, recorre los tres pasos con el patrón de esta semana: reconoce, admite y declara, entrega.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "Describe una situación de hoy donde puedas aplicar los tres pasos.",
    "¿Qué versión de ti actuaría distinto en esa situación?"
  ]},
  tapping:{ instruccion:"5-10 minutos de tapping sobre la resistencia a soltar el control.", pregunta:"¿Qué apareció durante el tapping?" },
  accion:{ titulo:"Acción de hoy", instruccion:"Aplica los tres pasos en esa situación real cuando se presente." } },

{ day:14, title:"Revisión — Pasos 2 a 4 integrados", resumen:"Cierre de la segunda semana antes de pasar a observar y redirigir.",
  blocks:["intencion","meditacion","journaling","cierre"],
  meditacionRef:"semana2-meditacion",
  journaling:{ instruccion:"Revisa tus respuestas de los días 8 a 13:", prompts:[
    "¿Cuántas veces esta semana lograste reconocer el patrón en el momento en que ocurría?",
    "¿Qué te resulta más difícil: reconocer, declarar o entregar?",
    "¿Qué te llevas a la semana 3?"
  ]} },

// ============ ETAPA 3 — OBSERVAR Y REDIRIGIR (días 15-21) ============
{ day:15, title:"Paso 5: Observar y recordar", resumen:"Esta semana añades observarte durante el día (no solo en la meditación) y usar una señal para redirigir la respuesta en el momento en que ocurre. Hoy defines esa señal.",
  blocks:["intencion","meditacion","journaling","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  meditacionExtra:"En la meditación de hoy, repasa mentalmente el patrón que llevas trabajando desde la semana 2 y decide una señal interna (una palabra, por ejemplo \"cambio\") para usar el resto del día, fuera de la meditación.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué señal (palabra o gesto) vas a usar esta semana para interrumpirte cuando aparezca el patrón?",
    "¿En qué momentos del día es más probable que aparezca?"
  ]},
  duranteeldia:{ instruccion:"Esto es lo que conecta la meditación de hoy con tu vida real: cada vez que notes el patrón fuera de la meditación, usa la señal que acabas de definir antes de reaccionar." },
  accion:{ titulo:"Paso 6: Redirigir", instruccion:"Cada vez que notes el patrón hoy, di internamente tu señal y elige conscientemente una respuesta distinta, aunque sea pequeña." } },

{ day:16, title:"Redirigir en una conversación", resumen:"Aplicas la señal de ayer a un tipo de situación concreto: una conversación.",
  blocks:["intencion","meditacion","journaling","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Cuántas veces notaste el patrón ayer, y en cuántas usaste la señal?",
    "¿En qué conversación de hoy es más probable que aparezca?"
  ]},
  duranteeldia:{ instruccion:"En esa conversación, antes de responder como sueles hacerlo, usa tu señal y deja pasar 2 segundos antes de hablar." },
  accion:{ titulo:"Redirigir", instruccion:"Aplica la señal específicamente en esa conversación cuando ocurra." } },

{ day:17, title:"Redirigir ante una emoción", resumen:"Ahora aplicas la misma señal, pero al notar la emoción antes que el pensamiento o la palabra.",
  blocks:["intencion","meditacion","journaling","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿La señal te está costando menos que el Día 15?",
    "¿Qué sensación física avisa, en tu cuerpo, de que el patrón está a punto de aparecer?"
  ]},
  duranteeldia:{ instruccion:"En cuanto notes esa sensación física de aviso, usa la señal antes de que llegue el pensamiento o la reacción completa." },
  accion:{ titulo:"Redirigir", instruccion:"Si hoy falla, anota qué pasó sin juzgarte — mañana es otra oportunidad." } },

{ day:18, title:"Redirigir bajo presión", resumen:"El patrón suele ganar cuando hay prisa o estrés. Hoy practicas la señal justo ahí.",
  blocks:["intencion","meditacion","journaling","tapping","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué ha cambiado en cómo reaccionas, aunque sea poco?",
    "¿En qué momento de prisa o estrés de hoy vas a poner especial atención?"
  ]},
  tapping:{ instruccion:"5-10 minutos de tapping sobre la situación de presión que más te cuesta redirigir.", pregunta:"¿Qué apareció durante el tapping?" },
  duranteeldia:{ instruccion:"En ese momento de prisa o estrés, aplica la señal aunque sea más difícil que en calma — es precisamente donde más cuenta." },
  accion:{ titulo:"Redirigir", instruccion:"Registra si conseguiste aplicarla incluso bajo presión." } },

{ day:19, title:"Redirigir sin que nadie lo note", resumen:"La señal ya no necesita ser visible para los demás — se vuelve un gesto interno.",
  blocks:["intencion","meditacion","journaling","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué le dirías a la versión de ti de hace 19 días sobre esta semana?",
    "¿Qué patrón nuevo (distinto al original) has notado en ti esta semana?"
  ]},
  duranteeldia:{ instruccion:"Hoy practica aplicar la señal de forma completamente interna, sin pausa visible ni gesto — solo el cambio de respuesta." },
  accion:{ titulo:"Redirigir", instruccion:"Anota si alguien notó el cambio sin que tú dijeras nada." } },

{ day:20, title:"Del esfuerzo a la costumbre", resumen:"Sexto día seguido de la misma práctica: empieza a comprobarse si la redirección se está volviendo más natural, con menos esfuerzo consciente.",
  blocks:["intencion","meditacion","journaling","duranteeldia","accion","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "En una palabra, ¿cómo describirías el esfuerzo de redirigir hoy comparado con el Día 15?",
    "¿Qué necesitarías para que se vuelva completamente automático?"
  ]},
  duranteeldia:{ instruccion:"Hoy no fuerces la señal: deja que aparezca sola cuando la necesites y solo anota si lo hizo." },
  accion:{ titulo:"Redirigir", instruccion:"Misma práctica, prestando atención a si te cuesta menos que al principio." } },

{ day:21, title:"Revisión — Pasos 5 y 6 integrados", resumen:"Cierre de la tercera semana antes de pasar a crear y ensayar.",
  blocks:["intencion","meditacion","journaling","cierre"],
  meditacionRef:"semana3-meditacion",
  journaling:{ instruccion:"Compara tu respuesta del Día 1 con hoy antes de escribir:", prompts:[
    "¿Qué pensabas el Día 1 sobre este patrón? ¿Qué piensas ahora?",
    "¿Qué haces diferente hoy que no hacías al empezar?",
    "¿Qué sigue costándote, y qué vas a hacer con eso en las próximas semanas?"
  ]} },

// ============ ETAPA 4 — CREAR Y ENSAYAR (días 22-30) ============
{ day:22, title:"Paso 7: definir la identidad futura", resumen:"Última etapa: crear conscientemente quién quieres ser y ensayarlo mentalmente. Empieza por definir esa identidad con claridad.",
  blocks:["intencion","meditacion","journaling","gratitud","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  meditacionExtra:"Tras la inducción, en vez de trabajar el patrón antiguo, dedica el resto de la sesión a imaginar en silencio a la persona que quieres ser — sin palabras, solo la sensación.",
  journaling:{ instruccion:"5-10 minutos. Antes de responder, relee lo que escribiste en Objetivos al empezar el programa:", prompts:[
    "Completa 5 veces: \"Soy una persona que...\" (conductas reales, no fantasías)",
    "¿Cuál de esas 5 frases es la más urgente de empezar a vivir?"
  ]},
  gratitud:{ instruccion:"Agradece por adelantado, como si ya fueras esa persona, una cosa concreta de tu día de hoy." },
  accion:{ titulo:"Acción de hoy", instruccion:"Actúa según la frase más urgente que has elegido, en una situación real de hoy." } },

{ day:23, title:"Ensayo mental de una situación", resumen:"El ensayo mental es imaginar con detalle cómo actuarías distinto en una situación concreta, antes de que ocurra.",
  blocks:["intencion","meditacion","journaling","visualizacion","gratitud","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "Elige una situación de los próximos días donde sueles reaccionar como el \"viejo yo\". Descríbela.",
    "¿Cómo reaccionaría la persona que definiste ayer?"
  ]},
  visualizacion:{ instruccion:"Cierra los ojos 3-5 minutos y repasa la situación paso a paso: cómo entras, qué dices, cómo te sientes, cómo actúas distinto. Hazlo despacio, con el mayor detalle posible." },
  gratitud:{ instruccion:"Agradece por adelantado como si esa situación ya hubiera salido bien." },
  accion:{ titulo:"Acción de hoy", instruccion:"Cuando llegue esa situación real, aplica lo ensayado." } },

{ day:24, title:"La emoción antes del resultado", resumen:"Dispenza insiste en sentir la emoción elevada (gratitud, por ejemplo) antes de que el resultado exista, como combustible del cambio.",
  blocks:["intencion","meditacion","journaling","gratitud","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  meditacionExtra:"Tras la inducción, elige una emoción elevada (gratitud, calma, ilusión) y quédate con ella 5 minutos, sin pensar en cómo conseguirla — solo sintiéndola.",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué emoción elevada eliges hoy para tu ensayo?",
    "¿En qué parte del cuerpo la notas cuando la sientes de verdad?"
  ]},
  gratitud:{ instruccion:"Agradece tres cosas de tu vida actual, sintiendo la emoción de verdad, no solo enumerando." },
  accion:{ titulo:"Acción de hoy", instruccion:"Elige una tarea de hoy y hazla sosteniendo esa emoción elevada, no la emoción con la que sueles hacerla." } },

{ day:25, title:"Ensayo mental de un día completo", resumen:"Ampliando el ensayo: en vez de una situación, un día entero de tu futuro.",
  blocks:["intencion","meditacion","journaling","visualizacion","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "Describe un día normal de tu vida dentro de unos meses: cómo piensas, cómo decides, qué toleras y qué ya no.",
    "¿Qué detalle de ese día es el más vivo para ti?"
  ]},
  visualizacion:{ instruccion:"Cierra los ojos 5 minutos y recorre ese día de principio a fin, con el mayor detalle sensorial posible (qué ves, qué oyes, cómo te sientes)." },
  accion:{ titulo:"Acción de hoy", instruccion:"Haz hoy una sola cosa que esa versión futura haría en un día normal." } },

{ day:26, title:"Dinero y oportunidades", resumen:"El ensayo mental también se aplica a decisiones concretas, no solo a estados internos.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Qué habilidad tuya podrías convertir en ingresos y aún no has explorado?",
    "¿Qué oportunidad tienes delante y no has mirado por miedo o por costumbre?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Da un paso concreto hacia esa oportunidad hoy: una búsqueda, un mensaje, una llamada." } },

{ day:27, title:"Integración de las prácticas", resumen:"Antes de cerrar el programa, repasa qué te ha sostenido realmente.",
  blocks:["intencion","meditacion","journaling","gratitud","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "De todo lo practicado (meditación, journaling, tapping, ensayo mental), ¿qué te está ayudando más a mantenerte centrada?",
    "¿Qué prácticas vas a dejar y cuáles quieres conservar?"
  ]},
  gratitud:{ instruccion:"Agradece algo del propio proceso de estos 27 días." } },

{ day:28, title:"Tu sistema de mantenimiento", resumen:"Elige, como máximo, 3 prácticas para sostener después del Día 30.",
  blocks:["intencion","meditacion","journaling","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5 minutos:", prompts:[
    "¿Cuáles son las 3 prácticas (de todas las de este programa) con las que te quedas?",
    "¿Con qué frecuencia realista vas a hacer cada una?"
  ]},
  accion:{ titulo:"Acción de hoy", instruccion:"Anota esas 3 prácticas en un lugar que vayas a ver después de terminar el programa." } },

{ day:29, title:"Plan de 90 días", resumen:"El ensayo mental de hoy se extiende más allá del programa: qué vas a construir en los próximos 3 meses.",
  blocks:["intencion","meditacion","journaling","visualizacion","accion","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"5-10 minutos. Relee tus objetivos del Día 1:", prompts:[
    "Completa: \"Durante los próximos 90 días voy a...\" (máximo 3 objetivos concretos)"
  ]},
  visualizacion:{ instruccion:"Cierra los ojos 5 minutos e imagina el resultado, el camino y los obstáculos probables de esos 90 días." },
  accion:{ titulo:"Acción de hoy", instruccion:"Define el primer paso concreto de esta semana para el primero de esos 3 objetivos." } },

{ day:30, title:"Cierre e informe final", resumen:"Último día. Revisa el camino completo antes de responder.",
  blocks:["intencion","meditacion","journaling","gratitud","cierre"],
  meditacionRef:"semana4-meditacion",
  journaling:{ instruccion:"Relee tus objetivos del Día 1 y tu revisión del Día 21 antes de escribir:", prompts:[
    "¿Qué hiciste en estos 30 días que antes no hacías?",
    "¿Qué pensamiento ha cambiado de verdad?",
    "¿Qué aprendiste sobre ti misma?",
    "¿Qué sigue frenándote, y qué vas a hacer con eso en los próximos 90 días?"
  ]},
  gratitud:{ instruccion:"Agradece el haber sostenido el programa hasta hoy, sea cual sea el resultado." } }
];
