import React, { useEffect } from "react";
import "../styles/floatingHearts.css";

const FloatingHearts = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const heart = document.createElement("div");
      heart.className = "heart";
      heart.style.left = Math.random() * 100 + "vw";
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 5000);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default FloatingHearts;
