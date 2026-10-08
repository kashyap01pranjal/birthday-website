import React, { useEffect, useRef } from "react";

/**
 * ParticleBackground:
 * An enchanting, romantic, cinematic midnight background.
 * Features:
 * - 4 drifting Aurora / Nebula luminous orbs (Rose, Champagne, Lavender, Blush)
 * - Shimmering 4-point sparkle stars with pulsing cross rays
 * - Floating golden & rose fairy embers with glowing halos
 * - Dreamy soft bokeh light circles adding photographic depth of field
 * - Occasional graceful shooting stars gliding across the night sky
 * - Subtle desktop mouse glow interaction
 */
export const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Track mouse for subtle interactive starlight glow
    let mouse = { x: width * 0.5, y: height * 0.4, active: false };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 1. Shimmering Sparkle Stars
    const starCount = width < 768 ? 30 : 65;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: 0.015 + Math.random() * 0.025,
        twinklePhase: Math.random() * Math.PI * 2,
        hasCrossRay: Math.random() > 0.6,
        rayLength: Math.random() * 7 + 4,
        hue: Math.random() > 0.5 ? "226, 180, 165" : "245, 230, 210",
      });
    }

    // 2. Floating Fairy Embers
    const emberCount = width < 768 ? 20 : 40;
    const embers = [];
    const emberPalettes = [
      "rgba(240, 160, 150, ", // Soft Rose
      "rgba(245, 210, 165, ", // Champagne Gold
      "rgba(255, 190, 205, ", // Blush Pink
      "rgba(215, 175, 235, ", // Lavender Twilight
    ];

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1.2,
        colorBase: emberPalettes[i % emberPalettes.length],
        alpha: Math.random() * 0.5 + 0.2,
        targetAlpha: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.4 - 0.15,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.015 + Math.random() * 0.02,
        pulseSpeed: 0.01 + Math.random() * 0.015,
      });
    }

    // 3. Dreamy Soft Bokeh Circles
    const bokehCount = width < 768 ? 6 : 14;
    const bokehs = [];
    for (let i = 0; i < bokehCount; i++) {
      bokehs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 35 + 20,
        colorBase: emberPalettes[i % emberPalettes.length],
        alpha: Math.random() * 0.08 + 0.03,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.25 - 0.08,
      });
    }

    // 4. Shooting Star System
    let shootingStar = null;
    let nextShootingStarTime = Date.now() + 4000;

    const spawnShootingStar = () => {
      const startX = Math.random() * width * 0.8 + width * 0.1;
      const startY = Math.random() * height * 0.35;
      const length = Math.random() * 120 + 80;
      const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // ~45 degrees diagonal

      shootingStar = {
        x: startX,
        y: startY,
        length: length,
        speed: Math.random() * 7 + 10,
        angle: angle,
        progress: 0,
        alpha: 0.9,
      };
      nextShootingStarTime = Date.now() + Math.random() * 7000 + 5000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Draw a 4-point sparkle star
    const drawSparkle = (ctx, x, y, size, alpha, hasCross, rayLen, hue) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hue}, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${hue}, ${alpha * 0.8})`;
      ctx.fill();

      if (hasCross && alpha > 0.45) {
        ctx.strokeStyle = `rgba(${hue}, ${alpha * 0.65})`;
        ctx.lineWidth = 0.8;
        // Horizontal ray
        ctx.beginPath();
        ctx.moveTo(x - rayLen, y);
        ctx.lineTo(x + rayLen, y);
        ctx.stroke();
        // Vertical ray
        ctx.beginPath();
        ctx.moveTo(x, y - rayLen);
        ctx.lineTo(x, y + rayLen);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // A. Render Soft Bokeh Circles (deepest background layer)
      for (let i = 0; i < bokehs.length; i++) {
        const b = bokehs[i];
        if (!prefersReducedMotion) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.y < -b.radius) {
            b.y = height + b.radius;
            b.x = Math.random() * width;
          }
          if (b.x < -b.radius) b.x = width + b.radius;
          if (b.x > width + b.radius) b.x = -b.radius;
        }

        const gradient = ctx.createRadialGradient(
          b.x,
          b.y,
          0,
          b.x,
          b.y,
          b.radius
        );
        gradient.addColorStop(0, `${b.colorBase}${b.alpha})`);
        gradient.addColorStop(0.7, `${b.colorBase}${b.alpha * 0.4})`);
        gradient.addColorStop(1, `${b.colorBase}0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // B. Render Twinkling Stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) {
          s.twinklePhase += s.twinkleSpeed;
        }
        const currentAlpha =
          s.alpha * (0.55 + 0.45 * Math.sin(s.twinklePhase));
        drawSparkle(
          ctx,
          s.x,
          s.y,
          s.size,
          currentAlpha,
          s.hasCrossRay,
          s.rayLength,
          s.hue
        );
      }

      // C. Render Floating Fairy Embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        if (!prefersReducedMotion) {
          e.wobble += e.wobbleSpeed;
          e.x += Math.sin(e.wobble) * 0.35 + e.vx;
          e.y += e.vy;

          e.alpha += (e.targetAlpha - e.alpha) * e.pulseSpeed;
          if (Math.abs(e.targetAlpha - e.alpha) < 0.02) {
            e.targetAlpha = Math.random() * 0.6 + 0.2;
          }

          if (e.y < -15) {
            e.y = height + 15;
            e.x = Math.random() * width;
          }
          if (e.x < -15) e.x = width + 15;
          if (e.x > width + 15) e.x = -15;
        }

        // Inner core
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${e.colorBase}${e.alpha})`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `${e.colorBase}0.85)`;
        ctx.fill();

        // Delicate outer halo
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `${e.colorBase}${e.alpha * 0.18})`;
        ctx.fill();
      }

      // D. Render Shooting Star
      if (!prefersReducedMotion) {
        if (!shootingStar && Date.now() > nextShootingStarTime) {
          spawnShootingStar();
        }

        if (shootingStar) {
          shootingStar.progress += shootingStar.speed;
          const headX =
            shootingStar.x +
            Math.cos(shootingStar.angle) * shootingStar.progress;
          const headY =
            shootingStar.y +
            Math.sin(shootingStar.angle) * shootingStar.progress;
          const tailX =
            headX -
            Math.cos(shootingStar.angle) * shootingStar.length;
          const tailY =
            headY -
            Math.sin(shootingStar.angle) * shootingStar.length;

          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, "rgba(235, 215, 195, 0)");
          grad.addColorStop(0.7, "rgba(245, 200, 190, 0.4)");
          grad.addColorStop(1, "rgba(255, 255, 255, 0.95)");

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.lineCap = "round";
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
          ctx.stroke();
          ctx.restore();

          if (
            headX > width + 150 ||
            headY > height + 150 ||
            shootingStar.progress > width * 0.7
          ) {
            shootingStar = null;
          }
        }
      }

      // E. Soft reactive mouse aura on desktop
      if (mouse.active && width > 768) {
        const mouseGlow = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          160
        );
        mouseGlow.addColorStop(0, "rgba(240, 180, 170, 0.06)");
        mouseGlow.addColorStop(1, "rgba(240, 180, 170, 0)");
        ctx.fillStyle = mouseGlow;
        ctx.fillRect(
          mouse.x - 160,
          mouse.y - 160,
          320,
          320
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="particle-container" aria-hidden="true">
      {/* 4 Drifting Aurora / Nebula luminous orbs creating dreamy atmosphere */}
      <div className="aurora-orb aurora-orb-rose" />
      <div className="aurora-orb aurora-orb-champagne" />
      <div className="aurora-orb aurora-orb-lavender" />
      <div className="aurora-orb aurora-orb-blush" />

      {/* Twinkles, embers, bokeh & shooting stars canvas */}
      <canvas ref={canvasRef} className="particle-canvas" />
    </div>
  );
};

export default ParticleBackground;
