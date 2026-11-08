"use client";
import { useEffect, useRef, useState } from "react";
import { SLIDES } from "@/data/slides";
import VoicePill from "./VoicePill";
import Embers from "./Embers";
import Flames from "./Flames";
import { useMoonPlacement } from "@/lib/useMoon";
import { KnockDoor, Room } from "./Door";
import { useDoor } from "@/lib/useDoor";
import "./stage.css";
import { initStage } from "@/lib/stage";

export default function Stage() {
  const [current, setCurrent] = useState(0);
  const api = useRef(null);
  useMoonPlacement();
  const door = useDoor(api, current);
  const doorRef = useRef(door);
  doorRef.current = door;
  useEffect(() => {
    api.current = initStage({
      onChange: setCurrent,
      isLocked: () => doorRef.current.isLocked(),
      onEscape: () => doorRef.current.leave(),
    });
    return () => api.current?.destroy();
  }, []);
  const go = (i) => api.current?.goTo(i);
  const s = SLIDES[current];
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <>

<svg width="0" height="0" style={{position:"absolute"}} aria-hidden="true">
  <defs>
    <linearGradient id="goldG" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#f6df9b"/>
      <stop offset=".35" stopColor="#c9973a"/>
      <stop offset=".6" stopColor="#f1d27c"/>
      <stop offset="1" stopColor="#7a4f17"/>
    </linearGradient>
    <symbol id="corner" viewBox="0 0 100 100">
      <path d="M3 97 V32 C3 15 15 3 32 3 H97 V13 H36 C23 13 13 23 13 36 V97 Z"
            fill="url(#goldG)" stroke="#3b2208" strokeWidth="1.2"/>
      <circle cx="30" cy="30" r="13" fill="url(#goldG)" stroke="#3b2208" strokeWidth="1.2"/>
      <circle cx="30" cy="30" r="6" fill="#4a0d16" stroke="#3b2208" strokeWidth="1"/>
      <path d="M46 13 C60 22 60 38 48 42 C38 45 32 38 37 32" fill="none" stroke="#3b2208" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M46 13 C60 22 60 38 48 42 C38 45 32 38 37 32" fill="none" stroke="url(#goldG)" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M13 46 C22 60 38 60 42 48 C45 38 38 32 32 37" fill="none" stroke="#3b2208" strokeWidth="3.2" strokeLinecap="round"/>
      <path d="M13 46 C22 60 38 60 42 48 C45 38 38 32 32 37" fill="none" stroke="url(#goldG)" strokeWidth="1.8" strokeLinecap="round"/>
    </symbol>
  </defs>
</svg>

<div  className="hero" id="hero">
  <div  className="bg"></div>
  <div  className="moon-copy"></div>
  <div  className="moon-clouds">
    <div  className="mcloud" style={{"--o":"-.75","--t":"52s","--dl":"-10s"}}></div>
    <div  className="mcloud" style={{"--o":".05","--t":"38s","--dl":"-24s"}}></div>
    <div  className="mcloud" style={{"--o":".7","--t":"66s","--dl":"-42s"}}></div>
  </div>
  <div  className="moon-glow"></div>
  <div  className="dim" id="dim"></div>
  <Flames />
  <Embers />
  <div  className="vignette"></div>

  <header  className="brand" id="brand">
    <p  className="eyebrow">Welcome to the hall of</p>
    <h1>ENHYPEN</h1>
    <p  className="sub">Swipe the frame to get to know each member</p>
  </header>

  <div  className="hint" id="hint"><span>Scroll</span><i></i></div>

  <section  className="stage" id="stage" aria-label="ENHYPEN member gallery">
    <button  className="arrow prev" id="prev" aria-label="Previous">‹</button>
    <button  className="arrow next" id="next" aria-label="Next">›</button>

    <div  className="float">
      <div  className="fly" id="fly">
      <div  className="tilt" id="tilt">

        <div  className="flip" id="flip">
          <div  className="frame" id="frame" data-mode="group">
            <div  className="layers" id="layers"></div>

            <div  className="front">
              <svg  className="orn tl"><use href="#corner"/></svg>
              <svg  className="orn tr"><use href="#corner"/></svg>
              <svg  className="orn bl"><use href="#corner"/></svg>
              <svg  className="orn br"><use href="#corner"/></svg>

              <div  className="mat">
                <div  className="photo">
                  <img id="photo" alt="" draggable="false" />
                  <div  className="placeholder" id="ph"><span id="phText">ENHYPEN</span><small>put the photo in the assets folder</small></div>
                  <div  className="glass"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VoicePill id={s.id} name={s.name} />

      </div>
      </div>
    </div>

    <div  className="plate" id="plate">
      <span  className="idx" id="idx">00 / 06</span>
      <h2 id="name">ENHYPEN</h2>
      <p id="role">Six souls, one night</p>
    </div>

    <nav className="dots" id="dots" aria-label="Choose a member">
      {SLIDES.map((m, i) => (
        <button key={m.id} className={"dot" + (i === current ? " active" : "")} data-name={m.name} aria-label={m.name}
          onClick={(e) => { e.stopPropagation(); go(i); }} />
      ))}
    </nav>
  </section>
</div>

<main  className="sections" id="sections">
  <section  className="spacer" aria-hidden="true"></section>

  <section  className="detail" id="detail">
    <article  className="panel" id="panel">
      <p className="kicker" id="dKicker">{current === 0 ? "About the group" : `Member ${pad(current)} / ${pad(SLIDES.length - 1)}`}</p>
      <h2 className="dname" id="dName">{s.name}</h2>
      <p className="drole" id="dRole">{s.role}</p>
      <div  className="divider"></div>
      <p className="lead" id="dLead">{s.lead}</p>
      <dl className="facts" id="dFacts">
        {s.facts.map(([k, v, wide]) => (
          <div key={k} className={"fact" + (wide ? " wide" : "")}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      <KnockDoor slide={s} state={door.state} doorRef={door.doorEl} onEnter={door.enter} />
      <div  className="chips-wrap">
        <p  className="chips-title">Meet the others</p>
        <div className="chips" id="chips">
          {SLIDES.map((m, i) => (
            <button key={m.id} type="button" className={"chip" + (i === current ? " active" : "")} onClick={() => go(i)}>{m.name}</button>
          ))}
        </div>
        <a id="profileLink" className="profile-link" style={{marginLeft:0,marginTop:18}} href={"/members/" + s.id} hidden={s.mode === "group"}>Full profile →</a>
      </div>
    </article>
  </section>

  <footer  className="outro">
    <button id="toTop" type="button">↑ Back to the frame</button>
  </footer>
</main>

<Room slide={s} index={current} state={door.state} origin={door.origin} scrollRef={door.scrollEl} onLeave={door.leave} />

    </>
  );
}
