import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  userImage: {
    type: String,
    required: [true, 'User image is required'],
    default: '/imgs/Logo.png' 
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [100, 'Content must be at least 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    match: [/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'],
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [160, 'Excerpt cannot exceed 160 characters'],
    trim: true

  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required'],
    default: '/imgs/Logo.png' // Add a default cover image

  },
  tags: {
    type: [String],
    required: [true, 'Tags are required'],
    validate: {
      validator: function (tags) {
        return tags.length <= 5; // Limit to 5 tags
      },
      message: 'Cannot have more than 5 tags'
    }

  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
});

// Add a pre-save hook to update the updatedAt field
postSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Add text indexes for search functionality
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.models.Post || mongoose.model('Post', postSchema);