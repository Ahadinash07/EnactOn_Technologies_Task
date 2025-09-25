"use client";
import React from 'react';
import { SearchBar } from './SearchBar';
import { FilterSort } from './FilterSort';
import { Button } from '@/components/ui/button';
import { Heart, Grid, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  currentView: 'explore' | 'favorites';
  onViewChange: (view: 'explore' | 'favorites') => void;
  favoritesCount: number;
}

export function Header({ currentView, onViewChange, favoritesCount }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Pokémon Explorer
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <SearchBar />
            <FilterSort />
            <div className="flex items-center space-x-2">
              <Button
                variant={currentView === 'explore' ? 'default' : 'outline'}
                onClick={() => onViewChange('explore')}
                className="flex items-center gap-2"
              >
                <Grid className="w-4 h-4" />
                Explore
              </Button>
              <Button
                variant={currentView === 'favorites' ? 'default' : 'outline'}
                onClick={() => onViewChange('favorites')}
                className="flex items-center gap-2 relative"
              >
                <Heart className="w-4 h-4" />
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            <SearchBar />
            <FilterSort />
            <div className="flex flex-col space-y-2">
              <Button
                variant={currentView === 'explore' ? 'default' : 'outline'}
                onClick={() => {
                  onViewChange('explore');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 justify-center"
              >
                <Grid className="w-4 h-4" />
                Explore
              </Button>
              <Button
                variant={currentView === 'favorites' ? 'default' : 'outline'}
                onClick={() => {
                  onViewChange('favorites');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 justify-center relative"
              >
                <Heart className="w-4 h-4" />
                Favorites
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}