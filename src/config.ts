export const siteConfig = {
  name: "Gonzague Teisseire",
  kicker: "MSc @ EDHEC · Lille / London",
  title: "I make things, then I make people care about them.",
  roles: ["AI tools", "RAG pipelines", "desktop apps", "launch films", "pitches"],
  stats: [
    { value: 0.89, decimals: 2, suffix: "", label: "MRR on recall's retrieval eval" },
    { value: 80, decimals: 0, suffix: "%", label: "mindwatch agreement on held-out labels" },
    { value: 3, decimals: 0, suffix: "", label: "Top-3 finish, EDHEC Sustainability Challenge", prefix: "Top " },
    { value: 6, decimals: 0, suffix: "+", label: "founders interviewed on Entrepreneurship Bites" },
  ],
  photo: {
    src: "/img/hero.jpg",
    alt: "Gonzague speaking on stage at EDHEC",
    caption: "On stage at EDHEC, 2026",
  },
  description:
    "Gonzague Teisseire: MSc student at EDHEC who builds AI tools and takes them from prototype to pitch.",
  accentColor: "#2547d0",
  social: {
    email: "gonzague.teisseire@gmail.com",
    linkedin: "https://www.linkedin.com/in/gonzague-teisseire/",
    twitter: "https://x.com/offrekordd",
    github: "https://github.com/gztes",
  },
  aboutMe:
    "Commercial profile who can also build. I ran marketing campaigns end to end at an AI startup in London, co-founded an entrepreneurship podcast at Imperial College London, and design AI apps and tools from prototype to pitch. MSc student at EDHEC after Imperial and ESCP. French and British, bilingual.",
  skills: [
    "Python",
    "TypeScript",
    "React",
    "Electron",
    "RAG",
    "Claude API",
    "Gemini",
    "Whisper",
    "Product marketing",
    "HubSpot",
  ],
  projects: [
    {
      name: "recall",
      category: ["AI"],
      description:
        "Ask questions about your own notes and get answers that cite the exact note they came from. A RAG pipeline built from scratch: local embeddings, Chroma, Claude for the answer. Retrieval scored at 0.89 MRR on a labelled question set.",
      link: "https://github.com/gztes/recall",
      terminal: `$ recall search "how big should my position be" -k 2
[1] 0.63  quant/kelly.md
    # Kelly criterion  Kelly tells you what fraction
    of your bankroll to stake on a bet with a known edge...
[2] 0.62  ml/attention.md
    # Attention  Attention lets every token in a sequence
    look at every other token...`,
      skills: ["Python", "Chroma", "Claude API"],
    },
    {
      name: "mindwatch",
      category: ["AI"],
      description:
        "Reads every save in my mymind, scores it against my goals, watches the best videos, and measures itself: 64% to 80% agreement on held-out hand labels.",
      link: "https://github.com/gztes/mindwatch",
      skills: ["Python", "LLM evals"],
    },
    {
      name: "Huddle",
      category: ["AI", "Product"],
      description:
        "Windows call companion. On-device Whisper transcription, with live suggestions from Gemini while you talk.",
      link: "https://github.com/gztes/huddle",
      image: "/img/huddle.jpg",
      skills: ["Electron", "Whisper", "Gemini"],
    },
    {
      name: "Clicky for Windows",
      category: ["AI", "Product"],
      description:
        "Windows rewrite of Farza's macOS assistant Clicky: local voice, multi-screen capture, and an on-screen pointer that shows you where to click.",
      link: "https://github.com/gztes/clicky-windows",
      image: "/img/clicky.jpg",
      skills: ["Electron", "TypeScript"],
    },
    {
      name: "Loop",
      category: ["Product", "Creative"],
      description:
        "Top-three finalist at the EDHEC Sustainability Challenge 2026. Team project: I built the digital wardrobe app prototype, the website and the promo film, and gave the final pitch.",
      link: "https://github.com/gztes/loop",
      image: "/img/loop.jpg",
      skills: ["Prototype", "Pitch", "Film"],
    },
  ],
  experience: [
    {
      company: "Gentek.ai · London / Lisbon",
      title: "Marketing, Sales & Product Intern",
      dateRange: "May – Aug 2025",
      bullets: [
        "Trusted by the founders of a 13-person AI startup to run marketing campaigns end to end, from strategy to execution",
        "Mapped user journeys for two AI products with the engineering team; internal platform demo",
      ],
    },
    {
      company: "Cosysense · London (Imperial College project)",
      title: "Business Model Consultant",
      dateRange: "Jan – Apr 2026",
      bullets: [
        "Climate-tech startup using AI to optimise energy consumption",
        "Business model analysis: Business Model Canvas, revenue model viability, customer segment choice",
      ],
    },
    {
      company: "Entrepreneurship Bites · Imperial College London",
      title: "Co-founder, host & producer",
      dateRange: "Nov 2025 – Sept 2026",
      bullets: [
        "Interviewed more than six serial entrepreneurs; booking, recording, publishing, then handover",
      ],
    },
    {
      company: "JET ESCP · London",
      title: "Business Developer, junior enterprise",
      dateRange: "Nov 2024 – Jun 2025",
      bullets: [
        "Weekly market research across three sectors to find new client opportunities",
        "Designed and ran targeted prospecting campaigns in a team of four",
      ],
    },
    {
      company: "HUB · London",
      title: "Technology & Data Intern",
      dateRange: "May – Jun 2024",
      bullets: [
        "AI competitor landscape across 3 sectors, turned into 2 product and positioning recommendations",
        "Audited and restructured 10,000+ CRM records in HubSpot",
      ],
    },
  ],
  education: [
    {
      school: "EDHEC Business School · Lille",
      degree: "MSc Sustainable Business Transformation",
      image: "/img/edhec.jpg",
      imageAlt: "Gonzague on stage at EDHEC",
      dateRange: "2026 – 2027",
      achievements: [
        "Sustainable procurement, industrial transformation, business ethics, corporate finance",
      ],
    },
    {
      school: "Imperial College Business School · London",
      degree: "MSc Innovation, Entrepreneurship & Management",
      image: "/img/imperial.jpg",
      imageAlt: "Imperial College Business School campus",
      dateRange: "2025 – 2026",
      achievements: [
        "Venture creation, innovation and technology management, design thinking",
      ],
    },
    {
      school: "ESCP Business School · Paris / Madrid / London",
      degree: "BSc in Management, three campuses",
      image: "/img/escp.jpg",
      imageAlt: "ESCP graduation ceremony",
      dateRange: "2022 – 2025",
      achievements: [
        "Dissertation: AI adoption and human–AI collaboration at work",
      ],
    },
  ],
};
