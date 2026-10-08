import React, { useState, useRef, useEffect, useCallback } from "react";

/**
 * MemoryPhoto:
 * Enhanced photo card supporting:
 * - Double Tap to Love ❤️ (floating hearts at tap point)
 * - Single Tap to Reveal Story (intimate message with fade/blur/translateY)
 * - Long Press (>650ms) to Focus ("Hold on to this memory...")
 * - Favorite button (saves memory to liked collection)
 * - Click to expand in full lightbox
 */
export const MemoryPhoto = ({
  memory,
  index,
  isFavorite = false,
  onToggleFavorite,
  onOpenLightbox,
  onHoverChange,
  isMobileDeck = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const lastTapRef = useRef(0);
  const pressTimerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const singleTapTimerRef = useRef(null);

  // Gradient themes for graceful fallback
  const fallbackThemes = [
    "linear-gradient(135deg, #1b1622 0%, #2f202a 50%, #151119 100%)",
    "linear-gradient(135deg, #241a23 0%, #36222b 50%, #17121c 100%)",
    "linear-gradient(135deg, #181923 0%, #2b1f2b 50%, #121019 100%)",
    "linear-gradient(135deg, #281d22 0%, #3b272f 50%, #1a1520 100%)",
  ];
  const bgTheme = fallbackThemes[index % fallbackThemes.length];

  // Spawn floating heart at tap point
  const spawnHeartAt = useCallback((clientX, clientY, targetRect) => {
    const x = clientX - targetRect.left;
    const y = clientY - targetRect.top;
    const heartId = Date.now() + Math.random();

    setFloatingHearts((prev) => [...prev, { id: heartId, x, y }]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId));
    }, 1100);
  }, []);

  // Handle pointer down (tracks long press start)
  const handlePointerDown = (e) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };

    pressTimerRef.current = setTimeout(() => {
      setIsLongPressed(true);
    }, 700);
  };

  const handlePointerMove = (e) => {
    // If user dragged more than 8px, it's a swipe/scroll, immediately cancel long press
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 8 || dy > 8) {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    }
  };

  const handlePointerUp = (e) => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);

    if (isLongPressed) {
      setIsLongPressed(false);
      return;
    }

    // Check for drag vs tap
    const dx = Math.abs(e.clientX - startPosRef.current.x);
    const dy = Math.abs(e.clientY - startPosRef.current.y);
    if (dx > 10 || dy > 10) return; // User was dragging, do not handle tap

    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    const rect = e.currentTarget.getBoundingClientRect();

    if (timeSinceLastTap < 320) {
      // DOUBLE TAP DETECTED -> Love ❤️
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
      lastTapRef.current = 0;

      spawnHeartAt(e.clientX, e.clientY, rect);
      if (onToggleFavorite && !isFavorite) {
        onToggleFavorite(memory.id);
      }
    } else {
      // Potential SINGLE TAP -> Wait 320ms to confirm not a double tap
      lastTapRef.current = now;
      singleTapTimerRef.current = setTimeout(() => {
        // Single tap: toggle story reveal
        setShowStory((prev) => !prev);
      }, 320);
    }
  };

  const handlePointerCancel = () => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    setIsLongPressed(false);
  };

  useEffect(() => {
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
      if (singleTapTimerRef.current) clearTimeout(singleTapTimerRef.current);
    };
  }, []);

  return (
    <figure
      className={`memory-card ${isLongPressed ? "is-long-pressed" : ""} ${
        isFavorite ? "is-favorited" : ""
      } ${isMobileDeck ? "is-deck-card" : ""}`}
      style={{
        "--rot": `${memory.rotation || 0}deg`,
        "--y-offset": `${memory.yOffset || 0}px`,
        "--scale": memory.scale || 1,
        "--aspect": memory.aspect || "4/5",
        "--obj-pos": memory.objectPosition || "center 20%",
        "--fit": memory.objectFit || "cover",
        width: memory.width || "280px",
      }}
      onMouseEnter={() => onHoverChange && onHoverChange(true)}
      onMouseLeave={() => onHoverChange && onHoverChange(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      tabIndex={0}
      role="button"
      aria-label={`Photo memory ${index + 1}: ${memory.caption}. Tap to reveal story, double tap to like.`}
    >
      <div className="memory-card-inner">
        {/* Floating Star/Sparkle Particles from Double-Taps */}
        {floatingHearts.map((heart) => (
          <span
            key={heart.id}
            className="floating-tap-heart"
            style={{ left: heart.x, top: heart.y }}
            aria-hidden="true"
          >
            ⭐
          </span>
        ))}

        {/* Long Press Banner Overlay */}
        {isLongPressed && (
          <div className="long-press-indicator" aria-hidden="true">
            <span className="long-press-glow-dot" />
            <span>Wait, looking closer... 👀</span>
          </div>
        )}

        <div className="memory-frame">
          {/* Favorite Star Badge Button */}
          <button
            type="button"
            className={`memory-fav-btn ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(memory.id);
            }}
            aria-label={isFavorite ? "Remove star" : "Star this photo"}
          >
            <span className="fav-heart-icon">{isFavorite ? "⭐" : "☆"}</span>
          </button>

          {!imageError ? (
            <div className={`memory-img-wrapper ${imageLoaded ? "is-loaded" : ""}`}>
              <img
                src={memory.image}
                alt={memory.caption || `Memory moment ${index + 1}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className="memory-img"
              />
              <div className="memory-img-overlay" aria-hidden="true" />

              {/* Story Overlay revealed on single tap */}
              {showStory && (
                <div
                  className="memory-story-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStory(false);
                  }}
                >
                  <span className="story-badge">STORY</span>
                  <p className="story-text">
                    {memory.story || memory.caption || "A moment I'll always remember. ❤️"}
                  </p>
                  <span className="story-close-hint">Tap to flip back</span>
                </div>
              )}

              {/* Fullscreen Expand cue button */}
              <button
                type="button"
                className="memory-expand-cue"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox && onOpenLightbox(memory);
                }}
                aria-label="View photograph in full screen"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
                <span>Full</span>
              </button>
            </div>
          ) : (
            // Graceful luxury fallback
            <div
              className="memory-fallback-card"
              style={{ background: bgTheme }}
              aria-label="Artistic memory placeholder"
            >
              <div className="fallback-inner">
                <span className="fallback-badge">Moment {index + 1}</span>
                <p className="fallback-tag">{memory.tag || "Cherished"}</p>
                <span className="fallback-date">{memory.date || "Forever in heart"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Caption bar */}
        <figcaption className="memory-caption">
          <div className="caption-top">
            <span className="caption-tag-pill">{memory.tag || `Photo ${index + 1}`}</span>
            {isFavorite && <span className="fav-pill">Starred ⭐</span>}
          </div>
          <p className="caption-text">{memory.caption}</p>
          <div className="caption-sub-bar">
            {memory.date && <span className="caption-date">{memory.date}</span>}
            <span className="tap-hint-text">
              {showStory ? "• Back" : "• Tap for the real story"}
            </span>
          </div>
        </figcaption>
      </div>
    </figure>
  );
};

export default MemoryPhoto;
