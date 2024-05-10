import React from 'react';
import { Pie } from 'react-chartjs-2';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PieController,
    ArcElement,
    Title,
    Tooltip,
    Legend
  } from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController
);

const chartContainerStyle = {
    width: '350px', // Set width to 500px
    height: '350px', // Set height to 500px
    margin: 'auto' // Center the chart in its container
  };

const PieChart = ({ graphData }) => {
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

  const data = {
    labels: Object.keys(graphData), // Use keys of graphData as labels
    datasets: [
      {
        label: 'Count',
        backgroundColor: backgroundColors, // Assign a unique color to each slice
        data: Object.values(graphData), // Use values of graphData as data
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
  };

  return (
    <div style={chartContainerStyle}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
