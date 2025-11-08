import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  location: {
    country: String,
    city: String,
    region: String,
    latitude: Number,
    longitude: Number,
  },
  sessionId: {
    type: String,
    required: true,
  },
  pageViews: [{
    url: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    duration: Number, // in seconds
  }],
  sessionStart: {
    type: Date,
    default: Date.now,
  },
  sessionEnd: {
    type: Date,
  },
  totalDuration: {
    type: Number, // in seconds
    default: 0,
  },
  referrer: String,
  device: {
    type: String, // desktop, mobile, tablet
  },
  browser: String,
  os: String,
}, {
  timestamps: true,
});

export default mongoose.models.Visit || mongoose.model('Visit', visitSchema);
