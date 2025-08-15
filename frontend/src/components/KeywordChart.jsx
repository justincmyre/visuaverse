import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function KeywordChart({ keywords }) {
  const data = {
    labels: keywords.map(k => k.normal),
    datasets: [{
      label: 'Keyword Frequency',
      data: keywords.map(k => k.count),
      backgroundColor: 'rgba(75,192,192,0.6)',
    }],
  };
  return <Bar data={data} />;
}
