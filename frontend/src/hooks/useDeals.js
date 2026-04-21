// Re-export deal hooks from useApi and add useDeal (single deal by slug)
import { useDeals, useActiveDeals } from './useApi';
import { useState, useEffect, useRef, useCallback } from 'react';
import { dealsApi } from '../services/api';

export { useDeals, useActiveDeals };

export function useDeal(slug) {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dealsApi.get(slug);
      if (mountedRef.current) setDeal(data);
    } catch (err) {
      if (mountedRef.current) setError(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  return { deal, loading, error, refetch: load };
}
