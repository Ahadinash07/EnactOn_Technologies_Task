"use client";
import React from 'react';
import { Pokemon } from '@/types/pokemon';
import { useFavorites } from '@/hooks/useFavorites';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, HeartOff } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: (pokemon: Pokemon) => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  };

  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                  pokemon.sprites?.front_default || 
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
      onClick={() => onClick(pokemon)}
    >
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img
            src={imageUrl}
            alt={pokemon.name}
            className="w-full h-32 object-contain mx-auto group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 hover:bg-red-100"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? (
              <Heart className="w-5 h-5 text-red-500 fill-current" />
            ) : (
              <HeartOff className="w-5 h-5 text-gray-400" />
            )}
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="font-semibold capitalize text-lg">
            {pokemon.name}
          </h3>
          <p className="text-sm text-gray-500">#{pokemon.id}</p>
          
          {pokemon.types && (
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemon.types.map((type) => (
                <Badge 
                  key={type.type.name} 
                  variant="secondary"
                  className="text-xs"
                >
                  {type.type.name}
                </Badge>
              ))}
            </div>
          )}
          
          {(pokemon.height || pokemon.weight) && (
            <div className="text-xs text-gray-500 space-y-1">
              {pokemon.height && <p>Height: {pokemon.height / 10}m</p>}
              {pokemon.weight && <p>Weight: {pokemon.weight / 10}kg</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}