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

  history: {
    id: "history",
    name: "History of GOEF",
    description:
      "A look back at the origins, milestones, and growth of GOEF over the years.",
    features: ["Timeline", "Milestones", "Leadership history"],
    icon: "archive",
  },
  "ask-kia": {
    id: "ask-kia",
    name: "Ask Kia (Q&A)",
    description:
      "Interactive Q&A sessions where participants can directly engage with Kia experts.",
    features: ["Live Q&A", "Expert panel", "Discussion forums"],
    icon: "message",
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
