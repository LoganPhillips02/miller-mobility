import { useState, useEffect } from 'react';
import { dealsService } from '../services/api';

export const useDeals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = () => {
    setLoading(true);
    dealsService
      .active()
      .then(setDeals)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  return { deals, loading, error, refresh: fetch };
};

export const useDeal = (slug) => {
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    dealsService
      .detail(slug)
      .then((d) => { if (!cancelled) setDeal(d); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  return { deal, loading, error };
};