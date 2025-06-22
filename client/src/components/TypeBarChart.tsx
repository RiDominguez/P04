import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

export const RarityBarChart = ({ data }: { data: Array<{ rarity: string; count: number }> }) => {
  const chartData = {
    labels: data.map(item => item.rarity),
    datasets: [{
      label: 'Cartas por Rareza',
      data: data.map(item => item.count),
      backgroundColor: '#36A2EB'
    }]
  };

  return <Bar data={chartData} options={{
    scales: { y: { beginAtZero: true } }
  }} />;
};