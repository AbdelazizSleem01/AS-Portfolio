'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Eye, 
  Clock, 
  MapPin, 
  Smartphone, 
  Globe, 
  FileText, 
  Users,
  RefreshCw,
  TrendingUp,
  Laptop
} from 'lucide-react';

export default function Visits() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/visits');
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }
                const data = await response.json();
                setAnalytics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const refreshData = () => {
        setLoading(true);
        setError(null);
        fetch('/api/visits')
            .then(res => res.json())
            .then(data => {
                setAnalytics(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const getFlagEmoji = (countryCode) => {
        if (!countryCode || countryCode === 'Unknown') {
            return '🌍'; 
        }

        if (countryCode === 'Local') {
            return '🏠'; 
        }

        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 0x1F1E6 - 65 + char.charCodeAt(0));

        return String.fromCodePoint(...codePoints);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <h3 className="text-xl font-semibold text-primary mb-2">Loading Analytics</h3>
                    <p className="text-base-content/70">Crunching the numbers...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md"
                >
                    <div className="text-error text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-error mb-2">Error Loading Analytics</h3>
                    <p className="text-base-content/70 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={refreshData}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-base-300 text-base-content px-6 py-2 rounded-lg hover:bg-base-400 transition-colors"
                        >
                            Reload Page
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const StatCard = ({ icon: Icon, title, value, subtitle, color = "from-primary to-secondary" }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${color}`}>
                    <Icon className="w-6 h-6 text-base-100" />
                </div>
                <TrendingUp className="w-5 h-5 text-base-content/40" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">{value}</h3>
            <p className="text-base-content font-semibold mb-1">{title}</p>
            {subtitle && <p className="text-base-content/70 text-sm">{subtitle}</p>}
        </motion.div>
    );

    const DataSection = ({ title, icon: Icon, children, color = "from-primary to-secondary" }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="w-5 h-5 text-base-100" />
                </div>
                <h3 className="text-xl font-bold text-base-content">{title}</h3>
            </div>
            {children}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl">
                            <Eye className="w-8 h-8 text-base-100" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Website Analytics
                        </h1>
                    </div>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-6">
                        Real-time insights into your website's performance and visitor behavior
                    </p>
                    <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                    
                    <motion.button
                        onClick={refreshData}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-base-300 text-base-content px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-base-400 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh Data
                    </motion.button>
                </motion.div>

                {/* Key Metrics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                >
                    <StatCard
                        icon={Users}
                        title="Total Visitors"
                        value={analytics?.totalVisitors || 0}
                        subtitle="All time visitors"
                        color="from-blue-500 to-cyan-500"
                    />
                    <StatCard
                        icon={Clock}
                        title="Avg Session"
                        value={analytics?.avgSessionDuration ? 
                            `${Math.round(analytics.avgSessionDuration / 60)}m ${Math.round(analytics.avgSessionDuration % 60)}s` : '0m 0s'
                        }
                        subtitle="Average duration"
                        color="from-green-500 to-emerald-500"
                    />
                    <StatCard
                        icon={MapPin}
                        title="Top Country"
                        value={analytics?.visitorsByCountry?.[0]?._id || 'N/A'}
                        subtitle={`${analytics?.visitorsByCountry?.[0]?.count || 0} visitors`}
                        color="from-purple-500 to-pink-500"
                    />
                    <StatCard
                        icon={Laptop}
                        title="Top Device"
                        value={analytics?.deviceBreakdown?.[0]?._id || 'N/A'}
                        subtitle={`${analytics?.deviceBreakdown?.[0]?.count || 0} users`}
                        color="from-orange-500 to-red-500"
                    />
                </motion.div>

                {/* Charts and Tables */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <DataSection title="Visitors by Country" icon={Globe} color="from-blue-500 to-cyan-500">
                        <div className="space-y-3">
                            {analytics?.visitorsByCountry?.slice(0, 8).map((country, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{getFlagEmoji(country._id)}</span>
                                        <span className="font-medium text-base-content">{country._id || 'Unknown'}</span>
                                    </div>
                                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {country.count}
                                    </span>
                                </div>
                            )) || <p className="text-base-content/70 text-center py-4">No data available</p>}
                        </div>
                    </DataSection>

                    <DataSection title="Device Breakdown" icon={Smartphone} color="from-green-500 to-emerald-500">
                        <div className="space-y-3">
                            {analytics?.deviceBreakdown?.map((device, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">
                                            {device._id === 'mobile' ? '📱' : device._id === 'tablet' ? '📟' : '💻'}
                                        </span>
                                        <span className="font-medium text-base-content capitalize">{device._id}</span>
                                    </div>
                                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                                        {device.count}
                                    </span>
                                </div>
                            )) || <p className="text-base-content/70 text-center py-4">No data available</p>}
                        </div>
                    </DataSection>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <DataSection title="Top Pages" icon={FileText} color="from-purple-500 to-pink-500">
                        <div className="space-y-3">
                            {analytics?.topPages?.slice(0, 6).map((page, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-xl">
                                    <span className="text-base-content text-sm truncate flex-1 font-medium">
                                        {page._id.split('/').pop() || 'Home'}
                                    </span>
                                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                                        {page.count} views
                                    </span>
                                </div>
                            )) || <p className="text-base-content/70 text-center py-4">No data available</p>}
                        </div>
                    </DataSection>

                    <DataSection title="Browser Usage" icon={Globe} color="from-orange-500 to-red-500">
                        <div className="space-y-3">
                            {analytics?.browserBreakdown?.slice(0, 6).map((browser, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-base-100 rounded-xl">
                                    <span className="font-medium text-base-content text-sm">
                                        {browser._id}
                                    </span>
                                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                                        {browser.count}
                                    </span>
                                </div>
                            )) || <p className="text-base-content/70 text-center py-4">No data available</p>}
                        </div>
                    </DataSection>
                </div>

                {/* Recent Visits */}
                <DataSection title="Recent Visits" icon={Eye} color="from-indigo-500 to-purple-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-base-300">
                                    <th className="text-left py-3 text-base-content font-semibold">Location</th>
                                    <th className="text-left py-3 text-base-content font-semibold">Device</th>
                                    <th className="text-left py-3 text-base-content font-semibold">Duration</th>
                                    <th className="text-left py-3 text-base-content font-semibold">Date</th>
                                    <th className="text-left py-3 text-base-content font-semibold">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics?.recentVisits?.slice(0, 8).map((visit, index) => (
                                    <motion.tr
                                        key={index}
                                        className="border-b border-base-300/50 hover:bg-base-300/50 transition-colors"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <td className="py-3 text-base-content">
                                            {visit.location.city}, {visit.location.country}
                                        </td>
                                        <td className="py-3 text-base-content capitalize">{visit.device}</td>
                                        <td className="py-3 text-base-content">
                                            {visit.totalDuration ?
                                                `${Math.floor(visit.totalDuration / 60)}m ${visit.totalDuration % 60}s` :
                                                'N/A'
                                            }
                                        </td>
                                        <td className="py-3 text-base-content">
                                            {new Date(visit.sessionStart).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 text-base-content">
                                            {new Date(visit.sessionStart).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </td>
                                    </motion.tr>
                                )) || (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-base-content/70">
                                            No recent visits data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </DataSection>

                {/* Vercel Analytics Link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://vercel.com/abdelazizsleem01s-projects/as-portfolio/analytics"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-secondary text-base-100 px-8 py-4 rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300"
                    >
                        <TrendingUp className="w-5 h-5" />
                        View Detailed Analytics on Vercel
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
