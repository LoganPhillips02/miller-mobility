import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@miller_mobility:favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load from storage on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          setFavoriteIds(new Set(JSON.parse(raw)));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Persist whenever favoriteIds changes (skip initial load)
  const persist = useCallback((ids) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...ids])).catch(() => {});
  }, []);

  const toggleFavorite = useCallback((productId) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      persist(next);
      return next;
    });
  }, [persist]);

  const isFavorite = useCallback(
    (productId) => favoriteIds.has(productId),
    [favoriteIds],
  );

  const clearFavorites = useCallback(() => {
    setFavoriteIds(new Set());
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
  }, []);

  return {
    favoriteIds,
    favoriteCount: favoriteIds.size,
    loading,
    toggleFavorite,
    isFavorite,
    clearFavorites,
  };
};