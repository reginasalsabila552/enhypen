"use client";
import { useState } from "react";

export default function DoorReveal({ children, hint = "knock to know me more" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`door-stage${open ? " open" : ""}`}>
      <div className="door-room" inert={!open}>{children}</div>
      <button className="door-btn" onClick={() => setOpen(true)} aria-label="Open the door" disabled={open}>
        <span className="leaf l"><i /><i /></span>
        <span className="leaf r"><i /><i /></span>
        <span className="door-hint">{hint}</span>
      </button>
    </div>
  );
}
