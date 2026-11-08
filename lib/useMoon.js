import { useEffect } from "react";

export function useMoonPlacement() {
  useEffect(() => {
    let alive = true;

  const MOON = { x: 0.266, y: 0.202, r: 0.046 };
  let iw = 1672, ih = 941;
  const place = () => {
    const W = innerWidth, H = innerHeight;
    const mobile = W <= 900;
    const px = mobile ? 0.27 : 0.5, py = mobile ? 0 : 0.5;
    const s = Math.max(W / iw, H / ih);
    const dw = iw * s, dh = ih * s;
    const ox = (W - dw) * px, oy = (H - dh) * py;
    const st = document.documentElement.style;
    st.setProperty("--mx", (ox + MOON.x * dw).toFixed(1) + "px");
    st.setProperty("--my", (oy + MOON.y * dh).toFixed(1) + "px");
    st.setProperty("--mr", (MOON.r * dw).toFixed(1) + "px");
  };
  const img = new Image();
  img.onload = () => { if (!alive) return; iw = img.naturalWidth; ih = img.naturalHeight; place(); };
  img.src = "/assets/bg.jpg";
  window.addEventListener("resize", place);
  place();

    return () => { alive = false; window.removeEventListener("resize", place); };
  }, []);
}
