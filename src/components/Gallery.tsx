import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArtAPI } from '../hooks/useArtAPI';
import { useArtSearch } from '../hooks/useArtSearch';
import { useImageMetadata } from '../hooks/useImageMetadata';
import { UI_TEXT } from '../constants';
import type { ArtPiece } from '../types';
import './Gallery.css';

/**
 * Gallery component displaying a grid of artworks with search functionality
 */
const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const { artPieces, loading, error } = useArtAPI();
  const { searchTerm, setSearchTerm, filteredArtPieces, hasResults, isSearching } = useArtSearch(artPieces);
  const { handleImageLoad, getMetadata } = useImageMetadata();

  const handlePictureClick = useCallback((artPiece: ArtPiece) => {
    navigate(`/discussion/${artPiece.id}`);
  }, [navigate]);

  const handleImageLoadEvent = useCallback((event: React.SyntheticEvent<HTMLImageElement>, imageUrl: string) => {
    const img = event.currentTarget;
    handleImageLoad(imageUrl, img);
  }, [handleImageLoad]);

  if (loading) {
    return (
      <main className="gallery" role="main">
        <header className="gallery-header">
          <h1>{UI_TEXT.APP_TITLE}</h1>
        </header>
        <div className="loading-message" role="status">
          <p>Loading artworks...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="gallery" role="main">
        <header className="gallery-header">
          <h1>{UI_TEXT.APP_TITLE}</h1>
        </header>
        <div className="error-message" role="alert">
          <p>Error loading artworks: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="gallery" role="main">
      <header className="gallery-header">
        <h1>{UI_TEXT.APP_TITLE}</h1>
        <div className="search-container">
          <label htmlFor="artwork-search" className="visually-hidden">
            Search artworks by title, artist, or category
          </label>
          <input
            id="artwork-search"
            type="text"
            placeholder={UI_TEXT.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-describedby="search-results-count"
          />
        </div>
      </header>

      <div 
        id="search-results-count" 
        className="visually-hidden"
        aria-live="polite"
      >
        {isSearching && `Found ${filteredArtPieces.length} artworks`}
      </div>

      <section className="gallery-grid" aria-label="Artwork gallery">
        {filteredArtPieces.map((artPiece) => (
          <article 
            key={artPiece.id} 
            className="art-card"
            onClick={() => handlePictureClick(artPiece)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePictureClick(artPiece);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View discussion for ${artPiece.title} by ${artPiece.artist}`}
          >
            <div className="art-image-container">
              <img 
                src={artPiece.imageUrl} 
                alt={`${artPiece.title} by ${artPiece.artist}`}
                className="art-image"
                loading="lazy"
                onLoad={(e) => handleImageLoadEvent(e, artPiece.imageUrl)}
              />
              {(() => {
                const metadata = getMetadata(artPiece.imageUrl);
                return metadata ? (
                  <div className="image-tooltip">
                    <div className="tooltip-row">
                      <span className="tooltip-label">Resolution:</span>
                      <span className="tooltip-value">{metadata.resolution}</span>
                    </div>
                    <div className="tooltip-row">
                      <span className="tooltip-label">Aspect:</span>
                      <span className="tooltip-value">{metadata.aspectRatio}</span>
                    </div>
                    {metadata.format && (
                      <div className="tooltip-row">
                        <span className="tooltip-label">Format:</span>
                        <span className="tooltip-value">{metadata.format}</span>
                      </div>
                    )}
                  </div>
                ) : null;
              })()}
            </div>
            <div className="art-info">
              <h3 className="art-title">{artPiece.title}</h3>
              <p className="art-artist">by {artPiece.artist}</p>
              <p className="art-description">{artPiece.description}</p>
            </div>
          </article>
        ))}
      </section>

      {isSearching && !hasResults && (
        <div className="no-results" role="status">
          <p>{UI_TEXT.NO_RESULTS} "{searchTerm}"</p>
        </div>
      )}
    </main>
  );
};

export default Gallery;
