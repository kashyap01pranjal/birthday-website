import React, { useEffect, useRef, useState } from "react";

/**
 * QuoteSection:
 * Full-screen cinematic emotional quote break.
 * Staggers 3 timeless lines with blur-to-focus, opacity, and scale reveals
 * as soon as the user scrolls into view.
 */
export const QuoteSection = ({ config }) => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const quotes = config.quotes || [
    "Some moments become memories.",
    "Some memories become stories.",
    "And some people become unforgettable.",
  ];

  return (
    <section
      id="quote"
      ref={sectionRef}
      className={`quote-section ${isInView ? "quote-in-view" : ""}`}
      aria-label="Cinematic reflection"
    >
      <div className="quote-ambient-light" aria-hidden="true" />

      <div className="quote-container">
        <div className="quote-accent-mark" aria-hidden="true">
          “
        </div>

        <div className="quote-lines">
          {quotes.map((line, index) => (
            <p
              key={index}
              className={`quote-line quote-line-${index + 1}`}
              style={{ "--line-delay": `${index * 0.45 + 0.2}s` }}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="quote-divider" aria-hidden="true" />
      </div>
    </section>
  );
};

export default QuoteSection;
