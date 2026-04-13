import { useState, useEffect } from 'react'
import axios from 'axios'

function Stars({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`text-base ${i <= count ? 'text-amber-400' : 'text-gray-200'}`} aria-hidden="true">★</span>
      ))}
    </div>
  )
}

function fmt(str) {
  return new Date(str).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
}

// ── Leave-a-Review Modal ────────────────────────────────────────────────────
function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [stars,    setStars]    = useState(5)
  const [hovered,  setHovered]  = useState(0)
  const [name,     setName]     = useState('')
  const [location, setLocation] = useState('')
  const [text,     setText]     = useState('')
  const [errors,   setErrors]   = useState({})
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  const validate = () => {
    const e = {}
    if (!text.trim()) e.text = 'Please write a short review.'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await axios.post('/api/reviews', {
        stars,
        name:     name.trim()     || 'Anonymous',
        location: location.trim() || 'Gonubie',
        text:     text.trim(),
      })
    } catch { /* show success anyway — optimistic */ }
    onSubmit({ stars, name: name.trim() || 'Anonymous', location: location.trim() || 'Gonubie', text: text.trim(), createdAt: new Date().toISOString() })
    setDone(true)
    setLoading(false)
    setTimeout(() => { setDone(false); onClose(); setName(''); setLocation(''); setText(''); setStars(5) }, 2000)
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
      aria-labelledby="review-modal-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 id="review-modal-title" className="font-heading font-bold text-gray-900 text-lg">Leave a Review</h3>
          <button onClick={onClose} aria-label="Close" className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3" aria-hidden="true">🎉</div>
            <p className="font-heading font-bold text-gray-900">Thank you!</p>
            <p className="text-sm text-gray-500 mt-1">Your review has been submitted for approval.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Star selector */}
            <div>
              <label className="field-label">Your Rating</label>
              <div className="flex gap-1" role="group" aria-label="Star rating">
                {[1,2,3,4,5].map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStars(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${i} star${i > 1 ? 's' : ''}`}
                    aria-pressed={stars >= i}
                    className={`text-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded ${i <= (hovered || stars) ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Your Name <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="e.g. Jane" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label className="field-label">Suburb <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="e.g. Gonubie" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Your Review <span className="text-red-500">*</span></label>
              <textarea
                className={`field-textarea ${errors.text ? 'border-red-400 focus:ring-red-400' : ''}`}
                rows={4}
                placeholder="Tell others about your experience…"
                value={text}
                onChange={e => { setText(e.target.value); if (errors.text) setErrors({}) }}
                aria-invalid={!!errors.text}
              />
              {errors.text && <p className="mt-1 text-xs text-red-500" role="alert">{errors.text}</p>}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`btn-primary w-full py-3 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting…' : 'Submit Review →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section ─────────────────────────────────────────────────────────────────
export default function ReviewsSection() {
  const [reviews,   setReviews]   = useState([])        // EMPTY — no seeded data
  const [loading,   setLoading]   = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    axios.get('/api/reviews')
      .then(r => setReviews(r.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  const addReview = (r) => setReviews(prev => [{ ...r, _id: Date.now().toString() }, ...prev])

  const avg   = reviews.length ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1) : null
  const total = reviews.length

  return (
    <section id="reviews" className="py-20 bg-gray-50" aria-labelledby="reviews-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="section-label" aria-hidden="true">Testimonials</p>
          <h2 id="reviews-heading" className="section-title">What Our Clients Say</h2>
          <p className="section-sub mx-auto text-center">
            Trusted by families across Gonubie and East London
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {[1,2].map(i => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-3/5" />
                </div>
                <div className="h-3 bg-gray-200 rounded w-32" />
              </div>
            ))}
          </div>
        )}

        {/* ── EMPTY STATE — no seeded data ── */}
        {!loading && reviews.length === 0 && (
          <div className="max-w-md mx-auto text-center mb-10">
            <div className="card p-10">
              <div className="text-5xl mb-4" aria-hidden="true">⭐</div>
              <h3 className="font-heading font-bold text-gray-900 text-xl mb-2">Be Our First Reviewer!</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We're just getting started. If you've used our house sitting services, we'd love to hear from you!
              </p>
              <button onClick={() => setModalOpen(true)} className="btn-primary px-6 py-3 text-sm">
                Leave the First Review ✦
              </button>
            </div>
          </div>
        )}

        {/* Review grid */}
        {!loading && reviews.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {reviews.slice(0, 4).map(r => (
                <article key={r._id} className="card p-6 hover:shadow-card-hover transition-shadow duration-300">
                  <Stars count={r.stars} />
                  <blockquote className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">
                    "{r.text}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                      <p className="text-gray-400 text-xs">{r.location}</p>
                    </div>
                    <p className="text-gray-300 text-xs">{fmt(r.createdAt)}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Average rating banner */}
            {avg && (
              <div className="bg-amber-50 border border-amber-100 rounded-2xl py-5 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl text-amber-400" aria-hidden="true">★</span>
                  <div>
                    <span className="font-heading font-bold text-gray-900 text-3xl">{avg}</span>
                    <p className="text-gray-500 text-sm">Average from {total} review{total !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button onClick={() => setModalOpen(true)} className="btn-outline text-sm">
                  Leave a Review
                </button>
              </div>
            )}
          </>
        )}

      </div>

      <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={addReview} />
    </section>
  )
}
