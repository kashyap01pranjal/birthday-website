import React, { useEffect, useRef, useState } from "react";

/**
 * PersonalMessage:
 * An intimate, heartfelt letter section with comfortable reading typography,
 * frosted glass styling, and a subtle handwritten script accent.
 */
export const PersonalMessage = ({ config, onTriggerSecret }) => {
  const [isInView, setIsInView] = useState(false);
  const letterRef = useRef(null);

  useEffect(() => {
    const el = letterRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { personalMessage } = config;

  return (
    <section
      id="personal-message"
      ref={letterRef}
      className={`message-section ${isInView ? "message-in-view" : ""}`}
      aria-label="Personal Birthday Letter"
    >
      <div className="message-radial-glow" aria-hidden="true" />

      <div className="message-container">
        {/* Intimate Letter Card */}
        <article className="letter-card">
          <header className="letter-header">
            {personalMessage.eyebrow && (
              <span className="letter-eyebrow">{personalMessage.eyebrow}</span>
            )}
            <h2 className="letter-title">{personalMessage.heading}</h2>
            {personalMessage.handwrittenAccent && (
              <span className="letter-accent-script">
                ~ {personalMessage.handwrittenAccent} ~
              </span>
            )}
          </header>

          <div className="letter-body">
            {personalMessage.paragraphs.map((p, idx) => (
              <p key={idx} className="letter-paragraph">
                {p}
              </p>
            ))}
          </div>

          <footer className="letter-footer">
            <span className="letter-signoff">{personalMessage.signoff}</span>
            <div className="letter-footer-sub">
              <span className="letter-author-script">{personalMessage.authorName}</span>
              {/* Hidden Easter Egg 2 */}
              <button
                type="button"
                className="easter-egg-btn letter-secret-btn"
                onClick={() =>
                  onTriggerSecret &&
                  onTriggerSecret(
                    config.secrets?.letter ||
                      "SECRET UNLOCKED 🔓 You weren't supposed to find that..."
                  )
                }
                aria-label="A hidden sparkle"
              >
                ✧
              </button>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PersonalMessage;
