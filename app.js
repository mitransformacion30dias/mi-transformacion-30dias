/* app.js — Mi Transformación
   Todo el estado vive en localStorage, en este dispositivo. Sin red, sin cuentas. */

const STORAGE_KEY = "mt_state_v2";
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const BLOCK_LABELS = {
  intencion: "Intención del día",
  meditacion: "Meditación",
  journaling: "Journaling",
  duranteeldia: "Durante el día",
  tapping: "Tapping",
  gratitud: "Gratitud",
  visualizacion: "Ensayo mental",
  accion: "Acción",
  cierre: "Cierre del día"
};

function todayISO() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

function defaultState() {
  return {
    currentDay: 1,
    startedAt: null,
    reminderTime: null,
    objetivos: { cambiar:"", crear:"", sentir:"", ser:"", resultado:"" },
    plan90: [],
    practices28: [],
    days: {},
    journalLog: [],
    bestStreak: 0
  };
}

function emptyDayRecord(day) {
  const d = dayData(day);
  const completedBlocks = {};
  (d ? d.blocks : []).forEach(b => { completedBlocks[b] = false; });
  return {
    completedBlocks,
    meditationDone: false,
    externalMeditation: false,
    journalAnswers: [],
    tappingNote: "",
    visualizacionDone: false,
    gratitudNote: "",
    actionDone: false,
    actionNote: "",
    mood: null,
    moodNote: "",
    dateCompleted: null,
    dateTouched: null
  };
}

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return Object.assign(defaultState(), parsed);
  } catch (e) {
    console.error("No se pudo leer el progreso guardado", e);
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("No se pudo guardar el progreso", e);
    toast("No se pudo guardar. Comprueba el espacio disponible en el dispositivo.");
  }
}

function getDayRecord(day) {
  const key = String(day);
  if (!state.days[key]) state.days[key] = emptyDayRecord(day);
  // por si el día ya existía de una versión anterior con otros bloques
  const d = dayData(day);
  if (d) {
    d.blocks.forEach(b => {
      if (!(b in state.days[key].completedBlocks)) state.days[key].completedBlocks[b] = false;
    });
  }
  return state.days[key];
}

function dayData(day) {
  return DAYS.find(d => d.day === day);
}

function touchDay(day) {
  const rec = getDayRecord(day);
  if (!rec.dateTouched) rec.dateTouched = todayISO();
  if (!state.startedAt) state.startedAt = todayISO();
  saveState();
}

/* ---------- Progreso y rachas ---------- */

function completedDaysCount() {
  return Object.values(state.days).filter(d => d.dateCompleted).length;
}

function computeStreaks() {
  const completedDates = Object.values(state.days)
    .filter(d => d.dateCompleted)
    .map(d => d.dateCompleted)
    .sort();
  if (completedDates.length === 0) return { current: 0, best: state.bestStreak || 0 };

  const dateSet = new Set(completedDates);
  let current = 0;
  let cursor = new Date();
  cursor.setHours(0,0,0,0);
  if (!dateSet.has(todayISO())) cursor.setDate(cursor.getDate() - 1);
  while (dateSet.has(cursor.toISOString().slice(0,10))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  let best = 0, run = 0, prev = null;
  for (const iso of completedDates) {
    if (prev) {
      const p = new Date(prev), c = new Date(iso);
      const diffDays = Math.round((c - p) / 86400000);
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = iso;
  }
  best = Math.max(best, current, state.bestStreak || 0);
  state.bestStreak = best;
  return { current, best };
}

function totalMeditationsDone() {
  return Object.values(state.days).filter(d => d.meditationDone).length;
}
function totalActions() {
  return Object.values(state.days).filter(d => d.actionDone).length;
}
function totalTappingSessions() {
  return Object.values(state.days).filter(d => d.tappingNote && d.tappingNote.trim().length > 0).length;
}
function totalJournalDays() {
  return Object.values(state.days).filter(d => d.journalAnswers && d.journalAnswers.some(a => a && a.trim().length > 0)).length;
}
function averageMood() {
  const moods = Object.values(state.days).map(d => d.mood).filter(Boolean);
  if (moods.length === 0) return null;
  const order = { muydificil:1, dificil:2, normal:3, bien:4, muybien:5 };
  const avg = moods.reduce((s,m) => s + order[m], 0) / moods.length;
  const nearest = MOODS.reduce((best, m) => {
    const d = Math.abs(order[m.key] - avg);
    return d < best.d ? { key: m.key, d } : best;
  }, { key: "normal", d: Infinity });
  return MOODS.find(m => m.key === nearest.key);
}

/* ---------- Navegación (con historial real) ---------- */

let currentScreen = "hoy";
let activeDayForToday = 1;
let openBlockKey = null;
let viewDayNumber = null;

function pickActiveDay() {
  for (const d of DAYS) {
    const rec = state.days[String(d.day)];
    if (!rec || !rec.dateCompleted) return d.day;
  }
  return 30;
}

function navState() { return { screen: currentScreen, block: openBlockKey, viewDay: viewDayNumber }; }

function applyNavState(s) {
  currentScreen = (s && s.screen) || "hoy";
  openBlockKey = (s && s.block) || null;
  viewDayNumber = (s && s.viewDay) || null;
}

function navigate(patch) {
  const current = navState();
  const next = Object.assign({}, current, patch);
  if (patch.screen && patch.screen !== current.screen) {
    if (patch.block === undefined) next.block = null;
    if (patch.viewDay === undefined) next.viewDay = null;
  }
  applyNavState(next);
  render();
  window.scrollTo(0,0);
  history.pushState(next, "", location.href);
}

function syncHistory() { history.replaceState(navState(), "", location.href); }

function updateScreenClasses() {
  $$(".screen").forEach(s => s.classList.remove("active"));
  $(`#screen-${currentScreen}`)?.classList.add("active");
  $$(".navitem").forEach(b => b.classList.toggle("active", b.dataset.screen === currentScreen));
}

function setScreen(name) { navigate({ screen: name }); }

window.addEventListener("popstate", (e) => {
  applyNavState(e.state || { screen: "hoy", block: null, viewDay: null });
  render();
  window.scrollTo(0,0);
});

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Render principal ---------- */

function render() {
  updateScreenClasses();
  if (currentScreen === "hoy") {
    if (viewDayNumber) renderDiaLectura(viewDayNumber); else renderHoy();
  }
  if (currentScreen === "progreso") renderProgreso();
  if (currentScreen === "diario") renderDiario();
  if (currentScreen === "objetivos") renderObjetivos();
  if (currentScreen === "mas") renderMas();
  if (currentScreen === "programa") renderPrograma();
}

/* ---------- Pantalla HOY ---------- */

function renderHoy() {
  activeDayForToday = pickActiveDay();
  const d = dayData(activeDayForToday);
  const rec = getDayRecord(activeDayForToday);
  const root = $("#screen-hoy");

  const pct = Math.round((completedDaysCount() / 30) * 100);
  const streaks = computeStreaks();
  const week = weekOf(d.day);

  const totalBlocks = d.blocks.length;
  const doneBlocks = d.blocks.filter(b => rec.completedBlocks[b]).length;
  const allDone = doneBlocks === totalBlocks;

  root.innerHTML = `
    <header class="hoy-header">
      <div class="brand">MI TRANSFORMACIÓN</div>
      <div class="daycount">Día ${d.day} de 30</div>
      <div class="progressbar"><div class="progressbar-fill" style="width:${pct}%"></div></div>
      <div class="streakline">Racha actual: ${streaks.current} día${streaks.current===1?"":"s"}</div>
    </header>

    <section class="today-card">
      <div class="weektag">Semana ${week.n} · ${week.title} <span class="weeksub">(${week.subtitle})</span></div>
      <h1 class="daytitle">${d.title}</h1>
      <p class="daymeta">${d.resumen}</p>
      ${!blocksAnyStarted(rec) ? `<button class="btn-primary" id="btn-empezar-dia">EMPEZAR MI DÍA</button>` : ""}
    </section>

    <section class="blocklist">
      ${d.blocks.map(b => renderBlockRow(b, rec)).join("")}
    </section>

    ${allDone ? `<div class="daydone">Día completado. Mañana continuamos.</div>` : ""}

    ${openBlockKey ? `<button class="btn-back" id="close-block">‹ Atrás</button>` : ""}
    <div id="block-detail" class="block-detail"></div>
  `;

  $("#btn-empezar-dia")?.addEventListener("click", () => openBlock(d.blocks[0]));
  $$(".blockrow").forEach(row => row.addEventListener("click", () => openBlock(row.dataset.block)));
  $("#close-block")?.addEventListener("click", () => history.back());

  if (openBlockKey) renderBlockDetail(openBlockKey, d, rec);
}

function blocksAnyStarted(rec) {
  return Object.values(rec.completedBlocks).some(Boolean) || rec.meditationDone ||
    (rec.journalAnswers && rec.journalAnswers.some(a => a && a.trim())) || rec.tappingNote || rec.actionDone;
}

function renderBlockRow(key, rec) {
  const done = rec.completedBlocks[key];
  return `
    <button class="blockrow ${done?'done':''}" data-block="${key}">
      <span class="check">${done ? "☑" : "☐"}</span>
      <span class="blocklabel">${BLOCK_LABELS[key]}</span>
      <span class="chev">›</span>
    </button>
  `;
}

function openBlock(key) {
  if (openBlockKey === key) {
    history.back();
  } else {
    navigate({ block: key });
    setTimeout(() => $("#block-detail")?.scrollIntoView({ behavior:"smooth", block:"start" }), 30);
  }
}

function markBlockDone(key, day) {
  const rec = getDayRecord(day);
  rec.completedBlocks[key] = true;
  touchDay(day);
  const d = dayData(day);
  const allDone = d.blocks.every(b => rec.completedBlocks[b]);
  if (key === "cierre" || allDone) {
    rec.dateCompleted = todayISO();
    saveState();
    openBlockKey = null;
    syncHistory();
    render();
    toast("Día completado. Mañana continuamos.");
    return;
  }
  saveState();
  render();
}

function renderBlockDetail(key, d, rec) {
  const host = $("#block-detail");
  if (key === "intencion") {
    host.innerHTML = `
      <div class="detail-panel">
        <h2>Intención del día</h2>
        <p class="detail-sub">${d.title}</p>
        <p>${d.resumen}</p>
        <button class="btn-secondary" data-done="intencion">Marcar como leído</button>
      </div>`;
  } else if (key === "meditacion") renderMeditacion(host, d, rec);
  else if (key === "journaling") renderJournaling(host, d, rec);
  else if (key === "duranteeldia") renderDuranteElDia(host, d, rec);
  else if (key === "tapping") renderTapping(host, d, rec);
  else if (key === "gratitud") renderGratitud(host, d, rec);
  else if (key === "visualizacion") renderVisualizacion(host, d, rec);
  else if (key === "accion") renderAccion(host, d, rec);
  else if (key === "cierre") renderCierre(host, d, rec);

  $$("[data-done]", host).forEach(btn => btn.addEventListener("click", () => markBlockDone(btn.dataset.done, d.day)));
}

/* ---------- Meditación: recurso real + enlace externo, sin reproductor propio ---------- */

function renderMeditacion(host, d, rec) {
  const res = RESOURCES[d.meditacionRef];
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Meditación</h2>
      <div class="resource-card">
        <div class="resource-name">${res.nombre}</div>
        <div class="resource-row"><span class="resource-label">Autor</span><span>${res.autor}</span></div>
        <div class="resource-row"><span class="resource-label">Tipo</span><span class="resource-tag ${res.tipo}">${res.tipoLabel}</span></div>
        <div class="resource-row"><span class="resource-label">Idioma</span><span>${res.idioma}</span></div>
        <div class="resource-row"><span class="resource-label">Duración</span><span>${res.duracion}</span></div>
        <div class="resource-row"><span class="resource-label">Contenido</span><span>${res.alcance}</span></div>
        <p class="resource-objetivo">${res.objetivo}</p>
        ${res.urlNota ? `<p class="note-small resource-url-note">${res.urlNota}</p>` : ""}
        <a class="btn-primary resource-link" href="${res.url}" target="_blank" rel="noopener">INICIAR MEDITACIÓN</a>
      </div>
      ${d.meditacionExtra ? `<div class="meditacion-extra"><p class="detail-sub">Durante o después de la grabación:</p><p>${escapeHtml(d.meditacionExtra)}</p></div>` : ""}
      <p class="note-small"><a href="${RESOURCES["oficial-playlist"].url}" target="_blank" rel="noopener">Prefiero la meditación oficial gratuita de Joe Dispenza (en inglés) →</a></p>
      <button class="btn-secondary" data-done="meditacion" id="med-done-btn">Ya he practicado</button>
      ${rec.completedBlocks.meditacion ? `<p class="confirm-msg">Práctica registrada.</p>` : ""}
    </div>
  `;
  $("#med-done-btn").addEventListener("click", () => { rec.meditationDone = true; });
}

/* ---------- Durante el día (etapa 3: conecta meditación con vida real) ---------- */

function renderDuranteElDia(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Durante el día</h2>
      <p class="detail-sub">Esto es lo que haces fuera de la meditación, con lo trabajado hoy sentada.</p>
      <p>${d.duranteeldia.instruccion}</p>
      <button class="btn-secondary" data-done="duranteeldia">Marcar como leído</button>
      ${rec.completedBlocks.duranteeldia ? `<p class="confirm-msg">Registrado.</p>` : ""}
    </div>
  `;
}

/* ---------- Journaling ---------- */

function renderJournaling(host, d, rec) {
  if (!rec.journalAnswers || rec.journalAnswers.length !== d.journaling.prompts.length) {
    rec.journalAnswers = d.journaling.prompts.map((_, i) => rec.journalAnswers?.[i] || "");
  }
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Journaling</h2>
      <p class="detail-sub">${d.journaling.instruccion}</p>
      ${d.journaling.prompts.map((p, i) => `
        <label class="field-label">${p}</label>
        <textarea class="field-textarea" data-idx="${i}" rows="3">${escapeHtml(rec.journalAnswers[i] || "")}</textarea>
      `).join("")}
      <button class="btn-primary" id="save-journal">GUARDAR MI REFLEXIÓN</button>
      ${rec.completedBlocks.journaling ? `<p class="confirm-msg">Reflexión guardada.</p>` : ""}
    </div>
  `;
  $("#save-journal").addEventListener("click", () => {
    $$(".field-textarea", host).forEach(ta => { rec.journalAnswers[Number(ta.dataset.idx)] = ta.value; });
    rec.completedBlocks.journaling = true;
    updateJournalLog(d, rec);
    touchDay(d.day);
    saveState();
    render();
    toast("Reflexión guardada.");
  });
}

function updateJournalLog(d, rec) {
  const entry = { day: d.day, title: d.title, date: rec.dateTouched || todayISO(), answers: d.journaling.prompts.map((p,i) => ({ prompt:p, answer: rec.journalAnswers[i] || "" })) };
  const idx = state.journalLog.findIndex(e => e.day === d.day);
  if (idx >= 0) state.journalLog[idx] = entry; else state.journalLog.push(entry);
}

/* ---------- Tapping (complementario) ---------- */

function renderTapping(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Tapping</h2>
      <p class="note-small">Complementario — no es parte del método de Joe Dispenza. Usa tu secuencia habitual de puntos EFT.</p>
      <p class="detail-sub">${d.tapping.instruccion}</p>
      <label class="field-label">${d.tapping.pregunta}</label>
      <textarea class="field-textarea" id="tapping-note" rows="3">${escapeHtml(rec.tappingNote || "")}</textarea>
      <button class="btn-primary" id="save-tapping">GUARDAR</button>
      ${rec.completedBlocks.tapping ? `<p class="confirm-msg">Guardado.</p>` : ""}
    </div>
  `;
  $("#save-tapping").addEventListener("click", () => {
    rec.tappingNote = $("#tapping-note").value;
    rec.completedBlocks.tapping = true;
    touchDay(d.day);
    saveState();
    render();
    toast("Guardado.");
  });
}

/* ---------- Gratitud ---------- */

function renderGratitud(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Gratitud</h2>
      <p class="detail-sub">${d.gratitud.instruccion}</p>
      <textarea class="field-textarea" id="gratitud-note" rows="3">${escapeHtml(rec.gratitudNote || "")}</textarea>
      <button class="btn-primary" data-done="gratitud" id="save-gratitud">GUARDAR</button>
      ${rec.completedBlocks.gratitud ? `<p class="confirm-msg">Guardado.</p>` : ""}
    </div>
  `;
  $("#save-gratitud").addEventListener("click", () => { rec.gratitudNote = $("#gratitud-note").value; });
}

/* ---------- Visualización / ensayo mental ---------- */

function renderVisualizacion(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Ensayo mental</h2>
      <p class="detail-sub">${d.visualizacion.instruccion}</p>
      ${!rec.visualizacionDone ? `<button class="btn-primary" id="viz-done-btn">HECHO</button>` : `<p class="confirm-msg">Práctica registrada.</p>`}
    </div>
  `;
  $("#viz-done-btn")?.addEventListener("click", () => {
    rec.visualizacionDone = true;
    rec.completedBlocks.visualizacion = true;
    touchDay(d.day);
    saveState();
    render();
  });
}

/* ---------- Acción ---------- */

function renderAccion(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Acción</h2>
      <h3 class="action-title">${d.accion.titulo}</h3>
      <p>${d.accion.instruccion}</p>
      ${!rec.actionDone ? `<button class="btn-primary" id="mark-action-done">HECHO</button>` : `
        <label class="field-label">¿Qué ocurrió?</label>
        <textarea class="field-textarea" id="action-note" rows="3">${escapeHtml(rec.actionNote || "")}</textarea>
        <button class="btn-secondary" id="save-action-note">GUARDAR</button>
      `}
    </div>
  `;
  $("#mark-action-done")?.addEventListener("click", () => {
    rec.actionDone = true;
    rec.completedBlocks.accion = true;
    touchDay(d.day);
    saveState();
    render();
  });
  $("#save-action-note")?.addEventListener("click", () => {
    rec.actionNote = $("#action-note").value;
    touchDay(d.day);
    saveState();
    render();
    toast("Guardado.");
  });
}

/* ---------- Cierre ---------- */

function renderCierre(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Cierre del día</h2>
      <p>¿Cómo te fue hoy?</p>
      <div class="mood-row">
        ${MOODS.map(m => `<button class="mood-btn ${rec.mood===m.key?'selected':''}" data-mood="${m.key}">
            <span class="mood-emoji">${m.emoji}</span><span class="mood-label">${m.label}</span>
          </button>`).join("")}
      </div>
      <label class="field-label">¿Qué influyó más en cómo te sentiste? (opcional)</label>
      <textarea class="field-textarea" id="mood-note" rows="2">${escapeHtml(rec.moodNote || "")}</textarea>
      <button class="btn-primary" data-done="cierre" id="close-day-btn">CERRAR EL DÍA</button>
    </div>
  `;
  $$(".mood-btn", host).forEach(btn => btn.addEventListener("click", () => { rec.mood = btn.dataset.mood; saveState(); render(); }));
  $("#close-day-btn").addEventListener("click", () => { rec.moodNote = $("#mood-note").value; saveState(); });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ---------- Progreso ---------- */

function renderProgreso() {
  const root = $("#screen-progreso");
  const pct = Math.round((completedDaysCount() / 30) * 100);
  const streaks = computeStreaks();
  const mood = averageMood();
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="atras-progreso">‹ Atrás</button><h1>Progreso</h1></header>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${pct}%</div><div class="stat-label">Programa completado</div></div>
      <div class="stat-card"><div class="stat-value">${completedDaysCount()}</div><div class="stat-label">Días completados</div></div>
      <div class="stat-card"><div class="stat-value">${streaks.current}</div><div class="stat-label">Racha actual</div></div>
      <div class="stat-card"><div class="stat-value">${streaks.best}</div><div class="stat-label">Mayor racha</div></div>
      <div class="stat-card"><div class="stat-value">${totalMeditationsDone()}</div><div class="stat-label">Meditaciones realizadas</div></div>
      <div class="stat-card"><div class="stat-value">${totalActions()}</div><div class="stat-label">Acciones completadas</div></div>
      <div class="stat-card"><div class="stat-value">${totalTappingSessions()}</div><div class="stat-label">Sesiones de tapping</div></div>
      <div class="stat-card"><div class="stat-value">${totalJournalDays()}</div><div class="stat-label">Días de journaling</div></div>
    </div>
    <div class="mood-summary">
      <div class="stat-label">Estado emocional promedio</div>
      <div class="mood-avg">${mood ? mood.emoji + " " + mood.label : "Aún sin datos"}</div>
    </div>
    <p class="note-small">Estos datos son descriptivos, no diagnósticos.</p>
    <button class="btn-secondary" id="ver-programa">Ver programa completo</button>
  `;
  $("#atras-progreso").addEventListener("click", () => history.back());
  $("#ver-programa").addEventListener("click", () => navigate({ screen: "programa" }));
}

function renderPrograma() {
  const root = $("#screen-programa");
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="back-progreso">‹ Progreso</button><h1>Programa completo</h1></header>
    <div class="program-list">
      ${WEEKS.map(w => `
        <div class="week-block">
          <div class="week-heading">Semana ${w.n} · ${w.title} <span class="weeksub">(${w.subtitle})</span></div>
          ${DAYS.filter(d => d.day >= w.range[0] && d.day <= w.range[1]).map(d => {
            const rec = state.days[String(d.day)];
            const done = rec && rec.dateCompleted;
            return `<button class="program-day ${done?'done':''}" data-day="${d.day}">
              <span class="check">${done?"☑":"☐"}</span>
              <span>Día ${d.day} — ${d.title}</span>
            </button>`;
          }).join("")}
        </div>
      `).join("")}
    </div>
  `;
  $("#back-progreso").addEventListener("click", () => history.back());
  $$(".program-day", root).forEach(btn => {
    btn.addEventListener("click", () => {
      const day = Number(btn.dataset.day);
      navigate({ screen: "hoy", viewDay: day, block: null });
    });
  });
}

function renderDiaLectura(day) {
  const d = dayData(day);
  const rec = getDayRecord(day);
  const root = $("#screen-hoy");
  const journalHtml = d.blocks.includes("journaling") ? `
      <h2>Journaling</h2>
      ${d.journaling.prompts.map((p,i) => `<label class="field-label">${p}</label><p class="readonly-answer">${escapeHtml(rec.journalAnswers?.[i] || "—")}</p>`).join("")}` : "";
  const tappingHtml = d.blocks.includes("tapping") ? `
      <h2>Tapping</h2>
      <p class="readonly-answer">${escapeHtml(rec.tappingNote || "—")}</p>` : "";
  const accionHtml = d.blocks.includes("accion") ? `
      <h2>Acción</h2>
      <p><strong>${d.accion.titulo}</strong></p>
      <p class="readonly-answer">${escapeHtml(rec.actionNote || (rec.actionDone ? "Hecho." : "—"))}</p>` : "";
  root.innerHTML = `
    <header class="hoy-header">
      <button class="btn-back" id="back-from-day">‹ Volver</button>
      <div class="daycount">Día ${d.day} de 30</div>
    </header>
    <section class="today-card">
      <div class="weektag">Semana ${weekOf(d.day).n} · ${weekOf(d.day).title}</div>
      <h1 class="daytitle">${d.title}</h1>
      <p class="daymeta">${d.resumen}</p>
    </section>
    <div class="detail-panel">${journalHtml}${tappingHtml}${accionHtml}</div>
  `;
  $("#back-from-day").addEventListener("click", () => history.back());
}

/* ---------- Diario ---------- */

function renderDiario() {
  const root = $("#screen-diario");
  const entries = [...state.journalLog].sort((a,b) => b.day - a.day);
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="atras-diario">‹ Atrás</button><h1>Diario</h1></header>
    ${entries.length === 0 ? `<p class="empty-msg">Todavía no hay reflexiones guardadas.</p>` : `
      <div class="journal-list">
        ${entries.map(e => `
          <div class="journal-entry">
            <div class="journal-meta">Día ${e.day} · ${e.date}</div>
            <div class="journal-title">${e.title}</div>
            ${e.answers.filter(a => a.answer && a.answer.trim()).map(a => `
              <p class="journal-q">${a.prompt}</p>
              <p class="journal-a">${escapeHtml(a.answer)}</p>
            `).join("")}
          </div>
        `).join("")}
      </div>
    `}
  `;
  $("#atras-diario").addEventListener("click", () => history.back());
}

/* ---------- Objetivos ---------- */

const OBJETIVO_FIELDS = [
  { key:"cambiar", label:"¿Qué quiero cambiar?" },
  { key:"crear", label:"¿Qué quiero crear?" },
  { key:"sentir", label:"¿Cómo quiero sentirme?" },
  { key:"ser", label:"¿Qué tipo de persona quiero ser?" },
  { key:"resultado", label:"¿Qué resultado concreto quiero conseguir en los próximos meses?" }
];

function renderObjetivos() {
  const root = $("#screen-objetivos");
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="atras-objetivos">‹ Atrás</button><h1>Objetivos</h1></header>
    <p class="note-small">Defínelos al empezar el programa. La aplicación te los recordará en los días que trabajan el futuro y la nueva identidad (a partir de la semana 4).</p>
    <div class="detail-panel">
      ${OBJETIVO_FIELDS.map(f => `
        <label class="field-label">${f.label}</label>
        <textarea class="field-textarea objetivo-field" data-key="${f.key}" rows="2">${escapeHtml(state.objetivos[f.key] || "")}</textarea>
      `).join("")}
      <button class="btn-primary" id="save-objetivos">GUARDAR OBJETIVOS</button>
    </div>
  `;
  $("#atras-objetivos").addEventListener("click", () => history.back());
  $("#save-objetivos").addEventListener("click", () => {
    $$(".objetivo-field", root).forEach(ta => { state.objetivos[ta.dataset.key] = ta.value; });
    saveState();
    toast("Objetivos guardados.");
  });
}

/* ---------- Más ---------- */

function renderMas() {
  const root = $("#screen-mas");
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="atras-mas">‹ Atrás</button><h1>Más</h1></header>

    <section class="more-section">
      <h2>Hora preferida de práctica</h2>
      <input type="time" id="reminder-time" value="${state.reminderTime || ""}">
      <p class="note-small">Se muestra dentro de la aplicación como recordatorio visual.</p>
    </section>

    <section class="more-section">
      <h2>Exportar</h2>
      <button class="btn-secondary" id="export-progress">EXPORTAR MI PROGRESO (JSON)</button>
      <button class="btn-secondary" id="export-journal">EXPORTAR MI DIARIO (texto)</button>
    </section>

    <section class="more-section">
      <h2>Reiniciar</h2>
      <button class="btn-ghost danger" id="reset-program">Comenzar nuevamente</button>
    </section>

    <section class="more-section">
      <h2>Sobre el contenido</h2>
      <p class="note-small">La estructura de las 4 etapas está basada en el proceso de 7 pasos del libro "Deja de ser tú" de Joe Dispenza (resumido con palabras propias). La meditación de audio de cada semana es de un canal en español inspirado en ese libro — no son grabaciones oficiales de Joe Dispenza. El tapping es un complemento ajeno a su método. Puedes ver el detalle completo de las fuentes al principio del archivo data.js de esta app.</p>
    </section>

    <section class="more-section">
      <h2>Después de los 30 días</h2>
      <p class="note-small">Si quieres continuar, Joe Dispenza suele recomendar seguir con estas meditaciones oficiales suyas (productos de pago, no verificados con enlace gratuito aquí — solo el nombre para que las busques si te interesa):</p>
      <ul class="continuity-list">
        <li>You Are the Placebo — Meditation #1</li>
        <li>The Generous Present Moment</li>
        <li>Blessing of the Energy Centers I</li>
        <li>Tuning in to New Potentials</li>
        <li>Reconditioning the Body to a New Mind</li>
        <li>Changing Beliefs and Perceptions</li>
      </ul>
    </section>

    <section class="more-section">
      <h2>Privacidad</h2>
      <p>Tu información se guarda únicamente en este dispositivo. No se usan trackers, publicidad, cuentas ni cookies innecesarias.</p>
    </section>

    <section class="more-section">
      <p class="note-small">Este programa es una herramienta personal de reflexión, meditación, hábitos y desarrollo personal. No constituye atención médica, psicológica o financiera profesional.</p>
    </section>
  `;

  $("#atras-mas").addEventListener("click", () => history.back());
  $("#reminder-time").addEventListener("change", (e) => { state.reminderTime = e.target.value; saveState(); toast("Hora guardada."); });
  $("#export-progress").addEventListener("click", exportProgressJSON);
  $("#export-journal").addEventListener("click", exportJournalText);
  $("#reset-program").addEventListener("click", confirmReset);
}

function exportProgressJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, `mi-transformacion-progreso-${todayISO()}.json`);
}

function exportJournalText() {
  const lines = ["MI TRANSFORMACIÓN — DIARIO", ""];
  const entries = [...state.journalLog].sort((a,b) => a.day - b.day);
  entries.forEach(e => {
    lines.push(`Día ${e.day} — ${e.title} (${e.date})`);
    e.answers.forEach(a => {
      if (a.answer && a.answer.trim()) { lines.push(`P: ${a.prompt}`); lines.push(`R: ${a.answer}`); }
    });
    lines.push("");
  });
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  downloadBlob(blob, `mi-transformacion-diario-${todayISO()}.txt`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let resetStep = 0;
function confirmReset() {
  if (resetStep === 0) {
    resetStep = 1;
    toast("Pulsa de nuevo para confirmar. Esto eliminará el progreso actual.");
    setTimeout(() => { resetStep = 0; }, 5000);
    return;
  }
  exportProgressJSON();
  state = defaultState();
  saveState();
  resetStep = 0;
  openBlockKey = null;
  setScreen("hoy");
  toast("Progreso reiniciado. Se ha descargado una copia de seguridad.");
}

/* ---------- Init ---------- */

function init() {
  $$(".navitem").forEach(btn => btn.addEventListener("click", () => setScreen(btn.dataset.screen)));
  applyNavState({ screen: "hoy", block: null, viewDay: null });
  render();
  history.replaceState(navState(), "", location.href);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(err => console.error("SW no registrado", err));
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
