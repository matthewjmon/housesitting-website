/**
 * mailer.js
 * Thin wrapper around Nodemailer using Gmail SMTP.
 * Call sendMail() anywhere in the app — it logs errors but never throws,
 * so a broken SMTP config won't crash the booking submission.
 */
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

/**
 * @param {object} opts
 * @param {string|string[]} opts.to        - Recipient(s)
 * @param {string}          opts.subject   - Subject line
 * @param {string}          opts.html      - HTML body
 * @param {object[]}        [opts.attachments] - Nodemailer attachments array
 */
async function sendMail({ to, subject, html, attachments }) {
  // Silently skip in test/CI environments that don't configure SMTP
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('[mailer] GMAIL_USER or GMAIL_APP_PASSWORD not set — email skipped.')
    return
  }

  try {
    const info = await transporter.sendMail({
      from:        `"Gonubie House Sitting" <${process.env.GMAIL_USER}>`,
      to:          Array.isArray(to) ? to.join(', ') : to,
      subject,
      html,
      attachments,
    })
    console.log(`[mailer] ✅ Sent "${subject}" → ${info.accepted.join(', ')}`)
  } catch (err) {
    console.error(`[mailer] ❌ Failed to send "${subject}":`, err.message)
  }
}

module.exports = { sendMail }
