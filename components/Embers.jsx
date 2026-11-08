"use client";
import { useEffect, useRef } from "react";

export default function Embers({ count = 55 }) {
  const ref = useRef(null);

  useEffect(() => {
    const c = ref.current, ctx = c.getContext("2d");
    let W, H, raf, alive = true;
    const resize = () => { W = c.width = innerWidth; H = c.height = innerHeight; };
    const make = () => ({
      x: Math.random() * W, y: H + Math.random() * 60,
      r: Math.random() * 1.8 + 0.4, vy: Math.random() * 0.5 + 0.15,
      vx: (Math.random() - 0.5) * 0.25, a: Math.random() * 0.6 + 0.2, t: Math.random() * 6.28,
    });
    resize();
    const P = Array.from({ length: count }, () => ({ ...make(), y: Math.random() * H }));

    const loop = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.t += 0.02; p.y -= p.vy; p.x += p.vx + Math.sin(p.t) * 0.2;
        if (p.y < -10) Object.assign(p, make());
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,${(90 + p.r * 40) | 0},90,${p.a * (0.6 + Math.sin(p.t * 2) * 0.4)})`;
        ctx.shadowColor = "rgba(255,70,80,.9)"; ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener("resize", resize);
    return () => { alive = false; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [count]);

  return <canvas id="embers" ref={ref} />;
}
