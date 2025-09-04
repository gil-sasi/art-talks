/**
 * Core type definitions for the Art Talks application
 */

export interface ArtPiece {
  readonly id: number;
  readonly title: string;
  readonly artist: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly category: ArtCategory;
}

export type ArtCategory = 'landscape' | 'abstract' | 'portrait' | 'digital' | 'still-life' | 'urban';

export interface ChatMessage {
  readonly id: number;
  readonly text: string;
  readonly timestamp: Date;
  readonly sender: string;
  readonly isOwnMessage?: boolean;
}

export interface User {
  readonly id: string;
  readonly name: string;
  readonly avatar?: string;
}

export type RouteParams = {
  id: string;
};
