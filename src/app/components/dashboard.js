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
import { 
  TrendingUp, 
  Users, 
  Folder, 
  Award, 
  MessageSquare, 
  FileText, 
  Mail, 
  Code,
  BarChart3,
  Eye,
  Briefcase
} from 'lucide-react';

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

  const generateColors = (data, baseColor1, baseColor2) => {
    return data.map((_, index) => {
      const transparency = 0.4 + (index * 0.1);
      const color = index % 2 === 0 ? baseColor1 : baseColor2;
      return color.replace(/[\d\.]+\)/, `${transparency})`);
    });
  };

  const formatGrowthData = (data, label) => {
    const baseColor1 = 'rgba(163, 29, 29, 1)';
    const baseColor2 = 'rgba(109, 35, 35, 1)';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-base-content/70">Loading Dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-error mb-2">Error Loading Dashboard</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: Code, label: 'Skills', value: stats.counts.skills, color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Subscriptions', value: stats.counts.subscriptions, color: 'from-green-500 to-emerald-500' },
    { icon: Folder, label: 'Projects', value: stats.counts.projects, color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Certificates', value: stats.counts.certificates, color: 'from-amber-500 to-orange-500' },
    { icon: MessageSquare, label: 'Feedbacks', value: stats.counts.feedbacks, color: 'from-indigo-500 to-purple-500' },
    { icon: FileText, label: 'Posts', value: stats.counts.posts, color: 'from-teal-500 to-blue-500' },
    { icon: Mail, label: 'Contacts', value: stats.counts.contacts, color: 'from-rose-500 to-pink-500' },
    { icon: MessageSquare, label: 'Pending Questions', value: stats.counts.pendingQuestions || 0, color: 'from-red-500 to-orange-500' },
    { icon: Briefcase, label: 'Experiences', value: stats.counts.experiences || 0, color: 'from-orange-500 to-amber-500' }
  ];

  const growthCharts = [
    { data: stats.growthData.skillsDistribution, label: 'Skills Growth', type: 'bar', icon: Code },
    { data: stats.growthData.subscriptionGrowth, label: 'Subscription Growth', type: 'line', icon: Users },
    { data: stats.growthData.feedbackGrowth, label: 'Feedback Growth', type: 'bar', icon: MessageSquare },
    { data: stats.growthData.projectGrowth, label: 'Project Growth', type: 'line', icon: Folder },
    { data: stats.growthData.certificatesGrowth, label: 'Certificates Growth', type: 'bar', icon: Award },
    { data: stats.growthData.postGrowth, label: 'Post Growth', type: 'line', icon: FileText },
    { data: stats.growthData.contactGrowth, label: 'Contact Growth', type: 'bar', icon: Mail },
    { data: stats.growthData.experienceGrowth || [], label: 'Experience Growth', type: 'line', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <BarChart3 className="w-10 h-10" />
            Analytics Dashboard
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Track your portfolio performance and growth metrics in real-time
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-base-200 rounded-2xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color}`}>
                      <IconComponent className="w-6 h-6 text-base-100" />
                    </div>
                    <Eye className="w-5 h-5 text-base-content/40" />
                  </div>
                  <h3 className="text-2xl font-bold text-base-content mb-2">{card.value}</h3>
                  <p className="text-base-content/70 text-sm font-medium">{card.label}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-base-200 rounded-3xl p-8 shadow-xl border border-base-300">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-base-content">Growth Analytics</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {growthCharts.map((chart, index) => {
                const IconComponent = chart.icon;
                return (
                  <motion.div
                    key={chart.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-base-content">{chart.label}</h3>
                    </div>
                    <div className="h-64">
                      {chart.type === 'bar' ? (
                        <Bar
                          data={formatGrowthData(chart.data, chart.label)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: { mode: 'index', intersect: false }
                            },
                            scales: {
                              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                              x: { grid: { display: false } }
                            }
                          }}
                        />
                      ) : (
                        <Line
                          data={formatGrowthData(chart.data, chart.label)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: { mode: 'index', intersect: false }
                            },
                            scales: {
                              y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                              x: { grid: { display: false } }
                            }
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}