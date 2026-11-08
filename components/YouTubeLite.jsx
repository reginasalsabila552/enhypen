"use client";
import { useState } from "react";

export default function YouTubeLite({ id, title }) {
  const [play, setPlay] = useState(false);
  if (!id) return <p className="muted">Video preview coming soon.</p>;
  return (
    <div className="video">
      {play ? (
        <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title}
          allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <button onClick={() => setPlay(true)} aria-label={`Play ${title}`}
          style={{ backgroundImage: `url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }}>
          <span>▶</span>
        </button>
      )}
    </div>
  );
}
