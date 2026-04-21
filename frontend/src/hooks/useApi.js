import { useState, useEffect, useCallback, useRef } from 'react';
import { productsApi, categoriesApi, dealsApi, brandsApi, ApiError } from '../services/api';
import { createProduct } from '../models/index';

// ─── Generic fetch hook ───────────────────────────────────────────────────────

function useFetch(fetcher, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => { mountedRef.current = false; };
  }, [load]);

  return { data, loading, error, refetch: load };
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(params = {}) {
  const key = JSON.stringify(params);
  const { data, loading, error, refetch } = useFetch(
    () => productsApi.list(params),
    [key]
  );
  return {
    products: (data?.results ?? []).map(createProduct),
    count:    data?.count ?? 0,
    next:     data?.next,
    previous: data?.previous,
    loading,
    error,
    refetch,
  };
}

export function useProduct(id) {
  const { data, loading, error, refetch } = useFetch(
    () => productsApi.get(id),
    [id]
  );
  return { product: data ? createProduct(data) : null, loading, error, refetch };
}

export function useFeaturedProducts() {
  const { data, loading, error, refetch } = useFetch(() => productsApi.featured());
  return { products: (data ?? []).map(createProduct), loading, error, refetch };
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  const { data, loading, error, refetch } = useFetch(() => categoriesApi.list());
  return { categories: data?.results ?? data ?? [], loading, error, refetch };
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export function useBrands() {
  const { data, loading, error, refetch } = useFetch(() => brandsApi.list());
  return { brands: data?.results ?? data ?? [], loading, error, refetch };
}

// ─── Deals ────────────────────────────────────────────────────────────────────

export function useDeals(params = {}) {
  const key = JSON.stringify(params);
  const { data, loading, error, refetch } = useFetch(
    () => dealsApi.list(params),
    [key]
  );
  return { deals: data?.results ?? data ?? [], loading, error, refetch };
}

export function useActiveDeals() {
  const { data, loading, error, refetch } = useFetch(() => dealsApi.active());
  return { deals: data ?? [], loading, error, refetch };
}

// ─── Paginated products (load-more) ──────────────────────────────────────────

export function usePaginatedProducts(initialParams = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [nextUrl, setNextUrl]   = useState(null);
  const [total, setTotal]       = useState(0);
  const paramsRef = useRef(initialParams);

  const loadPage = useCallback(async (params, replace = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsApi.list(params);
      const mapped = (data.results ?? []).map(createProduct);
      setProducts(prev => replace ? mapped : [...prev, ...mapped]);
      setNextUrl(data.next ?? null);
      setTotal(data.count ?? 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    paramsRef.current = initialParams;
    loadPage(initialParams, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialParams)]);

  const loadMore = useCallback(() => {
    if (nextUrl) {
      // Extract page number from Django pagination URL
      const url = new URL(nextUrl);
      const page = url.searchParams.get('page');
      loadPage({ ...paramsRef.current, page });
    }
  }, [nextUrl, loadPage]);

  return {
    products,
    loading,
    error,
    hasMore: !!nextUrl,
    total,
    loadMore,
  };
}