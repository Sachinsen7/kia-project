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
import { KiaLogoSvg } from "@/components/KiaLogoSvg";
import { CityLink } from "@/components/CityScene";

const baseLinks = [
  { id: "live-link", name: "Live Event", x: 57, y: 20, icon: Cast },
  { id: "welcome", name: "Welcome to 2025 GOEF", x: 80, y: 10, icon: Home },
  { id: "about", name: "About 2025 GOEF", x: 15, y: 35, icon: Info },
  { id: "history-goef", name: "History of GOEF", x: 30, y: 52, icon: Archive },
  {
    id: "ask-kia",
    name: "Questions on GOEF and our future",
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
  { id: "event", name: "Share & Win ! (Event)", x: 65, y: 70, icon: Calendar },
  {
    id: "dashboard",
    name: "Upload Your Contents",
    x: 33,
    y: 10,
    icon: LayoutDashboard,
  },
];

export const links: CityLink[] = baseLinks.map((link, index) => ({
  ...link,
  svg: (
    <KiaLogoSvg
      key={index}
      type={index + 1}
      width={64}
      height={26}
      className="w-full h-full"
    />
  ),
}));
