'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-red-500 p-8 text-center">Error: {error}</div>;

  // Helper function to generate colors with varying transparency
  const generateColors = (data, baseColor1, baseColor2) => {
    return data.map((_, index) => {
      const transparency = 0.4 + (index * 0.1); 
      const color = index % 2 === 0 ? baseColor1 : baseColor2; 
      return color.replace(/[\d\.]+\)/, `${transparency})`); 
    });
  };

  // Helper function to format growth data for charts
  const formatGrowthData = (data, label) => {
    const baseColor1 = 'rgba(54, 162, 235, 1)'; 
    const baseColor2 = 'rgb(123, 0, 1,1)'; 
    const colors = generateColors(data, baseColor1, baseColor2);

    return {
      labels: data.map((item) => item._id),
      datasets: [
        {
          label: label,
          data: data.map((item) => item.count),
          backgroundColor: colors, 
          borderColor: colors.map((color) => color.replace(/[\d\.]+\)/, '1)')), 
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div className="p-8 bg-base-200 min-h-screen mt-20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-base-100 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Skills</h3>
            <p>Total: {stats.counts.skills}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Subscriptions</h3>
            <p>Total: {stats.counts.subscriptions}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Projects</h3>
            <p>Total: {stats.counts.projects}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Certificates</h3>
            <p>Total: {stats.counts.certificates}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Feedbacks</h3>
            <p>Total: {stats.counts.feedbacks}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Posts</h3>
            <p>Total: {stats.counts.posts}</p>
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold">Contacts</h3>
            <p>Total: {stats.counts.contacts}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-base-100 rounded-lg shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4">Growth Over Time (5-Day Intervals)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Skills Growth</h3>
            <Bar
              data={formatGrowthData(stats.growthData.skillsDistribution, 'Skills')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Subscription Growth</h3>
            <Line
              data={formatGrowthData(stats.growthData.subscriptionGrowth, 'Subscriptions')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Feedback Growth</h3>
            <Bar
              data={formatGrowthData(stats.growthData.feedbackGrowth, 'Feedbacks')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Project Growth</h3>
            <Line
              data={formatGrowthData(stats.growthData.projectGrowth, 'Projects')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Certificates Growth</h3>
            <Bar
              data={formatGrowthData(stats.growthData.certificatesGrowth, 'Certificates')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Post Growth</h3>
            <Line
              data={formatGrowthData(stats.growthData.postGrowth, 'Posts')}
              options={{ responsive: true }}
            />
          </div>
          <div className="card bg-base-100 shadow-xl p-4 border border-primary rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Contact Growth</h3>
            <Bar
              data={formatGrowthData(stats.growthData.contactGrowth, 'Contacts')}
              options={{ responsive: true }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}