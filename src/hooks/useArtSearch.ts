import { useState, useMemo } from 'react';
import type { ArtPiece } from '../types';

/**
 * Custom hook for handling art search functionality
 * @param artPieces - Array of art pieces to search through
 * @returns Search state and filtered results
 */
export const useArtSearch = (artPieces: readonly ArtPiece[]) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArtPieces = useMemo(() => {
    if (!searchTerm.trim()) {
      return artPieces;
    }
    
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    
    return artPieces.filter(piece => 
      piece.title.toLowerCase().includes(normalizedSearchTerm) ||
      piece.artist.toLowerCase().includes(normalizedSearchTerm) ||
      piece.category.toLowerCase().includes(normalizedSearchTerm)
    );
  }, [artPieces, searchTerm]);

  const clearSearch = () => setSearchTerm('');

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    filteredArtPieces,
    hasResults: filteredArtPieces.length > 0,
    isSearching: searchTerm.trim().length > 0,
  };
};
