const mongoose = require('mongoose')

const PetSchema = new mongoose.Schema({
  type:        { type: String, trim: true },
  name:        { type: String, trim: true },
  feeding:     { type: String, trim: true },
  medication:  { type: String, trim: true },
  personality: { type: String, trim: true },
  notes:       { type: String, trim: true },
}, { _id: false })

const BookingSchema = new mongoose.Schema({
  // Step 1 — Guest
  guestName:  { type: String, required: true, trim: true },
  guestEmail: { type: String, required: true, trim: true, lowercase: true },
  guestPhone: { type: String, trim: true },

  // Step 2 — Dates & home
  dateFrom:            { type: String, required: true },   // stored as YYYY-MM-DD string
  dateTo:              { type: String, required: true },
  address:             { type: String, required: true, trim: true },
  specialInstructions: { type: String, trim: true },

  // Step 3 — Pets
  hasPets: { type: Boolean, default: false },
  pets:    { type: [PetSchema], default: [] },

  // Step 4 — Access & preferences
  accessInstructions: { type: String, trim: true },
  keysInventory:      { type: String, trim: true },
  securityCompany:    { type: String, trim: true },
  securityContact:    { type: String, trim: true },
  emergencyName:      { type: String, trim: true },
  emergencyPhone:     { type: String, trim: true },
  emergencyRelation:  { type: String, trim: true },
  hasPlants:          { type: Boolean, default: false },
  hasPool:            { type: Boolean, default: false },
  rubbishDay:         { type: String, trim: true },
  wifi:               { type: Boolean, default: false },
  wifiPassword:       { type: String, trim: true },
  dailyUpdates:       { type: Boolean, default: false },

  // Lifecycle
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,   // adds createdAt + updatedAt automatically
})

// Index for calendar date queries — fetching booked date ranges
BookingSchema.index({ dateFrom: 1, dateTo: 1, status: 1 })

module.exports = mongoose.model('Booking', BookingSchema)
