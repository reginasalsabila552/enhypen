"use client";
import { useEffect, useRef, useState } from "react";
import "./welcome.css";

const KEY = "enhypen-welcome-seen";
const BLOCKED = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "PageUp", "PageDown", "Home", "End"];

export default function Welcome() {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const btn = useRef(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch (e) {}
    if (!seen) setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    btn.current?.focus();
    const onKey = (e) => {
      if (BLOCKED.includes(e.key) && e.target !== btn.current) {
        e.preventDefault();
        e.stopImmediatePropagation();
      } else if (BLOCKED.includes(e.key)) {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  const close = () => {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
    setLeaving(true);
    setTimeout(() => setOpen(false), 650);
  };

  if (!open) return null;

  return (
    <div className={"welcome" + (leaving ? " leaving" : "")} role="dialog" aria-modal="true" aria-labelledby="welcomeTitle">
      <div className="welcome-veil"></div>
      <div className="welcome-card">
        <svg className="wc wc-tl" viewBox="0 0 100 100" aria-hidden="true"><use href="#corner" /></svg>
        <svg className="wc wc-tr" viewBox="0 0 100 100" aria-hidden="true"><use href="#corner" /></svg>
        <svg className="wc wc-bl" viewBox="0 0 100 100" aria-hidden="true"><use href="#corner" /></svg>
        <svg className="wc wc-br" viewBox="0 0 100 100" aria-hidden="true"><use href="#corner" /></svg>

        <div className="welcome-inner">
          <p className="welcome-eyebrow">A word from the kingdom</p>
          <h2 id="welcomeTitle">Welcome</h2>

          <div className="welcome-divider" aria-hidden="true">
            <span></span><i></i><span></span>
          </div>

          <p className="welcome-text">
            Hello, welcome to the ENHYPEN fanweb! This is not a commercial website, just a token of love from an ENGENE for ENHYPEN.
          </p>
          <p className="welcome-note">
            This website is still under development and is not fully finished yet.
          </p>

          <button ref={btn} type="button" className="welcome-btn" onClick={close}>
            <span>Understand</span>
          </button>
        </div>
      </div>
    </div>
  );
}
