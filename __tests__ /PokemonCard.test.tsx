import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PokemonCard } from '@/components/PokemonCard';
import { AppProvider } from '@/context/AppContext';
import { Pokemon } from '@/types/pokemon';

const mockPokemon: Pokemon = {
  id: 1,
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur-official.png'
      }
    }
  },
  types: [
    {
      type: {
        name: 'grass'
      }
    }
  ],
  height: 7,
  weight: 69
};

const mockOnClick = jest.fn();

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

beforeEach(() => {
  localStorage.clear();
  mockOnClick.mockClear();
});

describe('PokemonCard', () => {
  test('renders pokemon information correctly', () => {
    renderWithProvider(
      <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
    );

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('Height: 0.7m')).toBeInTheDocument();
    expect(screen.getByText('Weight: 6.9kg')).toBeInTheDocument();
    
    const image = screen.getByAltText('bulbasaur');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/bulbasaur-official.png');
  });

  test('calls onClick when card is clicked', () => {
    renderWithProvider(
      <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
    );

    const card = screen.getByText('bulbasaur').closest('.cursor-pointer');
    fireEvent.click(card!);

    expect(mockOnClick).toHaveBeenCalledWith(mockPokemon);
  });

  test('toggles favorite status when favorite button is clicked', () => {
    renderWithProvider(
      <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    expect(favoriteButton).toBeInTheDocument();

    fireEvent.click(favoriteButton);

    expect(screen.getByLabelText('Remove from favorites')).toBeInTheDocument();
  });

  test('favorite button click does not trigger card click', () => {
    renderWithProvider(
      <PokemonCard pokemon={mockPokemon} onClick={mockOnClick} />
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(favoriteButton);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});