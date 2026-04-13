import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Availability", href: "#availability" },
  { label: "Book Now", href: "#availability" }, // scrolls to availability, not about
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Meet Us", href: "#meetgreet" }, // NEW
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Set initial state in case page is already scrolled (e.g. refresh mid-page)
    setScrolled(window.scrollY > 40);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => scrollTo(e, "#hero")}
          className="flex items-center gap-2 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
          aria-label="Gonubie House Sitting — back to top"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-600 text-white text-sm flex-shrink-0">
            🏠
          </span>
          <span
            className={`font-heading font-bold text-sm sm:text-base leading-tight transition-colors duration-300 ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Gonubie House Sitting
          </span>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden xl:flex items-center gap-4 2xl:gap-6 flex-nowrap">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`whitespace-nowrap text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded ${
                  scrolled
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/85 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#availability"
          onClick={(e) => scrollTo(e, "#availability")}
          className="hidden xl:inline-flex btn-primary whitespace-nowrap text-sm px-5 py-2.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        >
          Book Now
        </a>

        {/* Mobile hamburger */}
        <button
          className={`xl:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
            scrolled
              ? "text-gray-600 hover:bg-gray-100"
              : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="xl:hidden bg-white border-t border-gray-100 px-4 py-3 shadow-lg"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className="block px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 pb-1">
            <a
              href="#availability"
              onClick={(e) => scrollTo(e, "#availability")}
              className="block w-full text-center btn-primary"
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
