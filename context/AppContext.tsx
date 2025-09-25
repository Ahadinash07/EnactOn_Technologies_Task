"use client";
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Pokemon, AppState, SortOption } from '@/types/pokemon';

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POKEMON'; payload: Pokemon[] }
  | { type: 'ADD_POKEMON'; payload: Pokemon[] }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SELECTED_TYPE'; payload: string }
  | { type: 'SET_SORT_BY'; payload: SortOption }
  | { type: 'ADD_TO_FAVORITES'; payload: Pokemon }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_FAVORITES'; payload: Pokemon[] }
  | { type: 'SET_HAS_NEXT_PAGE'; payload: boolean }
  | { type: 'SET_NEXT_PAGE_URL'; payload: string | null }
  | { type: 'FILTER_POKEMON' };

const initialState: AppState = {
  pokemon: [],
  filteredPokemon: [],
  favorites: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedType: '',
  sortBy: 'id',
  hasNextPage: true,
  nextPageUrl: null,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_POKEMON':
      return { ...state, pokemon: action.payload };
    case 'ADD_POKEMON':
      return { ...state, pokemon: [...state.pokemon, ...action.payload] };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SELECTED_TYPE':
      return { ...state, selectedType: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'ADD_TO_FAVORITES':
      const newFavorites = [...state.favorites, action.payload];
      localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'REMOVE_FROM_FAVORITES':
      const filteredFavorites = state.favorites.filter(p => p.id !== action.payload);
      localStorage.setItem('pokemon-favorites', JSON.stringify(filteredFavorites));
      return { ...state, favorites: filteredFavorites };
    case 'CLEAR_FAVORITES':
      localStorage.removeItem('pokemon-favorites');
      return { ...state, favorites: [] };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_HAS_NEXT_PAGE':
      return { ...state, hasNextPage: action.payload };
    case 'SET_NEXT_PAGE_URL':
      return { ...state, nextPageUrl: action.payload };
    case 'FILTER_POKEMON':
      let filtered = [...state.pokemon];
      
      if (state.searchTerm) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
      }
      
      if (state.selectedType) {
        filtered = filtered.filter(p => 
          p.types?.some(t => t.type.name === state.selectedType)
        );
      }
      
      filtered.sort((a, b) => {
        switch (state.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'id':
            return a.id - b.id;
          case 'height':
            return (a.height || 0) - (b.height || 0);
          case 'weight':
            return (a.weight || 0) - (b.weight || 0);
          default:
            return 0;
        }
      });
      
      return { ...state, filteredPokemon: filtered };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('pokemon-favorites');
    if (savedFavorites) {
      dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(savedFavorites) });
    }
  }, []);

  useEffect(() => {
    dispatch({ type: 'FILTER_POKEMON' });
  }, [state.pokemon, state.searchTerm, state.selectedType, state.sortBy]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}