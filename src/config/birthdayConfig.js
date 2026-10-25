/**
 * ====================================================================
 * BIRTHDAY WEBSITE CONFIGURATION
 * ====================================================================
 * Professional, respectful, warm, and heartfelt tribute.
 * Celebrates Ritu Roongta ("Ritu Ma'am") as an inspiring boss and mentor.
 */

export const birthdayConfig = {
  // Person being celebrated
  name: "Ritu Roongta",
  nickname: "Ritu Ma'am",
  birthdayDate: "Special Day",

  // Section 1: Intro texts
  intro: {
    eyebrow: "A SPECIAL BIRTHDAY TRIBUTE ✨",
    title: "A Celebration of Leadership",
    subtitle: "Dedicated to an inspiring mentor, guide, and leader on her special day.",
    buttonText: "Explore Tribute →",
    holdPrompt: "Press & hold to enter ✨",
    holdDurationMs: 1500, // Hold for ~1.5 seconds
  },

  // Section 2: Birthday reveal
  reveal: {
    eyebrow: "WARMEST BIRTHDAY WISHES ✨",
    headline: "HAPPY BIRTHDAY",
    subtitle: "Wishing you a wonderful year filled with happiness, good health, success, and fulfillment.",
    scrollCue: "Scroll to explore the highlights ↓",
    badge: "INSPIRING LEADER 🌟",
  },

  // Section 3: Photo Journey Header ("Moments & Milestones")
  memoriesHeader: {
    title: "MOMENTS & MILESTONES ✨",
    subtitle: "A curated collection celebrating leadership, inspiration, and memorable journeys.",
    hint: "← swipe → • Double tap to star ⭐ • Tap for a reflection",
  },

  // Thoughtful reflection questions during photo journey
  memoryQuestions: [
    {
      triggerAfterIndex: 3, // Appears on photo 4
      question: "Which quality best reflects Ritu Ma'am's leadership?",
      options: [
        { label: "Visionary & Inspiring ✨", reply: "Truly! A vision that constantly motivates and elevates everyone around her. 🌟" },
        { label: "Calm & Supportive 🤝", reply: "Absolutely! Calm guidance that brings out the very best in the team. 👏" },
      ],
    },
    {
      triggerAfterIndex: 8, // Appears on photo 9
      question: "What makes working with Ritu Ma'am most rewarding?",
      options: [
        { label: "Learning every day 📈", reply: "Indeed! The most valuable lessons come from leaders who lead by example. ✨" },
        { label: "Encouragement & Trust 🌟", reply: "So true! Her trust and encouragement make all the difference. 🤝" },
      ],
    },
    {
      triggerAfterIndex: 14, // Appears on photo 15
      question: "Wishing Ritu Ma'am the absolute best year ahead:",
      options: [
        { label: "Health & Happiness 🌿", reply: "May this year bring immense peace, vitality, and joyful moments! 🥂" },
        { label: "Great Milestones & Success 🏆", reply: "Here's to reaching new heights and celebrated achievements! 🎉" },
      ],
    },
  ],

  // "This or That" Memory Activity (Respectful celebration comparison)
  thisOrThat: {
    eyebrow: "A MOMENT IN THE SPOTLIGHT...",
    question: "Which moment captures the celebration best? ✨",
    optionA: {
      memoryId: 1,
      label: "🏛️ Leadership & Vision",
    },
    optionB: {
      memoryId: 8,
      label: "🌅 Serenity & Celebration",
    },
    replyA: "An exceptional moment reflecting true dedication and leadership! ✨",
    replyB: "A wonderful celebration of serenity, joy, and success! 🌟",
    reply: "Both capture the spirit of an inspiring mentor and leader! ✨",
  },

  // Hidden Easter Egg Secrets (Respectful, positive appreciation)
  secrets: {
    hero: "A mentor who inspires excellence and dedication every single day. ✨",
    letter: "Thank you for your guidance, encouragement, and trust, Ritu Ma'am! 🌟",
    gallery: "Celebrating an exceptional leader and a wonderful year ahead! 🏆",
  },

  // Mobile Shake Surprise (Tasteful celebration)
  shakeSurprise: {
    prompt: "A little extra birthday sparkle for Ritu Ma'am ✨",
    fallbackTap: "Tap here to celebrate 🎉",
    revealedText: "Wishing you immense joy, good health, and continued success, Ritu Ma'am! 🥂",
  },

  // Final Hold-to-Reveal step
  finalUnlock: {
    teaser: "AND ONE MORE THING...",
    subteaser: "WARMEST WISHES AHEAD.",
    buttonText: "Hold to reveal 🎉",
    holdDurationMs: 2000,
  },

  // Section 4: Inspiring reflections on mentorship and growth
  quotes: [
    "Great leaders don't just guide the way; they inspire others to find their own.",
    "Some of the most valuable lessons come from the people we have the privilege to learn from.",
    "The best mentors leave a lasting impact through the knowledge they share and the confidence they inspire.",
  ],

  // Section 5: Heartfelt letter of appreciation from an employee
  personalMessage: {
    eyebrow: "WITH SINCERE GRATITUDE ✉️",
    heading: "A Birthday Note for Ritu Ma'am",
    handwrittenAccent: "with appreciation & respect",
    paragraphs: [
      "Dear Ritu Ma'am, on your special day, I wanted to take a moment to express my sincere appreciation for your guidance, encouragement, and leadership.",
      "Working under your mentorship has been an invaluable learning experience. I have learned so much from the way you think, lead, and handle challenges with poise, and I continue learning from you every single day. Your trust and support have made a genuine difference in my professional growth.",
      "Thank you for always inspiring us with your dedication and for being such an exceptional leader and mentor. May this new year bring you abundant happiness, great health, continued success, and countless reasons to smile.",
    ],
    signoff: "With sincere respect and best wishes always,",
    authorName: "Your team member & mentee ✨",
  },

  // Section 6: Final celebration
  final: {
    topNote: "A heartfelt tribute to an exceptional mentor",
    eyebrow: "WARMEST WISHES",
    headline: "HAPPY BIRTHDAY",
    nameHeart: "RITU ROONGTA ✨",
    wish: "May this upcoming year bring you the same inspiration, positivity, and success that you bring to the people around you. Happy Birthday, Ritu Ma'am!",
    replayText: "View the tribute again ↺",
  },

  // Music configuration
  music: {
    audioSrc: "/music/birthday.mp3",
    trackTitle: "Good Vibes & Strings",
    autoScrollAfterOpen: true,
  },

  // Warm, clean, modern palette tokens (Black, Warm Cream, Amber, Subtle Violet)
  theme: {
    bgDark: "#08070B",
    bgCard: "rgba(22, 19, 28, 0.65)",
    textPrimary: "#FAF7F5",
    textMuted: "#B4ACB8",
    accentRose: "#E0A96D", // warm champagne / amber
    accentBlush: "#F4EDE4", // warm cream
    accentChampagne: "#E8D8C8",
    accentViolet: "#A894DC", // subtle modern violet
    glowPink: "rgba(224, 169, 109, 0.2)",
    borderGlass: "rgba(232, 216, 200, 0.16)",
  },
};

export default birthdayConfig;
