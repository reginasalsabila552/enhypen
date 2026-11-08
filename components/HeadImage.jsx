"use client";
import { useEffect, useRef, useState } from "react";

const EXTS = ["png", "webp", "jpg", "jpeg"];

export default function HeadImage({ id, name, className = "", title, onClick }) {
  const [src, setSrc] = useState(`/assets/heads/${id}.${EXTS[0]}`);
  const [ok, setOk] = useState(false);
  const n = useRef(1);
  useEffect(() => { n.current = 1; setOk(false); setSrc(`/assets/heads/${id}.${EXTS[0]}`); }, [id]);
  return (
    <div className={`head-img ${className}`} title={title} onClick={onClick}>
      <img src={src} alt="" draggable={false} className={ok ? "ok" : ""} onLoad={() => setOk(true)}
        onError={() => { if (n.current < EXTS.length) setSrc(`/assets/heads/${id}.${EXTS[n.current++]}`); }} />
      <span>{name[0].toUpperCase()}</span>
    </div>
  );
}
