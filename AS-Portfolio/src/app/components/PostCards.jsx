import { motion } from 'framer-motion';
import Link from 'next/link';

const PostCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-black"
  >
    <Link href={`/blog/${post.slug}`}>
      <div className="cursor-pointer">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-48 object-cover pb-2 border-b border-black"
        />
        <div className="p-4">
          <div className="mt-4 flex items-center gap-3">
            {post.userImage && (
              <img
                src={post.userImage}
                alt="Author"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="text-sm text-gray-500">{post.name}</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          <p className="text-gray-600 mb-4">{post.excerpt}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default PostCard;