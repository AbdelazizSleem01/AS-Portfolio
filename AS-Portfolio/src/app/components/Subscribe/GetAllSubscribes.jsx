"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const GetAllSubscribes = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const { user } = useUser();

  const router = useRouter();

  useEffect(() => {
    document.title = `All Subscribes | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", `View all subscribers on ${process.env.NEXT_PUBLIC_META_TITLE}.`);
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscribe");
        if (!response.ok) throw new Error("Failed to fetch subscriptions");
        const data = await response.json();
        setSubscriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const handleDelete = async (id) => {
    // SweetAlert2 confirmation for delete
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/subscribe/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          Swal.fire('Deleted!', 'Subscription deleted successfully!', 'success');
          setSubscriptions((prev) => prev.filter((sub) => sub._id !== id));
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete subscription");
        }
      } catch (err) {
        Swal.fire('Error!', err.message || 'Failed to delete subscription', 'error');
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      "Email,Verified,Subscribed At,Unsubscribe Token",
      ...filteredSubscriptions.map((sub) =>
        `"${sub.email}",${sub.verified},"${sub.createdAt}",${sub.unsubscribeToken}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-screen gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-12 h-12 border-4 border-t-4 border-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <motion.span
          className="text-primary text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading...
        </motion.span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-red-500 mt-10"
      >
        Error: {error}
      </motion.div>
    );
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-lg shadow-md shadow-primary border-2 border-primary mt-20"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Email Subscriptions
          <span className='text-primary mx-2'>
            ({filteredSubscriptions.length})
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 w-full border border-primary text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="h-5 w-5 absolute left-3 top-2.5 text-primary" />
          </div>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subscribed</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Unsubscribe Token</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Subscribed</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary">
            {currentItems.map((subscription) => (
              <tr key={subscription._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{subscription.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${subscription.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {subscription.verified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(subscription.createdAt).toLocaleDateString('en-GB', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-500 break-all">
                  {subscription.unsubscribeToken}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${subscription.subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {subscription.subscribed ? 'Active' : 'Unsubscribed'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(subscription._id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50"
                    title="Delete subscription"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSubscriptions.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No subscriptions found
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-700">Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border-2 border-primary rounded-md px-2 py-1 text-sm text-black"
          >
            {[3, 5, 10, 20, 50].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1 text-base-100">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary rounded-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-primary primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary rounded-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GetAllSubscribes;