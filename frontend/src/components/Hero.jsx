export default function Hero({ onBookClick }) {
  const scrollToAvailability = () => {
    document.querySelector('#availability')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/*
          REAL PHOTO SETUP:
          1. Place your photo at public/images/hero-home.jpg
          2. Remove the gradient div below and uncomment the img + overlay divs

          <img
            src="/images/hero-home.jpg"
            alt=""
            className="w-full h-full object-cover"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/50" />
        */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(30,20,10,0.75) 0%, rgba(60,40,15,0.68) 40%, rgba(180,120,40,0.48) 100%),
              linear-gradient(to right, #1a0f05 0%, #3d2208 25%, #7a4a12 55%, #c17d2a 80%, #e8b96a 100%)
            `,
          }}
        />
      </div>

      {/* ── Content — centred vertically with padding to account for fixed nav ── */}
      <div className="relative z-10 w-full text-center px-4 sm:px-8 pt-20 pb-24 flex flex-col items-center justify-center flex-1">

        {/* Location badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-7">
          <span className="text-white/80 text-sm" aria-hidden="true">🏠</span>
          <span className="text-white text-sm font-medium">Gonubie, East London</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl">
          Trusted House Sitting in{' '}
          <span className="text-primary-400">Gonubie</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/80 text-base sm:text-lg font-light max-w-lg mb-10 leading-relaxed">
          Friendly student couple offering reliable overnight house sitting.
          Your home and pets are safe with us.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
          <button
            onClick={scrollToAvailability}
            className="btn-primary px-7 py-3.5 text-base shadow-lg shadow-primary-900/30"
          >
            Check Availability
          </button>
          <button
            onClick={onBookClick}
            className="inline-flex items-center justify-center gap-2
                       border-2 border-white/70 text-white hover:bg-white hover:text-gray-900
                       font-semibold rounded-full px-7 py-3.5 text-base
                       transition-all duration-200 backdrop-blur-sm
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Book Now
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {[
            { icon: '🐾', label: 'Pet Friendly' },
            { icon: '📅', label: 'Available All Week' },
            { icon: '🎓', label: 'Student Couple' },
            { icon: '📍', label: 'Gonubie Local' },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm
                         border border-white/20 rounded-full px-3 py-1.5
                         text-white/90 text-xs font-medium"
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator — perfectly centred, BELOW badges, functional ── */}
      <button
        onClick={scrollToAvailability}
        aria-label="Scroll to availability calendar"
        className="relative z-10 mb-8 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded"
      >
        <span className="text-xs font-medium tracking-wider uppercase">Scroll</span>
        <svg
          className="w-5 h-5 animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  )
}
