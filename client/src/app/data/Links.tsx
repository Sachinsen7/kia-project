import {
  Home,
  Info,
  Archive,
  MessageCircle,
  LifeBuoy,
  LayoutDashboard,
  Calendar,
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
  { id: "history-goef", name: "History of GOEF", x: 23, y: 52, icon: Archive },
  { id: "ask-kia", name: "Ask Kia (Q&A)", x: 37, y: 75, icon: MessageCircle },
  {
    id: "help-support",
    name: "Help and support",
    x: 65,
    y: 63,
    icon: LifeBuoy,
  },
  {
    id: "event",
    name: "2025 GOEF Event",
    x: 47,
    y: 45,
    icon: Calendar,
  },
  {
    id: "dashboard",
    name: "Upload Your Contents",
    x: 82,
    y: 73,
    icon: LayoutDashboard,
  },
];
