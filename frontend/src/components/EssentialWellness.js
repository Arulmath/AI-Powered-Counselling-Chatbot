import React, { useState } from "react";

/* ----------  DATA  ---------- */
const wellnessVideos = [
  {
    id: "dhpCdqOtuj0",  // 10-Minute Full Body Stretch
    title: "10-Minute Full Body Stretch",
    thumb: "https://img.youtube.com/vi/dhpCdqOtuj0/hqdefault.jpg",
  },
  {
    id: "ygixKgwtUog",  // 5-Minute Stress Relief Routine
    title: "5-Minute Stress Relief Routine",
    thumb: "https://img.youtube.com/vi/ygixKgwtUog/hqdefault.jpg",
  },
  {
    id: "VIuNDgMNVBc",  // Guided Meditation for Peace
    title: "Guided Meditation for Peace",
    thumb: "https://img.youtube.com/vi/VIuNDgMNVBc/hqdefault.jpg",
  },
  {
    id: "zm1HP-F3HuE",  // Yoga for Better Sleep
    title: "Yoga for Better Sleep",
    thumb: "https://img.youtube.com/vi/zm1HP-F3HuE/hqdefault.jpg",
  },
  {
    id: "Fy0BVa5QmBw",  // Quick Breathing Exercise
    title: "Quick Breathing Exercise",
    thumb: "https://img.youtube.com/vi/Fy0BVa5QmBw/hqdefault.jpg",
  },
  {
    id: "wzWfUEAVIaU",  // Quick Breathing Exercise
    title: "Quick Breathing Exercise",
    thumb: "https://img.youtube.com/vi/wzWfUEAVIaU/hqdefault.jpg",
  },
  {
    id: "pmgkj01uUTw",  // Quick Breathing Exercise
    title: "Quick Breathing Exercise",
    thumb: "https://img.youtube.com/vi/pmgkj01uUTw/hqdefault.jpg",
  },
  {
    id: "1rHWRQb2qi4",  // Quick Breathing Exercise
    title: "Quick Breathing Exercise",
    thumb: "https://img.youtube.com/vi/1rHWRQb2qi4/hqdefault.jpg",
  },
  {
    id: "VIuNDgMNVBc",  // Guided Meditation for Peace
    title: "Guided Meditation for Peace",
    thumb: "https://img.youtube.com/vi/VIuNDgMNVBc/hqdefault.jpg",
  },
];

/* ----------  COMPONENT  ---------- */
export default function EssentialWellness() {
  const [activeId, setActiveId] = useState(null);

  /* inline-y css so the snippet is 1‑file */
  const css = `
    :root{
      --c1:#ff5fa3;--c2:#7c6cff;--page:#edf2fa;
      --glass:rgba(255,255,255,.18);--blur:20px;--rad:18px;
      --shadow:0 10px 28px rgba(0,0,0,.12);
    }
    body{background:var(--page);}
    .pack{max-width:933px;margin:0 auto;padding:14px 24px;font-family:'Segoe UI',sans-serif;color:#222}
    h1{font-size:32px;font-weight:700;text-align:center;margin-bottom:40px}
    .grid{display:grid;gap:26px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
    .card{position:relative;height:160px;border-radius:var(--rad);cursor:pointer;overflow:hidden;
          box-shadow:var(--shadow);background:var(--glass);backdrop-filter:blur(var(--blur));
          transition:.4s cubic-bezier(.16,1,.3,1) transform;}
    .card:hover{transform:translateY(-6px) scale(1.03)}
    .card::before{content:'';position:absolute;inset:-1px;border-radius:inherit;
                  background:linear-gradient(135deg,var(--c1),var(--c2));
                  mix-blend-mode:overlay;opacity:.5}
    .card img{width:100%;height:100%;object-fit:cover}
    .play{position:absolute;width:54px;height:54px;border-radius:50%;top:50%;left:50%;
          transform:translate(-50%,-50%);background:rgba(255,255,255,.78);
          display:flex;justify-content:center;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.2);
          backdrop-filter:blur(4px)}
    .play::before{content:'';border-style:solid;border-width:10px 0 10px 17px;
                  border-color:transparent transparent transparent var(--c1);transform:translateX(2px)}
    /* lightbox */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(2px);
             display:flex;justify-content:center;align-items:center;opacity:0;pointer-events:none;
             transition:.35s opacity;z-index:100}
    .overlay.show{opacity:1;pointer-events:auto}
    .playerWrap{width:90%;max-width:760px;aspect-ratio:16/9;border-radius:var(--rad);overflow:hidden;
                box-shadow:var(--shadow);transform:translateY(40px);transition:.4s transform}
    .overlay.show .playerWrap{transform:none}
    .close{position:absolute;top:28px;right:36px;font-size:34px;line-height:1;color:#fff;cursor:pointer;font-weight:600}
    @media(max-width:500px){.playerWrap{width:100%;aspect-ratio:auto;height:60vh}}
  `;

  /* helper to render youtube iframe */
  const frame = (id) => (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`}
      title="Essential Wellness video"
      frameBorder="0"
      allow="autoplay; encrypted-media"
      allowFullScreen
      style={{ width: "100%", height: "100%" }}
    />
  );

  return (
    <>
      <style>{css}</style>

      <section className="pack">
       {/*} <h1>Essential Wellness – Videos/Exercises</h1>*/}

        <div className="grid">
          {wellnessVideos.map((v) => (
            <div key={v.id} className="card" onClick={() => setActiveId(v.id)}>
              <img src={v.thumb} alt={v.title} />
              <span className="play" aria-hidden />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      <div
        className={`overlay ${activeId ? "show" : ""}`}
        onClick={(e) => {
          // close if backdrop clicked (not when clicking iframe)
          if (e.target.classList.contains("overlay")) setActiveId(null);
        }}
      >
        <div className="playerWrap">{activeId && frame(activeId)}</div>
        <span className="close" onClick={() => setActiveId(null)}>
          &times;
        </span>
      </div>
    </>
  );
}
