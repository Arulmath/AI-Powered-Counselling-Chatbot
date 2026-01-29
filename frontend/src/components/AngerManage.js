import React, { useState } from "react";

/* ----------  ANGER MANAGEMENT VIDEO DATA  ---------- */
const angerVideos = [
  {
    id: "a8t5SwmqDnk", // 5-Minute Breathing Meditation
    title: "5-Minute Breathing Meditation",
    thumb: "https://img.youtube.com/vi/a8t5SwmqDnk/hqdefault.jpg",
  },
  {
    id: "tV2Ecd7m6Tc", // Control Anger Instantly
    title: "Control Anger Instantly",
    thumb: "https://img.youtube.com/vi/tV2Ecd7m6Tc/hqdefault.jpg",
  },
  {
    id: "C1N4f1F0vDU", // 10-Minute Guided Meditation for Anger
    title: "10-Minute Guided Meditation for Anger",
    thumb: "https://img.youtube.com/vi/C1N4f1F0vDU/hqdefault.jpg",
  },
  {
    id: "BsVq5R_F6RA", // Relaxing Music for Calmness
    title: "Relaxing Music for Calmness",
    thumb: "https://img.youtube.com/vi/BsVq5R_F6RA/hqdefault.jpg",
  },
  {
    id: "_XBoeL1Q5jU", // Anger Management Techniques
    title: "Anger Management Techniques",
    thumb: "https://img.youtube.com/vi/_XBoeL1Q5jU/hqdefault.jpg",
  },
  {
    id: "4RHAznBTU1U", // Anger Management Techniques
    title: "Anger Management Techniques",
    thumb: "https://img.youtube.com/vi/4RHAznBTU1U/hqdefault.jpg",
  },
  {
    id: "Ge-g2gGB0cI", // Anger Management Techniques
    title: "Anger Management Techniques",
    thumb: "https://img.youtube.com/vi/Ge-g2gGB0cI/hqdefault.jpg",
  },
  {
    id: "kHvyZFXkB0Q", // Anger Management Techniques
    title: "Anger Management Techniques",
    thumb: "https://img.youtube.com/vi/kHvyZFXkB0Q/hqdefault.jpg",
  },
  {
    id: "BsVq5R_F6RA", // Relaxing Music for Calmness
    title: "Relaxing Music for Calmness",
    thumb: "https://img.youtube.com/vi/BsVq5R_F6RA/hqdefault.jpg",
  },
];

export default function AngerManagementPack() {
  const [activeId, setActiveId] = useState(null);

  const css = `
    :root {
      --c1: #f97316; --c2: #facc15; --page: #fff8f1;
      --glass: rgba(255,255,255,.2); --blur: 16px; --rad: 18px;
      --shadow: 0 10px 28px rgba(0,0,0,.1);
    }
    body { background: var(--page); }
    .pack { max-width: 933px; margin: 0 auto; padding: 14px 24px; font-family: 'Segoe UI', sans-serif; color: #222; }
    h1 { font-size: 32px; font-weight: 700; text-align: center; margin-bottom: 40px; }
    .grid { display: grid; gap: 26px; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
    .card { position: relative; height: 160px; border-radius: var(--rad); cursor: pointer; overflow: hidden;
            box-shadow: var(--shadow); background: var(--glass); backdrop-filter: blur(var(--blur));
            transition: .4s cubic-bezier(.16,1,.3,1) transform; }
    .card:hover { transform: translateY(-6px) scale(1.03); }
    .card::before { content: ''; position: absolute; inset: -1px; border-radius: inherit;
                    background: linear-gradient(135deg, var(--c1), var(--c2));
                    mix-blend-mode: overlay; opacity: .4; }
    .card img { width: 100%; height: 100%; object-fit: cover; }
    .play { position: absolute; width: 54px; height: 54px; border-radius: 50%; top: 50%; left: 50%;
            transform: translate(-50%, -50%); background: rgba(255,255,255,.78);
            display: flex; justify-content: center; align-items: center;
            box-shadow: 0 4px 12px rgba(0,0,0,.2); backdrop-filter: blur(4px); }
    .play::before { content: ''; border-style: solid; border-width: 10px 0 10px 17px;
                    border-color: transparent transparent transparent var(--c1); transform: translateX(2px); }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.58); backdrop-filter: blur(2px);
               display: flex; justify-content: center; align-items: center;
               opacity: 0; pointer-events: none; transition: .35s opacity; z-index: 100; }
    .overlay.show { opacity: 1; pointer-events: auto; }
    .playerWrap { width: 90%; max-width: 760px; aspect-ratio: 16/9; border-radius: var(--rad); overflow: hidden;
                  box-shadow: var(--shadow); transform: translateY(40px); transition: .4s transform; }
    .overlay.show .playerWrap { transform: none; }
    .close { position: absolute; top: 28px; right: 36px; font-size: 34px; line-height: 1;
             color: #fff; cursor: pointer; font-weight: 600; }
    @media(max-width:500px) { .playerWrap { width: 100%; aspect-ratio: auto; height: 60vh; } }
  `;

  const frame = (id) => (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`}
      title="Anger Management Video"
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
      {/*}  <h1>Anger Management – Calming Videos</h1>*/}

        <div className="grid">
          {angerVideos.map((v) => (
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
          if (e.target.classList.contains("overlay")) setActiveId(null);
        }}
      >
        <div className="playerWrap">{activeId && frame(activeId)}</div>
        <span className="close" onClick={() => setActiveId(null)}>&times;</span>
      </div>
    </>
  );
}
