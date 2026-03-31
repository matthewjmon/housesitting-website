import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Availability', href: '#availability' },
  { label: 'Book Now',     href: '#booking' },
  { label: 'About',        href: '#about' },
  { label: 'Reviews',      href: '#reviews' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <a
          href="#"
          onClick={e => handleNav(e, '#hero')}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm">
            🏠
          </span>
          <span className="font-heading font-bold text-gray-900 text-base leading-tight">
            Gonubie House Sitting
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={e => handleNav(e, link.href)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#booking"
          onClick={e => handleNav(e, '#booking')}
          className="hidden md:inline-flex btn-primary text-sm px-5 py-2.5"
        >
          Book Now
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => handleNav(e, link.href)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#booking"
              onClick={e => handleNav(e, '#booking')}
              className="block w-full text-center btn-primary"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
