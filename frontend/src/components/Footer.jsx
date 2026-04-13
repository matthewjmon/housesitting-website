const QUICK_LINKS = [
  { label: 'Availability', href: '#availability' },
  { label: 'Book Now',     href: '#availability' },
  { label: 'About Us',     href: '#about'        },
  { label: 'Reviews',      href: '#reviews'      },
  { label: 'Meet Us',      href: '#meetgreet'    },
  { label: 'Contact',      href: '#contact'      },
]

export default function Footer() {
  const scrollTo = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 3-column grid */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm flex-shrink-0" aria-hidden="true">
                🏠
              </span>
              <span className="font-heading font-bold text-white text-base">
                Gonubie House Sitting
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trusted, reliable house and pet sitting in Gonubie,
              East London. Available all week.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={e => scrollTo(e, href)}
                    className="text-gray-400 hover:text-white text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <address className="not-italic space-y-3">
              <p className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true">📍</span>
                Gonubie, East London, Eastern Cape
              </p>
              <p className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true">📞</span>
                +27 XXX XXX XXXX
              </p>
              <p className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5 flex-shrink-0" aria-hidden="true">✉️</span>
                housesit@gonubie.co.za
              </p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} Gonubie House Sitting. All rights reserved.</span>
          <span>Built with ❤️ in Gonubie, East London</span>
        </div>
      </div>
    </footer>
  )
}
