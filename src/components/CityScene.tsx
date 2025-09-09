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
        {links.map((link) => (
          <button
            key={link.id}
            onClick={() => onSelect(link.id)}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
            style={{
              left: `${link.x}%`,
              top: `${link.y}%`,
            }}
          >
            {/* Link Circle */}
            <div className="w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>

            {/* Link Label */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {link.name}
            </div>

            {/* Pulse Animation */}
            <div className="absolute inset-0 w-8 h-8 bg-white/30 rounded-full link-pulse"></div>
          </button>
        ))}
      </div>
    </div>
  );
}
