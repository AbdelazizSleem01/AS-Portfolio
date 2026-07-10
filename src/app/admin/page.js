"use client"
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/dashboard';

export default function AdminPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-base-content/70">Loading Admin Panel...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <AdminLayout pageTitle="Dashboard Overview">
      <Dashboard />
    </AdminLayout>
  );
}