import mongoose from 'mongoose';

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  isIndoor: {
    type: Boolean,
    default: false,
  },
  hasLighting: {
    type: Boolean,
    default: false,
  },
  availability: [{
    date: Date,
    timeSlots: [{
      time: String,
      isBooked: Boolean,
    }],
  }],
}, {
  timestamps: true,
});

export default mongoose.model('Turf', turfSchema);