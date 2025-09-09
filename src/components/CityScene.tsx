import { links } from "@/app/data/Links";

type CitySceneProps = {
  onSelect: (id: string) => void;
};

export default function CityScene({ onSelect }: CitySceneProps) {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <video
        src="/city_scape.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 w-full h-full">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.id}
              onClick={() => onSelect(link.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${link.x}%`,
                top: `${link.y}%`,
              }}
            >
              {/* Icon Circle */}
              <div className="w-15 h-15 bg-white/80 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:shadow-xl">
                <Icon className="w-5 h-5" style={{ color: "#b5513f" }} />
              </div>

              {/* Tooltip Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {link.name}
              </div>

              {/* Pulse Animation */}
              <div className="absolute inset-0 w-15 h-15 rounded-full border-2 border-[#b5513f] opacity-70 animate-ping"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
