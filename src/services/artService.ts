import type { ArtPiece } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

/**
 * Service for fetching art data from the backend API
 */
export class ArtService {
  /**
   * Fetch all artworks from the backend
   */
  static async getAllArtworks(): Promise<ArtPiece[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/artworks`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ArtPiece[]> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch artworks');
      }
      
      return result.data;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  }

  /**
   * Fetch a single artwork by ID
   */
  static async getArtworkById(id: number): Promise<ArtPiece> {
    try {
      const response = await fetch(`${API_BASE_URL}/artworks/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<ArtPiece> = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch artwork');
      }
      
      return result.data;
    } catch (error) {
      console.error(`Error fetching artwork ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Alternative implementations using different HTTP clients:
 */

// Using axios (if you prefer axios over fetch)
/*
import axios from 'axios';

export class ArtServiceAxios {
  private static client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  static async getAllArtworks(): Promise<ArtPiece[]> {
    const response = await this.client.get<ApiResponse<ArtPiece[]>>('/artworks');
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch artworks');
    }
    
    return response.data.data;
  }

  static async getArtworkById(id: number): Promise<ArtPiece> {
    const response = await this.client.get<ApiResponse<ArtPiece>>(`/artworks/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to fetch artwork');
    }
    
    return response.data.data;
  }
}
*/
