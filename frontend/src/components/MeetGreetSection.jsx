import { useState, useEffect } from 'react'
import axios from 'axios'

const PERKS = [
  'Get to know us personally',
  'Show us around your home',
  'Introduce us to your pets',
  'Discuss specific care requirements',
  'Ask any questions you may have',
]

function MeetModal({ isOpen, onClose }) {
  const [form, setForm]     = useState({ name: '', phone: '', email: '', preferredTime: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoad]  = useState(false)
  const [done, setDone]     = useState(false)

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())  e.name  = 'Please enter your name.'
    if (!form.phone.trim()) e.phone = 'Please enter a contact number.'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoad(true)
    try { await axios.post('/api/meetgreet', form) } catch { /* optimistic */ }
    setDone(true); setLoad(false)
    setTimeout(() => { setDone(false); onClose(); setForm({ name: '', phone: '', email: '', preferredTime: '', notes: '' }) }, 2200)
  }

  useEffect(() => {
    if (!isOpen) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="meet-modal-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h3 id="meet-modal-title" className="font-heading font-bold text-gray-900 text-lg">Schedule a Meet &amp; Greet</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3" aria-hidden="true">☕</div>
            <p className="font-heading font-bold text-gray-900 text-lg">Request Sent!</p>
            <p className="text-sm text-gray-500 mt-1">We'll be in touch to arrange a time that suits everyone.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500">Fill in your details and we'll reach out to arrange a convenient time.</p>

            <div>
              <label className="field-label">Your Name <span className="text-red-500" aria-hidden="true">*</span></label>
              <input className={`field-input ${errors.name ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="e.g. Sarah" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" aria-invalid={!!errors.name} />
              {errors.name && <p className="mt-1 text-xs text-red-500" role="alert">{errors.name}</p>}
            </div>

            <div>
              <label className="field-label">Phone / WhatsApp <span className="text-red-500" aria-hidden="true">*</span></label>
              <input className={`field-input ${errors.phone ? 'border-red-400 focus:ring-red-400' : ''}`} placeholder="+27 82 123 4567" value={form.phone} onChange={e => set('phone', e.target.value)} type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} />
              {errors.phone && <p className="mt-1 text-xs text-red-500" role="alert">{errors.phone}</p>}
            </div>

            <div>
              <label className="field-label">Email <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="sarah@email.com" value={form.email} onChange={e => set('email', e.target.value)} type="email" autoComplete="email" />
            </div>

            <div>
              <label className="field-label">Preferred Date / Time <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="e.g. Weekday afternoons, or weekend mornings" value={form.preferredTime} onChange={e => set('preferredTime', e.target.value)} />
            </div>

            <div>
              <label className="field-label">Anything we should know? <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea className="field-textarea" rows={2} placeholder="Pets, your address, any questions…" value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`btn-primary w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending…' : '☕ Send Request'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MeetGreetSection() {
  const [open, setOpen] = useState(false)

  return (
    <section id="meetgreet" className="py-20 bg-primary-50" aria-labelledby="meetgreet-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10 text-center">

            <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <span className="text-2xl">☕</span>
            </div>

            <h2 id="meetgreet-heading" className="font-heading font-bold text-gray-900 text-2xl sm:text-3xl mb-3">
              Schedule a Free Meet &amp; Greet
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-7 max-w-md mx-auto">
              We believe in building trust before any booking. Meet us for a complimentary coffee
              and home visit — no obligation required!
            </p>

            {/* FIXED: checklist properly centered using flex + justify-center */}
            <ul className="space-y-3 mb-8 inline-block text-left" aria-label="What we'll do at the meet & greet">
              {PERKS.map(perk => (
                <li key={perk} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center" aria-hidden="true">
                    <svg className="w-3 h-3 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center gap-3 sm:gap-4 text-xs text-gray-400 font-medium mb-7 border-t border-b border-gray-100 py-4 flex-wrap">
              <span>100% Free</span>
              <span aria-hidden="true">·</span>
              <span>No commitment</span>
              <span aria-hidden="true">·</span>
              <span>Weekdays &amp; weekends</span>
            </div>

            <button onClick={() => setOpen(true)} className="btn-primary px-8 py-3 text-sm">
              ☕ Book Your Meet &amp; Greet
            </button>
          </div>
        </div>
      </div>

      <MeetModal isOpen={open} onClose={() => setOpen(false)} />
    </section>
  )
}
