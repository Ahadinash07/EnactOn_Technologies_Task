"use client";
import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function SearchBar() {
  const { state, dispatch } = useAppContext();
  const [localSearchTerm, setLocalSearchTerm] = useState(state.searchTerm);
  const debouncedSearchTerm = useDebounce(localSearchTerm, 300);

  useEffect(() => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: debouncedSearchTerm });
  }, [debouncedSearchTerm, dispatch]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder="Search Pokémon..."
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        className="pl-10"
        aria-label="Search Pokémon"
      />
    </div>
  );
}