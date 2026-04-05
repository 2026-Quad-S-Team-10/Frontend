import { useEffect, useState } from 'react';
import { fetchNewsFeed } from '../api/newsApi.js';

export function useNews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchNewsFeed()
      .then((feed) => {
        if (!cancelled) setData(feed);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tick]);

  const refetch = () => {
    setError(null);
    setLoading(true);
    setTick((n) => n + 1);
  };

  return { data, loading, error, refetch };
}
