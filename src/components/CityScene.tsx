type CitySceneProps = {
  onSelect: (id: string) => void;
};

export default function CityScene({ onSelect }: CitySceneProps) {
  return (
    <div
      className="w-full h-full bg-blue-200 flex items-center justify-center"
      onClick={() => onSelect("building1")}
    >
      <p>3D City Scene (click to select building1)</p>
    </div>
  );
}
