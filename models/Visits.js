import mongoose from 'mongoose';

const pageViewSchema = new mongoose.Schema({
  url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 },
});

const visitSchema = new mongoose.Schema({
  sessionId: { 
    type: String, 
    required: true, 
    index: true,
    unique: true 
  },
  
  ip: { 
    type: String, 
    required: true,
    index: true 
  },
  
  userAgent: { type: String, required: true },
  
  location: {
    country: { type: String, default: 'Unknown' },
    city: { type: String, default: 'Unknown' },
    region: { type: String, default: 'Unknown' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    countryCode: { type: String, default: 'Unknown' },
    countryFlagEmoji: { type: String, default: '🌍' },
    countryFlagImg: { type: String, default: null },
  },
  
  device: { 
    type: String, 
    enum: ['desktop', 'mobile', 'tablet'], 
    default: 'desktop',
    index: true 
  },
  
  browser: { 
    type: String, 
    default: 'Unknown',
    index: true 
  },
  
  os: { type: String, default: 'Unknown' },
  
  pageViews: [pageViewSchema],
  
  referrer: { type: String, default: 'Direct' },
  
  sessionStart: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  
  lastActivity: { type: Date, default: Date.now },
  
  totalDuration: { 
    type: Number, 
    default: 0 
  }, 
  
  isActive: { type: Boolean, default: true },
  
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

visitSchema.index({ 'location.country': 1 });
visitSchema.index({ createdAt: -1 });
visitSchema.index({ device: 1, createdAt: -1 });
visitSchema.index({ browser: 1, createdAt: -1 });

visitSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

visitSchema.methods.calculateDuration = function() {
  const now = new Date();
  const start = new Date(this.sessionStart);
  this.totalDuration = Math.floor((now - start) / 1000);
  return this.totalDuration;
};

const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);

export default Visit;