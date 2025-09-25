"use client";
import { useCallback, useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';
import { pokemonApi } from '@/services/pokemonApi';

export function usePokemon() {
  const { state, dispatch } = useAppContext();
  const loadedCount = useRef(0);

  const loadMorePokemon = useCallback(async () => {
    if (state.loading || !state.hasNextPage) return;

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const data = await pokemonApi.fetchPokemonList(20, loadedCount.current);
      
      const pokemonWithDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          try {
            const details = await pokemonApi.fetchPokemonDetails(pokemon.id);
            return { ...pokemon, ...details };
          } catch (error) {
            return pokemon;
          }
        })
      );

      dispatch({ type: 'ADD_POKEMON', payload: pokemonWithDetails });
      dispatch({ type: 'SET_HAS_NEXT_PAGE', payload: !!data.next });
      dispatch({ type: 'SET_NEXT_PAGE_URL', payload: data.next });
      
      loadedCount.current += pokemonWithDetails.length;
    } catch (error) {
      if (error instanceof Error && error.message !== 'Request cancelled') {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.loading, state.hasNextPage, dispatch]);

  const resetPokemon = useCallback(() => {
    loadedCount.current = 0;
    dispatch({ type: 'SET_POKEMON', payload: [] });
    dispatch({ type: 'SET_HAS_NEXT_PAGE', payload: true });
    dispatch({ type: 'SET_NEXT_PAGE_URL', payload: null });
  }, [dispatch]);

  useEffect(() => {
    if (state.pokemon.length === 0) {
      loadMorePokemon();
    }
  }, [loadMorePokemon, state.pokemon.length]);

  useEffect(() => {
    return () => {
      pokemonApi.cancelRequests();
    };
  }, []);

  return {
    loadMorePokemon,
    resetPokemon,
  };
}