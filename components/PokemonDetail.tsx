"use client";
import React from 'react';
import { Pokemon } from '@/types/pokemon';
import { useFavorites } from '@/hooks/useFavorites';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, HeartOff, X } from 'lucide-react';

interface PokemonDetailProps {
  pokemon: Pokemon | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PokemonDetail({ pokemon, isOpen, onClose }: PokemonDetailProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  if (!pokemon) return null;

  const favorite = isFavorite(pokemon.id);
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                  pokemon.sprites?.front_default || 
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(pokemon.id);
    } else {
      addToFavorites(pokemon);
    }
  };

  const getStatColor = (statValue: number): string => {
    if (statValue >= 100) return 'bg-green-500';
    if (statValue >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold capitalize">
              {pokemon.name} #{pokemon.id}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {favorite ? (
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="w-6 h-6 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <img
              src={imageUrl}
              alt={pokemon.name}
              className="w-48 h-48 mx-auto object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Height:</span> {(pokemon.height || 0) / 10}m</p>
                  <p><span className="font-medium">Weight:</span> {(pokemon.weight || 0) / 10}kg</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Types</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.types?.map((type) => (
                    <Badge 
                      key={type.type.name} 
                      variant="secondary"
                      className="capitalize"
                    >
                      {type.type.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Abilities</h3>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities?.map((ability) => (
                    <Badge 
                      key={ability.ability.name} 
                      variant="outline"
                      className="capitalize"
                    >
                      {ability.ability.name.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Base Stats</h3>
              <div className="space-y-3">
                {pokemon.stats?.map((stat) => (
                  <div key={stat.stat.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span>{stat.base_stat}</span>
                    </div>
                    <Progress 
                      value={(stat.base_stat / 255) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}