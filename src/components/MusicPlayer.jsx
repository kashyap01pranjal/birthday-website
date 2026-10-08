import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * MusicPlayer:
 * Elegant fixed audio controller in bottom-right corner.
 * - Plays /music/birthday.mp3
 * - If file is missing or fails to load, gracefully falls back to an ambient Web Audio API
 *   piano/harmonic chime chord generator so the surprise NEVER fails or breaks!
 * - Animated soundwave visualizer bars
 * - Volume control slider
 * - Fully accessible with aria attributes
 */
export const MusicPlayer = ({ audioSrc, autoStartTrigger }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [showVolume, setShowVolume] = useState(false);
  const [usingFallbackSynth, setUsingFallbackSynth] = useState(false);

  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Fallback ambient harmonic chime generator using Web Audio API
  const startAmbientSynth = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Romantic chord notes: F3, A3, C4, E4, G4 (maj9 warm tones)
      const notes = [174.61, 220.0, 261.63, 329.63, 392.0, 440.0, 523.25];
      let noteIndex = 0;

      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);

      synthIntervalRef.current = setInterval(() => {
        if (!ctx || ctx.state === "closed") return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        osc.type = "sine";
        const freq = notes[noteIndex % notes.length];
        noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 2)) % notes.length;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.08 * volume, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.0);
      }, 1400);

      setUsingFallbackSynth(true);
      setIsPlaying(true);
      setHasStarted(true);
    } catch (e) {
      console.warn("Ambient audio fallback initialized with mute", e);
    }
  }, [volume]);

  const stopAmbientSynth = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  }, []);

  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
          setUsingFallbackSynth(false);
        })
        .catch((err) => {
          console.info("Audio file not found or blocked, activating ambient harmonic fallback:", err);
          // Fall back gracefully to synthesized ambient romantic chimes!
          startAmbientSynth();
        });
    }
  }, [volume, startAmbientSynth]);

  const pauseAudio = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    stopAmbientSynth();
    setIsPlaying(false);
  }, [stopAmbientSynth]);

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      if (usingFallbackSynth) {
        startAmbientSynth();
      } else {
        playAudio();
      }
    }
  };

  // Triggered when user opens the surprise
  useEffect(() => {
    if (autoStartTrigger && !hasStarted) {
      playAudio();
    }
  }, [autoStartTrigger, hasStarted, playAudio]);

  // Handle volume change
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbientSynth();
      if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAmbientSynth]);

  return (
    <div
      className={`music-controller ${isPlaying ? "is-playing" : "is-paused"}`}
      aria-label="Background music controls"
    >
      <audio
        ref={audioRef}
        src={audioSrc || "/music/birthday.mp3"}
        loop
        preload="auto"
        onError={() => {
          // If the MP3 file is missing, we don't crash
          if (isPlaying) {
            startAmbientSynth();
          }
        }}
      />

      {/* Volume Popout Slider */}
      {showVolume && (
        <div className="music-volume-slider-wrap" role="region" aria-label="Volume slider">
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume level"
            className="music-volume-input"
          />
          <span className="music-volume-pct">{Math.round(volume * 100)}%</span>
        </div>
      )}

      {/* Controller Capsule Button */}
      <div className="music-pill">
        <button
          type="button"
          className="music-btn-main"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background music" : "Play background music"}
        >
          {/* Animated sound equalizer bars */}
          <span className="sound-bars" aria-hidden="true">
            <span className={`sound-bar bar-1 ${isPlaying ? "animating" : ""}`} />
            <span className={`sound-bar bar-2 ${isPlaying ? "animating" : ""}`} />
            <span className={`sound-bar bar-3 ${isPlaying ? "animating" : ""}`} />
          </span>

          <span className="music-status-text">
            {!hasStarted ? "♫ Music" : isPlaying ? "♫ Playing" : "♫ Paused"}
          </span>
        </button>

        {/* Volume toggle icon */}
        <button
          type="button"
          className="music-vol-toggle-btn"
          onClick={() => setShowVolume((prev) => !prev)}
          aria-label="Toggle volume slider"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
