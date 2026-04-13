/**
 * routes/contact.js  — POST /api/contact
 * routes/meetgreet.js — POST /api/meetgreet
 * Both are in this file for conciseness; split into separate files if preferred.
 */

const express              = require('express')
const { sendMail }         = require('../utils/mailer')
const { contactEmail, meetGreetEmail } = require('../utils/emailTemplates')

// ── Contact form ─────────────────────────────────────────────────────────
const contactRouter = express.Router()

contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    if (!name?.trim())    return res.status(400).json({ error: 'Name is required.'    })
    if (!email?.trim())   return res.status(400).json({ error: 'Email is required.'   })
    if (!message?.trim()) return res.status(400).json({ error: 'Message is required.' })

    const owners = [process.env.OWNER_EMAIL_1, process.env.OWNER_EMAIL_2].filter(Boolean)

    await sendMail({
      to:      owners,
      subject: `📩 Website Enquiry — ${name.trim()}`,
      html:    contactEmail({ name, email, phone, message }),
    })

    res.json({ message: 'Message sent successfully.' })
  } catch (err) {
    console.error('[contact]', err)
    res.status(500).json({ error: 'Could not send message. Please try again.' })
  }
})

// ── Meet & greet ─────────────────────────────────────────────────────────
const meetRouter = express.Router()

meetRouter.post('/', async (req, res) => {
  try {
    const { name, phone } = req.body

    if (!name?.trim())  return res.status(400).json({ error: 'Name is required.'  })
    if (!phone?.trim()) return res.status(400).json({ error: 'Phone is required.' })

    const owners = [process.env.OWNER_EMAIL_1, process.env.OWNER_EMAIL_2].filter(Boolean)

    await sendMail({
      to:      owners,
      subject: `☕ Meet & Greet Request — ${name.trim()}`,
      html:    meetGreetEmail(req.body),
    })

    res.json({ message: 'Meet & greet request sent.' })
  } catch (err) {
    console.error('[meetgreet]', err)
    res.status(500).json({ error: 'Could not send request. Please try again.' })
  }
})

module.exports = { contactRouter, meetRouter }
