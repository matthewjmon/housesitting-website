/**
 * emailTemplates.js
 *
 * Centralised HTML email templates for all notification types.
 * Every booking email includes an attached .ics file so it can be
 * imported directly into Google Calendar with one click.
 */

// ── Colours matching the site ─────────────────────────────────────────────
const GREEN = "#16a34a";
const LIGHT = "#f0fdf4";
const BORDER = "#dcfce7";
const DARK = "#111827";
const MUTED = "#6b7280";

const base = (title, body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BORDER};">

          <!-- Header -->
          <tr>
            <td style="background:${GREEN};padding:24px 32px;">
              <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;">🏠 Gonubie House Sitting</p>
              <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">Gonubie, East London, Eastern Cape</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${LIGHT};padding:18px 32px;border-top:1px solid ${BORDER};">
              <p style="margin:0;font-size:12px;color:${MUTED};text-align:center;">
                This email was sent automatically by the Gonubie House Sitting booking system.<br/>
                Questions? Reply to this email or call us directly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const row = (label, value) =>
  value
    ? `<tr>
        <td style="padding:8px 0;font-size:13px;color:${MUTED};font-weight:600;width:140px;vertical-align:top;">${label}</td>
        <td style="padding:8px 0;font-size:13px;color:${DARK};vertical-align:top;">${String(value).replace(/\n/g, "<br/>")}</td>
       </tr>`
    : "";

const sectionHead = (title) =>
  `<tr><td colspan="2" style="padding:18px 0 6px;font-size:14px;font-weight:700;color:${GREEN};border-bottom:1px solid ${BORDER};">${title}</td></tr>`;

const petRows = (pets) =>
  pets
    .filter((p) => p.type || p.name)
    .map(
      (p, i) => `
    <tr>
      <td colspan="2" style="padding:10px 0 4px;font-size:13px;font-weight:600;color:${DARK};">
        🐾 Pet ${i + 1}${p.name ? ` — ${p.name}` : ""}
      </td>
    </tr>
    ${row("Type", p.type)}
    ${row("Feeding", p.feeding)}
    ${row("Medication", p.medication || "None")}
    ${row("Personality", p.personality)}
    ${row("Notes", p.notes)}
  `,
    )
    .join("");

// ── 1. NEW BOOKING — sent to BOTH owners ─────────────────────────────────
const newBookingOwner = (b) =>
  base(
    `New Booking Request — ${b.guestName}`,
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${DARK};">New Booking Request</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">Submitted ${new Date().toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${sectionHead("👤 Guest Details")}
    ${row("Name", b.guestName)}
    ${row("Email", b.guestEmail)}
    ${row("Phone", b.guestPhone || "—")}

    ${sectionHead("📅 Booking Dates")}
    ${row("Check-in", b.dateFrom)}
    ${row("Check-out", b.dateTo)}
    ${row("Address", b.address)}
    ${row("Instructions", b.specialInstructions || "—")}

    ${b.hasPets && b.pets?.length ? sectionHead("🐾 Pets") + petRows(b.pets) : ""}

    ${sectionHead("🔑 Home Access")}
    ${row("Access instructions", b.accessInstructions || "—")}
    ${row("Keys & remotes", b.keysInventory || "—")}
    ${row("Security company", b.securityCompany || "—")}
    ${row("Security number", b.securityContact || "—")}

    ${sectionHead("🚨 Emergency Contact")}
    ${row("Name", b.emergencyName || "—")}
    ${row("Phone", b.emergencyPhone || "—")}
    ${row("Relationship", b.emergencyRelation || "—")}

    ${sectionHead("🏡 Household Tasks")}
    ${row("Water plants", b.hasPlants ? "Yes" : "No")}
    ${row("Pool care", b.hasPool ? "Yes" : "No")}
    ${row("Bin day", b.rubbishDay || "—")}

    ${sectionHead("⚙️ Preferences")}
    ${row("WiFi access", b.wifi ? `Yes — ${b.wifiPassword || "password TBC"}` : "Not requested")}
    ${row("Daily updates", b.dailyUpdates ? "Yes — send each evening" : "Not requested")}
  </table>

  <div style="margin:28px 0 0;padding:16px;background:${LIGHT};border-radius:10px;border-left:3px solid ${GREEN};">
    <p style="margin:0;font-size:13px;color:${DARK};">
      <strong>Next step:</strong> Reply to the guest at <a href="mailto:${b.guestEmail}" style="color:${GREEN};">${b.guestEmail}</a> to confirm within 24 hours.
    </p>
  </div>
  `,
  );

// ── 2. BOOKING CONFIRMATION — sent to GUEST ───────────────────────────────
const bookingConfirmGuest = (b) =>
  base(
    "Booking Request Received — Gonubie House Sitting",
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${DARK};">Hi ${b.guestName.split(" ")[0]}! 👋</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">We've received your booking request. Here's a summary:</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("Check-in", b.dateFrom)}
    ${row("Check-out", b.dateTo)}
    ${row("Address", b.address)}
    ${row(
      "Pets",
      b.hasPets
        ? b.pets
            .filter((p) => p.name)
            .map((p) => p.name)
            .join(", ") || "Yes"
        : "None",
    )}
  </table>

  <div style="margin:24px 0;padding:18px;background:${LIGHT};border-radius:10px;border-left:3px solid ${GREEN};">
    <p style="margin:0;font-size:14px;color:${DARK};">
      <strong>What happens next?</strong><br/>
      We'll review your details and confirm via <strong>email or WhatsApp within 24 hours</strong>.
      If you have any questions in the meantime, just reply to this email.
    </p>
  </div>

  <p style="font-size:13px;color:${MUTED};">See you soon!<br/><strong style="color:${DARK};">Layla &amp; Matthew</strong><br/>Gonubie House Sitting</p>
  `,
  );

// ── 3. BOOKING CONFIRMED — sent to guest when owners accept ──────────────
const bookingAcceptedGuest = (b) =>
  base(
    "✅ Booking Confirmed — Gonubie House Sitting",
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${GREEN};">Your booking is confirmed! 🎉</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">We're looking forward to taking care of your home.</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("Check-in", b.dateFrom)}
    ${row("Check-out", b.dateTo)}
    ${row("Address", b.address)}
  </table>

  <div style="margin:24px 0;padding:18px;background:${LIGHT};border-radius:10px;border-left:3px solid ${GREEN};">
    <p style="margin:0;font-size:14px;color:${DARK};">
      We'll be in touch before your check-in date to arrange key handover and do a final walkthrough.
      ${b.dailyUpdates ? "We'll also be sending you a daily photo update each evening so you can relax knowing everything is fine." : ""}
    </p>
  </div>

  <p style="font-size:13px;color:${MUTED};">Warm regards,<br/><strong style="color:${DARK};">Layla &amp; Matthew</strong></p>
  `,
  );

// ── 4. BOOKING CANCELLED ─────────────────────────────────────────────────
const bookingCancelledGuest = (b) =>
  base(
    "Booking Cancellation — Gonubie House Sitting",
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${DARK};">Booking Cancelled</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">Hi ${b.guestName.split(" ")[0]}, your booking has been cancelled.</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("Check-in", b.dateFrom)}
    ${row("Check-out", b.dateTo)}
    ${row("Address", b.address)}
  </table>

  <p style="margin:24px 0 0;font-size:13px;color:${MUTED};">
    If you'd like to rebook or have any questions, please reply to this email or contact us directly.
  </p>
  `,
  );

// ── 5. CONTACT FORM ──────────────────────────────────────────────────────
const contactEmail = (f) =>
  base(
    `Website Enquiry — ${f.name}`,
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${DARK};">New Website Enquiry</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">${new Date().toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("From", f.name)}
    ${row("Email", f.email)}
    ${row("Phone", f.phone || "—")}
  </table>

  <div style="margin:20px 0;padding:16px;background:${LIGHT};border-radius:10px;border-left:3px solid ${GREEN};">
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:1px;">Message</p>
    <p style="margin:0;font-size:14px;color:${DARK};white-space:pre-wrap;">${f.message}</p>
  </div>

  <p style="margin:0;font-size:13px;color:${MUTED};">
    Reply directly to <a href="mailto:${f.email}" style="color:${GREEN};">${f.email}</a>
  </p>
  `,
  );

// ── 6. MEET & GREET REQUEST ──────────────────────────────────────────────
const meetGreetEmail = (f) =>
  base(
    `Meet & Greet Request — ${f.name}`,
    `
  <h1 style="margin:0 0 4px;font-size:22px;font-weight:800;color:${DARK};">☕ New Meet &amp; Greet Request</h1>
  <p style="margin:0 0 24px;font-size:14px;color:${MUTED};">${new Date().toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</p>

  <table width="100%" cellpadding="0" cellspacing="0">
    ${row("Name", f.name)}
    ${row("Phone", f.phone)}
    ${row("Email", f.email || "—")}
    ${row("Preferred time", f.preferredTime || "—")}
    ${row("Notes", f.notes || "—")}
  </table>

  <div style="margin:20px 0;padding:16px;background:${LIGHT};border-radius:10px;border-left:3px solid ${GREEN};">
    <p style="margin:0;font-size:13px;color:${DARK};">
      <strong>Next step:</strong> Reach out to ${f.name} at <strong>${f.phone}</strong>${f.email ? ` or <a href="mailto:${f.email}" style="color:${GREEN};">${f.email}</a>` : ""} to arrange a time.
    </p>
  </div>
  `,
  );

// ── iCal (.ics) generator — Google Calendar compatible ───────────────────
/**
 * Generates a VCALENDAR string for a booking.
 * Attach as booking.ics in the email so owners can click to import.
 */
const toICS = (b) => {
  const fmt = (d) =>
    new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = `booking-${Date.now()}@gonubiehousesitting`;
  const now = fmt(new Date());
  const start = fmt(new Date(b.dateFrom));
  const end = fmt(new Date(new Date(b.dateTo).getTime() + 86400000)); // end is exclusive in iCal

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gonubie House Sitting//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${start.slice(0, 8)}`,
    `DTEND;VALUE=DATE:${end.slice(0, 8)}`,
    `SUMMARY:🏠 House Sit — ${b.guestName}`,
    `DESCRIPTION:Guest: ${b.guestName}\\nPhone: ${b.guestPhone || "—"}\\nEmail: ${b.guestEmail}\\nAddress: ${b.address}\\nPets: ${b.hasPets ? "Yes" : "No"}`,
    `LOCATION:${b.address}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

module.exports = {
  newBookingOwner,
  bookingConfirmGuest,
  bookingAcceptedGuest,
  bookingCancelledGuest,
  contactEmail,
  meetGreetEmail,
  toICS,
};
