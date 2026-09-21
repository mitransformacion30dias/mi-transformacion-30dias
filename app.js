/* app.js — Mi Transformación
   Todo el estado vive en localStorage, en este dispositivo. Sin red, sin cuentas. */

const STORAGE_KEY = "mt_state_v1";
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

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
    goals: [],          // {id, name, desc, why, nextAction, status, notes}
    plan90: [],          // strings, max 3
    practices28: [],      // strings, max 3
    days: {},            // per-day record, keyed by day number as string
    journalLog: [],       // flattened list for the DIARIO screen: {day, date, answers[]}
    bestStreak: 0
  };
}

function emptyDayRecord() {
  return {
    completedBlocks: { intencion:false, meditacion:false, journaling:false, tapping:false, accion:false, cierre:false },
    meditationSeconds: 0,
    meditationDone: false,
    externalMeditation: false,
    journalAnswers: [],
    tappingNote: "",
    actionDone: false,
    actionNote: "",
    mood: null,
    moodNote: "",
    dateCompleted: null,   // ISO date when the day block "cierre" was completed
    dateTouched: null      // ISO date of first interaction, for streak/history
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
  if (!state.days[key]) state.days[key] = emptyDayRecord();
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
  // racha actual: días consecutivos (por fecha de calendario) con cierre completado,
  // contando hacia atrás desde hoy o ayer.
  const completedDates = Object.values(state.days)
    .filter(d => d.dateCompleted)
    .map(d => d.dateCompleted)
    .sort();
  if (completedDates.length === 0) return { current: 0, best: state.bestStreak || 0 };

  const dateSet = new Set(completedDates);
  let current = 0;
  let cursor = new Date();
  cursor.setHours(0,0,0,0);
  // si hoy no está completado, empezamos a contar desde ayer
  if (!dateSet.has(todayISO())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (dateSet.has(cursor.toISOString().slice(0,10))) {
    current++;
    cursor.setDate(cursor.getDate() - 1);
  }

  // mejor racha histórica: recorrer fechas ordenadas
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

function totalMeditationMinutes() {
  const secs = Object.values(state.days).reduce((sum, d) => sum + (d.meditationSeconds || 0), 0);
  return Math.round(secs / 60);
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

/* ---------- Navegación ---------- */

let currentScreen = "hoy";
let activeDayForToday = 1;

function pickActiveDay() {
  // el día activo es el primer día del programa que aún no tiene cierre completado
  for (const d of DAYS) {
    const rec = state.days[String(d.day)];
    if (!rec || !rec.dateCompleted) return d.day;
  }
  return 30;
}

function setScreen(name) {
  currentScreen = name;
  $$(".screen").forEach(s => s.classList.remove("active"));
  $(`#screen-${name}`).classList.add("active");
  $$(".navitem").forEach(b => b.classList.toggle("active", b.dataset.screen === name));
  render();
  window.scrollTo(0,0);
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------- Render: pantalla HOY ---------- */

function render() {
  if (currentScreen === "hoy") renderHoy();
  if (currentScreen === "progreso") renderProgreso();
  if (currentScreen === "diario") renderDiario();
  if (currentScreen === "objetivos") renderObjetivos();
  if (currentScreen === "mas") renderMas();
  if (currentScreen === "programa") renderPrograma();
}

function renderHoy() {
  activeDayForToday = pickActiveDay();
  const d = dayData(activeDayForToday);
  const rec = getDayRecord(activeDayForToday);
  const root = $("#screen-hoy");

  const pct = Math.round((completedDaysCount() / 30) * 100);
  const streaks = computeStreaks();
  const week = weekOf(d.day);

  const blocksDone = Object.values(rec.completedBlocks).filter(Boolean).length;
  const allDone = blocksDone === 6;

  root.innerHTML = `
    <header class="hoy-header">
      <div class="brand">MI TRANSFORMACIÓN</div>
      <div class="daycount">Día ${d.day} de 30</div>
      <div class="progressbar"><div class="progressbar-fill" style="width:${pct}%"></div></div>
      <div class="streakline">Racha actual: ${streaks.current} día${streaks.current===1?"":"s"}</div>
    </header>

    <section class="today-card">
      <div class="weektag">Semana ${week.n} · ${week.title}</div>
      <h1 class="daytitle">${d.title}</h1>
      <p class="daymeta">Meditación sugerida: ${d.meditationLabel}</p>
      ${!blocksAnyStarted(rec) ? `<button class="btn-primary" id="btn-empezar-dia">EMPEZAR MI DÍA</button>` : ""}
    </section>

    <section class="blocklist">
      ${renderBlockRow("intencion", "Intención del día", rec, activeDayForToday)}
      ${renderBlockRow("meditacion", "Meditación", rec, activeDayForToday)}
      ${renderBlockRow("journaling", "Journaling", rec, activeDayForToday)}
      ${renderBlockRow("tapping", "Tapping", rec, activeDayForToday)}
      ${renderBlockRow("accion", "Acción", rec, activeDayForToday)}
      ${renderBlockRow("cierre", "Cierre del día", rec, activeDayForToday)}
    </section>

    ${allDone ? `<div class="daydone">Día completado. Mañana continuamos.</div>` : ""}

    <div id="block-detail" class="block-detail"></div>
  `;

  $("#btn-empezar-dia")?.addEventListener("click", () => openBlock("intencion"));
  $$(".blockrow").forEach(row => {
    row.addEventListener("click", () => openBlock(row.dataset.block));
  });

  if (openBlockKey) renderBlockDetail(openBlockKey, d, rec);
}

function blocksAnyStarted(rec) {
  return Object.values(rec.completedBlocks).some(Boolean) || rec.meditationSeconds > 0 ||
    (rec.journalAnswers && rec.journalAnswers.some(a => a && a.trim())) || rec.tappingNote || rec.actionDone;
}

function renderBlockRow(key, label, rec, day) {
  const done = rec.completedBlocks[key];
  const disabled = key !== "intencion" && key !== "cierre" ? "" : "";
  return `
    <button class="blockrow ${done?'done':''}" data-block="${key}">
      <span class="check">${done ? "☑" : "☐"}</span>
      <span class="blocklabel">${label}</span>
      <span class="chev">›</span>
    </button>
  `;
}

let openBlockKey = null;

function openBlock(key) {
  openBlockKey = openBlockKey === key ? null : key;
  render();
  if (openBlockKey) {
    setTimeout(() => $("#block-detail")?.scrollIntoView({ behavior:"smooth", block:"start" }), 30);
  }
}

function markBlockDone(key, day) {
  const rec = getDayRecord(day);
  rec.completedBlocks[key] = true;
  touchDay(day);
  if (key === "cierre") {
    rec.dateCompleted = todayISO();
    saveState();
    openBlockKey = null;
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
        <p>Hoy dedica tu práctica a esto. No necesitas hacer nada más que lo que aparece en las siguientes secciones.</p>
        <button class="btn-secondary" data-done="intencion">Marcar como leído</button>
      </div>`;
  } else if (key === "meditacion") {
    renderMeditacion(host, d, rec);
  } else if (key === "journaling") {
    renderJournaling(host, d, rec);
  } else if (key === "tapping") {
    renderTapping(host, d, rec);
  } else if (key === "accion") {
    renderAccion(host, d, rec);
  } else if (key === "cierre") {
    renderCierre(host, d, rec);
  }
  $$("[data-done]", host).forEach(btn => {
    btn.addEventListener("click", () => markBlockDone(btn.dataset.done, d.day));
  });
}

/* ---------- Meditación ---------- */

let timerInterval = null;
let timerSeconds = 0;
let timerRunning = false;

function renderMeditacion(host, d, rec) {
  const totalDefault = d.meditationMin * 60;
  if (timerSeconds === 0 && !rec.meditationDone) timerSeconds = totalDefault;
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Meditación</h2>
      <p class="detail-sub">Duración sugerida: ${d.meditationLabel}</p>
      <div class="timer-display" id="timer-display">${formatTime(timerSeconds)}</div>
      <div class="timer-controls">
        <button class="btn-secondary" id="timer-startpause">${timerRunning ? "Pausar" : "Iniciar"}</button>
        <button class="btn-ghost" id="timer-reset">Reiniciar</button>
      </div>
      <button class="btn-secondary" id="timer-finish">Finalizar práctica</button>
      <div class="divider"></div>
      <button class="btn-ghost" id="use-external">Usaré una meditación externa</button>
      ${rec.meditationDone ? `<p class="confirm-msg">Práctica completada.</p>` : ""}
    </div>
  `;
  $("#timer-startpause").addEventListener("click", toggleTimer);
  $("#timer-reset").addEventListener("click", () => { resetTimer(d); });
  $("#timer-finish").addEventListener("click", () => finishMeditation(d, false));
  $("#use-external").addEventListener("click", () => finishMeditation(d, true));
}

function formatTime(s) {
  const h = String(Math.floor(s/3600)).padStart(2,"0");
  const m = String(Math.floor((s%3600)/60)).padStart(2,"0");
  const sec = String(s%60).padStart(2,"0");
  return `${h}:${m}:${sec}`;
}

function toggleTimer() {
  timerRunning = !timerRunning;
  if (timerRunning) {
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        const disp = $("#timer-display");
        if (disp) disp.textContent = formatTime(timerSeconds);
      } else {
        clearInterval(timerInterval);
        timerRunning = false;
      }
    }, 1000);
  } else {
    clearInterval(timerInterval);
  }
  const btn = $("#timer-startpause");
  if (btn) btn.textContent = timerRunning ? "Pausar" : "Iniciar";
}

function resetTimer(d) {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = d.meditationMin * 60;
  render();
}

function finishMeditation(d, external) {
  clearInterval(timerInterval);
  timerRunning = false;
  const rec = getDayRecord(d.day);
  const elapsed = external ? d.meditationMin * 60 : (d.meditationMin*60 - timerSeconds);
  rec.meditationSeconds = Math.max(rec.meditationSeconds, elapsed > 0 ? elapsed : d.meditationMin*60);
  rec.meditationDone = true;
  rec.externalMeditation = external;
  rec.completedBlocks.meditacion = true;
  timerSeconds = 0;
  touchDay(d.day);
  saveState();
  render();
  toast("Práctica completada.");
}

/* ---------- Journaling ---------- */

function renderJournaling(host, d, rec) {
  if (!rec.journalAnswers || rec.journalAnswers.length !== d.prompts.length) {
    rec.journalAnswers = d.prompts.map((_, i) => rec.journalAnswers?.[i] || "");
  }
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Journaling</h2>
      ${d.prompts.map((p, i) => `
        <label class="field-label">${p}</label>
        <textarea class="field-textarea" data-idx="${i}" rows="3">${escapeHtml(rec.journalAnswers[i] || "")}</textarea>
      `).join("")}
      <button class="btn-primary" id="save-journal">GUARDAR MI REFLEXIÓN</button>
      ${rec.completedBlocks.journaling ? `<p class="confirm-msg">Reflexión guardada.</p>` : ""}
    </div>
  `;
  $("#save-journal").addEventListener("click", () => {
    $$(".field-textarea", host).forEach(ta => {
      rec.journalAnswers[Number(ta.dataset.idx)] = ta.value;
    });
    rec.completedBlocks.journaling = true;
    updateJournalLog(d, rec);
    touchDay(d.day);
    saveState();
    render();
    toast("Reflexión guardada.");
  });
}

function updateJournalLog(d, rec) {
  const entry = { day: d.day, title: d.title, date: rec.dateTouched || todayISO(), answers: d.prompts.map((p,i) => ({ prompt:p, answer: rec.journalAnswers[i] || "" })) };
  const idx = state.journalLog.findIndex(e => e.day === d.day);
  if (idx >= 0) state.journalLog[idx] = entry; else state.journalLog.push(entry);
}

/* ---------- Tapping ---------- */

function renderTapping(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Tapping de hoy</h2>
      <p>Utiliza tu práctica habitual durante aproximadamente 5–10 minutos.</p>
      <p class="detail-sub">${d.tapping}</p>
      <label class="field-label">¿Qué apareció durante el tapping?</label>
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

/* ---------- Acción ---------- */

function renderAccion(host, d, rec) {
  host.innerHTML = `
    <div class="detail-panel">
      <h2>Una acción real</h2>
      <h3 class="action-title">${d.actionTitle}</h3>
      <p>${d.actionDesc}</p>
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
  $$(".mood-btn", host).forEach(btn => {
    btn.addEventListener("click", () => {
      rec.mood = btn.dataset.mood;
      saveState();
      render();
    });
  });
  $("#close-day-btn").addEventListener("click", () => {
    rec.moodNote = $("#mood-note").value;
    saveState();
  });
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
    <header class="screen-header"><h1>Progreso</h1></header>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${pct}%</div><div class="stat-label">Programa completado</div></div>
      <div class="stat-card"><div class="stat-value">${completedDaysCount()}</div><div class="stat-label">Días completados</div></div>
      <div class="stat-card"><div class="stat-value">${streaks.current}</div><div class="stat-label">Racha actual</div></div>
      <div class="stat-card"><div class="stat-value">${streaks.best}</div><div class="stat-label">Mayor racha</div></div>
      <div class="stat-card"><div class="stat-value">${totalMeditationMinutes()}</div><div class="stat-label">Minutos meditados</div></div>
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
  $("#ver-programa").addEventListener("click", () => setScreen("programa"));
}

function renderPrograma() {
  const root = $("#screen-programa");
  root.innerHTML = `
    <header class="screen-header"><button class="btn-back" id="back-progreso">‹ Progreso</button><h1>Programa completo</h1></header>
    <div class="program-list">
      ${WEEKS.map(w => `
        <div class="week-block">
          <div class="week-heading">Semana ${w.n} · ${w.title}</div>
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
  $("#back-progreso").addEventListener("click", () => setScreen("progreso"));
  $$(".program-day", root).forEach(btn => {
    btn.addEventListener("click", () => {
      openBlockKey = null;
      setScreen("hoy");
      // permite consultar cualquier día sin cambiar el día activo de progreso
      const day = Number(btn.dataset.day);
      viewDayReadOnly(day);
    });
  });
}

function viewDayReadOnly(day) {
  const d = dayData(day);
  const rec = getDayRecord(day);
  const root = $("#screen-hoy");
  root.innerHTML = `
    <header class="hoy-header">
      <button class="btn-back" id="back-from-day">‹ Volver</button>
      <div class="daycount">Día ${d.day} de 30</div>
    </header>
    <section class="today-card">
      <div class="weektag">Semana ${weekOf(d.day).n} · ${weekOf(d.day).title}</div>
      <h1 class="daytitle">${d.title}</h1>
      <p class="daymeta">Meditación sugerida: ${d.meditationLabel}</p>
    </section>
    <div class="detail-panel">
      <h2>Journaling</h2>
      ${d.prompts.map((p,i) => `<label class="field-label">${p}</label><p class="readonly-answer">${escapeHtml(rec.journalAnswers?.[i] || "—")}</p>`).join("")}
      <h2>Tapping</h2>
      <p class="readonly-answer">${escapeHtml(rec.tappingNote || "—")}</p>
      <h2>Acción</h2>
      <p><strong>${d.actionTitle}</strong></p>
      <p class="readonly-answer">${escapeHtml(rec.actionNote || (rec.actionDone ? "Hecho." : "—"))}</p>
    </div>
  `;
  $("#back-from-day").addEventListener("click", () => setScreen("programa"));
}

/* ---------- Diario ---------- */

function renderDiario() {
  const root = $("#screen-diario");
  const entries = [...state.journalLog].sort((a,b) => b.day - a.day);
  root.innerHTML = `
    <header class="screen-header"><h1>Diario</h1></header>
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
}

/* ---------- Objetivos ---------- */

function renderObjetivos() {
  const root = $("#screen-objetivos");
  root.innerHTML = `
    <header class="screen-header"><h1>Objetivos</h1></header>
    ${state.goals.length === 0 ? `<p class="empty-msg">Define hasta 3 objetivos principales para el programa.</p>` : ""}
    <div class="goal-list">
      ${state.goals.map((g, i) => `
        <div class="goal-card">
          <input class="goal-input goal-name" data-i="${i}" placeholder="Nombre del objetivo" value="${escapeHtml(g.name||"")}">
          <textarea class="field-textarea goal-desc" data-i="${i}" rows="2" placeholder="Descripción">${escapeHtml(g.desc||"")}</textarea>
          <textarea class="field-textarea goal-why" data-i="${i}" rows="2" placeholder="¿Por qué es importante?">${escapeHtml(g.why||"")}</textarea>
          <input class="goal-input goal-next" data-i="${i}" placeholder="Siguiente acción" value="${escapeHtml(g.nextAction||"")}">
          <select class="goal-status" data-i="${i}">
            <option value="pendiente" ${g.status==='pendiente'?'selected':''}>Pendiente</option>
            <option value="en_progreso" ${g.status==='en_progreso'?'selected':''}>En progreso</option>
            <option value="logrado" ${g.status==='logrado'?'selected':''}>Logrado</option>
          </select>
          <textarea class="field-textarea goal-notes" data-i="${i}" rows="2" placeholder="Notas">${escapeHtml(g.notes||"")}</textarea>
          <button class="btn-ghost goal-remove" data-i="${i}">Eliminar objetivo</button>
        </div>
      `).join("")}
    </div>
    ${state.goals.length < 3 ? `<button class="btn-secondary" id="add-goal">Añadir objetivo</button>` : `<p class="note-small">Máximo 3 objetivos principales.</p>`}
  `;
  $("#add-goal")?.addEventListener("click", () => {
    state.goals.push({ name:"", desc:"", why:"", nextAction:"", status:"pendiente", notes:"" });
    saveState();
    render();
  });
  $$(".goal-remove", root).forEach(btn => btn.addEventListener("click", () => {
    state.goals.splice(Number(btn.dataset.i), 1);
    saveState();
    render();
  }));
  const bind = (cls, field) => $$(cls, root).forEach(el => el.addEventListener("change", () => {
    state.goals[Number(el.dataset.i)][field] = el.value;
    saveState();
  }));
  bind(".goal-name","name"); bind(".goal-desc","desc"); bind(".goal-why","why");
  bind(".goal-next","nextAction"); bind(".goal-status","status"); bind(".goal-notes","notes");
}

/* ---------- Más ---------- */

function renderMas() {
  const root = $("#screen-mas");
  root.innerHTML = `
    <header class="screen-header"><h1>Más</h1></header>

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
      <h2>Privacidad</h2>
      <p>Tu información se guarda únicamente en este dispositivo. No se usan trackers, publicidad, cuentas ni cookies innecesarias.</p>
    </section>

    <section class="more-section">
      <p class="note-small">Este programa es una herramienta personal de reflexión, meditación, hábitos y desarrollo personal. No constituye atención médica, psicológica o financiera profesional. Los ejercicios de visualización se utilizan como práctica personal, no como afirmaciones científicas.</p>
    </section>
  `;

  $("#reminder-time").addEventListener("change", (e) => {
    state.reminderTime = e.target.value;
    saveState();
    toast("Hora guardada.");
  });

  $("#export-progress").addEventListener("click", exportProgressJSON);
  $("#export-journal").addEventListener("click", exportJournalText);
  $("#reset-program").addEventListener("click", confirmReset);
}

function exportProgressJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  downloadBlob(blob, `mi-transformacion-progreso-${todayISO()}.json`);
}

function exportJournalText() {
  const lines = [];
  lines.push("MI TRANSFORMACIÓN — DIARIO");
  lines.push("");
  const entries = [...state.journalLog].sort((a,b) => a.day - b.day);
  entries.forEach(e => {
    lines.push(`Día ${e.day} — ${e.title} (${e.date})`);
    e.answers.forEach(a => {
      if (a.answer && a.answer.trim()) {
        lines.push(`P: ${a.prompt}`);
        lines.push(`R: ${a.answer}`);
      }
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
  setScreen("hoy");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(err => console.error("SW no registrado", err));
    });
  }
}

document.addEventListener("DOMContentLoaded", init);
