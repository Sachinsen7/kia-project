export type CityLink = {
  id: string;
  name: string;
  description: string;
};

export const links: CityLink[] = [
  { id: "building1", name: "Headquarters", description: "Main office" },
  { id: "park", name: "City Park", description: "Green open space" },
];
