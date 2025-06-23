// src/components/charts/SetProgress.tsx
export const SetProgress = ({
  sets,
}: {
  sets: Array<{ set_name: string; owned: number; total: number | null }>;
}) => {
  return (
    <div className="space-y-4">
      {sets.map((set) => {
        const isValidTotal = typeof set.total === "number" && set.total > 0;
        const percentage = isValidTotal
          ? Math.round((set.owned / set.total!) * 100)
          : 0;

        return (
          <div key={set.set_name}>
            <div className="flex justify-between mb-1">
              <span>{set.set_name}</span>
              <span>
                {isValidTotal ? `${percentage}%` : "Sin datos"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  isValidTotal ? "bg-blue-600" : "bg-gray-400"
                }`}
                style={{ width: isValidTotal ? `${percentage}%` : "100%" }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isValidTotal
                ? `${set.owned} de ${set.total} cartas`
                : `${set.owned} cartas registradas`}
            </div>
          </div>
        );
      })}
    </div>
  );
};