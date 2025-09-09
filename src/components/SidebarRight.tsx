import { links } from "@/app/data/Links";

type SidebarRightProps = {
  onSelect: (id: string) => void;
};

export default function SidebarRight({ onSelect }: SidebarRightProps) {
  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-lg font-bold mb-4">City Links</h2>
      <ul>
        {links.map((link) => (
          <li
            key={link.id}
            className="cursor-pointer hover:underline"
            onClick={() => onSelect(link.id)}
          >
            {link.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
