import React, { useEffect, useRef, useState } from "react";

/**
 * CustomCursor:
 * Subtle ambient rose/champagne cursor follower on desktop.
 * Expands gently on interactive elements.
 * Completely hidden on touch screens or when prefers-reduced-motion is on.
 */
export const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationId;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect hoverable targets
    const handleMouseOver = (e) => {
      const target = e.target.closest("button, a, .memory-card, input, [role='button']");
      setIsHovering(!!target);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Smooth lerp movement loop
    const loop = () => {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor ${isHovering ? "custom-cursor-hover" : ""} ${
        isVisible ? "custom-cursor-visible" : ""
      }`}
      aria-hidden="true"
    />
  );
};

export default CustomCursor;
