import { SLIDES } from "@/data/slides";

export function initStage(options = {}) {
  const cleanups = [];
  let stopped = false;
  const listen = (t, f, o) => { window.addEventListener(t, f, o); cleanups.push(() => window.removeEventListener(t, f, o)); };
  const raf = (f) => (stopped ? 0 : requestAnimationFrame(f));

const VOICE_LABEL = "Say hi";

const $ = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => t * t * (3 - 2 * t);

const stage = $("stage"), tilt = $("tilt"), flip = $("flip"), frame = $("frame");
const photo = $("photo"), phText = $("phText"), plate = $("plate");
const nameEl = $("name"), roleEl = $("role"), idxEl = $("idx");
const panel = $("panel");

let current = 0;
let busy = false;
let detailVisible = false;

const layers = $("layers");
for (let i = 1; i <= 8; i++) {
  const l = document.createElement("div");
  l.className = "layer";
  l.style.transform = `translateZ(${-i * 3}px)`;
  l.style.filter = `brightness(${1 - i * 0.07})`;
  layers.appendChild(l);
}

function loadPhoto(base) {
  const exts = ["webp", "jpg", "jpeg", "png"];
  let n = 0;
  photo.classList.remove("ok");
  const tryNext = () => { if (n < exts.length) photo.src = `${base}.${exts[n++]}`; };
  photo.onload = () => photo.classList.add("ok");
  photo.onerror = tryNext;
  tryNext();
}

function render(i) {
  const s = SLIDES[i];
  frame.dataset.mode = s.mode;
  phText.textContent = s.name.toUpperCase();
  loadPhoto(s.img);
  photo.alt = s.name;
  idxEl.textContent = `${pad(i)} / ${pad(SLIDES.length - 1)}`;
  nameEl.textContent = s.name;
  roleEl.textContent = s.role;
  options.onChange?.(i);
  updateScroll();
}

let dragRot = 0;

async function goTo(target, dirOverride) {
  if (busy || target === current) return;
  busy = true;
  const dir = dirOverride ?? (target > current ? 1 : -1);
  const from = dragRot;

  plate.classList.add("swap");
  panel.classList.remove("in");

  await flip.animate(
    [{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${-dir * 90}deg)` }],
    { duration: 380, easing: "cubic-bezier(.5,0,.9,.6)", fill: "forwards" }
  ).finished;

  current = target;
  render(current);

  await flip.animate(
    [{ transform: `rotateY(${dir * 90}deg)` }, { transform: "rotateY(0deg)" }],
    { duration: 620, easing: "cubic-bezier(.2,.9,.25,1.15)", fill: "forwards" }
  ).finished;

  flip.getAnimations().forEach((a) => a.cancel());
  flip.style.transform = "rotateY(0deg)";
  dragRot = 0;
  plate.classList.remove("swap");
  if (detailVisible) panel.classList.add("in");
  busy = false;
}

const next = () => goTo((current + 1) % SLIDES.length, 1);
const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
$("next").addEventListener("click", (e) => { e.stopPropagation(); next(); });
$("prev").addEventListener("click", (e) => { e.stopPropagation(); prev(); });
listen("keydown", (e) => {
  if (e.key === "Escape") { options.onEscape?.(); return; }
  if (options.isLocked?.()) return;
  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft") prev();
});

let dragging = false, startX = 0;

stage.addEventListener("pointerdown", (e) => {
  if (busy || e.target.closest("button")) return;
  dragging = true; startX = e.clientX;
  stage.classList.add("dragging");
  stage.setPointerCapture(e.pointerId);
  flip.getAnimations().forEach((a) => a.cancel());
});

stage.addEventListener("pointermove", (e) => {
  if (dragging) {
    const dx = e.clientX - startX;
    dragRot = Math.max(-42, Math.min(42, dx * 0.2));
    flip.style.transform = `rotateY(${dragRot}deg)`;
    return;
  }
  if (e.pointerType === "mouse" && !busy) {
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `rotateY(${px * 12}deg) rotateX(${-py * 9}deg)`;
  }
});

const endDrag = (e) => {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove("dragging");
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 70) {
    dx < 0 ? next() : prev();
  } else {
    flip.animate(
      [{ transform: `rotateY(${dragRot}deg)` }, { transform: "rotateY(0deg)" }],
      { duration: 500, easing: "cubic-bezier(.2,.9,.25,1.3)", fill: "forwards" }
    ).finished.then(() => {
      flip.getAnimations().forEach((a) => a.cancel());
      flip.style.transform = "rotateY(0deg)"; dragRot = 0;
    });
  }
};
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);
stage.addEventListener("pointerleave", () => { if (!dragging) tilt.style.transform = ""; });

const brand = $("brand"), dim = $("dim"), hint = $("hint");
const floatEl = stage.querySelector(".float");
const fly = $("fly");
const detailEl = $("detail"), sectionsEl = $("sections");
let lastPt = -1;
const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a, b, t) => a + (b - a) * t;
const targetP = () => clamp(scrollY / (innerHeight * 0.85));

const LANDING = {
  desktop: { x: 0.24, y: 0.50, yGroup: 0.50 },
  mobile:  { top: 0.03 },
};

const FLY = { spin: 360, lift: 0.07, bank: 12, pop: 0.10 };

function frameSize(mode, e, W, H, mobile) {

  const hero = mode === "group"
    ? { h: mobile ? Math.min(.34 * H, W * .80 / 1.3333) : .54 * H, r: 1.3333 }
    : { h: mobile ? Math.min(.48 * H, W * .72 / .8) : .66 * H, r: 0.8 };
  const sect = mode === "group"
    ? { h: mobile ? Math.min(.36 * H, W * .92 / 1.2) : .50 * H, r: 1.2 }
    : { h: mobile ? Math.min(.50 * H, W * .92 / .8) : .68 * H, r: 0.8 };
  const h = lerp(hero.h, sect.h, e), r = lerp(hero.r, sect.r, e);
  return { h, w: h * r };
}

function apply(p) {
  const W = innerWidth, H = innerHeight, mobile = W <= 900;
  const e = smoother(p);
  const mode = SLIDES[current].mode;

  const { h, w } = frameSize(mode, e, W, H, mobile);
  frame.style.width = w.toFixed(1) + "px";
  frame.style.height = h.toFixed(1) + "px";

  const sW = stage.offsetWidth, sH = stage.offsetHeight;
  const fcY = floatEl.offsetTop + floatEl.offsetHeight / 2;

  const x0 = mobile ? W / 2 : W * 0.66;
  const y0 = mobile ? H * 0.56 - sH / 2 + fcY : H / 2 - sH / 2 + fcY;
  const x1 = mobile ? W / 2 : W * LANDING.desktop.x;
  const y1 = mobile ? H * LANDING.mobile.top + h / 2
                    : H * (mode === "group" ? LANDING.desktop.yGroup : LANDING.desktop.y);
  const arc = Math.sin(Math.PI * e);
  const x = lerp(x0, x1, e);
  const y = lerp(y0, y1, e) - arc * H * FLY.lift;

  stage.style.transform = `translate(${(x - sW / 2).toFixed(1)}px,${(y - fcY).toFixed(1)}px)`;
  fly.style.transform =
    `rotateY(${(e * FLY.spin).toFixed(2)}deg) rotateX(${(arc * FLY.bank).toFixed(2)}deg) ` +
    `rotate(${(arc * -5).toFixed(2)}deg) scale(${(1 + arc * FLY.pop).toFixed(3)})`;

  const ui = (1 - clamp(e * 2.2)).toFixed(3);
  stage.style.setProperty("--ui-o", ui);
  stage.style.setProperty("--plate-o", ui);
  stage.classList.toggle("compact", e > 0.35);

  brand.style.opacity = (1 - clamp(p * 1.8)).toFixed(3);
  brand.style.translate = `0 ${(-e * 60).toFixed(1)}px`;
  dim.style.opacity = e.toFixed(3);
  hint.style.opacity = (1 - clamp(p * 3)).toFixed(3);

  if (mobile) {
    const endH = frameSize(mode, 1, W, H, true).h;
    const detTop = detailEl.getBoundingClientRect().top + scrollY;
    const pt = Math.max(H * 0.2, H * LANDING.mobile.top + endH + H * 0.05 - (detTop - H * 0.85));
    if (Math.abs(pt - lastPt) > 0.5) { detailEl.style.paddingTop = pt.toFixed(1) + "px"; lastPt = pt; }
    const clip = Math.max(0, y + h / 2 + 4 - sectionsEl.getBoundingClientRect().top);
    sectionsEl.style.setProperty("--clip", clip.toFixed(1) + "px");
  } else if (lastPt !== -1) {
    detailEl.style.paddingTop = ""; sectionsEl.style.removeProperty("--clip"); lastPt = -1;
  }
}

let pCur = targetP(), looping = false, lastT = 0;
function tick(t) {
  const target = targetP();
  const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
  lastT = t;
  pCur += (target - pCur) * (1 - Math.exp(-dt / 0.12));
  if (Math.abs(target - pCur) < 0.0004) pCur = target;
  apply(pCur);
  if (pCur !== target) raf(tick); else looping = false;
}
const kick = () => { if (!looping) { looping = true; lastT = performance.now(); raf(tick); } };
const updateScroll = () => apply(pCur);
listen("scroll", kick, { passive: true });
listen("resize", () => { pCur = targetP(); apply(pCur); });

new IntersectionObserver((entries) => {
  detailVisible = entries[0].isIntersecting;
  if (busy) return;
  panel.classList.toggle("in", detailVisible);
}, { threshold: 0.25 }).observe($("detail"));

$("toTop").addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

render(0);
  const destroy = () => {
    stopped = true;
    cleanups.forEach((f) => f());
    document.documentElement.classList.remove("room-open");
    ["layers"].forEach((id) => { const e = document.getElementById(id); if (e) e.innerHTML = ""; });
  };
  return { goTo, destroy, isBusy: () => busy };
}
