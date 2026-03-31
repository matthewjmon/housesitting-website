const QUICK_LINKS = [
  { label: 'Availability', href: '#availability' },
  { label: 'Book Now',     href: '#booking'      },
  { label: 'About Us',     href: '#about'        },
  { label: 'Reviews',      href: '#reviews'      },
  { label: 'Contact',      href: '#contact'      },
]

export default function Footer() {
  const handleNav = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main footer grid — 3 columns as per wireframe */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm">
                🏠
              </span>
              <span className="font-heading font-bold text-white text-base">
                Gonubie House Sitting
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Trusted, reliable house and pet sitting services in Gonubie,
              East London. Available all week.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={e => handleNav(e, href)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm mb-4 uppercase tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5">📍</span>
                Gonubie, East London
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5">📞</span>
                +27 XXX XXX XXXX
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <span className="text-primary-500 mt-0.5">✉️</span>
                housesit@gonubie.co.za
              </li>
            </ul>
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
