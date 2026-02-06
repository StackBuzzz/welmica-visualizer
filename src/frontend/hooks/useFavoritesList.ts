'use client';

import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'FAVORITES_PRODUCTS';

const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

interface UseFavoritesListReturn {
  favoriteIds: string[];
  hasFavorites: boolean;
}

const useFavoritesList = (): UseFavoritesListReturn => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const updateFavorites = useCallback(() => {
    setFavoriteIds(getFavorites());
  }, []);

  useEffect(() => {
    updateFavorites();

    // Listen for storage changes (cross-tab sync + same-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) {
        updateFavorites();
      }
    };

    // Custom event for same-tab updates
    const handleCustomEvent = () => {
      updateFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favorites-updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favorites-updated', handleCustomEvent);
    };
  }, [updateFavorites]);

  return {
    favoriteIds,
    hasFavorites: favoriteIds.length > 0
  };
};

export default useFavoritesList;
