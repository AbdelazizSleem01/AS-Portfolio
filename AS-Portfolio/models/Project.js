// models/Project.js
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  liveLink: String,
  githubLink: String,
  videoLink: String, 
  imageUrl: String, 
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default Project;
