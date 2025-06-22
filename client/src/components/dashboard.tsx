// src/components/Dashboard.tsx
import { useStats } from '../hooks/useStats';
import { TypePieChart } from './TypePieChart';
import { RarityBarChart } from './TypeBarChart';
import { SetProgress } from './setProgress';

export const Dashboard = ({ userId }: { userId: number }) => {
  const { stats, loading, error } = useStats(userId);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No hay datos disponibles</div>;

  return (
    <div className="p-6 grid gap-8 md:grid-cols-2">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Distribución de Tipos</h2>
        <TypePieChart data={stats.cardTypes} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Distribución de Rarezas</h2>
        <RarityBarChart data={stats.rarities} />
      </div>

      <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Progreso de Sets</h2>
        <SetProgress sets={stats.setCompletion} />
      </div>
    </div>
  );
};