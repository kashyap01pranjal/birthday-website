import React, { useEffect, useState } from "react";

/**
 * SectionIndicator:
 * Minimal fixed editorial indicator (01, 02, 03, 04, 05)
 * showing current section progress and enabling smooth jump-navigation.
 */
export const SectionIndicator = ({ sections }) => {
  const [activeSection, setActiveSection] = useState("birthday-reveal");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="section-indicator" aria-label="Section navigation">
      <ul className="section-indicator-list">
        {sections.map((sec, index) => {
          const isActive = activeSection === sec.id;
          const num = String(index + 1).padStart(2, "0");

          return (
            <li key={sec.id} className="section-indicator-item">
              <button
                type="button"
                className={`section-indicator-btn ${isActive ? "active" : ""}`}
                onClick={() => scrollTo(sec.id)}
                aria-label={`Scroll to ${sec.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="indicator-number">{num}</span>
                <span className="indicator-dot" />
                <span className="indicator-tooltip">{sec.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SectionIndicator;
