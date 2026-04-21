// In-memory recent-searches hook (no persistence between app restarts,
// since AsyncStorage is not installed in this project)
import { useState, useCallback } from 'react';

const MAX_RECENT = 10;
let _store = [];

export function useSearch() {
  const [recentSearches, setRecentSearches] = useState(_store);

  const saveSearch = useCallback((term) => {
    if (!term) return;
    _store = [term, ..._store.filter((t) => t !== term)].slice(0, MAX_RECENT);
    setRecentSearches([..._store]);
  }, []);

  const removeSearch = useCallback((term) => {
    _store = _store.filter((t) => t !== term);
    setRecentSearches([..._store]);
  }, []);

  return { recentSearches, saveSearch, removeSearch };
}
