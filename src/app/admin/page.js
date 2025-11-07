"use client"
import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Shield, User, Settings } from 'lucide-react';
import AdminList from '../components/AdminList';

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
    <div className="min-h-screen bg-base-100 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-8 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-base-200 rounded-3xl p-8 shadow-2xl border border-base-300 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="bg-gradient-to-br from-primary to-secondary p-4 rounded-2xl shadow-lg"
                >
                  <Shield className="w-8 h-8 text-base-100" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold text-primary">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-base-content/70 mt-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Administrator Access
                  </p>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-base-300 rounded-xl text-base-content/70"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Admin Panel</span>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-base-300 rounded-2xl border border-base-300"
            >
              <p className="text-base-content/70 text-center">
                You have full access to manage all aspects of your portfolio website. 
                Use the dashboard below to navigate through different sections.
              </p>
            </motion.div>
          </div>
          
          <AdminList />
        </div>
      </motion.div>
    </div>
  );
}