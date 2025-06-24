// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const fetchStats = async (userId: number) => {
  const response = await fetch(`${API_URL}/stats/full?userId=${userId}`);
  if (!response.ok) throw new Error('Error fetching stats');
  return await response.json();
};
