import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  pid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Regular', 'Digital'],
    default: 'Regular'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true
  },
  maxAds: {
    type: Number,
    required: true,
    min: 1
  },
  features: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  popularity: {
    type: String,
    enum: ['Popular', 'Recommended', 'None'],
    default: 'None'
  },
  icon: {
    type: String,
    default: ''
  },
  subscriberCount: {
    type: Number,
    default: 0
  }
}, { 
  timestamps: true 
});

// Pre-save middleware to generate PID if not provided
packageSchema.pre('save', function(next) {
  if (!this.pid) {
    this.pid = `#PKG${Math.floor(10000 + Math.random() * 90000)}`;
  }
  next();
});

const Package = mongoose.model('Package', packageSchema);
export default Package;