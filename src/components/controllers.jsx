import React from "react";

function Controllers({
  maxCount,
  count,
  animationOngoing,
  setCount,
  resetArray,
  animationSpeed,
  setAnimationSpeed,
}) {
  return (
    <span>
      <span>
        Count
        <input
          type="range"
          min="10"
          max={maxCount}
          value={count}
          onChange={({ currentTarget: t }) => {
            if (animationOngoing) return;
            setCount(t.value);
            resetArray(t.value);
          }}
        />
      </span>
      <span>
        Speed
        <input
          type="range"
          min="0"
          max="49"
          value={50 - animationSpeed}
          onChange={({ currentTarget: t }) => {
            if (animationOngoing) return;
            setAnimationSpeed(50 - t.value);
          }}
        />
      </span>
    </span>
  );
}

export default Controllers;
