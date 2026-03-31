import { useState } from 'react'
import axios from 'axios'

const CONTACT_INFO = [
  {
    icon: '📞',
    label: 'Phone',
    lines: ['Your Name: +27 XXX XXX XXXX', 'Layla: +27 XXX XXX XXXX'],
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: '✉️',
    label: 'Email',
    lines: ['housesit@gonubie.co.za'],
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: '📍',
    label: 'Location',
    lines: ['Gonubie, East London', 'Eastern Cape, South Africa'],
    color: 'bg-purple-100 text-purple-600',
  },
]

export default function ContactSection() {
  const [form, setForm]     = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoad]  = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoad(true); setError('')
    try {
      await axios.post('/api/contact', form)
      setSent(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setError('Something went wrong. Please email us directly or try again.')
    } finally {
      setLoad(false)
    }
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Have questions? We'd love to hear from you!</h2>
        </div>

        {/* Two column layout — exactly as wireframe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: contact info cards */}
          <div className="space-y-5">
            {/* Contact info card */}
            <div className="card-mint p-6 sm:p-7">
              <h3 className="font-heading font-semibold text-gray-900 mb-5">Contact Information</h3>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon, label, lines, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center flex-shrink-0 text-lg`}>
                      {icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
                      {lines.map(l => (
                        <p key={l} className="text-gray-500 text-sm">{l}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time card */}
            <div className="card-mint p-6">
              <h3 className="font-heading font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                We typically respond within 2–4 hours during business hours. For urgent requests,
                please call us directly.
              </p>
            </div>
          </div>

          {/* Right: contact form */}
          <div className="card-mint p-6 sm:p-7">
            <h3 className="font-heading font-semibold text-gray-900 mb-5">Send Us a Message</h3>

            {sent ? (
              <div className="py-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <p className="font-semibold text-gray-900">Message sent!</p>
                <p className="text-sm text-gray-500 mt-1">We'll get back to you within a few hours.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-4 text-sm">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="field-label">Your Name</label>
                  <input className="field-input bg-white" placeholder="John Smith"
                    value={form.name} onChange={e => set('name', e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Email Address</label>
                  <input className="field-input bg-white" type="email" placeholder="john@example.com"
                    value={form.email} onChange={e => set('email', e.target.value)} required />
                </div>
                <div>
                  <label className="field-label">Phone Number <span className="text-gray-400 font-normal">(optional)</span></label>
                  <input className="field-input bg-white" placeholder="+27 82 123 4567"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
                <div>
                  <label className="field-label">Message</label>
                  <textarea className="field-textarea bg-white" rows={4}
                    placeholder="Tell us about your house sitting needs…"
                    value={form.message} onChange={e => set('message', e.target.value)} required />
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full py-3 justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
