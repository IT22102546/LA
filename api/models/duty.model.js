import mongoose from "mongoose";

const dutySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  conditions: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, { 
  timestamps: true,
  // Add validation to ensure at least one condition
  validate: {
    validator: function(v) {
      return v.conditions && v.conditions.length > 0;
    },
    message: 'At least one condition is required'
  }
});

// Pre-save middleware to ensure ID is generated if not provided
dutySchema.pre('save', function(next) {
  if (!this.id) {
    this.id = `#D${Math.floor(1000 + Math.random() * 9000)}`;
  }
  next();
});

const Duty = mongoose.model('Duty', dutySchema);
export default Duty;