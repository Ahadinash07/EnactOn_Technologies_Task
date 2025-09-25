import { Pokemon, PokemonListResponse, PokemonTypesResponse } from '@/types/pokemon';

class PokemonApiService {
  private cache = new Map<string, any>();
  private abortController: AbortController | null = null;

  async fetchPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    const cacheKey = `pokemon-list-${limit}-${offset}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
        { signal: this.abortController.signal }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonListResponse = await response.json();
      
      const pokemonWithIds = data.results.map((pokemon, index) => ({
        ...pokemon,
        id: offset + index + 1,
      }));
      
      const result = { ...data, results: pokemonWithIds };
      this.cache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw error;
    }
  }

  async fetchPokemonDetails(id: number): Promise<Pokemon> {
    const cacheKey = `pokemon-details-${id}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Pokemon = await response.json();
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchPokemonTypes(): Promise<PokemonTypesResponse> {
    const cacheKey = 'pokemon-types';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch('https://pokeapi.co/api/v2/type');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonTypesResponse = await response.json();
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  cancelRequests() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export const pokemonApi = new PokemonApiService();