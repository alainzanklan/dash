'use client';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarGraphProps {
  data: { day: string; date: string; totalAmount: number }[];
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.day),
    datasets: [
      {
        label: 'Revenue (GHS)',
        data: data.map((d) => d.totalAmount),
        backgroundColor: 'rgba(13, 148, 136, 0.15)',
        borderColor: 'rgba(13, 148, 136, 1)',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) =>
            ` ₵${ctx.parsed.y.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          color: '#94a3b8',
          font: { size: 12 },
          callback: (v: any) => `₵${v.toLocaleString()}`,
        },
      },
    },
  };

  return <Bar data={chartData} options={options as any} />;
};

export default BarGraph;
