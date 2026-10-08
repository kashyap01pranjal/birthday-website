import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * Intro Component:
 * Full-screen entrance greeting upgraded with "Hold to Open" interaction.
 * User presses and holds for ~1.5s to fill the circular progress ring.
 * While holding, the button glows and background intensifies.
 * If released early, progress smoothly resets.
 */
export const Intro = ({ config, onOpen, isOpened }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);

  const holdStartRef = useRef(null);
  const animFrameRef = useRef(null);
  const holdDuration = config.intro.holdDurationMs || 1500;

  const triggerOpen = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onOpen();
    }, 400);
  }, [onOpen]);

  // Hold loop using requestAnimationFrame for 60fps buttery progress
  const updateHold = useCallback(() => {
    if (!holdStartRef.current) return;
    const elapsed = Date.now() - holdStartRef.current;
    const p = Math.min(1, elapsed / holdDuration);
    setHoldProgress(p);

    if (p >= 1) {
      setIsHolding(false);
      holdStartRef.current = null;
      triggerOpen();
    } else {
      animFrameRef.current = requestAnimationFrame(updateHold);
    }
  }, [holdDuration, triggerOpen]);

  const startHold = (e) => {
    if (isExiting || isOpened) return;
    // Prevent context menu or text select on touch
    if (e && e.cancelable) e.preventDefault();
    setIsHolding(true);
    holdStartRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (isExiting || isOpened) return;
    setIsHolding(false);
    holdStartRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    // Smooth reset back to 0
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // SVG circular ring calculations (radius: 46px)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - holdProgress);

  return (
    <section
      id="intro"
      className={`intro-screen ${isOpened ? "intro-opened" : ""} ${
        isExiting ? "intro-exiting" : ""
      }`}
      style={{
        "--hold-intensity": holdProgress,
      }}
      aria-label="Welcome screen"
    >
      <div
        className={`intro-backdrop-glow ${isHolding ? "glow-intensified" : ""}`}
        style={{
          transform: `scale(${1 + holdProgress * 0.4})`,
          opacity: 0.6 + holdProgress * 0.4,
        }}
        aria-hidden="true"
      />

      <div className="intro-content">
        <span className="intro-eyebrow">{config.intro.eyebrow}</span>

        <h1 className="intro-title">{config.intro.title}</h1>

        <p className="intro-subtitle">{config.intro.subtitle}</p>

        {/* Hold to open action container */}
        <div className="intro-hold-wrapper">
          <button
            type="button"
            className={`intro-hold-btn ${isHolding ? "is-holding" : ""}`}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            onTouchCancel={endHold}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startHold();
              }
            }}
            onKeyUp={endHold}
            aria-label="Press and hold for 1.5 seconds to open the surprise"
          >
            {/* SVG Circular Progress Ring */}
            <svg
              className="hold-progress-svg"
              width="104"
              height="104"
              viewBox="0 0 104 104"
              aria-hidden="true"
            >
              {/* Subtle track ring */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                className="progress-track"
              />
              {/* Active filling progress ring */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                className="progress-fill"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>

            <div className="hold-btn-center">
              <span className="hold-icon" aria-hidden="true">
                {holdProgress >= 1 ? "🎉" : "✨"}
              </span>
              <span className="hold-label">
                {isHolding
                  ? `${Math.round(holdProgress * 100)}%`
                  : config.intro.buttonText || "Okay, show me →"}
              </span>
            </div>

            {/* Ripple glow inside button */}
            <div
              className="hold-pulse-glow"
              style={{
                opacity: holdProgress,
                transform: `scale(${0.8 + holdProgress * 0.5})`,
              }}
              aria-hidden="true"
            />
          </button>

          <span className="hold-hint">
            {isHolding ? "Almost in..." : (config.intro.holdPrompt || "Press & hold to enter 👀")}
          </span>
        </div>

        <div className="intro-hint" aria-hidden="true">
          <span>Headphones recommended for music</span>
        </div>
      </div>
    </section>
  );
};

export default Intro;
