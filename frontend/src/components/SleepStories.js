import React, { useState } from "react";

/* ----------  SLEEP‑STORY VIDEOS  ---------- */
const stories = [
  {
    id: "_q5L0JLi0zo",
    title: "Bedtime Story with RAIN",
    thumb: "https://img.youtube.com/vi/_q5L0JLi0zo/hqdefault.jpg",
  },
  {
    id: "M6HElXKOgZM",
    title: "A Soothing Sleepy Story: The Garden of Letting Go",
    thumb: "https://img.youtube.com/vi/M6HElXKOgZM/hqdefault.jpg",
  },
  {
    id: "SMvPw7bruuY",
    title: "Magical Sleepy Story ",
    thumb: "https://img.youtube.com/vi/SMvPw7bruuY/hqdefault.jpg",
  },
  {
    id: "PiV6O3Zh3dg",
    title: "Bedtime Sleep Stories | 🏠 Cozy Cottage by the Sea 🌊",
    thumb: "https://img.youtube.com/vi/PiV6O3Zh3dg/hqdefault.jpg",
  },
  {
    id: "fmZ54EaTlEk",
    title: "🐤The Very Sleepy Duckling🐤The CUTEST Story for Sleep 💤💤💤",
    thumb: "https://img.youtube.com/vi/fmZ54EaTlEk/hqdefault.jpg",
  },
  {
    id: "pgJFJhsqk-0",
    title: "☁️ The Cloud Sweeper | Bedtime Story for Kids",
    thumb: "https://img.youtube.com/vi/pgJFJhsqk-0/hqdefault.jpg",
  },
  {
    id: "4KU0MPZ261Q",
    title: "The Little Red Hen Story 🐔🌾",
    thumb: "https://img.youtube.com/vi/4KU0MPZ261Q/hqdefault.jpg",
  },
  {
    id: "zo5ySviFuN0",
    title: "The Clever Crab and the Sly Stork 🐦🦀",
    thumb: "https://img.youtube.com/vi/zo5ySviFuN0/hqdefault.jpg",
  },
  {
    id: "SMvPw7bruuY",
    title: "Magical Sleepy Story ",
    thumb: "https://img.youtube.com/vi/SMvPw7bruuY/hqdefault.jpg",
  },
];

/* ----------  COMPONENT  ---------- */
export default function SleepStories() {
  const [activeId, setActiveId] = useState(null);

  /* same glass‑UI CSS you provided */
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

  /* youtube iframe helper */
  const frame = (id) => (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`}
      title="Sleep Story video"
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
       {/*} <h1>Sleep Stories – Calm Videos</h1>*/}

        <div className="grid">
          {stories.map((s) => (
            <div key={s.id} className="card" onClick={() => setActiveId(s.id)}>
              <img src={s.thumb} alt={s.title} />
              <span className="play" aria-hidden />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      <div
        className={`overlay ${activeId ? "show" : ""}`}
        onClick={(e) => {
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
