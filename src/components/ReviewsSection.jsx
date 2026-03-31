import { useState, useEffect } from 'react'
import axios from 'axios'

const DEMO_REVIEWS = [
  {
    _id: '1', stars: 5, name: 'Linda Van Der Merwe', location: 'Gonubie Beach',
    text: 'Sarah and Michael were amazing! They took excellent care of our two dogs and sent us daily photos. We came home to a spotless house and happy pets. Highly recommend!',
    createdAt: '2026-02-15',
  },
  {
    _id: '2', stars: 5, name: 'John Stevens', location: 'Gonubie Heights',
    text: 'Very professional and caring. They watered our garden, brought in the mail, and even took our cat to the vet when she wasn\'t feeling well. Absolute lifesavers!',
    createdAt: '2026-01-20',
  },
  {
    _id: '3', stars: 5, name: 'Thandiwe Nkosi', location: 'Gonubie',
    text: 'We felt completely at ease leaving our home with them. They\'re responsible, trustworthy, and great with animals. Will definitely book again!',
    createdAt: '2025-12-10',
  },
  {
    _id: '4', stars: 5, name: 'Robert & Jane Smith', location: 'East London',
    text: 'Our house has never been in better hands. They went above and beyond — even took care of an unexpected delivery. Wonderful young couple!',
    createdAt: '2025-11-08',
  },
]

function StarDisplay({ count, size = 'sm' }) {
  const sz = size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`${sz} ${i <= count ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
      ))}
    </div>
  )
}

function formatDate(str) {
  const d = new Date(str)
  return d.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
}

function ReviewModal({ isOpen, onClose, onSubmit }) {
  const [stars, setStars]       = useState(5)
  const [hovered, setHovered]   = useState(0)
  const [name, setName]         = useState('')
  const [location, setLocation] = useState('')
  const [text, setText]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [done, setDone]         = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      await axios.post('/api/reviews', { stars, name: name || 'Anonymous', location: location || 'Gonubie', text })
    } catch {/* demo mode */}
    onSubmit({ stars, name: name || 'Anonymous', location: location || 'Gonubie', text, createdAt: new Date().toISOString() })
    setDone(true)
    setLoading(false)
    setTimeout(() => { setDone(false); onClose() }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-heading font-bold text-gray-900 text-lg">Leave a Review</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg">×</button>
        </div>

        {done ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="font-heading font-bold text-gray-900">Thank you!</p>
            <p className="text-sm text-gray-500 mt-1">Your review has been submitted for approval.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="field-label">Your Rating</label>
              <div className="flex gap-1 mt-1">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button"
                    onClick={() => setStars(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(0)}
                    className={`text-2xl transition-all ${i <= (hovered || stars) ? 'text-amber-400' : 'text-gray-200'}`}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="field-label">Your Name <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="e.g. Jane" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Suburb <span className="text-gray-400 font-normal">(optional)</span></label>
              <input className="field-input" placeholder="e.g. Gonubie" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Your Review *</label>
              <textarea className="field-textarea" rows={4}
                placeholder="Tell others about your experience…"
                value={text} onChange={e => setText(e.target.value)} />
            </div>
            <button onClick={handleSubmit} disabled={!text.trim() || loading} className="btn-primary w-full py-3">
              {loading ? 'Submitting…' : 'Submit Review →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReviewsSection() {
  const [reviews, setReviews]       = useState(DEMO_REVIEWS)
  const [modalOpen, setModalOpen]   = useState(false)

  useEffect(() => {
    axios.get('/api/reviews')
      .then(r => { if (r.data.length) setReviews(r.data) })
      .catch(() => {})
  }, [])

  const handleNewReview = (review) => {
    setReviews(prev => [{ ...review, _id: Date.now().toString() }, ...prev])
  }

  const avg  = (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
  const total = reviews.length

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-sub mx-auto text-center">
            Trusted by families across Gonubie and East London
          </p>
        </div>

        {/* 2×2 review grid — matches wireframe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {reviews.slice(0, 4).map(r => (
            <div key={r._id} className="card p-6 hover:shadow-card-hover transition-shadow duration-300">
              <StarDisplay count={r.stars} />
              <p className="text-gray-600 text-sm leading-relaxed mt-3 mb-4 italic">
                "{r.text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.location}</p>
                </div>
                <p className="text-gray-300 text-xs">{formatDate(r.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Average rating banner — matches wireframe exactly */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl py-6 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl text-amber-400">★</span>
            <div>
              <span className="font-heading font-bold text-gray-900 text-3xl">{avg}</span>
              <p className="text-gray-500 text-sm">Average rating from {total}+ satisfied clients</p>
            </div>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-outline text-sm">
            Leave a Review
          </button>
        </div>

      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewReview}
      />
    </section>
  )
}
