export default function Hero({ onBookClick }) {
  const handleScroll = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background: image + warm gradient + dark overlay */}
      <div className="absolute inset-0 z-0">
        {/* Image */}
        <img
          src="images/keys-in-house.jpg"
          alt="Cozy home interior"
          className="w-full h-full object-cover"
        />

        {/* Warm gradient overlay (keeps cozy tone) */}
        <div
          className="absolute inset-0"
          style={{
            background: `
        linear-gradient(
          135deg,
          rgba(30,20,10,0.65) 0%,
          rgba(60,40,15,0.55) 40%,
          rgba(180,120,40,0.35) 100%
        )
      `,
          }}
        />

        {/* Dark overlay for contrast (text readability) */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-8 max-w-3xl mx-auto">
        {/* Location badge */}
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-8">
          <span className="text-white/80 text-sm">🏠</span>
          <span className="text-white text-sm font-medium">
            Gonubie, East London
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
          Trusted House Sitting in{" "}
          <span className="text-primary-400">Gonubie</span>
        </h1>

        {/* Subheading */}
        <p className="text-white/80 text-base sm:text-lg font-light max-w-lg mx-auto mb-10 leading-relaxed">
          Friendly student couple offering reliable overnight house sitting.
          Your home and pets are safe with us.
        </p>

        {/* CTA buttons — matching wireframe exactly */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleScroll("#availability")}
            className="btn-primary px-7 py-3.5 text-base shadow-lg shadow-primary-900/30"
          >
            Check Availability
          </button>
          <button
            onClick={onBookClick}
            className="inline-flex items-center justify-center gap-2
                       border-2 border-white/70 text-white hover:bg-white hover:text-gray-900
                       font-semibold rounded-full px-7 py-3.5 text-base
                       transition-all duration-200 backdrop-blur-sm"
          >
            Book Now
          </button>
        </div>

        {/* Trust pills below CTAs */}
        <div className="flex items-center justify-center gap-3 flex-wrap mt-10">
          {[
            { icon: "🐾", label: "Pet Friendly" },
            { icon: "📅", label: "Available All Week" },
            { icon: "🎓", label: "Student Couple" },
            { icon: "📍", label: "Gonubie Local" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm
                         border border-white/20 rounded-full px-3.5 py-1.5
                         text-white/90 text-xs font-medium"
            >
              {icon} {label}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <svg
          className="w-6 h-6 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
