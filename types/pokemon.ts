export interface Pokemon {
  id: number;
  name: string;
  url: string;
  sprites?: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
  height?: number;
  weight?: number;
  stats?: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  abilities?: Array<{
    ability: {
      name: string;
    };
  }>;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Pokemon[];
}

export interface PokemonType {
  name: string;
  url: string;
}

export interface PokemonTypesResponse {
  results: PokemonType[];
}

export interface AppState {
  pokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  favorites: Pokemon[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedType: string;
  sortBy: string;
  hasNextPage: boolean;
  nextPageUrl: string | null;
}

export type SortOption = 'name' | 'id' | 'height' | 'weight';