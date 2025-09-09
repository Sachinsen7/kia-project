export type CityLink = {
  id: string;
  name: string;
  description: string;
  x: number; // percentage position from left
  y: number; // percentage position from top
  icon?: string; // icon name for future use
};

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

export const links: CityLink[] = [
  {
    id: "headquarters",
    name: "Headquarters",
    description:
      "Main corporate headquarters building with executive offices and meeting rooms",
    x: 20,
    y: 30,
    icon: "home",
  },
  {
    id: "park",
    name: "Central Park",
    description:
      "Beautiful green space with walking trails, playgrounds, and picnic areas",
    x: 60,
    y: 25,
    icon: "tree",
  },
  {
    id: "shopping",
    name: "Shopping District",
    description:
      "Modern shopping center with retail stores, restaurants, and entertainment venues",
    x: 75,
    y: 45,
    icon: "shopping",
  },
  {
    id: "residential",
    name: "Residential Area",
    description: "Luxury residential complex with apartments and townhouses",
    x: 15,
    y: 60,
    icon: "home",
  },
  {
    id: "hospital",
    name: "Medical Center",
    description:
      "State-of-the-art hospital with emergency services and specialized care",
    x: 40,
    y: 70,
    icon: "hospital",
  },
  {
    id: "school",
    name: "University",
    description:
      "Prestigious educational institution with research facilities and student housing",
    x: 80,
    y: 20,
    icon: "graduation",
  },
  {
    id: "stadium",
    name: "Sports Stadium",
    description:
      "Multi-purpose stadium hosting sports events, concerts, and community gatherings",
    x: 50,
    y: 80,
    icon: "stadium",
  },
  {
    id: "transport",
    name: "Transport Hub",
    description:
      "Central transportation station connecting buses, trains, and metro lines",
    x: 30,
    y: 85,
    icon: "train",
  },
  {
    id: "museum",
    name: "Cultural Museum",
    description:
      "Art and history museum featuring local culture and international exhibitions",
    x: 65,
    y: 15,
    icon: "museum",
  },
];
