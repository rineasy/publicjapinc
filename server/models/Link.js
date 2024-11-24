const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  analytics: {
    clicks: {
      type: Number,
      default: 0
    },
    lastClicked: Date,
    referrers: [{
      source: String,
      count: Number
    }],
    locations: [{
      country: String,
      count: Number
    }],
    devices: [{
      deviceType: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        default: 1
      }
    }]
  },
  customDomain: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for faster queries
linkSchema.index({ shortCode: 1 });
linkSchema.index({ user: 1, createdAt: -1 });
linkSchema.index({ tags: 1 });
linkSchema.index({ category: 1 });

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
