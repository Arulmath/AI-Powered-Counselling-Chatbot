import React, { useState } from "react";

/* ----------  8 VIDEOS  ---------- */
const videos = [
  {
    id: "inpok4MKVLM",
    title: "5‑Minute Guided Breath",
    thumb: "https://img.youtube.com/vi/inpok4MKVLM/hqdefault.jpg",
  },
  {
    id: "ZToicYcHIOU",
    title: "Body‑Scan Relaxation",
    thumb: "https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg",
  },
  {
    id: "ez3GgRqhNvA",
    title: "Box‑Breathing Calm‑Down",
    thumb: "https://img.youtube.com/vi/ez3GgRqhNvA/hqdefault.jpg",
  },
  {
    id: "MIr3RsUWrdo",
    title: "Mindfulness for Anxiety",
    thumb: "https://img.youtube.com/vi/MIr3RsUWrdo/hqdefault.jpg",
  },
  {
    id: "6p_yaNFSYao",
    title: "Ocean‑Wave Meditation",
    thumb: "https://img.youtube.com/vi/6p_yaNFSYao/hqdefault.jpg",
  },
  {
    id: "fiXwUZpj5Xg",
    title: "Inner Calm",
    thumb: "https://img.youtube.com/vi/fiXwUZpj5Xg/hqdefault.jpg",
  },
  {
    id: "Fpiw2hH-dlc",
    title: "Unclench‑Your‑Day Scan",
    thumb: "https://img.youtube.com/vi/Fpiw2hH-dlc/hqdefault.jpg",
  },
  {
    id: "_3fvhTO3pLM",
    title: "Evening Wind‑Down",
    thumb: "https://img.youtube.com/vi/_3fvhTO3pLM/hqdefault.jpg",
  },
  {
    id: "6p_yaNFSYao",
    title: "Ocean‑Wave Meditation",
    thumb: "https://img.youtube.com/vi/6p_yaNFSYao/hqdefault.jpg",
  },
];

export default function CalmMind() {
  const [activeId, setActiveId] = useState(null);

  /* ——— CSS‑in‑JS (same palette as other packs) ——— */
  const css = `
    :root{--c1:#5fb0ff;--c2:#7c6cff;--page:#edf2fa;
          --glass:rgba(255,255,255,.18);--blur:20px;--rad:18px;
          --shadow:0 10px 28px rgba(0,0,0,.12);}
    body{background:var(--page);}
    .pack{max-width:933px;margin:0 auto;padding:14px 24px;
          font-family:'Segoe UI',sans-serif;color:#222}
    h1{font-size:32px;font-weight:700;text-align:center;margin-bottom:40px}
    .grid{display:grid;gap:26px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
    .card{position:relative;height:160px;border-radius:var(--rad);cursor:pointer;overflow:hidden;
          box-shadow:var(--shadow);background:var(--glass);backdrop-filter:blur(var(--blur));
          transition:.4s cubic-bezier(.16,1,.3,1) transform;}
    .card:hover{transform:translateY(-6px) scale(1.03)}
    .card::before{content:'';position:absolute;inset:-1px;border-radius:inherit;
                  background:linear-gradient(135deg,var(--c1),var(--c2));
                  mix-blend-mode:overlay;opacity:.45}
    .card img{width:100%;height:100%;object-fit:cover}
    .play{position:absolute;width:54px;height:54px;border-radius:50%;top:50%;left:50%;
          transform:translate(-50%,-50%);background:rgba(255,255,255,.78);
          display:flex;justify-content:center;align-items:center;box-shadow:0 4px 12px rgba(0,0,0,.2);
          backdrop-filter:blur(4px)}
    .play::before{content:'';border-style:solid;border-width:10px 0 10px 17px;
                  border-color:transparent transparent transparent var(--c1);transform:translateX(2px)}
    /* light‑box */
    .overlay{position:fixed;inset:0;background:rgba(0,0,0,.58);backdrop-filter:blur(2px);
             display:flex;justify-content:center;align-items:center;opacity:0;pointer-events:none;
             transition:.35s opacity;z-index:100}
    .overlay.show{opacity:1;pointer-events:auto}
    .playerWrap{width:90%;max-width:760px;aspect-ratio:16/9;border-radius:var(--rad);overflow:hidden;
                box-shadow:var(--shadow);transform:translateY(40px);transition:.4s transform}
    .overlay.show .playerWrap{transform:none}
    .close{position:absolute;top:28px;right:36px;font-size:34px;color:#fff;cursor:pointer;font-weight:600}
    @media(max-width:500px){.playerWrap{width:100%;aspect-ratio:auto;height:60vh}}
  `;

  return (
    <>
      <style>{css}</style>

      <section className="pack">
        {/*<h1>Calm Your Mind – 8 Videos</h1>*/}

        <div className="grid">
          {videos.map((v) => (
            <div key={v.id} className="card" onClick={() => setActiveId(v.id)}>
              <img src={v.thumb} alt={v.title} />
              <span className="play" aria-hidden />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHT‑BOX */}
      <div
        className={`overlay ${activeId ? "show" : ""}`}
        onClick={(e) => {
          if (e.target.classList.contains("overlay")) setActiveId(null);
        }}
      >
        <div className="playerWrap">
          {activeId && (
            <iframe
              src={`https://www.youtube.com/embed/${activeId}?rel=0&autoplay=1`}
              title="Calm Mind video"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>
        <span className="close" onClick={() => setActiveId(null)}>
          &times;
        </span>
      </div>
    </>
  );
}
