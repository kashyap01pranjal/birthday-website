import React, { useState } from "react";
import birthdayConfig from "./config/birthdayConfig";
import memories from "./data/memories";

import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import SectionIndicator from "./components/SectionIndicator";
import Intro from "./components/Intro";
import BirthdayHero from "./components/BirthdayHero";
import MemoryGallery from "./components/MemoryGallery";
import ThisOrThat from "./components/ThisOrThat";
import QuoteSection from "./components/QuoteSection";
import PersonalMessage from "./components/PersonalMessage";
import InteractiveSurprises from "./components/InteractiveSurprises";
import FinalSection from "./components/FinalSection";
import MusicPlayer from "./components/MusicPlayer";

import "./App.css";

const sections = [
  { id: "birthday-reveal", label: "Reveal" },
  { id: "memories", label: "Memories" },
  { id: "quote", label: "Reflection" },
  { id: "personal-message", label: "Letter" },
  { id: "final", label: "Celebration" },
];

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [musicTrigger, setMusicTrigger] = useState(false);
  const [likedMemories, setLikedMemories] = useState([]);
  const [activeSecret, setActiveSecret] = useState(null);

  const handleOpen = () => {
    // 1. Trigger audio safely on user hold/gesture
    setMusicTrigger(true);
    // 2. Mark opened state
    setIsOpened(true);

    // 3. Smooth scroll down to Birthday Hero reveal
    setTimeout(() => {
      const hero = document.getElementById("birthday-reveal");
      if (hero) {
        hero.scrollIntoView({ behavior: "smooth" });
      }
    }, 450);
  };

  const handleToggleFavorite = (memoryId) => {
    setLikedMemories((prev) =>
      prev.includes(memoryId)
        ? prev.filter((id) => id !== memoryId)
        : [...prev, memoryId]
    );
  };

  const handleTriggerSecret = (secretText) => {
    setActiveSecret(secretText);
    setTimeout(() => {
      setActiveSecret((curr) => (curr === secretText ? null : curr));
    }, 4500);
  };

  const handleReplay = () => {
    // Reset interaction states
    setLikedMemories([]);
    setActiveSecret(null);
    setIsOpened(false);

    // Smooth scroll back to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-container">
      {/* Subtle organic noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Ambient particle & aurora lighting canvas */}
      <ParticleBackground />

      {/* Desktop subtle cursor glow follower */}
      <CustomCursor />

      {/* Hidden Easter Egg Toasts & Mobile Shake Surprise */}
      <InteractiveSurprises
        config={birthdayConfig}
        activeSecret={activeSecret}
        onCloseSecret={() => setActiveSecret(null)}
      />

      {/* Intro Entrance Screen (Upgraded with Hold-to-Open) */}
      <Intro config={birthdayConfig} onOpen={handleOpen} isOpened={isOpened} />

      {/* Section Indicator dots (visible once opened) */}
      {isOpened && <SectionIndicator sections={sections} />}

      {/* Main Experience Stream */}
      <main id="experience-main" className="experience-main">
        {/* Section 01: Birthday Reveal */}
        <BirthdayHero
          config={birthdayConfig}
          isOpened={isOpened}
          onTriggerSecret={handleTriggerSecret}
        />

        {/* Section 02: Memory Journey (Interactive Swipe Deck + Stream) */}
        <MemoryGallery
          config={birthdayConfig}
          memories={memories}
          likedMemories={likedMemories}
          onToggleFavorite={handleToggleFavorite}
        />

        {/* Section 02.5: Interactive "This or That" Memory Activity */}
        <ThisOrThat config={birthdayConfig} memories={memories} />

        {/* Section 03: Cinematic Quote Break */}
        <QuoteSection config={birthdayConfig} />

        {/* Section 04: Personal Heartfelt Message with Secret Sparkle */}
        <PersonalMessage
          config={birthdayConfig}
          onTriggerSecret={handleTriggerSecret}
        />

        {/* Section 05: Grand Final Celebration with Hold-to-Reveal */}
        <FinalSection
          config={birthdayConfig}
          likedCount={likedMemories.length}
          onReplay={handleReplay}
        />
      </main>

      {/* Bottom-right audio controller */}
      <MusicPlayer
        audioSrc={birthdayConfig.music?.audioSrc}
        autoStartTrigger={musicTrigger}
      />
    </div>
  );
}

export default App;
