import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * FinalSection:
 * Emotional grand finale upgraded with:
 * - Secret Final Unlock: Press & hold for 2s to unlock the final reveal
 * - Background darkens and progress ring fills during hold
 * - Shows count of saved favorite memories ("You picked 4 favorite memories. ❤️")
 * - Emotional wishes: "May this year give you a thousand reasons to smile."
 * - Elegant champagne & rose celebration confetti canvas
 * - Replay the journey without page refresh
 */
export const FinalSection = ({
  config,
  likedCount = 0,
  onReplay,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const holdStartRef = useRef(null);
  const animFrameRef = useRef(null);

  const holdDuration = config.finalUnlock?.holdDurationMs || 2000;

  // Final hold-to-reveal physics
  const updateHold = useCallback(() => {
    if (!holdStartRef.current) return;
    const elapsed = Date.now() - holdStartRef.current;
    const p = Math.min(1, elapsed / holdDuration);
    setHoldProgress(p);

    if (p >= 1) {
      setIsHolding(false);
      holdStartRef.current = null;
      // 500ms suspense pause before opening grand finale
      setTimeout(() => {
        setIsUnlocked(true);
      }, 500);
    } else {
      animFrameRef.current = requestAnimationFrame(updateHold);
    }
  }, [holdDuration]);

  const startHold = (e) => {
    if (isUnlocked) return;
    if (e && e.cancelable) e.preventDefault();
    setIsHolding(true);
    holdStartRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const endHold = () => {
    if (isUnlocked) return;
    setIsHolding(false);
    holdStartRef.current = null;
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Elegant celebration confetti & glowing hearts canvas
  useEffect(() => {
    if (!isUnlocked) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const palette = [
      "rgba(232, 216, 200, ", // champagne
      "rgba(226, 164, 153, ", // soft rose
      "rgba(246, 213, 205, ", // blush
      "rgba(245, 236, 226, ", // warm off-white
      "rgba(212, 175, 140, ", // gentle gold
    ];

    const particleCount = window.innerWidth < 768 ? 45 : 80;
    const items = [];

    for (let i = 0; i < particleCount; i++) {
      items.push({
        x: Math.random() * width,
        y: Math.random() * height - height * 0.5,
        type: i % 4 === 0 ? "sparkle" : i % 3 === 0 ? "star" : "ribbon",
        size: Math.random() * 5 + 4,
        colorBase: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.8,
        vy: Math.random() * 1.2 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.03 + Math.random() * 0.02,
      });
    }

    const drawSparkle = (ctx, x, y, size) => {
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.quadraticCurveTo(x, y, x + size, y);
      ctx.quadraticCurveTo(x, y, x, y + size);
      ctx.quadraticCurveTo(x, y, x - size, y);
      ctx.quadraticCurveTo(x, y, x, y - size);
      ctx.fill();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.y += item.vy;
        item.x += Math.sin(item.wobble) * 0.6 + item.vx;
        item.wobble += item.wobbleSpeed;
        item.rotation += item.rotSpeed;

        if (item.y > height + 20) {
          item.y = -20;
          item.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.fillStyle = `${item.colorBase}${item.alpha})`;

        if (item.type === "sparkle") {
          drawSparkle(ctx, 0, 0, item.size * 1.5);
        } else if (item.type === "star") {
          ctx.beginPath();
          ctx.arc(0, 0, item.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-item.size, -item.size * 0.3, item.size * 2, item.size * 0.6);
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isUnlocked]);

  // SVG Circular progress math (radius 48)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - holdProgress);

  return (
    <section
      id="final"
      ref={sectionRef}
      className={`final-section ${isUnlocked ? "final-revealed" : "final-locked"}`}
      style={{
        backgroundColor: `rgba(8, 7, 11, ${0.85 + holdProgress * 0.15})`,
      }}
      aria-label="Final Celebration"
    >
      {/* Soft warm pink celebration glow background */}
      <div className="final-warm-glow" aria-hidden="true" />
      <canvas ref={canvasRef} className="final-canvas" aria-hidden="true" />

      {/* STEP 1: SECRET FINAL UNLOCK (Hold to reveal) */}
      {!isUnlocked ? (
        <div className="final-lock-stage">
          <span className="final-lock-eyebrow">
            {config.finalUnlock?.teaser || "You've seen the memories..."}
          </span>
          <h2 className="final-lock-title">
            {config.finalUnlock?.subteaser || "There's one more thing."}
          </h2>

          <div className="final-hold-wrap">
            <button
              type="button"
              className={`final-hold-btn ${isHolding ? "is-holding" : ""}`}
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
              aria-label="Press and hold for 2 seconds to reveal final birthday wish"
            >
              <svg
                className="final-hold-svg"
                width="108"
                height="108"
                viewBox="0 0 108 108"
                aria-hidden="true"
              >
                <circle cx="54" cy="54" r={radius} className="progress-track" />
                <circle
                  cx="54"
                  cy="54"
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
                  {holdProgress >= 1 ? "✨" : "🔒"}
                </span>
                <span className="hold-label">
                  {isHolding
                    ? `${Math.round(holdProgress * 100)}%`
                    : config.finalUnlock?.buttonText || "Hold to reveal"}
                </span>
              </div>
            </button>
            <span className="final-hold-hint">
              {isHolding ? "Almost there..." : "Press and hold for 2 seconds"}
            </span>
          </div>
        </div>
      ) : (
        /* STEP 2: THE GRAND CELEBRATION REVEAL */
        <div className="final-content">
          {config.final.topNote && (
            <p className="final-top-note">{config.final.topNote}</p>
          )}

          <span className="final-eyebrow">{config.final.eyebrow}</span>

          <h2 className="final-title">{config.final.headline}</h2>

          <div className="final-name-wrap">
            <h1 className="final-name">
              {config.final.nameHeart || `${config.name} ✨`}
            </h1>
          </div>

          <p className="final-wish">
            {config.final.wish || "Hope this year brings you good people, good memories, good food, and a ridiculous amount of fun."}
          </p>

          {/* Show favorite memories count if user interacted */}
          {likedCount > 0 && (
            <div className="final-favorites-summary">
              <span className="summary-heart" aria-hidden="true">
                ⭐
              </span>
              <span>
                You picked <strong>{likedCount}</strong> favorite {likedCount === 1 ? "photo" : "photos"}! ⭐
              </span>
            </div>
          )}

          <div className="final-actions">
            <button
              type="button"
              className="final-replay-btn"
              onClick={onReplay}
              aria-label="Replay from the start"
            >
              <span className="replay-icon" aria-hidden="true">
                ↺
              </span>
              <span>{config.final.replayText || "Wanna see it again? ↻"}</span>
            </button>
          </div>

          <div className="final-credits">
            <span>Made for Nisha Choudhary 😌</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default FinalSection;
