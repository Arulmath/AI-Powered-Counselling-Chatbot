import React, { useState, useEffect } from "react";

/* ----------  SPOTIFY TRACK IDS ONLY  ---------- */
const rawTracks = [
  { id: 1, title: "Gentle Rain on Leaves", spotifyId: "64ssnSXXTLqSNn7ioao1Gn" },
  { id: 2, title: "Thunder & Wind",        spotifyId: "1TRFkS5ljjNjqI9Lu66Bxg" },
  { id: 3, title: "Thunder & Wind",        spotifyId: "6Lv5SfOMw1l5TVOgmFuKiD" },
  { id: 4, title: "Thunder & Wind",        spotifyId: "1CD7kkvlve6prIywd0sSwW" },
  { id:5, title: "Thunder & Wind",        spotifyId: "6OrvXlYgTwdywGn0MNOltG" },
  { id: 6, title: "Thunder & Wind",        spotifyId: "3r4Huoc5pruXrcT8B35BnV" },
  { id: 7, title: "Thunder & Wind",        spotifyId: "4XYkH36IVadjm4iQe1lE1M" },
  { id: 8, title: "Thunder & Wind",        spotifyId: "6FLb46S3SKN6p7Hco0CXf8" },
  { id:9, title: "Thunder & Wind",        spotifyId: "6OrvXlYgTwdywGn0MNOltG" },
  // … six more …
];

export default function SleepSounds() {
  const [tracks, setTracks] = useState(rawTracks);
  const [activeTrack, setActiveTrack] = useState(null);

  /* fetch cover once per track (no token needed) */
  useEffect(() => {
    const fetchCovers = async () => {
      const withCovers = await Promise.all(
        rawTracks.map(async (t) => {
          const res = await fetch(
            `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${t.spotifyId}`
          );
          const data = await res.json();
          return { ...t, cover: data.thumbnail_url }; // 300×300 jpg
        })
      );
      setTracks(withCovers);
    };
    fetchCovers();
  }, []);

  /* ----------  CSS ---------- */
  const css = `
    :root{
      --c1:#ff5fa3;--c2:#7c6cff;--page:#edf2fa;
      --glass:rgba(255,255,255,.18);--blur:20px;--rad:18px;
      --shadow:0 10px 28px rgba(0,0,0,.12);
    }
    body{background:var(--page);}
    .pack{max-width:933px;margin:0 auto;padding: 14px 24px;font-family:'Segoe UI',sans-serif;color:#222}
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

  return (
    <>
      <style>{css}</style>

      <section className="pack">
        {/*<h1>Sleep Sounds – 8 Tracks</h1>*/}

        <div className="grid">
          {tracks.map((t) => (
            <div
              key={t.id}
              className="card"
              onClick={() => setActiveTrack(t)}
            >
              {t.cover ? (
                <img src={t.cover} alt={t.title} />
              ) : (
                <div style={{ background: "#ccc", width: "100%", height: "100%" }} />
              )}
              <span className="play" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* LIGHTBOX */}
      <div
        className={`overlay ${activeTrack ? "show" : ""}`}
        onClick={(e) => {
          if (e.target.classList.contains("overlay")) setActiveTrack(null);
        }}
      >
        {activeTrack && (
          <div className="playerWrap">
            <div className="trackTitle">{activeTrack.title}</div>
            <iframe
              src={`https://open.spotify.com/embed/track/${activeTrack.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ borderRadius: "12px" }}
            />
          </div>
        )}

        <span className="close" onClick={() => setActiveTrack(null)}>
          &times;
        </span>
      </div>
    </>
  );
}
