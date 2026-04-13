/**
 * server.js — Gonubie House Sitting API
 *
 * Express + MongoDB REST API.
 * All configuration is via environment variables (see .env.example).
 */

'use strict'

require('dotenv').config()
const express   = require('express')
const mongoose  = require('mongoose')
const cors      = require('cors')

const bookingsRouter            = require('./routes/bookings')
const reviewsRouter             = require('./routes/reviews')
const blockedRouter             = require('./routes/blocked')
const { contactRouter, meetRouter } = require('./routes/contact')

// ── App setup ─────────────────────────────────────────────────────────────
const app  = express()
const PORT = process.env.PORT || 5000

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,        // e.g. https://your-site.vercel.app
  'http://localhost:3000',          // Vite dev server
  'http://localhost:4173',          // Vite preview
].filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

// ── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Security headers (basic, no extra packages needed) ────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// ── Request logger (dev only) ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()}  ${req.method}  ${req.path}`)
    next()
  })
}

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/bookings',  bookingsRouter)
app.use('/api/reviews',   reviewsRouter)
app.use('/api/blocked',   blockedRouter)
app.use('/api/contact',   contactRouter)
app.use('/api/meetgreet', meetRouter)

// Health-check — used by Render to confirm the service is alive
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    env:    process.env.NODE_ENV,
    time:   new Date().toISOString(),
  })
})

// ── 404 handler ───────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' })
})

// ── Global error handler ──────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[server error]', err)
  res.status(500).json({ error: 'An unexpected error occurred.' })
})

// ── Database connection then start ────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('❌  MONGO_URI is not set. Please check your .env file.')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected')
    app.listen(PORT, () => {
      console.log(`🚀  API running → http://localhost:${PORT}`)
      console.log(`    Environment : ${process.env.NODE_ENV || 'development'}`)
      console.log(`    CORS origin : ${allowedOrigins.join(', ')}`)
    })
  })
  .catch(err => {
    console.error('❌  MongoDB connection failed:', err.message)
    process.exit(1)
  })

// Graceful shutdown on SIGTERM (Render sends this before restarting)
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — closing connections...')
  await mongoose.connection.close()
  process.exit(0)
})
