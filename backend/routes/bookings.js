/**
 * routes/bookings.js
 *
 * POST   /api/bookings          — create booking, send emails to owners + guest
 * GET    /api/bookings          — list all bookings (admin)
 * GET    /api/bookings/dates    — return array of booked YYYY-MM-DD strings (calendar)
 * PATCH  /api/bookings/:id/status — confirm | cancel | complete
 * DELETE /api/bookings/:id      — hard delete (admin)
 */

const express  = require('express')
const Booking  = require('../models/Booking')
const { BlockedDate } = require('../models/Review')
const { sendOwnerNotification, sendGuestConfirmation } = require('../utils/mailer')
const {
  newBookingOwner,
  bookingConfirmGuest,
  bookingAcceptedGuest,
  bookingCancelledGuest,
  toICS,
} = require('../utils/emailTemplates')

const router = express.Router()

// Helper — build the list of owner email addresses from env


// ── GET /dates — array of all booked YYYY-MM-DD strings ─────────────────
router.get('/dates', async (req, res) => {
  try {
    // Fetch all active bookings AND manually blocked dates
    const [bookings, blocked] = await Promise.all([
      Booking.find({ status: { $in: ['pending', 'confirmed'] } }, 'dateFrom dateTo'),
      BlockedDate.find({}, 'date'),
    ])

    const dates = new Set(blocked.map(b => b.date))

    bookings.forEach(b => {
      const start = new Date(b.dateFrom)
      const end   = new Date(b.dateTo)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.add(d.toISOString().split('T')[0])
      }
    })

    res.json([...dates].sort())
  } catch (err) {
    console.error('[bookings/dates]', err)
    res.status(500).json({ error: 'Could not fetch booked dates.' })
  }
})

// ── GET / — all bookings for admin ──────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ dateFrom: 1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch bookings.' })
  }
})

// ── POST / — create a new booking ───────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const {
      guestName, guestEmail, dateFrom, dateTo, address,
    } = req.body

    // Basic server-side validation
    if (!guestName?.trim())  return res.status(400).json({ error: 'Guest name is required.'  })
    if (!guestEmail?.trim()) return res.status(400).json({ error: 'Guest email is required.' })
    if (!dateFrom)           return res.status(400).json({ error: 'Check-in date is required.'  })
    if (!dateTo)             return res.status(400).json({ error: 'Check-out date is required.' })
    if (!address?.trim())    return res.status(400).json({ error: 'Property address is required.' })
    if (dateTo < dateFrom)   return res.status(400).json({ error: 'Check-out must be after check-in.' })

    const booking = await Booking.create(req.body)

    // ── Emails (non-blocking — errors are logged but don't fail the request) ──
    const icsAttachment = {
      filename:    'booking.ics',
      content:     toICS(booking),
      contentType: 'text/calendar',
    }

    // Notify both owners with full details + calendar attachment
    sendOwnerNotification({
      subject:     `🏠 New Booking Request — ${booking.guestName} (${booking.dateFrom} → ${booking.dateTo})`,
      html:        newBookingOwner(booking),
      attachments: [icsAttachment],
    })

    // Guest confirmation is intentionally disabled for launch on the free tier
    if (booking.guestEmail) {
      sendGuestConfirmation({
        to:      booking.guestEmail,
        subject: 'Booking Request Received — Gonubie House Sitting',
        html:    bookingConfirmGuest(booking),
      })
    }

    res.status(201).json(booking)
  } catch (err) {
    console.error('[bookings/create]', err)
    if (err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ')
      return res.status(400).json({ error: msg })
    }
    res.status(500).json({ error: 'Could not create booking. Please try again.' })
  }
})

// ── PATCH /:id/status — owners confirm | cancel | complete a booking ─────
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'confirmed', 'cancelled', 'completed']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` })
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    if (!booking) return res.status(404).json({ error: 'Booking not found.' })

    // Guest emails are intentionally disabled for launch on the free tier
    if (status === 'confirmed' && booking.guestEmail) {
      const icsAttachment = {
        filename:    'booking-confirmed.ics',
        content:     toICS(booking),
        contentType: 'text/calendar',
      }
      sendGuestConfirmation({
        to:          booking.guestEmail,
        subject:     '✅ Booking Confirmed — Gonubie House Sitting',
        html:        bookingAcceptedGuest(booking),
        attachments: [icsAttachment],
      })
    }

    if (status === 'cancelled' && booking.guestEmail) {
      sendGuestConfirmation({
        to:      booking.guestEmail,
        subject: 'Booking Cancellation — Gonubie House Sitting',
        html:    bookingCancelledGuest(booking),
      })
    }

    res.json(booking)
  } catch (err) {
    console.error('[bookings/status]', err)
    res.status(500).json({ error: 'Could not update booking status.' })
  }
})

// ── DELETE /:id — hard delete ────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ error: 'Booking not found.' })
    res.json({ message: 'Booking deleted.' })
  } catch (err) {
    res.status(500).json({ error: 'Could not delete booking.' })
  }
})

module.exports = router
