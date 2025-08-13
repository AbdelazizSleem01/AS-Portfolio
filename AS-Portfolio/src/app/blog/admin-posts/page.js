'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import Swal from 'sweetalert2';

const ITEMS_PER_PAGE = 10;

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const { user } = useUser();

  useEffect(() => {
    document.title = `All Posts | ${process.env.NEXT_PUBLIC_META_TITLE}`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      `View and manage all posts on ${process.env.NEXT_PUBLIC_META_TITLE}`
    );
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format');

        setPosts(data);
        setSuccess('Posts loaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message);
        setTimeout(() => setError(''), 5000);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  const handleDelete = async (slug) => {
    if (!slug) return setError('Invalid post identifier');

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
        const response = await fetch(`/api/posts/${encodeURIComponent(slug)}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete post');
        }

        setPosts(posts.filter(post => post.slug !== slug));
        Swal.fire('Deleted!', `Post "${slug}" deleted successfully`, 'success');
      } catch (err) {
        Swal.fire('Error!', err.message || 'Failed to delete post', 'error');
      }
    }
  };

  const handleEdit = async (slug) => {
    // SweetAlert2 confirmation for edit
    const result = await Swal.fire({
      title: 'Edit Post',
      text: 'Are you sure you want to edit this post?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, edit it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      router.push(`/blog/edit-post/${slug}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-primary font-medium"
        >
          Loading Posts...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-100">
        <div className="text-4xl">⚠️</div>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl text-error font-medium max-w-md text-center"
        >
          {error}
        </motion.p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary mt-4"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-base-100 p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">Blog Management</h1>
          <p className="text-lg text-gray-500">Manage all blog posts and content</p>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="alert alert-success mb-8 shadow-lg"
            >
              <span>{success}</span>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="alert alert-error mb-8 shadow-lg"
            >
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b border-gray-200">
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search posts..."
                className="pl-10 pr-4 py-2 w-full border border-primary text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="h-5 w-5 absolute left-3 top-2.5 text-primary" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="w-16"></th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Tags</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentItems.map((post) => (
                    <motion.tr
                      key={post._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="hover:bg-base-100 group"
                    >
                      <td>
                        {post.coverImage && (
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-lg">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="font-semibold text-primary">{post.title}</div>
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {post.excerpt}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          {post.userImage && (
                            <img
                              src={post.userImage}
                              alt="Author"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-primary">{post.name}</div>
                            <div className="text-xs text-gray-500">Author</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="badge badge-outline badge-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className='text-primary'>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        <div className="badge badge-success gap-2">
                          <div className="w-2 h-2 rounded-full bg-current" />
                          Published
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-square btn-sm text-primary hover:bg-base-200"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="btn btn-square btn-sm text-primary hover:bg-base-200"
                            onClick={() => handleEdit(post.slug)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="btn btn-square btn-sm btn-error text-white hover:bg-error/90"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No posts found matching your search criteria
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-200">
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
                  className="p-2 bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary rounded-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {currentItems.length} of {filteredPosts.length} posts
          </div>
          <button
            className="btn btn-primary"
            onClick={() => window.open('/blog/create-post-open', '_self')}
          >
            Create New Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPostsPage;