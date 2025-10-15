import mongoose from "mongoose";

const bannerAdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  placement: {
    type: String,
    default: "Home Page, Category Page"
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Inactive"
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field
bannerAdSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to check for date conflicts
bannerAdSchema.statics.hasDateConflict = async function(startDate, endDate, excludeId = null) {
  const query = {
    status: "Active",
    $or: [
      // New ad starts during an existing active ad
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      // New ad ends during an existing active ad
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      // New ad completely contains an existing active ad
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return !!conflict;
};

export default mongoose.model("BannerAd", bannerAdSchema);