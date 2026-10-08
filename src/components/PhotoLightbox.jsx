import React, { useEffect, useCallback } from "react";

/**
 * PhotoLightbox:
 * Cinematic full-screen centered modal for viewing photographs in high resolution.
 * Supports:
 * - Keyboard navigation (Esc to close, Arrow keys to navigate)
 * - Previous / Next controls
 * - Counter indicator (e.g. 03 / 15)
 * - Click backdrop to close
 */
export const PhotoLightbox = ({
  memory,
  currentIndex,
  totalCount,
  onClose,
  onPrev,
  onNext,
}) => {
  // Handle keyboard events (Escape, Left, Right)
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    },
    [onClose, onPrev, onNext]
  );

  // Touch swipe support for mobile devices
  const touchStartX = React.useRef(0);
  const touchEndX = React.useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    // Swipe threshold of 45px
    if (diff > 45) {
      onNext(); // Swiped left -> next photo
    } else if (diff < -45) {
      onPrev(); // Swiped right -> previous photo
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while lightbox is active
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!memory) return null;

  const currentNum = String(currentIndex + 1).padStart(2, "0");
  const totalNum = String(totalCount).padStart(2, "0");

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen photo view"
    >
      <div className="lightbox-backdrop-glow" aria-hidden="true" />

      {/* Top Header bar: counter and close button */}
      <div className="lightbox-topbar" onClick={(e) => e.stopPropagation()}>
        <span className="lightbox-counter">
          {currentNum} <span className="counter-sep">/</span> {totalNum}
        </span>

        <button
          type="button"
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close photo view"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Main Centered Content */}
      <div
        className="lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        <button
          type="button"
          className="lightbox-nav-btn btn-prev"
          onClick={onPrev}
          aria-label="Previous photograph"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Center Frame */}
        <div className="lightbox-figure-wrap">
          <figure className="lightbox-figure">
            <div className="lightbox-img-box">
              <img
                src={memory.image}
                alt={memory.caption || "Full photo memory"}
                className="lightbox-full-img"
              />
            </div>

            <figcaption className="lightbox-caption-box">
              <div className="caption-tag-bar">
                {memory.tag && <span className="lightbox-tag">{memory.tag}</span>}
                {memory.date && <span className="lightbox-date">{memory.date}</span>}
              </div>
              <p className="lightbox-text">{memory.caption}</p>
            </figcaption>
          </figure>
        </div>

        {/* Next Button */}
        <button
          type="button"
          className="lightbox-nav-btn btn-next"
          onClick={onNext}
          aria-label="Next photograph"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PhotoLightbox;
