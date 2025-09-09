export type CityDetail = {
  id: string;
  name: string;
  description: string;
  features: string[];
  hours?: string;
  contact?: string;
  image?: string;
  icon: string; // lucide icon key
};

export const cityDetails: Record<string, CityDetail> = {
  welcome: {
    id: "welcome",
    name: "Welcome to 2025 GOEF",
    description:
      "An introduction and overview of the 2025 Global Organization of Emerging Futures event.",
    features: [
      "Event highlights",
      "Main objectives",
      "Overview of participants",
    ],
    icon: "home",
  },
  about: {
    id: "about",
    name: "About 2025 GOEF",
    description:
      "Background, vision, and mission of GOEF, including its role in shaping future strategies.",
    features: ["Mission statement", "Vision", "Core values"],
    icon: "info",
  },
  strategy: {
    id: "strategy",
    name: "2026 Ownership Strategy",
    description:
      "Strategic goals and ownership plans that will define GOEF’s long-term approach.",
    features: ["Strategic goals", "Ownership models", "Key milestones"],
    icon: "target",
  },
  trackA: {
    id: "trackA",
    name: "Track A: Introduction to KDCCC",
    description:
      "Foundational overview of KDCCC, its programs, and impact on global communities.",
    features: ["Introduction to KDCCC", "Key programs", "Impact stories"],
    icon: "book",
  },
  trackB: {
    id: "trackB",
    name: "Track B: Retention Programs",
    description:
      "Programs and initiatives designed to improve member retention and engagement.",
    features: ["Retention strategies", "Community engagement", "Case studies"],
    icon: "users",
  },
  trackC: {
    id: "trackC",
    name: "Track C: Capacity Enhancement",
    description:
      "Workshops and strategies focused on expanding organizational capacity.",
    features: ["Capacity-building tools", "Workshops", "Growth frameworks"],
    icon: "trending",
  },
  history: {
    id: "history",
    name: "History of GOEF",
    description:
      "A look back at the origins, milestones, and growth of GOEF over the years.",
    features: ["Timeline", "Milestones", "Leadership history"],
    icon: "archive",
  },
  askKia: {
    id: "askKia",
    name: "Ask Kia (Q&A)",
    description:
      "Interactive Q&A sessions where participants can directly engage with Kia experts.",
    features: ["Live Q&A", "Expert panel", "Discussion forums"],
    icon: "message",
  },
  practices: {
    id: "practices",
    name: "Best Practices",
    description:
      "Sharing of successful case studies and best practices across industries.",
    features: ["Case studies", "Knowledge sharing", "Practical insights"],
    icon: "lightbulb",
  },
  help: {
    id: "help",
    name: "Help and Support",
    description:
      "Assistance and resources available to participants for navigating GOEF.",
    features: ["Support desk", "FAQs", "Participant resources"],
    icon: "lifebuoy",
  },
};
