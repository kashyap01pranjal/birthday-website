import React, { useState, useEffect, useCallback, useRef } from "react";

/**
 * InteractiveSurprises:
 * - Mobile shake detection (DeviceMotion API) with accessible tap fallback
 * - Toast notification manager for hidden Easter egg secrets
 * - Screen flash and floating celebration hearts when shake/tap is triggered
 */
export const InteractiveSurprises = ({ config, activeSecret, onCloseSecret }) => {
  const [shakeRevealed, setShakeRevealed] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [shakeHearts, setShakeHearts] = useState([]);

  const lastShakeTimeRef = useRef(0);
  const shakeDataRef = useRef({ lastX: 0, lastY: 0, lastZ: 0, lastTime: 0 });

  const triggerShakeMagic = useCallback(() => {
    setIsFlashing(true);
    setShakeRevealed(true);

    // Spawn 14 floating celebration stars and confetti
    const symbols = ["✨", "⭐", "🎉", "🌟", "🥳", "✨", "🎊"];
    const sparkles = [];
    for (let i = 0; i < 14; i++) {
      sparkles.push({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * 0.7 + Math.random() * 150,
        size: Math.random() * 18 + 14,
        symbol: symbols[i % symbols.length],
      });
    }
    setShakeHearts(sparkles);

    setTimeout(() => {
      setIsFlashing(false);
    }, 600);

    setTimeout(() => {
      setShakeHearts([]);
    }, 2800);
  }, []);

  // DeviceMotion shake detection
  useEffect(() => {
    const handleDeviceMotion = (e) => {
      const current = e.accelerationIncludingGravity;
      if (!current) return;

      const currentTime = Date.now();
      if (currentTime - lastShakeTimeRef.current < 1000) return; // Prevent spam

      const diffTime = currentTime - shakeDataRef.current.lastTime;
      if (diffTime > 100) {
        const deltaX = Math.abs(current.x - shakeDataRef.current.lastX);
        const deltaY = Math.abs(current.y - shakeDataRef.current.lastY);
        const deltaZ = Math.abs(current.z - shakeDataRef.current.lastZ);

        const speed = ((deltaX + deltaY + deltaZ) / diffTime) * 10000;

        // Shake threshold
        if (speed > 800) {
          lastShakeTimeRef.current = currentTime;
          triggerShakeMagic();
        }

        shakeDataRef.current = {
          lastX: current.x,
          lastY: current.y,
          lastZ: current.z,
          lastTime: currentTime,
        };
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener("devicemotion", handleDeviceMotion, { passive: true });
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener("devicemotion", handleDeviceMotion);
      }
    };
  }, [triggerShakeMagic]);

  const { shakeSurprise } = config;

  return (
    <>
      {/* Screen flash on surprise unlock */}
      {isFlashing && <div className="screen-flash-overlay" aria-hidden="true" />}

      {/* Floating sparkles and stars generated from shake */}
      {shakeHearts.map((h) => (
        <span
          key={h.id}
          className="shake-floating-heart"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
          }}
          aria-hidden="true"
        >
          {h.symbol || "✨"}
        </span>
      ))}

      {/* Shake Surprise Section */}
      {shakeSurprise && (
        <section className="shake-surprise-section" aria-label="Shake for surprise interaction">
          <div className="shake-card">
            {!shakeRevealed ? (
              <>
                <p className="shake-prompt-text">{shakeSurprise.prompt}</p>
                <button
                  type="button"
                  className="shake-fallback-btn"
                  onClick={triggerShakeMagic}
                  aria-label="Tap to unlock surprise"
                >
                  <span>{shakeSurprise.fallbackTap || "or tap here ✨"}</span>
                </button>
              </>
            ) : (
              <div className="shake-revealed-box">
                <span className="shake-revealed-badge">FOUND IT!</span>
                <p className="shake-revealed-text">{shakeSurprise.revealedText}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Easter Egg Floating Toast Message */}
      {activeSecret && (
        <div className="easter-egg-toast" role="alert">
          <div className="toast-inner">
            <span className="toast-icon" aria-hidden="true">
              ✨
            </span>
            <p className="toast-message">{activeSecret}</p>
            <button
              type="button"
              className="toast-close-btn"
              onClick={onCloseSecret}
              aria-label="Dismiss secret message"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveSurprises;
