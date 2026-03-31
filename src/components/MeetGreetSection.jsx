import { useState } from 'react'
import axios from 'axios'

function MeetModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', preferredTime: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.phone) return
    setLoading(true)
    try { await axios.post('/api/meetgreet', form) } catch {/* demo */}
    setDone(true)
    setLoading(false)
    setTimeout(() => { setDone(false); onClose() }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-heading font-bold text-gray-900 text-lg">Schedule a Meet & Greet</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg">×</button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">☕</div>
            <p className="font-heading font-bold text-gray-900">Request Sent!</p>
            <p className="text-sm text-gray-500 mt-1">We'll be in touch to arrange a time that works for everyone.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Fill in your details and we'll reach out to arrange a convenient time.</p>
            <div>
              <label className="field-label">Your Name *</label>
              <input className="field-input" placeholder="e.g. Sarah" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Phone / WhatsApp *</label>
              <input className="field-input" placeholder="+27 82 123 4567" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input className="field-input" type="email" placeholder="sarah@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Preferred Date / Time</label>
              <input className="field-input" placeholder="e.g. Weekday afternoons, anytime" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} />
            </div>
            <div>
              <label className="field-label">Anything we should know?</label>
              <textarea className="field-textarea" rows={2}
                placeholder="Pets, address, anything else…"
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
            <button onClick={handleSubmit} disabled={!form.name || !form.phone || loading}
              className="btn-primary w-full py-3">
              {loading ? 'Sending…' : '☕ Send Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const PERKS = [
  'Get to know us personally',
  'Show us around your home',
  'Introduce us to your pets',
  'Discuss specific care requirements',
  'Ask any questions you may have',
]

export default function MeetGreetSection() {
  const [open, setOpen] = useState(false)

  return (
    <section id="meetgreet" className="py-20 bg-primary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {/* Centered card — matches wireframe exactly */}
          <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10 text-center">

            {/* Coffee icon in green circle */}
            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">☕</span>
            </div>

            <h2 className="font-heading font-bold text-gray-900 text-2xl sm:text-3xl mb-3">
              Schedule a Free Meet & Greet
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-7 max-w-md mx-auto">
              We believe in building trust before any booking. Meet us for a complimentary coffee
              and home visit — no obligation required!
            </p>

            {/* Checklist — matches wireframe */}
            <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
              {PERKS.map(perk => (
                <li key={perk} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                    <span className="text-primary-600 text-xs">✓</span>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            {/* Meta line — matches wireframe */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400 font-medium mb-7 border-t border-b border-gray-100 py-4">
              <span>100% Free</span>
              <span>·</span>
              <span>No commitment</span>
              <span>·</span>
              <span>Available weekdays & weekends</span>
            </div>

            <button onClick={() => setOpen(true)} className="btn-primary px-8 py-3 text-sm">
              ☕ Book Your Meet & Greet
            </button>
          </div>
        </div>
      </div>

      <MeetModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}
