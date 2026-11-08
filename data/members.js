import { SLIDES } from "./slides";

export const group = SLIDES.find((s) => s.mode === "group");
export const members = SLIDES.filter((s) => s.mode === "member").map((m) => ({ ...m, img: `${m.img}.webp` }));
