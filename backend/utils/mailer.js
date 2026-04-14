'use strict'

/**
 * mailer.js
 * Thin wrapper around Resend's HTTPS API.
 * Call sendMail() anywhere in the app — it logs errors but never throws,
 * so a broken email config won't crash the booking submission.
 */

const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM =
  process.env.EMAIL_FROM ||
  'Gonubie House Sitting <onboarding@resend.dev>'

function mapAttachments(attachments = []) {
  return attachments.map(att => {
    const mapped = { filename: att.filename }

    if (att.contentType) mapped.contentType = att.contentType
    if (att.path) mapped.path = att.path

    if (att.content && !att.path) {
      mapped.content = Buffer.isBuffer(att.content)
        ? att.content.toString('base64')
        : Buffer.from(String(att.content)).toString('base64')
    }

    return mapped
  })
}

/**
 * @param {object} opts
 * @param {string|string[]} opts.to        - Recipient(s)
 * @param {string}          opts.subject   - Subject line
 * @param {string}          opts.html      - HTML body
 * @param {object[]}        [opts.attachments] - Resend-compatible attachments array
 */
async function sendMail({ to, subject, html, attachments }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY not set — email skipped.')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      attachments: attachments?.length ? mapAttachments(attachments) : undefined,
    })

    if (error) {
      console.error(`[mailer] ❌ Resend failed for "${subject}":`, error.message || error)
      return
    }

    console.log(`[mailer] ✅ Sent "${subject}" → ${data?.id}`)
  } catch (err) {
    console.error(`[mailer] ❌ Failed to send "${subject}":`, err.message)
  }
}

module.exports = { sendMail }
