"use client";
import { useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Pokemon } from '@/types/pokemon';

export function useFavorites() {
  const { state, dispatch } = useAppContext();

  const addToFavorites = useCallback((pokemon: Pokemon) => {
    if (!state.favorites.some(p => p.id === pokemon.id)) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: pokemon });
    }
  }, [state.favorites, dispatch]);

  const removeFromFavorites = useCallback((pokemonId: number) => {
    dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: pokemonId });
  }, [dispatch]);

  const clearFavorites = useCallback(() => {
    dispatch({ type: 'CLEAR_FAVORITES' });
  }, [dispatch]);

  const isFavorite = useCallback((pokemonId: number) => {
    return state.favorites.some(p => p.id === pokemonId);
  }, [state.favorites]);

  return {
    favorites: state.favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    isFavorite,
  };
}