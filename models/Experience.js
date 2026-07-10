import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    default: 'Present',
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: '',
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);

export default Experience;
