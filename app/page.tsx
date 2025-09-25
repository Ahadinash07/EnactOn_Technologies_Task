"use client";
import React, { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { PokemonList } from '@/components/PokemonList';
import { FavoritesList } from '@/components/FavoritesList';
import { PokemonDetail } from '@/components/PokemonDetail';
import { useFavorites } from '@/hooks/useFavorites';
import { Pokemon } from '@/types/pokemon';

function AppContent() {
  const [currentView, setCurrentView] = useState<'explore' | 'favorites'>('explore');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { favorites } = useFavorites();

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedPokemon(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        favoritesCount={favorites.length}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'explore' ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Discover Pokémon</h2>
              <p className="text-gray-600">Explore the world of Pokémon with detailed information</p>
            </div>
            <PokemonList onPokemonClick={handlePokemonClick} />
          </div>
        ) : (
          <FavoritesList onPokemonClick={handlePokemonClick} />
        )}
      </main>

      <PokemonDetail 
        pokemon={selectedPokemon}
        isOpen={detailModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}