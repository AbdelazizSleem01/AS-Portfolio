'use client';

import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceScore, setPerformanceScore] = useState(0);

  useEffect(() => {
    document.title = `Dashboard of ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        `Dashboard of ${process.env.NEXT_PUBLIC_META_TITLE}. View your website's performance, analytics, and insights.`
      );
  }, []);

  const chartRefs = {
    skill: useRef(null),
    subscription: useRef(null),
    feedback: useRef(null),
    project: useRef(null),
    visits: useRef(null),
    certificates: useRef(null),
    posts: useRef(null),
    contacts: useRef(null),
  };

  const chartInstances = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setStats(data);
        setPerformanceScore(data.performanceScore || 80);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!stats) return;

    const createChart = (ref, type, data, options = {}) => {
      if (!ref.current) return;
      const ctx = ref.current.getContext('2d');
      const chart = new Chart(ctx, { type, data, options: { responsive: true, maintainAspectRatio: false, ...options } });
      chartInstances.current.push(chart);
    };

    const chartConfigs = [
      { ref: chartRefs.skill, type: 'doughnut', data: stats.growthData.skillsDistribution, label: 'Skills', backgroundColor: ['#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6', '#d946ef'] },
      { ref: chartRefs.subscription, type: 'bar', data: stats.growthData.subscriptionGrowth, label: 'Subscriptions', backgroundColor: '#A31D1D' },
      { ref: chartRefs.feedback, type: 'bar', data: stats.growthData.feedbackGrowth, label: 'Feedback', backgroundColor: '#10b981' },
      { ref: chartRefs.project, type: 'bar', data: stats.growthData.projectGrowth, label: 'Projects', backgroundColor: '#6366f1' },
      { ref: chartRefs.visits, type: 'bar', data: stats.growthData.visitsGrowth, label: 'Visits', backgroundColor: '#6366f1' },
      { ref: chartRefs.certificates, type: 'bar', data: stats.growthData.certificatesGrowth, label: 'Certificates', backgroundColor: '#8b5cf6' },
      { ref: chartRefs.posts, type: 'bar', data: stats.growthData.postGrowth, label: 'Posts', backgroundColor: '#d946ef' },
      { ref: chartRefs.contacts, type: 'bar', data: stats.growthData.contactGrowth, label: 'Contacts', backgroundColor: '#3b82f6' },
    ];

    chartConfigs.forEach((config) => {
      if (config.data) {
        createChart(config.ref, config.type, {
          labels: config.data.map((item) => item._id),
          datasets: [{
            label: config.label,
            data: config.data.map((item) => item.count),
            backgroundColor: config.backgroundColor,
          }],
        });
      }
    });

    return () => {
      chartInstances.current.forEach((chart) => chart.destroy());
    };
  }, [stats]);

  if (loading) return <div className="p-8 text-center text-lg font-semibold">Loading...</div>;
  if (error) return <div className="text-red-500 p-8 text-center">Error: {error}</div>;

  return (
    <div className="p-8 bg-base-200 min-h-screen mt-20">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8 p-6 bg-base-100 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Website Performance</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${performanceScore}%` }} transition={{ duration: 1 }}
            className="h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>
        <p className="mt-2 text-sm text-gray-600">Score: {performanceScore}/100</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(chartRefs).map(([key, ref]) => (
          <div key={key} className="card bg-base-100 shadow-xl p-6 border rounded-lg h-96">
            <h2 className="card-title mb-4 capitalize">{key} Growth</h2>
            <div className="h-80"><canvas ref={ref}></canvas></div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}