"use client";
import { useEffect, useRef } from "react";

export default function Flames() {
  const ref = useRef(null);

  useEffect(() => {
    let alive = true;
    const raf = (f) => (alive ? requestAnimationFrame(f) : 0);

  const cv = ref.current, ctx = cv.getContext("2d");
  const DEBUG = /[?&]debug/.test(location.search);
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let W, H, iw = 1672, ih = 941, flames = [], dw = 0, dh = 0;

  const FALLBACK = [
    [629,64],[652,48],[693,22],[746,12],[806,10],[852,10],[894,24],[933,44],[963,64],
    [1281,350],[1300,340],[1321,318],[1343,332],[1362,352],
    [1572,262],[1556,276],[1588,280],[1536,292],[1614,292],
    [972,550],[958,565],[986,565],[948,572],[996,572],
    [125,478],[86,507],[162,535],[237,540],[222,556],[257,558],
  ];

  const make = (x, y, s) => ({
    x, y, s,
    a: 5 + Math.random() * 5, b: 2 + Math.random() * 3, c: 11 + Math.random() * 7,
    p: Math.random() * 6.28, q: Math.random() * 6.28, px: 0, py: 0, sz: 6,
  });

  function detect(img) {
    const sc = 0.5, w = Math.round(img.naturalWidth * sc), h = Math.round(img.naturalHeight * sc);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.drawImage(img, 0, 0, w, h);
    let d; try { d = g.getImageData(0, 0, w, h).data; } catch (e) { return []; }
    const hot = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const r = d[i * 4], gr = d[i * 4 + 1], b = d[i * 4 + 2];
      if (r >= 225 && gr >= 150 && r - b >= 70) hot[i] = 1;
    }
    const seen = new Uint8Array(w * h), out = [], stack = [];
    for (let s = 0; s < w * h; s++) {
      if (!hot[s] || seen[s]) continue;
      let n = 0, sx = 0, sy = 0;
      stack.length = 0; stack.push(s); seen[s] = 1;
      while (stack.length) {
        const p = stack.pop(), x = p % w, y = (p / w) | 0;
        n++; sx += x; sy += y;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const q = ny * w + nx;
          if (hot[q] && !seen[q]) { seen[q] = 1; stack.push(q); }
        }
      }
      if (n < 2 || n > 260) continue;
      const cx = sx / n / w, cy = sy / n / h;
      if (cy > 0.76) continue;
      if (cx > 0.22 && cx < 0.56 && cy > 0.5 && cy < 0.76) continue;
      out.push({ n, x: cx, y: cy, s: (2 * Math.sqrt(n)) / img.naturalWidth });
    }
    return out.sort((a, b) => b.n - a.n).slice(0, 90).map((o) => make(o.x, o.y, o.s));
  }

  function layout() {
    const mobile = W <= 900;
    const px = mobile ? 0.27 : 0.5, py = mobile ? 0 : 0.5;
    const s = Math.max(W / iw, H / ih);
    dw = iw * s; dh = ih * s;
    const ox = (W - dw) * px, oy = (H - dh) * py;
    for (const f of flames) {
      f.px = ox + f.x * dw; f.py = oy + f.y * dh;
      f.sz = Math.max(3, f.s * dw);
    }
  }
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
    if (REDUCED) draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    const k = t / 1000;
    for (const f of flames) {
      const n = .55 * Math.sin(k * f.a + f.p) + .3 * Math.sin(k * f.b + f.q) + .15 * Math.sin(k * f.c + f.p * 3);
      const I = .8 + .25 * n;
      const x = f.px + Math.sin(k * f.b + f.q) * f.sz * .1, y = f.py;
      const R = Math.min(70, f.sz * 7);
      let g = ctx.createRadialGradient(x, y, 0, x, y, R);
      g.addColorStop(0, `rgba(255,165,70,${.28 * I})`);
      g.addColorStop(.4, `rgba(255,110,40,${.1 * I})`);
      g.addColorStop(1, "rgba(255,80,30,0)");
      ctx.fillStyle = g; ctx.fillRect(x - R, y - R, R * 2, R * 2);

      const cr = f.sz * .9;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 1.7 + .3 * n);
      g = ctx.createRadialGradient(0, 0, 0, 0, 0, cr);
      g.addColorStop(0, `rgba(255,246,215,${.8 * I})`);
      g.addColorStop(.5, `rgba(255,185,70,${.38 * I})`);
      g.addColorStop(1, "rgba(255,140,40,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, cr, 0, 6.283); ctx.fill();
      ctx.restore();

      if (DEBUG) { ctx.strokeStyle = "#0f0"; ctx.strokeRect(f.px - 5, f.py - 5, 10, 10); }
    }
    if (!REDUCED) raf(draw);
  }

  const img = new Image();
  img.onload = () => { if (!alive) return;
    iw = img.naturalWidth; ih = img.naturalHeight;
    flames = detect(img);
    if (flames.length < 6) flames = FALLBACK.map(([x, y]) => make(x / 1672, y / 941, 7 / 1672));
    if (DEBUG) console.log(`[lilin] api terdeteksi: ${flames.length}`);
    layout();
  };
  img.onerror = () => { if (!alive) return; flames = FALLBACK.map(([x, y]) => make(x / 1672, y / 941, 7 / 1672)); layout(); };
  img.src = "/assets/bg.jpg";

  window.addEventListener("resize", resize);
  resize();
  if (!REDUCED) raf(draw);

    return () => { alive = false; window.removeEventListener("resize", resize); };
  }, []);

  return <canvas id="flames" ref={ref} />;
}
