/* ══════════════════════════════════════════════
   razones.js — 365 Razones · Kvmily
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   EDITA ESTA SECCIÓN CON TU CONTENIDO
   ══════════════════════════════════════════════ */

const DEDICATORIA = "Guardé un pensamiento para cada día del año. Ábrelos poco a poco, sin prisa, y deja que cada uno te recuerde lo mucho que significas para mí.";

// 365 reasons (repeated cyclically if fewer provided)
const REASONS = [
  "Por la forma en que sonríes cuando crees que nadie te está viendo.",
  "Porque contigo hasta los días grises se sienten cálidos.",
  "Por cómo me escuchas, incluso cuando hablo de tonterías.",
  "Porque tu abrazo se siente como llegar a casa.",
  "Por la paz que me das con solo tomarme de la mano.",
  "Porque me haces reír justo cuando más lo necesito.",
  "Por todos los planes pequeños que se vuelven mis recuerdos favoritos.",
  "Porque crees en mí incluso cuando yo no lo hago.",
  "Por la manera en que dices mi nombre.",
  "Porque contigo el silencio nunca es incómodo.",
  "Por cada café compartido y cada mañana lenta a tu lado.",
  "Porque haces que quiera ser una mejor versión de mí.",
  "Por tu forma de cuidarme en los detalles más pequeños.",
  "Porque tu felicidad se volvió parte de la mía."
];

// Add your MP3 files here (place them in the same folder as razones.html)
const SONGS = [
  // { title: 'Nombre canción', artist: 'Artista', src: 'cancion.mp3' },
];

const LIFE_EVENTS = [
  { date: 'Cuando nos conocimos', title: 'El principio', text: 'Cuéntalo aquí...', img: null },
  { date: 'Primera cita', title: 'La primera vez', text: 'Cuéntalo aquí...', img: null },
  { date: 'Primer "te amo"', title: 'Tres palabras', text: 'Cuéntalo aquí...', img: null },
];

const LETTERS = [
  {
    title: 'Una carta para ti',
    date: 'Este año',
    content: 'Querida/o...\n\nEscribe aquí tu primera carta completa.\n\nCon todo mi amor,',
    sig: 'Tu persona favorita',
  },
  {
    title: 'Para cuando estés lejos',
    date: 'Siempre',
    content: 'Querida/o...\n\nEscribe aquí tu segunda carta.\n\nTe quiero,',
    sig: 'Yo',
  },
];

const CAPSULES = [
  { label: '1 mes',       icon: '📅', unlockDate: null, message: 'Después de un mes juntos, quiero que sepas que...' },
  { label: '6 meses',     icon: '🌙', unlockDate: null, message: 'A mitad del año, me alegra poder decirte que...' },
  { label: '1 año',       icon: '✨', unlockDate: null, message: 'Un año entero. 365 razones. Y sigo eligiéndote.' },
  { label: 'Tu cumpleaños', icon: '🎂', unlockDate: null, message: 'Feliz cumpleaños. Que este año...' },
];

const DEDICATORIAS_DATA = [
  {
    for: 'Para ti, siempre',
    title: 'Escribe aquí el título',
    body: 'Escribe aquí tus palabras. Pueden ser un recuerdo especial, una promesa, o simplemente lo que sientes en este momento. No tiene que ser perfecto; solo tiene que ser tuyo.',
    sig: 'Con todo mi amor',
  },
  {
    for: 'Para el día en que lo necesites',
    title: 'Escribe aquí el título',
    body: 'Un mensaje para cuando esté triste, para cuando lo olvide, para cuando lo necesite leer. Algo que venga del corazón y llegue directo al suyo.',
    sig: 'Tuyo/a para siempre',
  },
  {
    for: 'Para el futuro',
    title: 'Escribe aquí el título',
    body: 'Una visión de lo que quieres que sea, de cómo te imaginas juntos más adelante. Un sueño escrito con letra pequeña pero corazón grande.',
    sig: 'Con esperanza',
  },
];

const LAST_WORDS = {
  title: 'Y si me faltaran las palabras…',
  body: 'Escribe aquí tu mensaje de cierre. La que resuma todo lo que quisiste decir a lo largo de estas 365 razones. El punto final que en realidad es un comienzo.',
  firma: 'Tu nombre aquí',
};

/* ══════════════════════════════════════════════
   FIN DE SECCIÓN EDITABLE
   ══════════════════════════════════════════════ */

const TOTAL = 365;
const STORAGE_KEY = 'razones-v2';
const MILESTONES = [25, 50, 100, 150, 200, 250, 300, 365];

// ── State ──────────────────────────────────────
let STATE = {
  opened:    new Set(),
  favorites: new Set(),
  history:   [],        // [{n, ts}]
  mode:      'free',    // 'free' | 'calendar'
  theme:     'dark',
  fontSize:  'medium',
  music:     { index: 0, volume: 0.7, playing: false, time: 0 },
  ambient:   null,
  selectedIndex: null,
  filter:    'all',
  calendarDate: null,   // YYYY-MM-DD of last calendar open
};

// ── Storage ─────────────────────────────────────
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const obj = JSON.parse(raw);
    if (Array.isArray(obj.opened))    STATE.opened    = new Set(obj.opened);
    if (Array.isArray(obj.favorites)) STATE.favorites = new Set(obj.favorites);
    if (Array.isArray(obj.history))   STATE.history   = obj.history;
    if (obj.mode)      STATE.mode     = obj.mode;
    if (obj.theme)     STATE.theme    = obj.theme;
    if (obj.fontSize)  STATE.fontSize = obj.fontSize;
    if (obj.music)     STATE.music    = Object.assign(STATE.music, obj.music);
    if (obj.ambient !== undefined)    STATE.ambient   = obj.ambient;
    if (obj.calendarDate)             STATE.calendarDate = obj.calendarDate;
  } catch (e) {}
}

function saveState() {
  try {
    const obj = {
      opened:       [...STATE.opened],
      favorites:    [...STATE.favorites],
      history:      STATE.history,
      mode:         STATE.mode,
      theme:        STATE.theme,
      fontSize:     STATE.fontSize,
      music:        STATE.music,
      ambient:      STATE.ambient,
      calendarDate: STATE.calendarDate,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {}
}

// ── Helpers ─────────────────────────────────────
function reason(i) { return REASONS[i % REASONS.length]; }

function todayStr() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2,'0');
}

// ── Toast ────────────────────────────────────────
function showToast(msg, duration) {
  duration = duration || 3000;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(function() {
    el.classList.add('out');
    setTimeout(function() { el.remove(); }, 400);
  }, duration);
}

// ── Starfield ────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  let stars    = [];
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        speed:   Math.random() * 0.12 + 0.04,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005),
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(function(s) {
      s.twinkle += s.twinkleSpeed;
      s.y -= s.speed;
      if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      const op = s.opacity * (0.5 + 0.5 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,245,220,' + op.toFixed(3) + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ── FX Particles ─────────────────────────────────
const FX = (function() {
  const canvas  = document.getElementById('fx-canvas');
  const ctx     = canvas.getContext('2d');
  let W, H;
  let particles = [];
  let running   = false;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function Particle(x, y, type) {
    this.x    = x; this.y = y;
    this.vx   = (Math.random() - 0.5) * 6;
    this.vy   = (Math.random() * -6) - 2;
    this.life = 1;
    this.decay = 0.012 + Math.random() * 0.015;
    this.type  = type || 'rect';
    this.color = type === 'heart' ? '#e87070' :
                 type === 'star'  ? '#e7c15f' :
                 ['#c77d5a','#e7c15f','#c9a227','#ece2d6','#b7e0c0'][Math.floor(Math.random()*5)];
    this.size  = 6 + Math.random() * 8;
    this.rotation    = Math.random() * Math.PI * 2;
    this.rotSpeed    = (Math.random() - 0.5) * 0.2;
    this.gravity     = 0.18;
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function(p) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.gravity;
      p.life -= p.decay;
      p.rotation += p.rotSpeed;
      if (p.life <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.type === 'heart') {
        ctx.font = p.size + 'px serif';
        ctx.fillText('♥', -p.size/2, p.size/2);
      } else if (p.type === 'star') {
        ctx.font = p.size + 'px serif';
        ctx.fillText('★', -p.size/2, p.size/2);
      } else {
        ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size * 0.6);
      }
      ctx.restore();
    });
    particles = particles.filter(function(p) { return p.life > 0; });
    if (particles.length === 0) running = false;
    else requestAnimationFrame(loop);
  }

  function trigger(x, y, count, type) {
    count = count || 30;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, type));
    }
    if (!running) { running = true; loop(); }
  }

  function epicMode() {
    let t = 0;
    const interval = setInterval(function() {
      for (let i = 0; i < 8; i++) {
        trigger(Math.random() * W, Math.random() * H * 0.6, 1, t % 2 === 0 ? 'heart' : 'star');
      }
      t++;
      if (t > 60) clearInterval(interval);
    }, 50);
  }

  return { trigger: trigger, epicMode: epicMode };
})();

// ── Progress ──────────────────────────────────────
function updateProgress() {
  const n    = STATE.opened.size;
  const fill = document.getElementById('prog-fill');
  const cnt  = document.getElementById('opened-count');
  if (fill) fill.style.width = (n / TOTAL * 100).toFixed(2) + '%';
  if (cnt)  cnt.textContent  = n;
  renderStats();
}

// ── Stats ─────────────────────────────────────────
function renderStats() {
  const opened = STATE.opened.size;
  const pct    = Math.round(opened / TOTAL * 100);

  let days = '—';
  if (STATE.history.length > 0) {
    const first = STATE.history[0].ts;
    const diff  = Date.now() - first;
    days = Math.max(1, Math.floor(diff / 86400000));
  }

  let last = '—';
  if (STATE.history.length > 0) {
    last = '#' + STATE.history[STATE.history.length - 1].n;
  }

  const set = function(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  set('stat-opened', opened);
  set('stat-pct',    pct + '%');
  set('stat-days',   days);
  set('stat-favs',   STATE.favorites.size);
  set('stat-last',   last);
}

// ── Grid ─────────────────────────────────────────
function buildGrid(filter) {
  filter = filter || STATE.filter;
  const grid = document.getElementById('grid');
  if (!grid) return;
  grid.innerHTML = '';

  for (let i = 0; i < TOTAL; i++) {
    const n      = i + 1;
    const isOpen = STATE.opened.has(n);
    const isFav  = STATE.favorites.has(n);
    const isMile = MILESTONES.indexOf(n) !== -1;

    if (filter === 'opened'    && !isOpen) continue;
    if (filter === 'locked'    && isOpen)  continue;
    if (filter === 'favorites' && !isFav)  continue;

    const btn = document.createElement('button');
    let cls = 'card';
    if (isOpen)  cls += ' is-open';
    if (isFav)   cls += ' is-favorite';
    if (isMile)  cls += ' is-milestone';
    btn.className = cls;
    btn.innerHTML =
      '<span class="card-heart">♥</span>' +
      '<span class="card-num">' + String(n).padStart(3,'0') + '</span>';

    btn.addEventListener('mousemove', makeTilt(btn));
    btn.addEventListener('mouseleave', function() { btn.style.transform = ''; });
    btn.addEventListener('click', (function(idx) { return function() { openNote(idx); }; })(i));
    grid.appendChild(btn);
  }
}

function makeTilt(el) {
  return function(e) {
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * -10;
    const ry   = ((e.clientX - cx) / (rect.width  / 2)) *  10;
    el.style.transform = 'perspective(400px) rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg) translateY(-4px)';
  };
}

// ── Open Note ────────────────────────────────────
function openNote(i) {
  const n = i + 1;
  const isNew = !STATE.opened.has(n);

  if (STATE.mode === 'calendar' && isNew) {
    const today = todayStr();
    if (STATE.calendarDate === today) {
      startCalendarCountdown();
      return;
    }
    STATE.calendarDate = today;
  }

  if (isNew) {
    STATE.opened.add(n);
    STATE.history.push({ n: n, ts: Date.now() });
  }
  STATE.selectedIndex = i;
  saveState();
  updateProgress();
  updateCardClass(i);
  checkMilestone(n);
  showModal(i);
}

let calendarTimer = null;
function startCalendarCountdown() {
  const now       = new Date();
  const tomorrow  = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const diff      = tomorrow - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  showToast('Ya abriste tu razón de hoy. Próxima en: ' + h + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0'), 4000);
}

function updateCardClass(i) {
  const grid = document.getElementById('grid');
  if (!grid) return;
  const cards = grid.querySelectorAll('.card');
  // find the card with this index in the filtered view
  let found = null;
  const n = i + 1;
  cards.forEach(function(card) {
    const numEl = card.querySelector('.card-num');
    if (numEl && parseInt(numEl.textContent, 10) === n) found = card;
  });
  if (!found) return;
  let cls = 'card is-open';
  if (STATE.favorites.has(n)) cls += ' is-favorite';
  if (MILESTONES.indexOf(n) !== -1) cls += ' is-milestone';
  found.className = cls;
}

// ── Milestones ───────────────────────────────────
function checkMilestone(n) {
  if (MILESTONES.indexOf(n) === -1) return;
  if (!STATE.opened.has(n)) return;

  const count = MILESTONES.filter(function(m) { return STATE.opened.has(m); }).length;
  if (STATE.opened.size !== count) { /* only fire on the turn we just hit it */ }

  if (n === 365) {
    showToast('¡365 razones! ¡Lo lograste! ✨', 5000);
    FX.epicMode();
  } else {
    showToast('¡Razón ' + n + '! ¡Un logro especial! 🎉', 3500);
    const rect = document.body.getBoundingClientRect();
    FX.trigger(window.innerWidth / 2, window.innerHeight / 2, 60, 'rect');
  }
}

// ── Typewriter ───────────────────────────────────
let typewriterTimer = null;
function typeText(el, text, delay) {
  delay = delay || 20;
  if (typewriterTimer) clearTimeout(typewriterTimer);
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  function tick() {
    el.textContent += text[i];
    i++;
    if (i < text.length) typewriterTimer = setTimeout(tick, delay);
    else el.classList.remove('typing');
  }
  tick();
}

// ── Modal ─────────────────────────────────────────
function showModal(i) {
  const n       = i + 1;
  const overlay = document.getElementById('modal-overlay');
  const counter = document.getElementById('modal-counter');
  const numEl   = document.getElementById('modal-num');
  const reasonEl = document.getElementById('modal-reason');
  const imgSlot  = document.getElementById('img-slot-active');
  const favBtn   = document.getElementById('fav-btn');

  if (counter)  counter.textContent = 'Razón ' + n + ' de 365';
  if (numEl)    numEl.textContent   = String(n).padStart(3,'0');
  if (reasonEl) typeText(reasonEl, reason(i), 22);
  if (imgSlot)  imgSlot.id = 'razon-' + n;

  if (favBtn) {
    if (STATE.favorites.has(n)) {
      favBtn.classList.add('is-fav');
      favBtn.textContent = '♥ Favorita';
    } else {
      favBtn.classList.remove('is-fav');
      favBtn.textContent = '♡ Favorita';
    }
  }

  if (overlay) {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.remove('is-open');
  document.body.style.overflow = '';
  STATE.selectedIndex = null;
}

function goTo(i) {
  openNote(((i % TOTAL) + TOTAL) % TOTAL);
}

// Modal events
document.addEventListener('DOMContentLoaded', function() {
  const overlay   = document.getElementById('modal-overlay');
  const closeBtn  = document.getElementById('modal-close');
  const btnPrev   = document.getElementById('btn-prev');
  const btnNext   = document.getElementById('btn-next');
  const favBtn    = document.getElementById('fav-btn');

  if (overlay)  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeModal(); });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (btnPrev)  btnPrev.addEventListener('click', function() { if (STATE.selectedIndex !== null) goTo(STATE.selectedIndex - 1); });
  if (btnNext)  btnNext.addEventListener('click', function() { if (STATE.selectedIndex !== null) goTo(STATE.selectedIndex + 1); });
  if (favBtn)   favBtn.addEventListener('click',  function() {
    if (STATE.selectedIndex === null) return;
    toggleFavorite(STATE.selectedIndex + 1);
  });

  document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('modal-overlay');
    const letterModal = document.getElementById('letter-modal');

    if (letterModal && letterModal.style.display !== 'none') {
      if (e.key === 'Escape') letterModal.style.display = 'none';
      return;
    }
    if (overlay && overlay.classList.contains('is-open')) {
      if (e.key === 'Escape')      closeModal();
      if (e.key === 'ArrowLeft'  && STATE.selectedIndex !== null) goTo(STATE.selectedIndex - 1);
      if (e.key === 'ArrowRight' && STATE.selectedIndex !== null) goTo(STATE.selectedIndex + 1);
    }
  });
});

// ── Favorites ─────────────────────────────────────
function toggleFavorite(n) {
  if (STATE.favorites.has(n)) STATE.favorites.delete(n);
  else                         STATE.favorites.add(n);
  saveState();

  const favBtn = document.getElementById('fav-btn');
  if (favBtn) {
    if (STATE.favorites.has(n)) {
      favBtn.classList.add('is-fav');
      favBtn.textContent = '♥ Favorita';
    } else {
      favBtn.classList.remove('is-fav');
      favBtn.textContent = '♡ Favorita';
    }
  }

  updateCardClass(n - 1);
  renderFavGrid();
  renderStats();
}

function renderFavGrid() {
  const grid  = document.getElementById('fav-grid');
  const empty = document.getElementById('fav-empty');
  if (!grid) return;
  grid.innerHTML = '';

  const favs = [...STATE.favorites].sort(function(a,b){ return a - b; });
  if (favs.length === 0) {
    if (empty) empty.style.display = '';
    return;
  }
  if (empty) empty.style.display = 'none';

  favs.forEach(function(n) {
    const i   = n - 1;
    const btn = document.createElement('button');
    btn.className = 'card is-open is-favorite';
    btn.innerHTML =
      '<span class="card-heart">♥</span>' +
      '<span class="card-num">' + String(n).padStart(3,'0') + '</span>';
    btn.addEventListener('click', function() { openNote(i); });
    grid.appendChild(btn);
  });
}

// ── Timeline ──────────────────────────────────────
function renderTimeline() {
  const list = document.getElementById('timeline-list');
  if (!list) return;
  list.innerHTML = '';

  const recent = STATE.history.slice().reverse().slice(0, 20);
  if (recent.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text3);padding:24px">Aún no has abierto ninguna razón.</p>';
    return;
  }

  recent.forEach(function(entry, idx) {
    const d    = new Date(entry.ts);
    const date = d.toLocaleDateString('es', { day:'numeric', month:'short', year:'numeric' });
    const time = d.toLocaleTimeString('es', { hour:'2-digit', minute:'2-digit' });

    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML =
      '<div class="timeline-dot"></div>' +
      '<div class="timeline-content">' +
        '<div class="timeline-date">' + date + '</div>' +
        '<div class="timeline-reason">Razón #' + entry.n + '</div>' +
        '<div class="timeline-time">' + time + '</div>' +
      '</div>';
    list.appendChild(item);
  });
}

// ── Life Line ────────────────────────────────────
function renderLifeLine() {
  const list = document.getElementById('life-list');
  if (!list) return;
  list.innerHTML = '';

  LIFE_EVENTS.forEach(function(ev, idx) {
    const item = document.createElement('div');
    item.className = 'life-item';
    item.style.setProperty('--li', idx);

    let imgHTML = '';
    if (ev.img) {
      imgHTML = '<img src="' + ev.img + '" alt="" style="width:100%;border-radius:12px;margin-top:14px;">';
    } else {
      imgHTML = '<div class="life-img-ph">📷</div>';
    }

    item.innerHTML =
      '<div class="life-dot"></div>' +
      '<div class="life-content">' +
        '<div class="life-date">' + ev.date + '</div>' +
        '<h3 class="life-title">' + ev.title + '</h3>' +
        '<p class="life-text">' + ev.text + '</p>' +
        imgHTML +
      '</div>';
    list.appendChild(item);
  });
}

// ── Letters ──────────────────────────────────────
function renderLetters() {
  const grid = document.getElementById('letters-grid');
  if (!grid) return;
  grid.innerHTML = '';

  LETTERS.forEach(function(letter, idx) {
    const env = document.createElement('div');
    env.className = 'letter-env';
    env.innerHTML =
      '<div class="letter-env-title">' + letter.title + '</div>' +
      '<div class="letter-env-date">' + letter.date + '</div>' +
      '<div class="letter-env-preview">' + letter.content.replace(/\n/g,' ').slice(0,80) + '…</div>';
    env.addEventListener('click', function() { openLetter(idx); });
    grid.appendChild(env);
  });
}

function openLetter(idx) {
  const letter = LETTERS[idx];
  if (!letter) return;
  const modal = document.getElementById('letter-modal');
  if (!modal) return;

  document.getElementById('letter-date').textContent  = letter.date;
  document.getElementById('letter-title').textContent = letter.title;
  document.getElementById('letter-sig').textContent   = letter.sig;

  const bodyEl = document.getElementById('letter-body');
  bodyEl.textContent = '';
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(function() { typeText(bodyEl, letter.content, 12); }, 200);
}

// Letter modal close
document.addEventListener('DOMContentLoaded', function() {
  const closeBtn = document.getElementById('letter-close');
  const modal    = document.getElementById('letter-modal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });
  }
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  }
});

// ── Capsules ─────────────────────────────────────
function renderCapsules() {
  const grid = document.getElementById('capsules-grid');
  if (!grid) return;
  grid.innerHTML = '';

  CAPSULES.forEach(function(cap) {
    const card    = document.createElement('div');
    const now     = Date.now();
    let unlocked  = false;
    let statusText = 'Aún no es el momento';

    if (cap.unlockDate) {
      const unlock = new Date(cap.unlockDate).getTime();
      unlocked = now >= unlock;
      if (!unlocked) {
        const diff = unlock - now;
        const days = Math.ceil(diff / 86400000);
        statusText = 'Se abre en ' + days + ' día' + (days !== 1 ? 's' : '');
      }
    }

    card.className = 'capsule-card' + (unlocked ? ' is-unlocked' : '');
    card.innerHTML =
      '<div class="capsule-icon">' + cap.icon + '</div>' +
      '<div class="capsule-label">' + cap.label + '</div>' +
      '<div class="capsule-status">' + (unlocked ? '¡Desbloqueada!' : statusText) + '</div>' +
      (unlocked ? '<div class="capsule-message">' + cap.message + '</div>' : '');
    grid.appendChild(card);
  });
}

// ── Dedicatorias ────────────────────────────────
function renderDedicatorias() {
  DEDICATORIAS_DATA.forEach(function(ded, i) {
    const forEl   = document.getElementById('ded-for-'   + i);
    const titleEl = document.getElementById('ded-title-' + i);
    const bodyEl  = document.getElementById('ded-body-'  + i);
    const sigEl   = document.getElementById('ded-sig-'   + i);
    if (forEl)   forEl.textContent   = ded.for;
    if (titleEl) titleEl.textContent = ded.title;
    if (bodyEl)  bodyEl.textContent  = ded.body;
    if (sigEl)   sigEl.textContent   = ded.sig;
  });
}

// ── Last Words ───────────────────────────────────
function renderLastWords() {
  const titleEl = document.getElementById('last-title');
  const bodyEl  = document.getElementById('last-body');
  const firmaEl = document.getElementById('last-firma-name');
  if (titleEl) titleEl.textContent = LAST_WORDS.title;
  if (bodyEl)  bodyEl.textContent  = LAST_WORDS.body;
  if (firmaEl) firmaEl.textContent = LAST_WORDS.firma;
}

// ── IntersectionObserver ─────────────────────────
function initIntersection() {
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.ded-card, .stat-card, .life-item, .letter-env, .capsule-card').forEach(function(el, i) {
    el.style.setProperty('--si', i);
    io.observe(el);
  });

  // Last words reveal on scroll
  const lastSection = document.getElementById('ultimo');
  if (lastSection) {
    const lastIo = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        const body = document.getElementById('last-body');
        if (body) typeText(body, LAST_WORDS.body, 10);
        lastIo.disconnect();
      }
    }, { threshold: 0.3 });
    lastIo.observe(lastSection);
  }
}

// ── Search ───────────────────────────────────────
function initSearch() {
  const overlay    = document.getElementById('search-overlay');
  const input      = document.getElementById('search-input');
  const results    = document.getElementById('search-results');
  const openBtn    = document.getElementById('search-open-btn');
  const closeBtn   = document.getElementById('search-close');

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add('is-open');
    if (input) { input.value = ''; input.focus(); }
    if (results) results.innerHTML = '';
  }

  function closeSearch() {
    if (overlay) overlay.classList.remove('is-open');
  }

  if (openBtn)  openBtn.addEventListener('click',  openSearch);
  if (closeBtn) closeBtn.addEventListener('click',  closeSearch);
  if (overlay)  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeSearch(); });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) closeSearch();
  });

  if (input) {
    input.addEventListener('input', function() {
      const q = input.value.trim().toLowerCase();
      if (!results) return;
      results.innerHTML = '';
      if (q.length < 2) return;

      let shown = 0;
      for (let i = 0; i < TOTAL; i++) {
        const r = reason(i).toLowerCase();
        if (r.indexOf(q) === -1) continue;
        const item = document.createElement('div');
        item.className = 'search-result-item';
        const excerpt = reason(i).slice(0, 100);
        item.innerHTML =
          '<div class="search-result-num">Razón #' + (i+1) + '</div>' +
          '<div class="search-result-text">' + excerpt + '</div>';
        item.addEventListener('click', function() {
          closeSearch();
          openNote(i);
        });
        results.appendChild(item);
        shown++;
        if (shown >= 20) break;
      }
      if (shown === 0) {
        results.innerHTML = '<p style="text-align:center;color:var(--text3);padding:24px">Sin resultados para "' + input.value + '"</p>';
      }
    });
  }
}

// ── Filter Tabs ──────────────────────────────────
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      STATE.filter = tab.dataset.filter;
      buildGrid(STATE.filter);
    });
  });
}

// ── Gallery + Lightbox ───────────────────────────
function initGallery() {
  let lbImages = [];
  let lbIndex  = 0;

  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');

  document.querySelectorAll('.gal-item:not(.gal-placeholder)').forEach(function(item, i) {
    item.addEventListener('click', function() {
      lbImages = [];
      document.querySelectorAll('.gal-item:not(.gal-placeholder) img').forEach(function(img) {
        lbImages.push(img.src);
      });
      lbIndex = i;
      if (lbImages.length === 0) return;
      if (lbImg)     lbImg.src = lbImages[lbIndex];
      if (lightbox)  lightbox.style.display = 'flex';
    });
  });

  if (lbClose) lbClose.addEventListener('click', function() { if (lightbox) lightbox.style.display = 'none'; });
  if (lightbox) lightbox.addEventListener('click', function(e) { if (e.target === lightbox) lightbox.style.display = 'none'; });
  if (lbPrev)   lbPrev.addEventListener('click', function() {
    lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
    if (lbImg) lbImg.src = lbImages[lbIndex];
  });
  if (lbNext)   lbNext.addEventListener('click', function() {
    lbIndex = (lbIndex + 1) % lbImages.length;
    if (lbImg) lbImg.src = lbImages[lbIndex];
  });
}

// ── Music Player ────────────────────────────────
function initMusicPlayer() {
  const player  = document.getElementById('music-player');
  const toggle  = document.getElementById('music-toggle');
  const panel   = document.getElementById('music-panel');
  const audio   = document.getElementById('audio-el');
  const playBtn = document.getElementById('music-play');
  const prevBtn = document.getElementById('music-prev');
  const nextBtn = document.getElementById('music-next');
  const fill    = document.getElementById('music-fill');
  const rail    = document.getElementById('music-rail');
  const current = document.getElementById('music-current');
  const total   = document.getElementById('music-total');
  const volEl   = document.getElementById('music-vol');
  const titleEl = document.getElementById('music-title');
  const artistEl = document.getElementById('music-artist');

  if (SONGS.length === 0) {
    if (player) player.style.display = 'none';
    return;
  }

  let idx  = STATE.music.index  || 0;
  let vol  = STATE.music.volume !== undefined ? STATE.music.volume : 0.7;
  if (audio) audio.volume = vol;
  if (volEl) volEl.value  = vol;

  function loadSong(i) {
    idx = ((i % SONGS.length) + SONGS.length) % SONGS.length;
    const song = SONGS[idx];
    if (audio)   audio.src = song.src;
    if (titleEl) titleEl.textContent  = song.title;
    if (artistEl) artistEl.textContent = song.artist;
    if (fill)    fill.style.width = '0%';
    if (current) current.textContent = '0:00';
    if (total)   total.textContent   = '0:00';
    STATE.music.index = idx;
    saveState();
  }

  function play() {
    if (!audio) return;
    audio.play().then(function() {
      if (playBtn) playBtn.textContent = '⏸';
      STATE.music.playing = true;
    }).catch(function() {});
  }

  function pause() {
    if (!audio) return;
    audio.pause();
    if (playBtn) playBtn.textContent = '▶';
    STATE.music.playing = false;
  }

  loadSong(idx);

  if (toggle) toggle.addEventListener('click', function() {
    if (panel) panel.classList.toggle('is-open');
  });

  if (playBtn) playBtn.addEventListener('click', function() {
    if (STATE.music.playing) pause(); else play();
  });

  if (prevBtn) prevBtn.addEventListener('click', function() { pause(); loadSong(idx - 1); play(); });
  if (nextBtn) nextBtn.addEventListener('click', function() { pause(); loadSong(idx + 1); play(); });

  if (audio) {
    audio.addEventListener('timeupdate', function() {
      if (!audio.duration) return;
      const pct = audio.currentTime / audio.duration * 100;
      if (fill)    fill.style.width         = pct.toFixed(2) + '%';
      if (current) current.textContent      = formatTime(audio.currentTime);
      if (total)   total.textContent        = formatTime(audio.duration);
      STATE.music.time = audio.currentTime;
    });
    audio.addEventListener('ended', function() { loadSong(idx + 1); play(); });
    audio.addEventListener('volumechange', function() {
      STATE.music.volume = audio.volume;
      saveState();
    });
  }

  if (rail) rail.addEventListener('click', function(e) {
    if (!audio || !audio.duration) return;
    const rect = rail.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  if (volEl) volEl.addEventListener('input', function() {
    if (audio) audio.volume = parseFloat(volEl.value);
  });
}

// ── Ambient Sounds ───────────────────────────────
const Ambient = (function() {
  let ctx    = null;
  let source = null;
  let gainNode = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function createNoise(type) {
    const ac   = getCtx();
    const size = ac.sampleRate * 2;
    const buf  = ac.createBuffer(1, size, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;

    const src = ac.createBufferSource();
    src.buffer = buf;
    src.loop   = true;

    const filter = ac.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'highpass'; filter.frequency.value = 1000;
    } else if (type === 'forest') {
      filter.type = 'bandpass'; filter.frequency.value = 600; filter.Q.value = 0.5;
    } else if (type === 'cafe') {
      filter.type = 'bandpass'; filter.frequency.value = 400; filter.Q.value = 1;
    } else {
      filter.type = 'lowpass'; filter.frequency.value = 400;
    }

    gainNode = ac.createGain();
    gainNode.gain.setValueAtTime(0, ac.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ac.currentTime + 1.5);

    src.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ac.destination);
    src.start();
    source = src;
  }

  function start(type) {
    stop();
    if (!type) return;
    try { createNoise(type); } catch(e) {}
  }

  function stop() {
    if (gainNode) {
      try {
        gainNode.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.8);
        setTimeout(function() { if (source) { try { source.stop(); } catch(e) {} source = null; } }, 900);
      } catch(e) {}
      gainNode = null;
    }
  }

  return { start: start, stop: stop };
})();

// ── Settings Panel ───────────────────────────────
function initSettings() {
  const btn   = document.getElementById('settings-btn');
  const panel = document.getElementById('settings-panel');

  if (btn) btn.addEventListener('click', function() {
    if (panel) panel.classList.toggle('is-open');
  });

  document.addEventListener('click', function(e) {
    if (panel && panel.classList.contains('is-open')) {
      if (!panel.contains(e.target) && e.target !== btn) {
        panel.classList.remove('is-open');
      }
    }
  });

  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', STATE.theme);
      themeToggle.textContent = STATE.theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro';
      saveState();
    });
  }

  // Font
  document.querySelectorAll('.font-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.font-chip').forEach(function(c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      STATE.fontSize = chip.dataset.font;
      document.documentElement.setAttribute('data-font', STATE.fontSize);
      saveState();
    });
  });

  // Mode
  document.querySelectorAll('.mode-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.mode-chip').forEach(function(c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      STATE.mode = chip.dataset.mode;
      saveState();
      showToast('Modo ' + (STATE.mode === 'free' ? 'libre' : 'calendario') + ' activado');
    });
  });

  // Ambient
  const ambientSelect = document.getElementById('ambient-select');
  if (ambientSelect) {
    ambientSelect.addEventListener('change', function() {
      STATE.ambient = ambientSelect.value || null;
      Ambient.start(STATE.ambient);
      saveState();
    });
    if (STATE.ambient) ambientSelect.value = STATE.ambient;
  }
}

// ── Export / Import ──────────────────────────────
function initExportImport() {
  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importInput = document.getElementById('import-input');

  if (exportBtn) exportBtn.addEventListener('click', function() {
    const data = {
      opened:    [...STATE.opened],
      favorites: [...STATE.favorites],
      history:   STATE.history,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = '365-razones-progreso.json';
    a.click(); URL.revokeObjectURL(url);
    showToast('Progreso exportado');
  });

  if (importBtn) importBtn.addEventListener('click', function() {
    if (importInput) importInput.click();
  });

  if (importInput) importInput.addEventListener('change', function() {
    const file = importInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.opened))    STATE.opened    = new Set(data.opened);
        if (Array.isArray(data.favorites)) STATE.favorites = new Set(data.favorites);
        if (Array.isArray(data.history))   STATE.history   = data.history;
        saveState();
        updateProgress();
        buildGrid();
        renderFavGrid();
        renderTimeline();
        showToast('Progreso importado correctamente');
      } catch(ex) {
        showToast('Error al importar el archivo');
      }
    };
    reader.readAsText(file);
    importInput.value = '';
  });
}

// ── Easter Eggs ──────────────────────────────────
function initEasterEggs() {
  // Konami code
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  document.addEventListener('keydown', function(e) {
    if (e.key === KONAMI[kIdx]) {
      kIdx++;
      if (kIdx === KONAMI.length) {
        kIdx = 0;
        showToast('Te encontré ❤️', 4000);
        FX.trigger(window.innerWidth/2, window.innerHeight/2, 80, 'heart');
      }
    } else {
      kIdx = 0;
    }
  });

  // Hero title: 5 clicks → floating hearts
  const heroTitle = document.querySelector('.hero-title');
  let titleClicks = 0; let titleTimer = null;
  if (heroTitle) {
    heroTitle.addEventListener('click', function(e) {
      titleClicks++;
      clearTimeout(titleTimer);
      titleTimer = setTimeout(function() { titleClicks = 0; }, 1000);
      if (titleClicks >= 5) {
        titleClicks = 0;
        for (let i = 0; i < 12; i++) {
          (function(delay) {
            setTimeout(function() {
              const heart = document.createElement('div');
              heart.className = 'float-heart';
              heart.textContent = '♥';
              heart.style.left = (Math.random() * 80 + 10) + '%';
              heart.style.top  = (Math.random() * 60 + 20) + '%';
              heart.style.fontSize = (16 + Math.random() * 20) + 'px';
              heart.style.color = Math.random() > 0.5 ? '#e7c15f' : '#c77d5a';
              heart.style.opacity = '1';
              document.body.appendChild(heart);
              setTimeout(function() { heart.remove(); }, 1800);
            }, delay);
          })(i * 100);
        }
      }
    });
  }

  // Secret word "amor" typed anywhere
  let typed = '';
  document.addEventListener('keypress', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    typed += e.key.toLowerCase();
    if (typed.length > 6) typed = typed.slice(-6);
    if (typed.includes('amor')) {
      typed = '';
      FX.trigger(window.innerWidth/2, window.innerHeight/3, 60, 'heart');
    }
  });
}

// ── Apply saved theme/font settings ─────────────
function applyAppearance() {
  document.documentElement.setAttribute('data-theme', STATE.theme);
  document.documentElement.setAttribute('data-font',  STATE.fontSize);

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.textContent = STATE.theme === 'dark' ? '🌙 Oscuro' : '☀️ Claro';

  document.querySelectorAll('.font-chip').forEach(function(chip) {
    chip.classList.toggle('is-active', chip.dataset.font === STATE.fontSize);
  });

  document.querySelectorAll('.mode-chip').forEach(function(chip) {
    chip.classList.toggle('is-active', chip.dataset.mode === STATE.mode);
  });

  const ambientSelect = document.getElementById('ambient-select');
  if (ambientSelect && STATE.ambient) ambientSelect.value = STATE.ambient;
}

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  loadState();
  applyAppearance();

  const heroSub = document.getElementById('hero-sub');
  if (heroSub) heroSub.textContent = DEDICATORIA;

  renderDedicatorias();
  renderLastWords();
  renderLetters();
  renderCapsules();
  renderLifeLine();
  renderTimeline();
  updateProgress();
  buildGrid();
  renderFavGrid();
  renderStats();

  initMusicPlayer();
  initSettings();
  initFilterTabs();
  initSearch();
  initGallery();
  initExportImport();
  initEasterEggs();

  setTimeout(initIntersection, 100);
});
