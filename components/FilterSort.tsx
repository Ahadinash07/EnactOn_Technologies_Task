"use client";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { pokemonApi } from '@/services/pokemonApi';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PokemonType, SortOption } from '@/types/pokemon';

export function FilterSort() {
  const { state, dispatch } = useAppContext();
  const [pokemonTypes, setPokemonTypes] = useState<PokemonType[]>([]);

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const typesData = await pokemonApi.fetchPokemonTypes();
        setPokemonTypes(typesData.results);
      } catch (error) {
        console.error('Failed to load Pokemon types:', error);
      }
    };
    
    loadTypes();
  }, []);

  const handleTypeChange = (value: string) => {
    dispatch({ type: 'SET_SELECTED_TYPE', payload: value === 'all' ? '' : value });
  };

  const handleSortChange = (value: string) => {
    dispatch({ type: 'SET_SORT_BY', payload: value as SortOption });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <Select value={state.selectedType || 'all'} onValueChange={handleTypeChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {pokemonTypes.map((type) => (
            <SelectItem key={type.name} value={type.name}>
              {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={state.sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="height">Height</SelectItem>
          <SelectItem value="weight">Weight</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}