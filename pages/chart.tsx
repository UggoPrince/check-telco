import type { AppProps } from 'next/app'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Search data',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const searchCountInMonths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
function Chart(props: any) {
  const { telcoHistory } = props;
  for (let i = 0; i < telcoHistory.length; i++) {
    const { _id, count } = telcoHistory[i];
    const pos = _id - 1;
    searchCountInMonths[pos] = count;
  }
  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Number of checks',
        data: searchCountInMonths,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return <Line options={options} data={data} />
}

export default Chart;
