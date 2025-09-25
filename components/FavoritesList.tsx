"use client";
import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { PokemonCard } from './PokemonCard';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Pokemon } from '@/types/pokemon';

interface FavoritesListProps {
  onPokemonClick: (pokemon: Pokemon) => void;
}

export function FavoritesList({ onPokemonClick }: FavoritesListProps) {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No favorite Pokémon yet. Start exploring and add some!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Favorites ({favorites.length})</h2>
        <Button
          variant="destructive"
          onClick={clearFavorites}
          className="flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {favorites.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
          />
        ))}
      </div>
    </div>
  );
}