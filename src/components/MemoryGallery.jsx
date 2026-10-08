import React, { useState, useRef, useEffect, useCallback } from "react";
import MemoryPhoto from "./MemoryPhoto";
import PhotoLightbox from "./PhotoLightbox";

/**
 * MemoryGallery:
 * Photographic journey featuring true two-direction smooth card swiping:
 * - Swipe LEFT (←): moves to NEXT memory, current card exits left, next card scales up behind
 * - Swipe RIGHT (→): moves to PREVIOUS memory, current card exits right, previous card scales up behind
 * - 1:1 physical finger tracking via Refs & translate3d (ZERO React re-renders during dragging)
 * - Subtle rotation (-8deg to +8deg)
 * - Velocity-assisted flick detection + 22% distance threshold
 * - Dynamic dual-direction peek cards (reveals next or previous memory stack dynamically)
 * - Elastic boundary resistance at first and last photo (springs back safely)
 * - touch-action: pan-y with smart direction detection (vertical page scrolling unhindered)
 * - Non-intrusive bottom question overlay compatibility (photo stays 100% visible)
 */
export const MemoryGallery = ({
  config,
  memories,
  likedMemories = [],
  onToggleFavorite,
}) => {
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const [viewMode, setViewMode] = useState("deck"); // 'deck' or 'stream'
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  // Non-intrusive card question state
  const [cardQuestion, setCardQuestion] = useState(null);
  const [hasSwipedOnce, setHasSwipedOnce] = useState(false);
  const questionTimerRef = useRef(null);
  const answeredQuestionsRef = useRef(new Set());

  // High-performance swipe physics refs
  const cardRef = useRef(null);
  const peekNextRef = useRef(null);
  const peekPrevRef = useRef(null);
  const isDraggingRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startTimeRef = useRef(0);
  const currentDxRef = useRef(0);
  const directionLockRef = useRef(null); // null | 'horizontal' | 'vertical'
  const pointerIdRef = useRef(null);

  // Preload neighboring images in both directions for instant rendering
  useEffect(() => {
    const next1 = memories[activeDeckIndex + 1]?.image;
    const next2 = memories[activeDeckIndex + 2]?.image;
    const prev1 = memories[activeDeckIndex - 1]?.image;
    if (next1) new Image().src = next1;
    if (next2) new Image().src = next2;
    if (prev1) new Image().src = prev1;
  }, [activeDeckIndex, memories]);

  // Handle Question Appearance: wait 1.8s after photo appears, photo remains visible
  useEffect(() => {
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    setCardQuestion(null);

    if (viewMode !== "deck") return;

    const matchedQ = config.memoryQuestions?.find(
      (q) =>
        q.triggerAfterIndex === activeDeckIndex &&
        !answeredQuestionsRef.current.has(q.triggerAfterIndex)
    );

    if (matchedQ) {
      questionTimerRef.current = setTimeout(() => {
        setCardQuestion({
          ...matchedQ,
          answeredOption: null,
          isClosing: false,
        });
      }, 1800); // 1.8 seconds delay: gives time to enjoy the photo first!
    }

    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, [activeDeckIndex, config.memoryQuestions, viewMode]);

  // Answer Question: subtle glow, fade other, wait 1s, then fade out
  const handleAnswerQuestion = (optIdx) => {
    if (!cardQuestion || cardQuestion.answeredOption !== null) return;

    setCardQuestion((prev) => ({
      ...prev,
      answeredOption: optIdx,
    }));
    answeredQuestionsRef.current.add(cardQuestion.triggerAfterIndex);

    // Wait ~1000ms then smoothly slide/fade question card out
    setTimeout(() => {
      setCardQuestion((prev) => (prev ? { ...prev, isClosing: true } : null));
      setTimeout(() => {
        setCardQuestion(null);
      }, 350);
    }, 1000);
  };

  // Dismiss question via '×' button
  const handleDismissQuestion = (e) => {
    e.stopPropagation();
    if (!cardQuestion) return;
    answeredQuestionsRef.current.add(cardQuestion.triggerAfterIndex);
    setCardQuestion((prev) => ({ ...prev, isClosing: true }));
    setTimeout(() => {
      setCardQuestion(null);
    }, 350);
  };

  // Commit Swipe in either direction with smooth cubic-bezier fly-off and stack promotion
  // direction > 0: Swipe LEFT (deltaX < 0) -> Next Memory
  // direction < 0: Swipe RIGHT (deltaX > 0) -> Previous Memory
  const commitSwipe = useCallback(
    (direction) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setHasSwipedOnce(true);

      // Dismiss pending or active question immediately upon swipe
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
      setCardQuestion(null);

      const exitX = direction > 0 ? -window.innerWidth * 1.25 : window.innerWidth * 1.25;
      const exitRot = direction > 0 ? -12 : 12;

      // Current card flies offscreen smoothly in the swipe direction
      if (cardRef.current) {
        cardRef.current.style.transition =
          "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 280ms ease";
        cardRef.current.style.transform = `translate3d(${exitX}px, 0, 0) rotate(${exitRot}deg)`;
        cardRef.current.style.opacity = "0";
      }

      // Next peek card scales up to full size if moving forward
      if (peekNextRef.current && direction > 0) {
        peekNextRef.current.style.display = "block";
        peekNextRef.current.style.transition =
          "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 280ms ease";
        peekNextRef.current.style.transform = "scale(1) translateY(0)";
        peekNextRef.current.style.opacity = "1";
      }

      // Previous peek card scales up to full size if moving backward
      if (peekPrevRef.current && direction < 0) {
        peekPrevRef.current.style.display = "block";
        peekPrevRef.current.style.transition =
          "transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 280ms ease";
        peekPrevRef.current.style.transform = "scale(1) translateY(0)";
        peekPrevRef.current.style.opacity = "1";
      }

      setTimeout(() => {
        setActiveDeckIndex((prev) => {
          const nextIdx = prev + direction;
          return Math.max(0, Math.min(memories.length - 1, nextIdx));
        });
        currentDxRef.current = 0;

        // Reset front card styles instantly
        if (cardRef.current) {
          cardRef.current.style.transition = "none";
          cardRef.current.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
          cardRef.current.style.opacity = "1";
        }
        // Reset peek next card styles
        if (peekNextRef.current) {
          peekNextRef.current.style.transition = "none";
          peekNextRef.current.style.transform = "scale(0.94) translateY(18px)";
          peekNextRef.current.style.opacity = "0.4";
          peekNextRef.current.style.display = "block";
        }
        // Reset peek prev card styles
        if (peekPrevRef.current) {
          peekPrevRef.current.style.transition = "none";
          peekPrevRef.current.style.transform = "scale(0.94) translateY(18px)";
          peekPrevRef.current.style.opacity = "0.4";
          peekPrevRef.current.style.display = "none";
        }
        isAnimatingRef.current = false;
      }, 280);
    },
    [memories.length]
  );

  // Snap back smoothly when swipe threshold is not met (works in BOTH directions)
  const snapBack = useCallback(() => {
    if (cardRef.current) {
      cardRef.current.style.transition =
        "transform 240ms cubic-bezier(0.25, 1, 0.5, 1)";
      cardRef.current.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
    }
    if (peekNextRef.current) {
      peekNextRef.current.style.transition =
        "transform 240ms cubic-bezier(0.25, 1, 0.5, 1), opacity 240ms ease";
      peekNextRef.current.style.transform = "scale(0.94) translateY(18px)";
      peekNextRef.current.style.opacity = "0.4";
      peekNextRef.current.style.display = "block";
    }
    if (peekPrevRef.current) {
      peekPrevRef.current.style.transition =
        "transform 240ms cubic-bezier(0.25, 1, 0.5, 1), opacity 240ms ease";
      peekPrevRef.current.style.transform = "scale(0.94) translateY(18px)";
      peekPrevRef.current.style.opacity = "0.4";
      peekPrevRef.current.style.display = "none";
    }
    currentDxRef.current = 0;
  }, []);

  // Pointer gesture handlers with zero React re-renders during drag
  const handlePointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return; // Only primary clicks
    if (isAnimatingRef.current) return;

    // Do not initiate swipe if clicking buttons or interactive elements
    if (
      e.target.closest(
        "button, .photo-question-card, .photo-opt-btn, .question-close-btn, .memory-fav-btn, .memory-expand-cue"
      )
    ) {
      return;
    }

    isDraggingRef.current = true;
    directionLockRef.current = null;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startTimeRef.current = Date.now();
    currentDxRef.current = 0;
    pointerIdRef.current = e.pointerId;

    if (cardRef.current) {
      cardRef.current.style.transition = "none";
    }
    if (peekNextRef.current) {
      peekNextRef.current.style.transition = "none";
    }
    if (peekPrevRef.current) {
      peekPrevRef.current.style.transition = "none";
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || isAnimatingRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Initial direction detection: don't hijack vertical scrolling!
    if (directionLockRef.current === null) {
      if (absDx < 6 && absDy < 6) return; // Tiny noise

      if (absDy > absDx) {
        // Vertical scroll intent: release drag and let page scroll naturally
        directionLockRef.current = "vertical";
        isDraggingRef.current = false;
        return;
      } else {
        // Horizontal swipe intent: capture pointer and track gesture
        directionLockRef.current = "horizontal";
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    if (directionLockRef.current === "horizontal") {
      let effectiveDx = dx;
      const isAtStart = activeDeckIndex === 0 && dx > 0;
      const isAtEnd = activeDeckIndex === memories.length - 1 && dx < 0;

      // Boundary elastic resistance at the start (swiping right) and end (swiping left)
      if (isAtStart || isAtEnd) {
        effectiveDx = dx * 0.32;
      }

      currentDxRef.current = effectiveDx;

      // Rotation clamped between -8deg and +8deg
      // dx < 0 (left): negative rotation (counter-clockwise)
      // dx > 0 (right): positive rotation (clockwise)
      const rotation = Math.max(-8, Math.min(8, effectiveDx * 0.04));

      // Direct DOM transform update: ZERO React re-renders!
      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${effectiveDx}px, 0, 0) rotate(${rotation}deg)`;
      }

      const dragDistance = Math.abs(effectiveDx);
      const dragProgress = Math.min(dragDistance / 130, 1);
      const scale = 0.94 + 0.06 * dragProgress;
      const opacity = 0.4 + 0.6 * dragProgress;
      const yOffset = 18 * (1 - dragProgress);

      // Smooth peek card reaction in BOTH directions:
      if (effectiveDx < 0) {
        // Dragging LEFT (Next memory preview in stack)
        if (peekNextRef.current && activeDeckIndex < memories.length - 1) {
          peekNextRef.current.style.display = "block";
          peekNextRef.current.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
          peekNextRef.current.style.opacity = opacity;
        }
        if (peekPrevRef.current) {
          peekPrevRef.current.style.display = "none";
        }
      } else if (effectiveDx > 0) {
        // Dragging RIGHT (Previous memory preview in stack)
        if (peekPrevRef.current && activeDeckIndex > 0) {
          peekPrevRef.current.style.display = "block";
          peekPrevRef.current.style.transform = `scale(${scale}) translateY(${yOffset}px)`;
          peekPrevRef.current.style.opacity = opacity;
        }
        if (peekNextRef.current) {
          peekNextRef.current.style.display = "none";
        }
      }
    }
  };

  const handlePointerEnd = (e) => {
    if (!isDraggingRef.current || isAnimatingRef.current) {
      isDraggingRef.current = false;
      return;
    }

    isDraggingRef.current = false;

    try {
      if (pointerIdRef.current !== null) {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      }
    } catch (err) {}

    const dx = currentDxRef.current;
    const absDx = Math.abs(dx);
    const deltaTime = Math.max(1, Date.now() - startTimeRef.current);
    const velocity = absDx / deltaTime; // px per ms

    const cardWidth = cardRef.current ? cardRef.current.offsetWidth : 300;
    const distanceThreshold = Math.min(90, Math.max(60, cardWidth * 0.22)); // 60px to 90px
    const isFlick = velocity > 0.42 && absDx > 24; // Quick flick velocity detection

    const shouldSwipe =
      (absDx >= distanceThreshold || isFlick) &&
      directionLockRef.current === "horizontal";

    if (shouldSwipe) {
      if (dx < 0 && activeDeckIndex < memories.length - 1) {
        // Swipe LEFT -> NEXT PHOTO
        commitSwipe(1);
        return;
      } else if (dx > 0 && activeDeckIndex > 0) {
        // Swipe RIGHT -> PREVIOUS PHOTO
        commitSwipe(-1);
        return;
      }
    }

    // Didn't meet threshold or boundary hit -> spring back smoothly
    snapBack();
  };

  // Keyboard navigation support for desktop users
  useEffect(() => {
    if (viewMode !== "deck") return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && activeDeckIndex > 0) {
        commitSwipe(-1);
      } else if (e.key === "ArrowRight" && activeDeckIndex < memories.length - 1) {
        commitSwipe(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, activeDeckIndex, memories.length, commitSwipe]);

  const nextCard = useCallback(() => {
    if (activeDeckIndex < memories.length - 1) {
      commitSwipe(1);
    }
  }, [activeDeckIndex, memories.length, commitSwipe]);

  const prevCard = useCallback(() => {
    if (activeDeckIndex > 0) {
      commitSwipe(-1);
    }
  }, [activeDeckIndex, commitSwipe]);

  // Continuous Stream split (10 per row)
  const half = Math.ceil(memories.length / 2);
  const row1Memories = memories.slice(0, half);
  const row2Memories = memories.slice(half);
  const seamlessRow1 = [...row1Memories, ...row1Memories];
  const seamlessRow2 = [...row2Memories, ...row2Memories];

  const currentMemory = memories[activeDeckIndex];
  const progressPercent = ((activeDeckIndex + 1) / memories.length) * 100;
  const currentNum = String(activeDeckIndex + 1).padStart(2, "0");
  const totalNum = String(memories.length).padStart(2, "0");

  return (
    <section id="memories" className="memories-section" aria-label="Photo Memories Journey">
      {/* Section Header */}
      <div className="memories-header">
        <span className="memories-eyebrow">PHOTO JOURNEY</span>
        <h2 className="memories-title">{config.memoriesHeader.title}</h2>
        <p className="memories-subtitle">{config.memoriesHeader.subtitle}</p>

        {/* View Mode Toggle Button */}
        <div className="gallery-mode-toggle">
          <button
            type="button"
            className={`mode-btn ${viewMode === "deck" ? "active" : ""}`}
            onClick={() => setViewMode("deck")}
            aria-label="Switch to interactive swipe deck mode"
          >
            <span>🃏 Swipe Cards</span>
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === "stream" ? "active" : ""}`}
            onClick={() => setViewMode("stream")}
            aria-label="Switch to continuous floating stream mode"
          >
            <span>🌊 Stream Flow</span>
          </button>
        </div>

        {/* Memory Progress Indicator */}
        <div className="memory-progress-wrap" aria-label="Memory progress">
          <div className="progress-label-row">
            <span className="progress-tag">PHOTOS</span>
            <span className="progress-counter">
              {currentNum} <span className="sep">/</span> {totalNum}
            </span>
          </div>
          <div className="progress-track-line">
            <div
              className="progress-fill-line"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="progress-dot-handle"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          <span className="memories-hint">
            {viewMode === "deck"
              ? (config.memoriesHeader?.hint || "← swipe → • Double tap to star ⭐ • Tap for real story")
              : "Click any photo to view in full • Hover to pause"}
          </span>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE SWIPEABLE CARD DECK (Mobile-First) */}
      {viewMode === "deck" ? (
        <div className="deck-container">
          <div
            className="deck-stage"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
          >
            {/* Subtle one-time swipe hint on the very first photo */}
            {activeDeckIndex === 0 && !hasSwipedOnce && (
              <div className="first-photo-swipe-hint" aria-hidden="true">
                <span>← swipe →</span>
              </div>
            )}
            {/* Background Peeking Card (NEXT memory preview) */}
            {activeDeckIndex < memories.length - 1 && (
              <div
                ref={peekNextRef}
                className="deck-peek-card deck-peek-next"
                aria-hidden="true"
              >
                <img
                  src={memories[activeDeckIndex + 1].image}
                  alt=""
                  className="peek-img"
                />
              </div>
            )}

            {/* Background Peeking Card (PREVIOUS memory preview) */}
            {activeDeckIndex > 0 && (
              <div
                ref={peekPrevRef}
                className="deck-peek-card deck-peek-prev"
                style={{ display: "none" }}
                aria-hidden="true"
              >
                <img
                  src={memories[activeDeckIndex - 1].image}
                  alt=""
                  className="peek-img"
                />
              </div>
            )}

            {/* Current Active Interactive Card */}
            <div
              ref={cardRef}
              className="deck-active-card"
              style={{
                transform: "translate3d(0, 0, 0) rotate(0deg)",
              }}
            >
              <MemoryPhoto
                memory={currentMemory}
                index={activeDeckIndex}
                isFavorite={likedMemories.includes(currentMemory.id)}
                onToggleFavorite={onToggleFavorite}
                onOpenLightbox={() => setSelectedPhotoIndex(activeDeckIndex)}
                isMobileDeck={true}
              />

              {/* NON-INTRUSIVE BOTTOM QUESTION CARD (Photo remains visible!) */}
              {cardQuestion && (
                <div
                  className={`photo-question-card ${
                    cardQuestion.isClosing ? "is-closing" : ""
                  }`}
                  onPointerDown={(e) => e.stopPropagation()}
                  role="region"
                  aria-label="Memory question"
                >
                  <button
                    type="button"
                    className="question-close-btn"
                    onClick={handleDismissQuestion}
                    aria-label="Skip question"
                  >
                    ×
                  </button>

                  <span className="photo-question-eyebrow">WAIT...</span>
                  <p className="photo-question-text">{cardQuestion.question}</p>

                  <div className="photo-question-options">
                    {cardQuestion.options.map((opt, optIdx) => {
                      const isSelected = cardQuestion.answeredOption === optIdx;
                      const isOther =
                        cardQuestion.answeredOption !== null && !isSelected;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          className={`photo-opt-btn ${
                            isSelected ? "selected" : ""
                          } ${isOther ? "faded" : ""}`}
                          disabled={cardQuestion.answeredOption !== null}
                          onClick={() => handleAnswerQuestion(optIdx)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Playful Romantic Reply */}
                  {cardQuestion.answeredOption !== null && (
                    <div className="photo-question-reply">
                      <p className="photo-reply-text">
                        {cardQuestion.options[cardQuestion.answeredOption].reply}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Thumb-friendly Deck Navigation Controls */}
          <div className="deck-controls">
            <button
              type="button"
              className="deck-nav-btn btn-prev"
              onClick={prevCard}
              disabled={activeDeckIndex === 0}
              aria-label="Previous memory card"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Prev</span>
            </button>

            <span className="deck-fav-counter">
              {likedMemories.includes(currentMemory.id)
                ? "⭐ Starred"
                : "☆ Double tap to star"}
            </span>

            <button
              type="button"
              className="deck-nav-btn btn-next"
              onClick={nextCard}
              disabled={activeDeckIndex === memories.length - 1}
              aria-label="Next memory card"
            >
              <span>Next</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        /* VIEW 2: CONTINUOUS FLOATING STREAMS */
        <div className="stream-viewport">
          <div className="stream-row stream-row-1" aria-label="Memories row 1">
            <div className="stream-track stream-track-ltr">
              {seamlessRow1.map((mem, index) => (
                <MemoryPhoto
                  key={`r1-${mem.id}-${index}`}
                  memory={mem}
                  index={index}
                  isFavorite={likedMemories.includes(mem.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenLightbox={() =>
                    setSelectedPhotoIndex(
                      memories.findIndex((m) => m.id === mem.id)
                    )
                  }
                />
              ))}
            </div>
          </div>

          <div className="stream-row stream-row-2" aria-label="Memories row 2">
            <div className="stream-track stream-track-rtl">
              {seamlessRow2.map((mem, index) => (
                <MemoryPhoto
                  key={`r2-${mem.id}-${index}`}
                  memory={mem}
                  index={index}
                  isFavorite={likedMemories.includes(mem.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpenLightbox={() =>
                    setSelectedPhotoIndex(
                      memories.findIndex((m) => m.id === mem.id)
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoLightbox
          memory={memories[selectedPhotoIndex]}
          currentIndex={selectedPhotoIndex}
          totalCount={memories.length}
          onClose={() => setSelectedPhotoIndex(null)}
          onPrev={() =>
            setSelectedPhotoIndex(
              (prev) => (prev - 1 + memories.length) % memories.length
            )
          }
          onNext={() =>
            setSelectedPhotoIndex((prev) => (prev + 1) % memories.length)
          }
        />
      )}
    </section>
  );
};

export default MemoryGallery;
