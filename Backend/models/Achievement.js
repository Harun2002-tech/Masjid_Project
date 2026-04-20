const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String, // ለምሳሌ: "Trophy", "Sparkles" (በFrontend በኩል ለመለየት)
    default: "Trophy"
  },
  color: {
    type: String, // ለምሳሌ: "emerald", "yellow", "blue"
    default: "emerald"
  },
  earnedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // መቼ እንደተፈጠረ እና እንደተሻሻለ በራሱ ይመዘግባል
});

module.exports = mongoose.model('Achievement', achievementSchema);