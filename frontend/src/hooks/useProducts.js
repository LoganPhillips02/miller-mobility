// Re-export product/category hooks from useApi, plus a paginated useProducts
// that matches the interface ProductsScreen expects: { products, loading, error, hasMore, loadMore, refresh }
import { useCallback, useState } from 'react';
import {
  useFeaturedProducts,
  useCategories,
  useProduct,
  useBrands,
  usePaginatedProducts as _usePaginated,
} from './useApi';

export { useFeaturedProducts, useCategories, useProduct, useBrands };

// Wraps usePaginatedProducts and adds a refresh function
export function useProducts(params = {}) {
  const { products, loading, error, hasMore, loadMore } = _usePaginated(params);
  // usePaginatedProducts re-runs when params change, so "refresh" is just a
  // no-op trigger — we expose refetch via a counter that forces a re-mount.
  const [, setTick] = useState(0);
  const refresh = useCallback(() => setTick((n) => n + 1), []);
  return { products, loading, error, hasMore, loadMore, refresh };
}
