import {
  Home,
  Info,
  Target,
  BookOpen,
  Users,
  TrendingUp,
  Archive,
  MessageCircle,
  Lightbulb,
  LifeBuoy,
} from "lucide-react";

export type CityLink = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ElementType;
};

export const links: CityLink[] = [
  { id: "welcome", name: "Welcome to 2025 GOEF", x: 20, y: 30, icon: Home },
  { id: "about", name: "About 2025 GOEF", x: 40, y: 25, icon: Info },
  {
    id: "strategy",
    name: "2026 Ownership strategy",
    x: 60,
    y: 35,
    icon: Target,
  },
  {
    id: "track-a",
    name: "Track A: Introduction to KDCCC",
    x: 75,
    y: 20,
    icon: BookOpen,
  },
  {
    id: "track-b",
    name: "Track B: Retention programs",
    x: 30,
    y: 50,
    icon: Users,
  },
  {
    id: "track-c",
    name: "Track C: Capacity enhancement",
    x: 55,
    y: 60,
    icon: TrendingUp,
  },
  { id: "history", name: "History of GOEF", x: 15, y: 70, icon: Archive },
  { id: "ask-kia", name: "Ask Kia (Q&A)", x: 45, y: 80, icon: MessageCircle },
  {
    id: "best-practices",
    name: "Best practices",
    x: 70,
    y: 75,
    icon: Lightbulb,
  },
  { id: "help", name: "Help and support", x: 85, y: 40, icon: LifeBuoy },
];
