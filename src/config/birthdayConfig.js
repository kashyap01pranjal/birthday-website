/**
 * ====================================================================
 * BIRTHDAY WEBSITE CONFIGURATION
 * ====================================================================
 * Friendly, playful, warm, and personal tone.
 * Celebrates Nisha Choudhary with fun banter, warm vibes, and great memories.
 */

export const birthdayConfig = {
  // Person being celebrated
  name: "Nisha Choudhary",
  nickname: "Nisha",
  birthdayDate: "Special Day",

  // Section 1: Intro texts (Casual, friendly, zero speeches)
  intro: {
    eyebrow: "HEY YOU 👋",
    title: "I made a little something...",
    subtitle: "Don't worry, it's definitely not a 5-minute speech. 😂",
    buttonText: "Okay, show me →",
    holdPrompt: "Press & hold to enter 👀",
    holdDurationMs: 1500, // Hold for ~1.5 seconds
  },

  // Section 2: Birthday reveal
  reveal: {
    eyebrow: "OKAY, FIRST THINGS FIRST...",
    headline: "HAPPY BIRTHDAY 🎉",
    subtitle: "Yep, you're officially another year older. 😌",
    badge: "LEVEL UNLOCKED 🎮",
  },

  // Section 3: Photo Journey Header ("The Good Stuff")
  memoriesHeader: {
    title: "LOOK WHAT I FOUND 👀",
    subtitle: "Swipe through... I definitely didn't spend way too long choosing these.",
    hint: "← swipe → • Double tap to star ⭐ • Tap for the real story",
  },

  // Random Memory Questions during photo journey (Max 3, friendly friend banter)
  memoryQuestions: [
    {
      triggerAfterIndex: 3, // Appears on photo 4
      question: "Okay, be honest... You remember this, right? 👀",
      options: [
        { label: "Obviously 😂", reply: "Good. I knew you'd remember! 😂" },
        { label: "Nope 😭", reply: "Wow... okay. I'm disappointed. 😂" },
      ],
    },
    {
      triggerAfterIndex: 8, // Appears on photo 9
      question: "Wait... Who actually looked cooler in this moment? 🤭",
      options: [
        { label: "Definitely you 👀", reply: "Haha, respect the honesty! 😂🤝" },
        { label: "100% ME 😎", reply: "Confidence is at 100% today. Love to see it! 😌" },
      ],
    },
    {
      triggerAfterIndex: 14, // Appears on photo 15
      question: "Rate this memory out of 10:",
      options: [
        { label: "Solid 10/10 ✨", reply: "Agreed. Absolute top tier memory right here. 🌟" },
        { label: "11/10 honestly 😂", reply: "Overachiever... but I'll allow it! 🤝" },
      ],
    },
  ],

  // "This or That" Memory Activity (Casual debate)
  thisOrThat: {
    eyebrow: "OKAY, SETTLE THIS...",
    question: "Which photo wins? 👀",
    optionA: {
      memoryId: 1,
      label: "🌅 This moment",
    },
    optionB: {
      memoryId: 8,
      label: "🌙 That moment",
    },
    replyA: "Good choice. I was hoping you'd pick that one. 😂",
    replyB: "Hmm... questionable choice. But I'll allow it. 😌",
    reply: "Good choice! Both are certified classics anyway. ✨",
  },

  // Hidden Easter Egg Secrets (Playful Detective notes)
  secrets: {
    hero: "You found it 👀 Okay, you're actually paying attention.",
    letter: "SECRET UNLOCKED 🔓 You weren't supposed to find that...",
    gallery: "Okay detective, you found the hidden secret. 🕵️‍♂️",
  },

  // Mobile Shake Surprise (Fun & slightly goofy)
  shakeSurprise: {
    prompt: "Okay, there's one weird thing... Try shaking your phone. 😂",
    fallbackTap: "or tap here if shaking looks ridiculous in public 👀",
    revealedText: "HAHA, IT WORKED 😂 Okay, moving on...",
  },

  // Final Hold-to-Reveal step
  finalUnlock: {
    teaser: "WAIT...",
    subteaser: "ONE LAST THING.",
    buttonText: "Hold to reveal 🎉",
    holdDurationMs: 2000,
  },

  // Section 4: Friendly & fun quote breaks
  quotes: [
    "Growing older is mandatory. Growing up is entirely optional. 😌",
    "Some people just make everything 10x more fun. You're definitely one of them. ✨",
    "Here's to another year of questionable decisions and great stories. 🥂",
  ],

  // Section 5: Warm & genuinely friendly note
  personalMessage: {
    eyebrow: "FROM YOUR FAVORITE PERSON (PROBABLY) 😌",
    heading: "A quick birthday note.",
    handwrittenAccent: "cheers to you",
    paragraphs: [
      "Look, I'm not going to write a whole 10-page essay here, but I definitely wanted to take a minute to say Happy Birthday to someone truly awesome.",
      "You bring so much genuine energy, good vibes, and effortless laughter wherever you go. Whether it's random late-night chats, chaotic plans that somehow worked out, or just making ordinary days funny, you're just great to have around.",
      "I hope this year brings you ridiculous amounts of happiness, zero stress, incredible food, and plenty of new funny memories worth adding to this collection next year.",
    ],
    signoff: "Cheers to you always,",
    authorName: "Yours truly 😌",
  },

  // Section 6: Final celebration
  final: {
    topNote: "Okay, that was it 😌",
    eyebrow: "AND FINALLY...",
    headline: "HAPPY BIRTHDAY 🎉",
    nameHeart: "NISHA CHOUDHARY ✨",
    wish: "Hope this year brings you good people, good memories, good food, and a ridiculous amount of fun.",
    replayText: "Wanna see it again? ↻",
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
