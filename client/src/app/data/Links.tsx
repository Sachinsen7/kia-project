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
  { id: "welcome", name: "Welcome to 2025 GOEF", x: 57, y: 20, icon: Home },
  { id: "about", name: "About 2025 GOEF", x: 30, y: 10, icon: Info },
  { id: "history-goef", name: "History of GOEF", x: 13, y: 36, icon: Archive },
  {
    id: "ask-kia",
    name: "Questions that shape our future",
    x: 30,
    y: 54,
    icon: MessageCircle,
  },
  {
    id: "help-support",
    name: "Help and support",
    x: 75,
    y: 63,
    icon: LifeBuoy,
  },
  {
    id: "event",
    name: "2025 GOEF Event",
    x: 80,
    y: 6,
    icon: Calendar,
  },
  {
    id: "dashboard",
    name: "Upload Your Contents",
    x: 88,
    y: 33,
    icon: LayoutDashboard,
  },
];
