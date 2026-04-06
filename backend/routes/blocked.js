/**
 * routes/blocked.js
 *
 * GET    /api/blocked       — list all manually blocked dates
 * POST   /api/blocked       — block a date { date: "YYYY-MM-DD", reason?: string }
 * DELETE /api/blocked/:date — unblock a date
 */

const express = require('express')
const { BlockedDate } = require('../models/Review')

const router = express.Router()

// List all blocked dates
router.get('/', async (req, res) => {
  try {
    const blocked = await BlockedDate.find().sort({ date: 1 })
    res.json(blocked)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch blocked dates.' })
  }
})

// Block a date
router.post('/', async (req, res) => {
  try {
    const { date, reason } = req.body

    if (!date) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD).' })

    // Validate format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Date must be in YYYY-MM-DD format.' })
    }

    const blocked = await BlockedDate.create({ date, reason: reason?.trim() })
    res.status(201).json(blocked)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'That date is already blocked.' })
    }
    res.status(500).json({ error: 'Could not block date.' })
  }
})

// Unblock a date
router.delete('/:date', async (req, res) => {
  try {
    const result = await BlockedDate.deleteOne({ date: req.params.date })
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Date not found in blocked list.' })
    }
    res.json({ message: `${req.params.date} unblocked.` })
  } catch (err) {
    res.status(500).json({ error: 'Could not unblock date.' })
  }
})

module.exports = router
