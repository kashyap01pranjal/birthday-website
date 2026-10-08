import React, { useEffect, useRef, useState } from "react";

/**
 * BirthdayHero:
 * Fullscreen cinematic reveal section.
 * Features staggered reveals of eyebrow, "HAPPY BIRTHDAY", the recipient's name
 * with an atmospheric breathing backlight glow, and the subtitle.
 */
export const BirthdayHero = ({ config, isOpened, onTriggerSecret }) => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    if (isOpened) {
      // Trigger smooth entrance once intro is opened
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isOpened]);

  return (
    <section
      id="birthday-reveal"
      ref={heroRef}
      className={`hero-section ${isVisible ? "hero-animate-in" : ""}`}
      aria-label="Birthday Announcement"
    >
      <div className="hero-radial-glow" aria-hidden="true" />

      <div className="hero-content">
        {/* Stagger item 1 */}
        <p className="hero-eyebrow stagger-1">
          <span className="eyebrow-line" aria-hidden="true" />
          {config.reveal.eyebrow}
          <span className="eyebrow-line" aria-hidden="true" />
        </p>

        {/* Stagger item 2 */}
        <h2 className="hero-title stagger-2">{config.reveal.headline}</h2>

        {/* Stagger item 3: Prominent recipient name with animated breathing halo */}
        <div className="hero-name-wrap stagger-3">
          <div className="hero-name-halo" aria-hidden="true" />
          <h1 className="hero-name">{config.name}</h1>
        </div>

        {/* Stagger item 4 */}
        <div className="hero-subtitle-wrap stagger-4">
          <p className="hero-subtitle">{config.reveal.subtitle}</p>
          {/* Hidden Easter Egg 1 */}
          <button
            type="button"
            className="easter-egg-btn"
            onClick={() =>
              onTriggerSecret &&
              onTriggerSecret(
                config.secrets?.hero ||
                  "You found it 👀 Okay, you're actually paying attention."
              )
            }
            aria-label="A tiny secret"
          >
            ✨
          </button>
        </div>

        {/* Scroll prompt cue */}
        <div className="hero-scroll-cue stagger-5" aria-hidden="true">
          <span className="scroll-cue-text">Scroll to see what I found 👀</span>
          <div className="scroll-cue-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BirthdayHero;
