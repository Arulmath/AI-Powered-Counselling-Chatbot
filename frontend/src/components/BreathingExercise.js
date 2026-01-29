import React, { useState } from "react";
import "../styles/BreathingExercise.css"; // Import the corresponding CSS

const BreathingExercise = () => {
  const [isPaused, setIsPaused] = useState(false);

  const toggleAnimation = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="breathing-container">
      <div
        className={`breathing-circle ${isPaused ? "paused" : "running"}`}
      ></div>
      <button onClick={toggleAnimation}>
        {isPaused ? "Play" : "Pause"}
      </button>
    </div>
  );
};

export default BreathingExercise;
