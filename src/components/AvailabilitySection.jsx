import { useState, useEffect } from "react";
import axios from "axios";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Booked dates — will be fetched from API in production
const DEMO_BOOKED = [
  "2026-04-05",
  "2026-04-06",
  "2026-04-07",
  "2026-04-18",
  "2026-04-19",
  "2026-05-02",
  "2026-05-03",
  "2026-05-04",
  "2026-05-05",
];

export default function AvailabilitySection({ onBookClick }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [bookedDates, setBooked] = useState(DEMO_BOOKED);
  const [selStart, setSelStart] = useState(null);
  const [selEnd, setSelEnd] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Fetch real booked dates from backend
  useEffect(() => {
    axios
      .get("/api/bookings/dates")
      .then((r) => setBooked(r.data))
      .catch(() => {
        /* use demo dates */
      });
  }, []);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const toDateStr = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelStart(null);
    setSelEnd(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelStart(null);
    setSelEnd(null);
  };

  const handleDayClick = (dateStr, isPast, isBooked) => {
    if (isPast || isBooked) return;
    if (!selStart || (selStart && selEnd)) {
      setSelStart(dateStr);
      setSelEnd(null);
    } else {
      if (dateStr <= selStart) {
        setSelStart(dateStr);
        setSelEnd(null);
      } else setSelEnd(dateStr);
    }
  };

  const isInRange = (dateStr) => {
    if (!selStart || !selEnd) return false;
    return dateStr > selStart && dateStr < selEnd;
  };

  const selectionText = () => {
    if (!selStart) return "Click a date to start your selection";
    if (!selEnd) return `Start: ${selStart} — click an end date`;
    return `Selected: ${selStart} → ${selEnd}`;
  };

  const handleBookSelected = () => {
    onBookClick({ dateFrom: selStart, dateTo: selEnd });
  };

  return (
    <section id="availability" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="section-label">Availability</p>
          <h2 className="section-title">Check Our Availability</h2>
          <p className="section-sub mx-auto text-center">
            Select your desired dates to request a booking
          </p>
        </div>

        {/* Mint card — matches wireframe */}
        <div className="card-mint p-6 sm:p-8 max-w-2xl mx-auto">
          {/* Legend pills — exact wireframe match */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <p className="text-sm font-semibold text-gray-700 mr-1">
              Available Dates
            </p>
            <span className="inline-flex items-center gap-1.5 border border-primary-300 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-lg">
              <span className="w-3.5 h-3.5 rounded border border-primary-400 flex items-center justify-center text-primary-600">
                <svg
                  className="w-2.5 h-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Available
            </span>
            <span className="inline-flex items-center gap-1.5 border border-gray-200 bg-gray-50 text-gray-500 text-xs font-medium px-3 py-1.5 rounded-lg">
              <span className="w-3.5 h-3.5 rounded border border-gray-300 flex items-center justify-center">
                <svg
                  className="w-2.5 h-2.5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </span>
              Booked
            </span>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-primary-100 overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-500 transition-all"
              >
                ‹
              </button>
              <h3 className="font-heading font-bold text-gray-900 text-base">
                {MONTHS[month]} {year}
              </h3>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:border-primary-400 hover:text-primary-600 text-gray-500 transition-all"
              >
                ›
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 p-2 gap-0.5">
              {/* Empty cells for first day offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = toDateStr(year, month, day);
                const dateObj = new Date(year, month, day);
                const isPast = dateObj < today;
                const isBooked = bookedDates.includes(dateStr);
                const isToday = dateObj.getTime() === today.getTime();
                const isStart = selStart === dateStr;
                const isEnd = selEnd === dateStr;
                const inRange = isInRange(dateStr);
                const isHovered = hovered === dateStr;
                const inHoverRange =
                  selStart &&
                  !selEnd &&
                  hovered &&
                  dateStr > selStart &&
                  dateStr <= hovered;

                let cellClass =
                  "relative flex items-center justify-center h-9 w-full rounded-lg text-sm cursor-pointer select-none transition-all duration-100 ";

                if (isPast) {
                  cellClass += "text-gray-300 cursor-default";
                } else if (isBooked) {
                  cellClass +=
                    "bg-gray-100 text-gray-400 cursor-not-allowed line-through";
                } else if (isStart || isEnd) {
                  cellClass +=
                    "bg-primary-600 text-white font-semibold shadow-sm";
                } else if (inRange || inHoverRange) {
                  cellClass += "bg-primary-100 text-primary-800";
                } else if (isToday) {
                  cellClass +=
                    "text-primary-700 font-bold border border-primary-300 hover:bg-primary-50";
                } else {
                  cellClass +=
                    "text-gray-700 hover:bg-primary-50 hover:text-primary-700";
                }

                return (
                  <div
                    key={dateStr}
                    className={cellClass}
                    onClick={() => handleDayClick(dateStr, isPast, isBooked)}
                    onMouseEnter={() =>
                      !isPast && !isBooked && setHovered(dateStr)
                    }
                    onMouseLeave={() => setHovered(null)}
                  >
                    {day}
                    {isToday && !isStart && !isEnd && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selection text */}
            <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-500">
              {selectionText()}
            </div>
          </div>

          {/* Request Booking CTA */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBookSelected}
              className="btn-primary px-8 py-3 text-sm"
            >
              Request Booking
            </button>
            <p className="text-xs text-gray-400 mt-2">
              We'll confirm your booking within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
