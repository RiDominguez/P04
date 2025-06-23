import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export const TypePieChart = ({ data }: { data: Array<{ type: string; count: number }> }) => {
  const chartData = {
    labels: data.map(item => item.type),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC249', '#EA5F89', '#00BFFF', '#A0522D'
      ],
    }]
  };

  return <Pie data={chartData} />;
};