'use client';

import { useCallback, useEffect, useState } from 'react';

const FAVORITES_KEY = 'FAVORITES_PRODUCTS';

const getFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveFavorites = (favorites: string[]): void => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent('favorites-updated'));
};

interface UseFavoritesReturn {
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const useFavorites = (productId: string): UseFavoritesReturn => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorite(favorites.includes(productId));
  }, [productId]);

  const addFavorite = useCallback(() => {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      saveFavorites(favorites);
      setIsFavorite(true);
    }
  }, [productId]);

  const removeFavorite = useCallback(() => {
    const favorites = getFavorites();
    const index = favorites.indexOf(productId);
    if (index !== -1) {
      favorites.splice(index, 1);
      saveFavorites(favorites);
      setIsFavorite(false);
    }
  }, [productId]);

  const toggleFavorite = useCallback(() => {
    if (isFavorite) {
      removeFavorite();
    } else {
      addFavorite();
    }
  }, [isFavorite, addFavorite, removeFavorite]);

  return { isFavorite, toggleFavorite };
};

export default useFavorites;
