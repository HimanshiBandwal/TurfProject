export interface Turf {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  sport: string;
  amenities: string[];
  isIndoor: boolean;
  hasLighting: boolean;
}

export interface SearchFilters {
  location: string;
  sport: string;
  date: string;
  isIndoor?: boolean;
  hasLighting?: boolean;
}