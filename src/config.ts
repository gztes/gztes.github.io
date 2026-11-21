export const siteConfig = {
  name: "Gonzague Teisseire",
  title: "I make things, then I make people care about them.",
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
      description:
        "Ask questions about your own notes and get answers that cite the exact note they came from. A RAG pipeline built from scratch: local embeddings, Chroma, Claude for the answer. Retrieval scored at 0.89 MRR on a labelled question set.",
      link: "https://github.com/gztes/recall",
      skills: ["Python", "Chroma", "Claude API"],
    },
    {
      name: "mindwatch",
      description:
        "Reads every save in my mymind, scores it against my goals, watches the best videos, and measures itself: 64% to 80% agreement on held-out hand labels.",
      link: "https://github.com/gztes/mindwatch",
      skills: ["Python", "LLM evals"],
    },
    {
      name: "Huddle",
      description:
        "Windows call companion. On-device Whisper transcription, with live suggestions from Gemini while you talk.",
      link: "https://github.com/gztes/huddle",
      skills: ["Electron", "Whisper", "Gemini"],
    },
    {
      name: "Clicky for Windows",
      description:
        "Windows rewrite of Farza's macOS assistant Clicky: local voice, multi-screen capture, and an on-screen pointer that shows you where to click.",
      link: "https://github.com/gztes/clicky-windows",
      skills: ["Electron", "TypeScript"],
    },
    {
      name: "Loop",
      description:
        "Top-three finalist at the EDHEC Sustainability Challenge 2026. Team project: I built the digital wardrobe app prototype, the website and the promo film, and gave the final pitch.",
      link: "https://github.com/gztes/loop",
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
      dateRange: "2026 – 2027",
      achievements: [
        "Sustainable procurement, industrial transformation, business ethics, corporate finance",
      ],
    },
    {
      school: "Imperial College Business School · London",
      degree: "MSc Innovation, Entrepreneurship & Management",
      dateRange: "2025 – 2026",
      achievements: [
        "Venture creation, innovation and technology management, design thinking",
      ],
    },
    {
      school: "ESCP Business School · Paris / Madrid / London",
      degree: "BSc in Management, three campuses",
      dateRange: "2022 – 2025",
      achievements: [
        "Dissertation: AI adoption and human–AI collaboration at work",
      ],
    },
  ],
};
