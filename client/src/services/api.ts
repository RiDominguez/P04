// src/services/api.ts
export const fetchStats = async (userId: number) => {
  const response = await fetch(`http://localhost:8000/stats/full?userId=${userId}`);
  if (!response.ok) throw new Error('Error fetching stats');
  return await response.json();
};