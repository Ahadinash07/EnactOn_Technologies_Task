"use client";
import React, { useMemo, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useAppContext } from '@/context/AppContext';
import { usePokemon } from '@/hooks/usePokemon';
import { PokemonCard } from './PokemonCard';
import { Pokemon } from '@/types/pokemon';

interface PokemonListProps {
  onPokemonClick: (pokemon: Pokemon) => void;
}

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
}

export function PokemonList({ onPokemonClick }: PokemonListProps) {
  const { state } = useAppContext();
  const { loadMorePokemon } = usePokemon();

  const itemCount = useMemo(() => {
    return state.hasNextPage ? state.filteredPokemon.length + 1 : state.filteredPokemon.length;
  }, [state.filteredPokemon.length, state.hasNextPage]);

  const isItemLoaded = useCallback((index: number) => {
    return index < state.filteredPokemon.length;
  }, [state.filteredPokemon.length]);

  const Item = useCallback(({ index, style }: ListItemProps) => {
    const pokemon = state.filteredPokemon[index];
    
    if (!pokemon) {
      return (
        <div style={style} className="flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
      );
    }

    return (
      <div style={style} className="p-2">
        <PokemonCard pokemon={pokemon} onClick={onPokemonClick} />
      </div>
    );
  }, [state.filteredPokemon, onPokemonClick]);

  if (state.error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {state.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (state.filteredPokemon.length === 0 && !state.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No Pokémon found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full">
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={itemCount}
            loadMoreItems={loadMorePokemon}
          >
            {({ onItemsRendered, ref }) => (
              <FixedSizeList
                ref={ref}
                height={height}
                width={width}
                itemCount={itemCount}
                itemSize={280}
                onItemsRendered={onItemsRendered}
              >
                {Item}
              </FixedSizeList>
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
}