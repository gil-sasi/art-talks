import { useState, useEffect } from 'react';
import { ArtService } from '../services/artService';
import type { ArtPiece } from '../types';

interface UseArtAPIResult {
  artPieces: ArtPiece[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch art pieces from the backend API
 */
export const useArtAPI = (): UseArtAPIResult => {
  const [artPieces, setArtPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const artworks = await ArtService.getAllArtworks();
      setArtPieces(artworks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Failed to fetch artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return {
    artPieces,
    loading,
    error,
    refetch: fetchArtworks,
  };
};

interface UseArtworkByIdResult {
  artwork: ArtPiece | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch a single artwork by ID
 */
export const useArtworkById = (id: number): UseArtworkByIdResult => {
  const [artwork, setArtwork] = useState<ArtPiece | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedArtwork = await ArtService.getArtworkById(id);
      setArtwork(fetchedArtwork);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(`Failed to fetch artwork ${id}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtwork();
  }, [id]);

  return {
    artwork,
    loading,
    error,
    refetch: fetchArtwork,
  };
};
