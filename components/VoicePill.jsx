"use client";
import { useEffect, useRef, useState } from "react";

const EXTS = ["mp3", "m4a", "ogg", "wav"];
const BARS = [[0.1, 60], [0.5, 85], [0.3, 50], [0.7, 95], [0.2, 70], [0.6, 55], [0.4, 80]];

export default function VoicePill({ id, name, hint = "Say hi" }) {
  const audio = useRef(null);
  const [status, setStatus] = useState("loading");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = audio.current;
    let n = 0, dead = false;
    a.pause(); setStatus("loading"); setPlaying(false); setProgress(0);
    const tryNext = () => {
      if (dead) return;
      if (n >= EXTS.length) { setStatus("empty"); return; }
      a.src = `/assets/voice/${id}.${EXTS[n++]}`;
      a.load();
    };
    a.onloadedmetadata = () => { if (!dead) setStatus("ready"); };
    a.onerror = tryNext;
    tryNext();
    return () => { dead = true; a.pause(); a.onloadedmetadata = null; a.onerror = null; };
  }, [id]);

  const toggle = (e) => {
    e.stopPropagation();
    const a = audio.current;
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };

  return (
    <div className={`voice ${status}${playing ? " playing" : ""}`} id="voiceWrap">
      <div className="voice-bob">
        <div className="pill">
          <button className="play" aria-label="Play voice" disabled={status !== "ready"} onClick={toggle} style={{ "--p": progress }}>
            <span className="ico"></span>
          </button>
          <div className="pill-text">
            <small>{status === "empty" ? "no voice yet" : hint}</small>
            <b>{name}</b>
          </div>
          <div className="bars">
            {BARS.map(([d, h], k) => <i key={k} style={{ "--d": d + "s", "--h": h + "%" }} />)}
          </div>
        </div>
      </div>
      <audio ref={audio} preload="metadata"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setProgress(0); }}
        onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setProgress(+(a.currentTime / a.duration * 100).toFixed(1)); }} />
    </div>
  );
}
