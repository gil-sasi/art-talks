import { useState, useCallback } from 'react';

export interface ImageMetadata {
  width: number;
  height: number;
  resolution: string;
  aspectRatio: string;
  fileSize?: string;
  format?: string;
}

/**
 * Custom hook to get image metadata when an image loads
 */
export const useImageMetadata = () => {
  const [metadata, setMetadata] = useState<Map<string, ImageMetadata>>(new Map());

  const getImageMetadata = useCallback((imageUrl: string, img: HTMLImageElement): ImageMetadata => {
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    const aspectRatio = (width / height).toFixed(2);
    
    // Extract format from URL (basic detection)
    const format = imageUrl.includes('.jpg') || imageUrl.includes('jpeg') ? 'JPEG' : 
                  imageUrl.includes('.png') ? 'PNG' : 
                  imageUrl.includes('.webp') ? 'WebP' : 'Unknown';

    return {
      width,
      height,
      resolution: `${width} × ${height}`,
      aspectRatio: `${aspectRatio}:1`,
      format
    };
  }, []);

  const handleImageLoad = useCallback((imageUrl: string, img: HTMLImageElement) => {
    const imageMetadata = getImageMetadata(imageUrl, img);
    setMetadata(prev => new Map(prev.set(imageUrl, imageMetadata)));
  }, [getImageMetadata]);

  const getMetadata = useCallback((imageUrl: string) => {
    return metadata.get(imageUrl);
  }, [metadata]);

  return {
    handleImageLoad,
    getMetadata
  };
};
