const mongoose = require('mongoose')

// ── Review ────────────────────────────────────────────────────────────────
const ReviewSchema = new mongoose.Schema({
  name:     { type: String, trim: true,  default: 'Anonymous' },
  location: { type: String, trim: true,  default: 'Gonubie'   },
  stars:    { type: Number, required: true, min: 1, max: 5    },
  text:     { type: String, required: true, trim: true        },
  // Reviews are hidden until approved — prevents spam
  approved: { type: Boolean, default: false },
}, {
  timestamps: true,
})

// ── BlockedDate ───────────────────────────────────────────────────────────
// Allows owners to manually mark dates as unavailable (e.g. personal trips)
const BlockedDateSchema = new mongoose.Schema({
  date:   { type: String, required: true, unique: true }, // YYYY-MM-DD
  reason: { type: String, trim: true },
})

module.exports = {
  Review:      mongoose.model('Review',      ReviewSchema),
  BlockedDate: mongoose.model('BlockedDate', BlockedDateSchema),
}
