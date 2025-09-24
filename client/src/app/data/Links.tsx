import {
  Home,
  Info,
  Archive,
  MessageCircle,
  LifeBuoy,
  LayoutDashboard,
  Calendar,
  Cast,
} from "lucide-react";

export type CityLink = {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ElementType;
};

export const links: CityLink[] = [
  { id: "live-link", name: "Welcome to 2025 GOEF", x: 57, y: 20, icon: Cast },
  { id: "welcome", name: "Welcome to 2025 GOEF", x: 15, y: 35, icon:  Home},
  { id: "about", name: "About 2025 GOEF", x: 80, y: 10, icon: Info },
  { id: "history-goef", name: "History of GOEF", x: 30, y: 52, icon: Archive },
  {
    id: "ask-kia",
    name: "Questions that shape our future",
    x: 73,
    y: 65,
    icon: MessageCircle,
  },
  {
    id: "help-support",
    name: "Help and support",
    x: 83,
    y: 47,
    icon: LifeBuoy,
  },
  {
    id: "event",
    name: "2025 GOEF Event",
    x: 65,
    y: 70,
    icon: Calendar,
  },
  {
    id: "dashboard",
    name: "Upload Your Contents",
    x: 33,
    y: 10,
    icon: LayoutDashboard,
  },
];
