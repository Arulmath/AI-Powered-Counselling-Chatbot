import { Link } from "react-router-dom";     // ①
import "../styles/mypacks.css";

const packs = [
  { title: "For Fresh Mornings", path: "/fresh-mornings", type: "8 VIDEOS" },
  { title: "Calm your Mind",      path: "/calm-mind",      type: "8 VIDEOS" },
  { title: "Sleep Sounds",        path: "/sleep-sounds",   type: "8 AUDIOS" },
  { title: "Sleep Stories",       path: "/sleep-stories",  type: "8 STORIES" },
  { title: "Essential Wellness Pack", path: "/essential-wellness", type: "8 VIDEOS" },
  { title: "Manage Anger",        path: "/manage-anger",   type: "8 EXERCISES" }
];

export default function MyPacks() {
  return (
    <div className="mypacks-wrapper">
   

      <div className="grid-container">
        {packs.map(({ title, type, path }) => (
          <Link to={path} className="card" key={title}>   {/* ② */}
            <div className="card-content">
              <h3>{title}</h3>
              <span>{type}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
