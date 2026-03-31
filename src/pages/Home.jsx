import { useState } from "react";
import Hero from "../components/Hero";
import AvailabilitySection from "../components/AvailabilitySection";
import BookingModal from "../components/BookingModal";
import AboutSection from "../components/AboutSection";
import ReviewsSection from "../components/ReviewsSection";
import MeetGreetSection from "../components/MeetGreetSection";
import ContactSection from "../components/ContactSection";

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [initialDates, setInitialDates] = useState({});

  const openBooking = (dates = {}) => {
    setInitialDates(dates);
    setBookingOpen(true);
  };

  return (
    <>
      <Hero onBookClick={() => openBooking()} />

      <AvailabilitySection onBookClick={openBooking} />

      {/* Booking anchor target — triggered from nav "Book Now" */}
      <div id="booking" className="-mt-16 pt-16" />

      <AboutSection />

      <ReviewsSection />

      <MeetGreetSection />

      <ContactSection />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        initialDates={initialDates}
      />
    </>
  );
}
