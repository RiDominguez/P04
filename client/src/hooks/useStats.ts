// src/hooks/useStats.ts
import { useEffect, useState } from 'react';
import { fetchStats } from '../services/api';

export const useStats = (userId: number) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStats(userId);
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  return { stats, loading, error };
};