'use strict'

/**
 * mailer.js
 * Production-safe mailer for Resend free tier.
 * Free tier restriction: can only send to the Resend account email
 * until a domain is verified. So all internal notifications are routed
 * to one inbox we control.
 */

const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL
const FROM = process.env.EMAIL_FROM || 'Gonubie House Sitting <onboarding@resend.dev>'

function mapAttachments(attachments = []) {
  return attachments.map(att => {
    const mapped = { filename: att.filename }

    if (att.contentType) mapped.contentType = att.contentType

    if (att.content) {
      mapped.content = Buffer.isBuffer(att.content)
        ? att.content.toString('base64')
        : Buffer.from(String(att.content)).toString('base64')
    }

    return mapped
  })
}

async function sendOwnerNotification({ subject, html, attachments = [] }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[mailer] RESEND_API_KEY not set — skipping owner notification')
    return
  }

  if (!NOTIFY_EMAIL) {
    console.warn('[mailer] NOTIFY_EMAIL not set — skipping owner notification')
    return
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: [NOTIFY_EMAIL],
      subject,
      html,
      attachments: attachments.length ? mapAttachments(attachments) : undefined,
    })

    if (error) {
      console.error('[mailer] owner notification failed:', error.message || error)
      return
    }

    console.log(`[mailer] owner notification sent → ${NOTIFY_EMAIL} ${data?.id || ''}`.trim())
  } catch (err) {
    console.error('[mailer] owner notification failed:', err?.message || err)
  }
}

async function sendGuestConfirmation({ to, subject }) {
  console.log(`[mailer] guest confirmation skipped (free tier) → ${to} | "${subject}"`)
}

module.exports = { sendOwnerNotification, sendGuestConfirmation }
