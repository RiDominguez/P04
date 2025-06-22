// src/components/charts/SetProgress.tsx
export const SetProgress = ({ sets }: { sets: Array<{ set_name: string; owned: number; total: number }> }) => {
  return (
    <div className="space-y-4">
      {sets.map(set => {
        const percentage = Math.round((set.owned / set.total) * 100);
        return (
          <div key={set.set_name}>
            <div className="flex justify-between mb-1">
              <span>{set.set_name}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {set.owned} de {set.total} cartas
            </div>
          </div>
        );
      })}
    </div>
  );
};