'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Laptop,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Calendar,
  Download,
  Share2,
  AlertCircle,
  CheckCircle,
  X,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import Swal from 'sweetalert2';
import Image from 'next/image';

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="animate-pulse">
      <div className="h-12 bg-base-300 rounded-2xl w-64 mx-auto mb-4"></div>
      <div className="h-4 bg-base-300 rounded-lg w-96 mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-32 bg-base-300 rounded-3xl"></div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-12 bg-base-300 rounded-xl mb-4 w-48"></div>
          <div className="h-64 bg-base-300 rounded-3xl"></div>
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, title, value, subtitle, color = "from-primary to-secondary", trend, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300 animate-pulse">
        <div className="h-8 bg-base-300 rounded-lg w-3/4 mb-4"></div>
        <div className="h-10 bg-base-300 rounded-lg w-1/2 mb-2"></div>
        <div className="h-4 bg-base-300 rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300 hover:shadow-xl transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-base-100" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-primary mb-2">{value}</h3>
      <p className="text-base-content font-semibold mb-1">{title}</p>
      {subtitle && <p className="text-base-content/70 text-sm">{subtitle}</p>}
    </motion.div>
  );
};

const DataSection = ({ title, icon: Icon, children, color = "from-primary to-secondary", action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-base-200 rounded-3xl p-6 shadow-lg border border-base-300"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-5 h-5 text-base-100" />
        </div>
        <h3 className="text-xl font-bold text-base-content">{title}</h3>
      </div>
      {action && (
        <div className="flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
    {children}
  </motion.div>
);

const FilterComponent = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-base-300 hover:bg-base-400 text-base-content px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
      >
        <Filter className="w-4 h-4" />
        Filters
        {Object.values(filters).some(f => f !== 'all') && (
          <span className="bg-primary text-primary-content text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-base-200 border border-base-300 rounded-2xl shadow-2xl p-6 w-80 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-lg">Filter Analytics</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="text-base-content/50 hover:text-base-content"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Country Filter */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => onFilterChange('country', e.target.value)}
                  className="w-full bg-base-100 border border-base-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Countries</option>
                  {/* سيتم ملء هذا من البيانات */}
                </select>
              </div>

              {/* Device Filter */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Device
                </label>
                <select
                  value={filters.device}
                  onChange={(e) => onFilterChange('device', e.target.value)}
                  className="w-full bg-base-100 border border-base-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-base-content/70 mb-2">
                  Date Range
                </label>
                <div className="flex gap-2">
                  {[7, 30, 90, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => onFilterChange('days', days)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${filters.days === days
                        ? 'bg-primary text-primary-content'
                        : 'bg-base-100 text-base-content hover:bg-base-300'
                        }`}
                    >
                      {days === 365 ? '1Y' : `${days}D`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  onFilterChange('country', 'all');
                  onFilterChange('device', 'all');
                  onFilterChange('days', 30);
                }}
                className="w-full bg-base-300 hover:bg-base-400 text-base-content py-2 rounded-xl font-medium mt-4 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Visits() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    country: 'all',
    device: 'all',
    days: 30
  });

  const itemsPerPage = 8;

  const totalVisits = analytics?.pagination?.totalItems || 0;
  const totalPages = analytics?.pagination?.totalPages || 1;
  const currentVisits = analytics?.recentVisits || [];

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: itemsPerPage.toString(),
      days: filters.days.toString(),
    });

    if (filters.country !== 'all') params.append('country', filters.country);
    if (filters.device !== 'all') params.append('device', filters.device);

    return params.toString();
  }, [currentPage, filters, itemsPerPage]);

  const fetchAnalytics = useCallback(async (showToast = false) => {
    try {
      const queryString = buildQueryString();
      const response = await fetch(`/api/visits?${queryString}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
      setError(null);

      if (showToast) {
        Swal.fire({
          icon: 'success',
          title: 'Analytics Updated!',
          text: 'Analytics data has been refreshed successfully.',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);

      Swal.fire({
        icon: 'error',
        title: 'Failed to Load Analytics',
        text: err.message,
        timer: 5000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [buildQueryString]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (analytics) {
      setCurrentPage(1);
      setLoading(true);
      fetchAnalytics();
    }
  }, [filters]);

  useEffect(() => {
    if (analytics) {
      setLoading(true);
      fetchAnalytics();
    }
  }, [currentPage]);

  const refreshData = () => {
    setRefreshing(true);
    fetchAnalytics(true);
  };

  const exportData = () => {
    if (!analytics) return;

    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: 'success',
      title: 'Data Exported!',
      text: 'Analytics data has been exported successfully.',
      timer: 3000,
      showConfirmButton: false,
    });
  };

  const shareDashboard = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Website Analytics Dashboard',
        text: 'Check out these amazing website analytics!',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Dashboard link has been copied to clipboard.',
        timer: 3000,
        showConfirmButton: false,
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-error/10 rounded-3xl border border-error/20 max-w-md w-full"
        >
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-error mb-2">Error Loading Analytics</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={refreshData}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Retrying...' : 'Try Again'}
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

  return (
    <div className="min-h-screen bg-base-100 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-primary to-secondary rounded-2xl">
                  <Eye className="w-8 h-8 text-base-100" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Website Analytics
                </h1>
              </div>
              <p className="text-xl text-base-content/70 max-w-2xl">
                Real-time insights into your website's performance and visitor behavior
              </p>
              <div className="w-32 h-1.5 bg-gradient-to-r from-primary to-secondary rounded-full mt-4" />
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3">
              <FilterComponent
                filters={filters}
                onFilterChange={handleFilterChange}
              />

              <button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-base-300 hover:bg-base-400 text-base-content px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>

              <button
                onClick={exportData}
                className="bg-base-300 hover:bg-base-400 text-base-content px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={shareDashboard}
                className="bg-base-300 hover:bg-base-400 text-base-content px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>

          {/* Last Updated */}
          {analytics?.lastUpdated && (
            <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-base-content/50">
              <Clock className="w-4 h-4" />
              Last updated: {new Date(analytics.lastUpdated).toLocaleString()}
            </div>
          )}
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
            value={analytics?.totalVisitors?.toLocaleString() || '0'}
            subtitle="Unique sessions"
            color="from-blue-500 to-cyan-500"
            trend={12.5}
          />

          <StatCard
            icon={Clock}
            title="Avg Session"
            value={analytics?.avgSessionDuration ?
              `${Math.floor(analytics.avgSessionDuration / 60)}m ${Math.floor(analytics.avgSessionDuration % 60)}s` : '0m 0s'
            }
            subtitle="Average duration"
            color="from-green-500 to-emerald-500"
            trend={5.2}
          />

          <StatCard
            icon={MapPin}
            title="Top Country"
            value={analytics?.visitorsByCountry?.[0]?.country || 'N/A'}
            subtitle={`${analytics?.visitorsByCountry?.[0]?.count?.toLocaleString() || 0} visitors`}
            color="from-purple-500 to-pink-500"
          />

          <StatCard
            icon={Laptop}
            title="Top Device"
            value={analytics?.deviceBreakdown?.[0]?._id?.toUpperCase() || 'N/A'}
            subtitle={`${analytics?.deviceBreakdown?.[0]?.count?.toLocaleString() || 0} users`}
            color="from-orange-500 to-red-500"
          />
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-base-200 rounded-3xl p-6 border border-base-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <BarChart3 className="w-5 h-5 text-base-100" />
              </div>
              <h3 className="font-bold text-base-content">Page Views</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {analytics?.stats?.totalPageViews?.toLocaleString() || '0'}
            </p>
          </div>

          <div className="bg-base-200 rounded-3xl p-6 border border-base-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                <PieChart className="w-5 h-5 text-base-100" />
              </div>
              <h3 className="font-bold text-base-content">Bounce Rate</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {analytics?.stats?.bounceRate ? `${analytics.stats.bounceRate}%` : 'N/A'}
            </p>
          </div>

          <div className="bg-base-200 rounded-3xl p-6 border border-base-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <LineChart className="w-5 h-5 text-base-100" />
              </div>
              <h3 className="font-bold text-base-content">Returning Users</h3>
            </div>
            <p className="text-3xl font-bold text-primary">
              {analytics?.stats?.newVsReturning?.returning?.toLocaleString() || '0'}
            </p>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DataSection
            title="Visitors by Country"
            icon={Globe}
            color="from-blue-500 to-cyan-500"
            action={
              <span className="text-sm text-base-content/50">
                Top 20
              </span>
            }
          >
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {analytics?.visitorsByCountry?.map((country, index) => (
                <motion.div
                  key={country.country}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-base-100 rounded-xl hover:bg-base-300/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl min-w-[40px] flex justify-center">
                      {country.flag || getFlagEmoji(country.countryCode)}
                    </div>
                    <div>
                      <span className="font-medium text-base-content block">
                        {country.country || 'Unknown'}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {country.count} visit{country.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-base-300 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full"
                        style={{
                          width: `${(country.count / analytics.totalVisitors) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full min-w-[60px] text-center">
                      {country.count.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )) || (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70">No country data available</p>
                  </div>
                )}
            </div>
          </DataSection>

          <DataSection
            title="Device Breakdown"
            icon={Smartphone}
            color="from-green-500 to-emerald-500"
          >
            <div className="space-y-3">
              {analytics?.deviceBreakdown?.map((device, index) => (
                <motion.div
                  key={device._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-base-100 rounded-xl hover:bg-base-300/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {device._id === 'mobile' ? '📱' :
                       device._id === 'tablet' ? '📟' : '💻'}
                    </span>
                    <div>
                      <span className="font-medium text-base-content capitalize block">
                        {device._id}
                      </span>
                      <span className="text-xs text-base-content/50">
                        {((device.count / analytics.totalVisitors) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {device.count.toLocaleString()}
                  </span>
                </motion.div>
              )) || (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70">No device data available</p>
                  </div>
                )}
            </div>
          </DataSection>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <DataSection
            title="Top Pages"
            icon={FileText}
            color="from-purple-500 to-pink-500"
            action={
              <span className="text-sm text-base-content/50">
                By views
              </span>
            }
          >
            <div className="space-y-3">
              {analytics?.topPages?.slice(0, 6).map((page, index) => (
                <motion.div
                  key={page._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-base-100 rounded-xl hover:bg-base-300/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-lg text-base-content/50 group-hover:text-primary transition-colors">
                      {index + 1}.
                    </div>
                    <div className="min-w-0">
                      <div className="text-base-content text-sm truncate font-medium">
                        {page._id.split('/').pop() || '/'}
                      </div>
                      <div className="text-xs text-base-content/50 truncate">
                        {page._id}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {page.avgDuration && (
                      <span className="text-xs text-base-content/50">
                        {Math.floor(page.avgDuration)}s avg
                      </span>
                    )}
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                      {page.count.toLocaleString()} views
                    </span>
                  </div>
                </motion.div>
              )) || (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70">No page data available</p>
                  </div>
                )}
            </div>
          </DataSection>

          <DataSection
            title="Browser Usage"
            icon={Globe}
            color="from-orange-500 to-red-500"
          >
            <div className="space-y-3">
              {analytics?.browserBreakdown?.slice(0, 6).map((browser, index) => (
                <motion.div
                  key={browser._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-base-100 rounded-xl hover:bg-base-300/50 transition-colors"
                >
                  <span className="font-medium text-base-content text-sm capitalize">
                    {browser._id}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-24 bg-base-300 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full"
                        style={{
                          width: `${(browser.count / analytics.totalVisitors) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                      {browser.count.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )) || (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                    <p className="text-base-content/70">No browser data available</p>
                  </div>
                )}
            </div>
          </DataSection>
        </div>

        {/* Recent Visits */}
        <DataSection
          title="Recent Visits"
          icon={Eye}
          color="from-indigo-500 to-purple-500"
          action={
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/50">
                Page {currentPage} of {totalPages}
              </span>
            </div>
          }
        >
          <div className="overflow-x-auto rounded-2xl">
            <table className="w-full">
              <thead>
                <tr className="bg-base-300/50">
                  <th className="text-left py-4 px-6 text-base-content font-semibold rounded-l-2xl">
                    Location
                  </th>
                  <th className="text-left py-4 px-6 text-base-content font-semibold">
                    Device & Browser
                  </th>
                  <th className="text-left py-4 px-6 text-base-content font-semibold">
                    Duration
                  </th>
                  <th className="text-left py-4 px-6 text-base-content font-semibold">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-base-content font-semibold rounded-r-2xl">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentVisits.map((visit, index) => (
                    <motion.tr
                      key={visit._id || visit.sessionId || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-base-300/30 hover:bg-base-300/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">
                            {visit.location?.countryFlagEmoji || getFlagEmoji(visit.location?.countryCode)}
                          </div>
                          <div>
                            <div className="font-medium text-base-content">
                              {visit.location?.city || 'Unknown'}, {visit.location?.country || 'Unknown'}
                            </div>
                            <div className="text-xs text-base-content/50">
                              {visit.ip?.slice(0, 15)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${visit.device === 'mobile' ? 'bg-blue-500/10 text-blue-500' :
                            visit.device === 'tablet' ? 'bg-green-500/10 text-green-500' :
                              'bg-purple-500/10 text-purple-500'
                            }`}>
                            {visit.device === 'mobile' ? '📱' :
                              visit.device === 'tablet' ? '📟' : '💻'}
                          </div>
                          <div>
                            <div className="font-medium text-base-content capitalize">
                              {visit.device}
                            </div>
                            <div className="text-xs text-base-content/50">
                              {visit.browser} • {visit.os}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-base-content">
                          {visit.totalDuration ?
                            `${Math.floor(visit.totalDuration / 60)}m ${visit.totalDuration % 60}s` :
                            'N/A'
                          }
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-base-content">
                          {new Date(visit.createdAt || visit.sessionStart).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-base-content">
                          {new Date(visit.createdAt || visit.sessionStart).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>

                {(!currentVisits || currentVisits.length === 0) && (
                  <tr>
                    <td colSpan="5" className="py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-base-content/30 mx-auto mb-3" />
                      <p className="text-base-content/70">No recent visits found</p>
                      <p className="text-sm text-base-content/50 mt-1">
                        Try adjusting your filters
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-base-100 border-t border-base-300">
                <div className="text-sm text-base-content/70 mb-4 sm:mb-0">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalVisits)} of {totalVisits} visits
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-base-200 text-base-content/70 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="First page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-base-200 text-base-content/70 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`px-3 py-2 text-sm rounded-lg transition-colors min-w-[40px] ${currentPage === pageNum
                            ? 'bg-primary text-primary-content font-semibold'
                            : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                            }`}
                          aria-label={`Page ${pageNum}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-base-200 text-base-content/70 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-base-200 text-base-content/70 hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Last page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </DataSection>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-base-300"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-lg mb-2">Need More Insights?</h4>
              <p className="text-base-content/70 max-w-md">
                Access detailed analytics, custom reports, and advanced segmentation on Vercel Analytics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://vercel.com/analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-secondary text-base-100 px-6 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <TrendingUp className="w-5 h-5" />
                View Detailed Analytics
              </a>

              <a
                href="/api/visits?format=json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-base-300 hover:bg-base-400 text-base-content px-6 py-3 rounded-xl font-semibold transition-colors"
              >
                <FileText className="w-5 h-5" />
                Raw API Data
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-base-content/50">
            <p>
              Data is automatically updated every 5 minutes.
              Last fetch: {analytics?.lastUpdated ? new Date(analytics.lastUpdated).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode === 'Unknown') return '🌍';
  if (countryCode === 'Local') return '🏠';

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1F1E6 - 65 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
};
