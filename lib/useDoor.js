import { useEffect, useRef, useState } from "react";
import { knockSound } from "./knockSound";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function useDoor(stageApi, current) {
  const [state, setState] = useState("closed");
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const ref = useRef("closed");
  const token = useRef(0);
  const doorEl = useRef(null);
  const scrollEl = useRef(null);
  const set = (v) => { ref.current = v; setState(v); };

  useEffect(() => { token.current++; set("closed"); }, [current]);

  useEffect(() => {
    document.documentElement.classList.toggle("room-open", state === "open");
    return () => document.documentElement.classList.remove("room-open");
  }, [state]);

  const enter = async () => {
    if (ref.current !== "closed" || stageApi.current?.isBusy()) return;
    const t = ++token.current;
    set("knocking"); knockSound();
    await wait(950);
    if (t !== token.current) return;
    set("opening");
    await wait(900);
    if (t !== token.current) return;
    const r = doorEl.current.getBoundingClientRect();
    setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    if (scrollEl.current) scrollEl.current.scrollTop = 0;
    set("open");
  };

  const leave = () => {
    if (ref.current !== "open") return;
    set("leaving");
    const t = token.current;
    setTimeout(() => { if (t === token.current) set("closed"); }, 950);
  };

  return { state, origin, enter, leave, doorEl, scrollEl, isLocked: () => ref.current !== "closed" };
}
