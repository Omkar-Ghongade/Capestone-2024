import React from 'react';
import { Bar } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";
  
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);

const chartContainerStyle = {
  width: '600px', // Set width to 500px
  height: '300px', // Set height to 500px
  margin: 'auto' // Center the chart in its container
};

const BarChart = ({ graphData }) => {
  if (!graphData) return null; // If graphData is not available, return null or a loading indicator

  // Function to generate random color
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.6)`;
  };

  // Generate a color for each data item
  const backgroundColors = Object.values(graphData).map(() => getRandomColor());
  const borderColors = backgroundColors.map(color => color.replace('0.6', '1')); // More opaque for border

  const data = {
    labels: Object.keys(graphData), // Use keys of graphData as labels
    datasets: [
      {
        label: 'Count',
        backgroundColor: backgroundColors, // Assign a unique color to each bar
        borderColor: borderColors,
        borderWidth: 1,
        data: Object.values(graphData), // Use values of graphData as data
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={chartContainerStyle}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
