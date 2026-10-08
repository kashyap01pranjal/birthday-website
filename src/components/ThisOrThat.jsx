import React, { useState } from "react";

/**
 * ThisOrThat:
 * A lighthearted romantic activity comparing two precious memories.
 * When an option is chosen, the selected photo gently expands,
 * the other softens, and a sweet message is shown.
 */
export const ThisOrThat = ({ config, memories }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);

  const { thisOrThat } = config;
  if (!thisOrThat) return null;

  const memoryA =
    memories.find((m) => m.id === thisOrThat.optionA.memoryId) || memories[0];
  const memoryB =
    memories.find((m) => m.id === thisOrThat.optionB.memoryId) || memories[7] || memories[1];

  return (
    <section className="this-or-that-section" aria-label="This or that activity">
      <div className="this-or-that-card">
        <span className="tot-eyebrow">{thisOrThat.eyebrow || "A LITTLE QUESTION..."}</span>
        <h3 className="tot-title">{thisOrThat.question || "Which one would you choose?"}</h3>

        <div className="tot-comparison-grid">
          {/* Choice A */}
          <button
            type="button"
            className={`tot-option-card ${
              selectedChoice === "A"
                ? "is-selected"
                : selectedChoice === "B"
                ? "is-dimmed"
                : ""
            }`}
            onClick={() => setSelectedChoice("A")}
            aria-label={`Choose ${thisOrThat.optionA.label}`}
          >
            <div className="tot-img-frame">
              <img src={memoryA.image} alt="" className="tot-img" />
              {selectedChoice === "A" && <span className="tot-choice-badge">Your Pick ✨</span>}
            </div>
            <span className="tot-btn-label">{thisOrThat.optionA.label}</span>
          </button>

          <div className="tot-divider" aria-hidden="true">
            <span className="tot-or-text">OR</span>
          </div>

          {/* Choice B */}
          <button
            type="button"
            className={`tot-option-card ${
              selectedChoice === "B"
                ? "is-selected"
                : selectedChoice === "A"
                ? "is-dimmed"
                : ""
            }`}
            onClick={() => setSelectedChoice("B")}
            aria-label={`Choose ${thisOrThat.optionB.label}`}
          >
            <div className="tot-img-frame">
              <img src={memoryB.image} alt="" className="tot-img" />
              {selectedChoice === "B" && <span className="tot-choice-badge">Your Pick ✨</span>}
            </div>
            <span className="tot-btn-label">{thisOrThat.optionB.label}</span>
          </button>
        </div>

        {/* Selected Response */}
        {selectedChoice && (
          <div className="tot-response-box">
            <p className="tot-response-text">
              {selectedChoice === "A"
                ? thisOrThat.replyA || "Good choice. I was hoping you'd pick that one. 😂"
                : thisOrThat.replyB || "Hmm... questionable choice. But I'll allow it. 😌"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThisOrThat;
