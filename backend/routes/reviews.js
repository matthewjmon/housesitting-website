/**
 * routes/reviews.js
 *
 * GET    /api/reviews         — list approved reviews (public)
 * GET    /api/reviews/all     — list ALL reviews including unapproved (admin)
 * POST   /api/reviews         — submit a new review (pending approval)
 * PATCH  /api/reviews/:id/approve — approve a review (admin)
 * DELETE /api/reviews/:id     — delete a review (admin)
 */

const express = require('express')
const { Review } = require('../models/Review')

const router = express.Router()

// Public — only approved reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reviews.' })
  }
})

// Admin — all reviews
router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reviews.' })
  }
})

// Submit a new review — starts as unapproved
router.post('/', async (req, res) => {
  try {
    const { stars, text, name, location } = req.body

    if (!stars || stars < 1 || stars > 5) return res.status(400).json({ error: 'Stars must be between 1 and 5.' })
    if (!text?.trim())                     return res.status(400).json({ error: 'Review text is required.'      })

    const review = await Review.create({
      stars: Number(stars),
      text:  text.trim(),
      name:  name?.trim()     || 'Anonymous',
      location: location?.trim() || 'Gonubie',
    })

    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ error: 'Could not submit review.' })
  }
})

// Admin — approve
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { approved: true }, { new: true })
    if (!review) return res.status(404).json({ error: 'Review not found.' })
    res.json(review)
  } catch (err) {
    res.status(500).json({ error: 'Could not approve review.' })
  }
})

// Admin — delete
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ error: 'Review not found.' })
    res.json({ message: 'Review deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete review.' })
  }
})

module.exports = router
