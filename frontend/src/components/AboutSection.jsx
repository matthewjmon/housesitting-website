// ── Replace photo: null with your Cloudinary URL when ready ─────────────────
// e.g. photo: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/your-photo.jpg'
const SITTERS = [
  {
    name:  'Your Name',
    role:  'BSc IT Student · English Tutor on Preply',
    bio:   "I'm a tech student completing my BSc IT degree and a HyperionDev full-stack bootcamp. I teach English online, which means I'm home and available throughout the week. I love animals, the beach, and taking responsibility seriously.",
    tags:  ['Animal Lover', 'Beach Walks', 'Tech & Coding'],
    photo: null,
    emoji: '🧑‍💻',
    color: 'from-blue-100 to-primary-100',
  },
  {
    name:  'Layla',
    role:  'Online Student · Gonubie Local',
    bio:   "Born and raised in Gonubie, I have a genuine love for animals and homey spaces. My dad has served this community for years as a pharmacist, and I carry that same spirit of care and trustworthiness into everything I do.",
    tags:  ['Local to Gonubie', 'Pet Lover', 'Reading'],
    photo: null,
    emoji: '👩‍🎓',
    color: 'from-pink-100 to-primary-100',
  },
]

const TRUST = [
  { icon: '❤️', label: 'Trustworthy & Reliable', sub: 'Your home and pets are our top priority'    },
  { icon: '🐾', label: 'Pet Lovers',               sub: 'Experienced with all types of animals'     },
  { icon: '📍', label: 'Local to Gonubie',          sub: 'Familiar with the area and community'      },
]

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white" aria-labelledby="about-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <p className="section-label" aria-hidden="true">About Us</p>
          <h2 id="about-heading" className="section-title">Meet Your House Sitters</h2>
          <p className="section-sub mx-auto text-center">
            We're a responsible student couple based in Gonubie, passionate about providing
            trustworthy house and pet sitting services.
          </p>
        </div>

        {/* Profile cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-14">
          {SITTERS.map(({ name, role, bio, tags, photo, emoji, color }) => (
            <div key={name} className="card overflow-hidden hover:shadow-card-hover transition-shadow duration-300">

              {/* Photo / placeholder */}
              <div className={`bg-gradient-to-br ${color} h-56 flex items-center justify-center relative overflow-hidden`}>
                {photo ? (
                  <img src={photo} alt={`${name} profile photo`} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="text-center px-4">
                    <div className="text-6xl mb-2" aria-hidden="true">{emoji}</div>
                    <p className="text-xs text-gray-400 bg-white/60 rounded-full px-3 py-1">
                      Photo coming soon
                    </p>
                  </div>
                )}
              </div>

              {/* Info — FIXED: centered on mobile */}
              <div className="p-6 text-center sm:text-left">
                {/* Name + role */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-primary-600 text-sm">🎓</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-heading font-bold text-gray-900 text-xl">{name}</h3>
                    <p className="text-primary-600 text-sm font-medium">{role}</p>
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4">{bio}</p>

                {/* Tags — FIXED: centered on mobile */}
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {tags.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" aria-label="Why trust us">
          {TRUST.map(({ icon, label, sub }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
                <span className="text-xl">{icon}</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
