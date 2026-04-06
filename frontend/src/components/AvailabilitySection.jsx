import { useState, useEffect } from 'react'
import axios from 'axios'

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function AvailabilitySection({ onBookClick }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [year,        setYear]        = useState(today.getFullYear())
  const [month,       setMonth]       = useState(today.getMonth())
  const [bookedDates, setBookedDates] = useState([])
  const [selStart,    setSelStart]    = useState(null)
  const [selEnd,      setSelEnd]      = useState(null)
  const [hovered,     setHovered]     = useState(null)
  const [loadingDates, setLoadingDates] = useState(true)

  useEffect(() => {
    axios.get('/api/bookings/dates')
      .then(r => setBookedDates(r.data))
      .catch(() => setBookedDates([]))
      .finally(() => setLoadingDates(false))
  }, [])

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const toDateStr = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelStart(null); setSelEnd(null)
  }

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelStart(null); setSelEnd(null)
  }

  /**
   * FIXED: Consecutive click logic.
   * - No selection → set start
   * - Have start, no end:
   *   - Click earlier or same → reset start
   *   - Click same day after start → single-day booking (start = end)
   *   - Click after start → extend end (allows clicking Mon→Tue→Wed→Thu)
   * - Have both start & end → click extends end if after start, else resets
   */
  const handleDayClick = (dateStr, isPast, isBooked) => {
    if (isPast || isBooked) return

    if (!selStart) {
      // First click — set start
      setSelStart(dateStr)
      setSelEnd(null)
      return
    }

    if (selStart && !selEnd) {
      if (dateStr < selStart) {
        // Clicked before start — reset start to this date
        setSelStart(dateStr)
        setSelEnd(null)
      } else if (dateStr === selStart) {
        // Clicked same as start — single day
        setSelEnd(dateStr)
      } else {
        // Clicked after start — set/extend end
        setSelEnd(dateStr)
      }
      return
    }

    // Both selected — clicking again extends end (if after start) or resets
    if (selStart && selEnd) {
      if (dateStr > selStart) {
        // Extend the end date
        setSelEnd(dateStr)
      } else {
        // Reset from scratch
        setSelStart(dateStr)
        setSelEnd(null)
      }
    }
  }

  const isInRange = (dateStr) => {
    if (!selStart || !selEnd) return false
    return dateStr > selStart && dateStr < selEnd
  }

  const inHoverRange = (dateStr) =>
    selStart && !selEnd && hovered && hovered > selStart &&
    dateStr > selStart && dateStr <= hovered

  const nights = () => {
    if (!selStart || !selEnd || selStart === selEnd) return 0
    return Math.round((new Date(selEnd) - new Date(selStart)) / 86400000)
  }

  const selectionText = () => {
    if (!selStart) return 'Click a start date to begin your selection'
    if (!selEnd)   return `Start: ${selStart} — now click your end date (or keep clicking to extend)`
    const n = nights()
    return `${selStart} → ${selEnd}${n > 0 ? ` · ${n} night${n !== 1 ? 's' : ''}` : ' (same-day)'}`
  }

  return (
    <section id="availability" className="py-20 bg-white" aria-labelledby="availability-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="section-label" aria-hidden="true">Availability</p>
          <h2 id="availability-heading" className="section-title">Check Our Availability</h2>
          <p className="section-sub mx-auto text-center">
            Select your desired dates to request a booking
          </p>
        </div>

        {/* Mint card */}
        <div className="card-mint p-4 sm:p-8 max-w-2xl mx-auto">

          {/* ── Legend — FIXED: wraps cleanly on all screen sizes ── */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <p className="text-sm font-semibold text-gray-700">Available Dates</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 border border-primary-300 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0" aria-hidden="true" />
                Available
              </span>
              <span className="inline-flex items-center gap-1.5 border border-gray-200 bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400 flex-shrink-0" aria-hidden="true" />
                Booked
              </span>
              <span className="inline-flex items-center gap-1.5 border border-primary-200 bg-primary-100 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                <span className="w-2.5 h-2.5 rounded-full bg-primary-600 flex-shrink-0" aria-hidden="true" />
                Selected
              </span>
            </div>
          </div>

          {/* Calendar */}
          <div
            className="bg-white rounded-2xl border border-primary-100 overflow-hidden"
            role="application"
            aria-label="Availability calendar"
          >
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-100">
              <button
                onClick={prevMonth}
                aria-label="Previous month"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-500 transition-all focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none text-lg font-medium"
              >
                ‹
              </button>
              <h3 className="font-heading font-bold text-gray-900 text-base" aria-live="polite">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                aria-label="Next month"
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-500 transition-all focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none text-lg font-medium"
              >
                ›
              </button>
            </div>

            {/* Day-of-week labels */}
            <div className="grid grid-cols-7 border-b border-gray-100" role="row">
              {DAYS.map(d => (
                <div
                  key={d}
                  role="columnheader"
                  aria-label={d}
                  className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 p-2 gap-0.5" role="grid">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} role="gridcell" aria-hidden="true" />
              ))}

              {loadingDates
                ? Array.from({ length: daysInMonth }).map((_, i) => (
                    <div key={i} className="h-9 rounded-lg bg-gray-100 animate-pulse" />
                  ))
                : Array.from({ length: daysInMonth }).map((_, i) => {
                    const day     = i + 1
                    const str     = toDateStr(year, month, day)
                    const dateObj = new Date(year, month, day)
                    const isPast  = dateObj < today
                    const isBook  = bookedDates.includes(str)
                    const isToday = dateObj.getTime() === today.getTime()
                    const isStart = selStart === str
                    const isEnd   = selEnd   === str
                    const range   = isInRange(str)
                    const hRange  = inHoverRange(str)

                    let cls = 'relative flex items-center justify-center h-9 w-full rounded-lg text-sm select-none transition-all duration-100 '

                    if (isPast) {
                      cls += 'text-gray-300 cursor-not-allowed'
                    } else if (isBook) {
                      cls += 'bg-red-50 text-red-400 cursor-not-allowed line-through'
                    } else if (isStart || isEnd) {
                      cls += 'bg-primary-600 text-white font-bold shadow-sm cursor-pointer'
                    } else if (range || hRange) {
                      cls += 'bg-primary-100 text-primary-800 cursor-pointer'
                    } else if (isToday) {
                      cls += 'text-primary-700 font-bold border-2 border-primary-400 hover:bg-primary-50 cursor-pointer'
                    } else {
                      cls += 'text-gray-700 hover:bg-primary-50 hover:text-primary-700 cursor-pointer'
                    }

                    return (
                      <div
                        key={str}
                        role="gridcell"
                        tabIndex={isPast || isBook ? -1 : 0}
                        aria-label={`${MONTHS[month]} ${day}${isBook ? ' — booked' : isPast ? ' — past' : isStart ? ' — start date' : isEnd ? ' — end date' : ''}`}
                        aria-selected={isStart || isEnd || range ? true : undefined}
                        aria-disabled={isPast || isBook}
                        className={cls}
                        onClick={() => handleDayClick(str, isPast, isBook)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDayClick(str, isPast, isBook) } }}
                        onMouseEnter={() => !isPast && !isBook && setHovered(str)}
                        onMouseLeave={() => setHovered(null)}
                      >
                        {day}
                        {isToday && !isStart && !isEnd && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" aria-hidden="true" />
                        )}
                      </div>
                    )
                  })}
            </div>

            {/* Selection status */}
            <div
              className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-500"
              aria-live="polite"
              aria-atomic="true"
            >
              {selectionText()}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={() => onBookClick({ dateFrom: selStart, dateTo: selEnd })}
              className="btn-primary px-8 py-3 text-sm"
            >
              Request a Booking
            </button>
            <p className="text-xs text-gray-400 mt-2">
              We'll confirm your booking within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
