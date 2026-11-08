"use client";
import HeadImage from "./HeadImage";
import { LOREM } from "@/data/slides";

const pad = (n) => String(n).padStart(2, "0");

export function KnockDoor({ slide, state, doorRef, onEnter }) {
  const opened = state === "opening" || state === "open" || state === "leaving";
  return (
    <div className="knock" id="knock">
      <div className="door-wrap" id="doorWrap">
        <button ref={doorRef} type="button" aria-label="Knock on the door to get to know more" onClick={onEnter}
          className={"door" + (state === "knocking" ? " knocking" : "") + (opened ? " open" : "")}>
          <span className="door-frame">
            <span className="door-light"></span>
            {["leaf-l", "leaf-r"].map((side) => (
              <span key={side} className={"door-leaf " + side}>
                <i className="dp dp-a"></i><i className="dp dp-b"></i><i className="knocker"></i>
              </span>
            ))}
          </span>
        </button>
        <div className="knock-head" id="knockHead">
          <div className="head-bob">
            <HeadImage id={slide.id} name={slide.name} title="Knock on the door" onClick={onEnter} />
            <div className={"bubble" + (state !== "closed" ? " hide" : "")}>knock to know me more</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Room({ slide, index, state, origin, scrollRef, onLeave }) {
  const facts = slide.more?.facts ?? Array.from({ length: 6 }, (_, k) => [`Fact ${pad(k + 1)}`, LOREM]);
  const story = slide.more?.story ?? [LOREM, LOREM, LOREM];
  return (
    <div className={"room" + (state === "open" ? " open" : "")} id="room" aria-hidden={state !== "open"}
      style={{ "--cx": origin.x + "px", "--cy": origin.y + "px" }}>
      <div className="room-glow"></div>
      <button className="room-back" type="button" onClick={onLeave}>← Leave the room</button>
      <div className="room-scroll" ref={scrollRef}>
        <header className="room-top">
          <HeadImage id={slide.id} name={slide.name} className="room-avatar" />
          <p className="kicker">{index === 0 ? "Behind the door · Group" : `Behind the door · Member ${pad(index)}`}</p>
          <h2 className="dname">{slide.name}</h2>
          <p className="drole">{`Getting closer to ${slide.name}`}</p>
          <div className="divider"></div>
        </header>
        <section className="room-grid">
          {facts.map(([t, body]) => <div key={t} className="rcard"><h3>{t}</h3><p>{body}</p></div>)}
        </section>
        <article className="room-story">{story.map((t, k) => <p key={k}>{t}</p>)}</article>
      </div>
    </div>
  );
}
