// import {
//   Home,
//   Info,
//   Target,
//   BookOpen,
//   Users,
//   TrendingUp,
//   Archive,
//   MessageCircle,
//   Lightbulb,
//   LifeBuoy,
// } from "lucide-react";

// export type CityLink = {
//   id: string;
//   name: string;
//   x: number;
//   y: number;
//   icon: React.ElementType;
// };

// export const links: CityLink[] = [
//   { id: "welcome", name: "Welcome to 2025 GOEF", x: 10, y: 9, icon: Home },
//   { id: "about", name: "About 2025 GOEF", x: 45, y: 8, icon: Info },
//   {
//     id: "strategy",
//     name: "2026 Ownership strategy",
//     x: 45,
//     y: 40,
//     icon: Target,
//   },
//   {
//     id: "track-a",
//     name: "Track A: Introduction to KDCCC",
//     x: 75,
//     y: 30,
//     icon: BookOpen,
//   },
//   {
//     id: "track-b",
//     name: "Track B: Retention programs",
//     x: 30,
//     y: 30,
//     icon: Users,
//   },
//   {
//     id: "track-c",
//     name: "Track C: Capacity enhancement",
//     x: 81,
//     y: 58,
//     icon: TrendingUp,
//   },
//   { id: "history", name: "History of GOEF", x: 10, y: 75, icon: Archive },
//   { id: "ask-kia", name: "Ask Kia (Q&A)", x: 37, y: 75, icon: MessageCircle },
//   {
//     id: "best-practices",
//     name: "Best practices",
//     x: 90,
//     y: 90,
//     icon: Lightbulb,
//   },
//   { id: "help", name: "Help and support", x: 90, y: 5, icon: LifeBuoy },
// ];

// video linkss

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
  LayoutDashboard,
} from "lucide-react";

export type CityLink = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ElementType;
};

export const links: CityLink[] = [
  { id: "welcome", name: "Welcome to 2025 GOEF", x: 60, y: 12, icon: Home },
  { id: "about", name: "About 2025 GOEF", x: 18, y: 18, icon: Info },
  {
    id: "strategy",
    name: "2026 Ownership strategy",
    x: 47,
    y: 43,
    icon: Target,
  },
  {
    id: "track-a",
    name: "Track A: Introduction to KDCCC",
    x: 75,
    y: 30,
    icon: BookOpen,
  },
  {
    id: "track-b",
    name: "Track B: Retention programs",
    x: 34,
    y: 10,
    icon: Users,
  },
  {
    id: "track-c",
    name: "Track C: Capacity enhancement",
    x: 76,
    y: 52,
    icon: TrendingUp,
  },
  { id: "history-goef", name: "History of GOEF", x: 23, y: 52, icon: Archive },
  { id: "ask-kia", name: "Ask Kia (Q&A)", x: 37, y: 75, icon: MessageCircle },
  {
    id: "best-practices",
    name: "Best practices",
    x: 84,
    y: 75,
    icon: Lightbulb,
  },
  {
    id: "help-support",
    name: "Help and support",
    x: 65,
    y: 63,
    icon: LifeBuoy,
  },
  {
    id: "dashboard",
    name: "Event Dashboard",
    x: 65,
    y: 63,
    icon: LayoutDashboard,
  },
];
