# 🏠 Gonubie House Sitting — Full-Stack Website

**A production-ready house sitting business website for a student couple in Gonubie, East London, Eastern Cape, South Africa.**

Built with React (Vite) + Tailwind CSS on the frontend and Node.js / Express / MongoDB on the backend. Designed to be hosted entirely for free (Vercel + Render + MongoDB Atlas). Optimised for mobile-first use — the site URL is turned into a QR code on a physical flyer, so most visitors arrive on mobile devices.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Design System](#4-design-system)
5. [Frontend — Feature Breakdown](#5-frontend--feature-breakdown)
6. [Backend — API Reference](#6-backend--api-reference)
7. [Email System](#7-email-system)
8. [Environment Variables](#8-environment-variables)
9. [Running Locally](#9-running-locally)
10. [Deployment Guide](#10-deployment-guide)
11. [Before Going Live — Checklist](#11-before-going-live--checklist)
12. [Adding Your Photos](#12-adding-your-photos)
13. [Known Limitations & Future Work](#13-known-limitations--future-work)

---

## 1. Project Overview

| Feature | Detail |
|---|---|
| Business name | Gonubie House Sitting |
| Owners | [Your Name] & Layla |
| Location | Gonubie, East London, Eastern Cape, South Africa |
| Target users | Local homeowners (mostly mobile) scanning a QR code flyer |
| Purpose | Booking enquiries, trust-building, business presence |
| Budget | R0 — all services used are on free tiers |

---

## 2. Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 + Vite | Fast dev, tree-shaking, free Vercel hosting |
| Styling | Tailwind CSS 3 | Utility-first, responsive, no runtime cost |
| HTTP client | Axios | Clean API, interceptors, wide browser support |
| Routing | React Router v6 | SPA routing |
| Backend | Node.js + Express | MERN-aligned, lightweight, free Render hosting |
| Database | MongoDB Atlas (free tier) | Flexible schema, generous free tier (512 MB) |
| Email | Nodemailer + Gmail SMTP | Free, no third-party cost, full HTML support |
| Hosting (FE) | Vercel | Free, auto-deploys from GitHub, custom domain |
| Hosting (BE) | Render | Free web service, spins down after 15 min inactivity |
| Assets | Cloudinary (free tier) | Photo hosting with URL-based transformations |
| Fonts | Google Fonts (Syne + DM Sans) | Free, self-serve, loaded in `index.html` |

---

## 3. Repository Structure

```
housesitting-website/
├── frontend/                        ← React app (deployed to Vercel)
│   ├── index.html                   ← Entry HTML, font links, meta tags
│   ├── package.json
│   ├── vite.config.js               ← Dev proxy: /api → localhost:5000
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx                 ← React entry point
│       ├── App.jsx                  ← Router + layout
│       ├── index.css                ← Tailwind directives + custom components
│       ├── components/
│       │   ├── Navbar.jsx           ← Transparent → solid on scroll, "Meet Us" link
│       │   ├── Hero.jsx             ← Full-screen, scroll arrow, trust badges
│       │   ├── AvailabilitySection.jsx  ← Custom calendar, consecutive date selection
│       │   ├── BookingModal.jsx     ← 5-step form, inline validation, no remount bug
│       │   ├── AboutSection.jsx     ← Profile cards, mobile-centered
│       │   ├── ReviewsSection.jsx   ← Empty state, live data from API, approve flow
│       │   ├── MeetGreetSection.jsx ← Centered checklist, request modal
│       │   ├── ContactSection.jsx   ← Two-column, validated form
│       │   └── Footer.jsx           ← Dark footer, three columns
│       └── pages/
│           └── Home.jsx             ← Assembles all sections
│
└── backend/                         ← Express API (deployed to Render)
    ├── server.js                    ← Entry point, DB connect, middleware, routes
    ├── package.json
    ├── .env.example                 ← Template — copy to .env before running
    ├── .gitignore
    ├── models/
    │   ├── Booking.js               ← Mongoose schema for bookings
    │   └── Review.js                ← Mongoose schemas for reviews + blocked dates
    ├── routes/
    │   ├── bookings.js              ← CRUD + emails + iCal attachments
    │   ├── reviews.js               ← Submit, list (approved), admin approve/delete
    │   ├── contact.js               ← Contact form + meet & greet request
    │   └── blocked.js               ← Admin: manually block calendar dates
    └── utils/
        ├── mailer.js                ← Nodemailer wrapper (never throws)
        └── emailTemplates.js        ← All HTML email templates + iCal (.ics) generator
```

---

## 4. Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `primary-600` | `#16a34a` | CTAs, nav active, icon backgrounds |
| `primary-50`  | `#f0fdf4` | Card mint backgrounds |
| `primary-100` | `#dcfce7` | Borders, hover fills |
| `gray-900`    | `#111827` | Dark headings |
| `gray-500`    | `#6b7280` | Body / muted text |
| `amber-400`   | `#fbbf24` | Star ratings |
| `red-400`     | `#f87171` | Validation errors |

### Typography

| Role | Font | Weights |
|---|---|---|
| Headings (`h1`–`h4`) | **Syne** | 400, 600, 700, 800 |
| Body / UI | **DM Sans** | 300, 400, 500, 600 |

Both are loaded from Google Fonts in `index.html`. No JavaScript bundle cost.

### Key Design Decisions

- **Light theme** matching the Figma wireframe (not the dark GitHub colorblind palette discussed earlier — the wireframe clearly used white/green).
- **Rounded corners** (`rounded-2xl`, `rounded-3xl`) throughout for a friendly, approachable feel.
- **Mint card background** (`bg-primary-50`) used for calendar, contact, meet & greet sections — distinct from pure white without being loud.
- **`focus-visible`** used throughout instead of `focus` to keep keyboard accessibility clean without blue outlines on mouse clicks.

---

## 5. Frontend — Feature Breakdown

### Navbar (`Navbar.jsx`)

- **Transparent with white text** when the hero is in view (`scrollY <= 40`).
- **Solid white background with dark text** after scrolling — smooth 300ms transition.
- Links: Availability, Book Now (→ `#availability`), About, Reviews, **Meet Us** (→ `#meetgreet`), Contact.
- Mobile hamburger drawer with all links.
- `aria-expanded` on hamburger, `role="navigation"` on mobile drawer.

### Hero (`Hero.jsx`)

- Full-screen dark-overlay section.
- Flex-column layout ensures the scroll-down arrow is **always below** the trust badges on every screen size.
- Scroll arrow is a `<button>` (keyboard accessible) and scrolls to `#availability`.
- **To add a real photo:** replace the gradient `<div>` with an `<img>` pointing to `/images/hero-home.jpg` (place in `frontend/public/images/`). The comment in the file shows exactly what to change.

### Availability Calendar (`AvailabilitySection.jsx`)

- Custom-built calendar (no FullCalendar dependency) — lighter, fully controlled.
- **Date selection logic:**
  - First click → sets start date.
  - Subsequent clicks on dates *after* the start → extends the end date (consecutive clicking works: Mon → Tue → Wed → Thu).
  - Clicking a date before the current start → resets start to that date.
  - Clicking when both start and end are set → extends end if after start, otherwise resets.
- Booked dates fetched from `GET /api/bookings/dates` on mount (includes both confirmed bookings and manually blocked dates).
- Falls back to an empty array if the API is unavailable.
- Legend items use `whitespace-nowrap` — never wraps on narrow screens.
- Loading skeleton while fetching.
- ARIA: `role="application"`, `role="grid"`, `role="gridcell"`, `aria-selected`, `aria-label`, `aria-live` on month heading and selection text.

### Booking Modal (`BookingModal.jsx`)

**⚠️ Root cause of the input focus bug (now fixed):**

The original code defined `StepContent` as a component *inside* the `BookingModal` function body. Every time any state changed (e.g. a keystroke), React re-evaluated `BookingModal`, created a brand-new `StepContent` function reference, treated it as a new component type, and unmounted/remounted the entire step DOM — causing every input to lose focus after each character.

**Fix:** All step components (`Step1`, `Step2`, `Step3`, `Step4`, `Step5`) are defined as **top-level functions outside** `BookingModal`. React sees stable component references across renders and never remounts them unnecessarily.

Additional improvements:
- **Single-column layout always** (no sidebar on desktop — cleaner on all screen sizes as requested).
- **Pet fields stacked vertically**, one input per row.
- **Keys & remotes inventory** is now a `<textarea>` (multi-line list) instead of a single-line input.
- **Per-step inline validation** with red border + error message beneath each failing field, `aria-invalid` and `role="alert"`.
- **Loading spinner** on final submit button.
- Closes on `Escape` key press.
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for screen readers.

**Steps:**
1. Your Details (name, email, phone)
2. Dates & Home (check-in, check-out, address, instructions)
3. Pets (toggle + stacked pet cards, add/remove)
4. Home Access & Preferences (access instructions, keys textarea, security, emergency contact, household tasks, WiFi, daily updates)
5. Review & Confirm (zebra-striped summary table)

### About Section (`AboutSection.jsx`)

- **Mobile:** name/role/icon stack vertically and centre-align (`flex-col items-center`, `text-center sm:text-left`).
- **Desktop:** name/role row side-by-side, left-aligned.
- Tags centre on mobile (`justify-center sm:justify-start`).
- Photo placeholder shows emoji + "Photo coming soon" text until Cloudinary URL is added (see [Adding Your Photos](#12-adding-your-photos)).

### Reviews Section (`ReviewsSection.jsx`)

- **No seeded data** — starts completely empty.
- **Empty state card:** "Be Our First Reviewer!" with a call-to-action button.
- Reviews fetched from `GET /api/reviews` (only approved ones are returned publicly).
- Loading skeleton (two pulsing cards).
- New reviews submitted via modal go into MongoDB with `approved: false` — they appear publicly only after you approve them via `PATCH /api/reviews/:id/approve`.
- Average rating banner only renders when at least one review exists.

### Meet & Greet Section (`MeetGreetSection.jsx`)

- Nav link added: **"Meet Us"** in both desktop nav and mobile drawer.
- Checklist uses `inline-block text-left` inside a `text-center` container — items are left-aligned relative to each other but the block as a whole is horizontally centred.
- Request modal has full validation (name + phone required).

### Contact Section (`ContactSection.jsx`)

- Inline validation: name, email (format-checked), message all required.
- Error messages use `role="alert"` for screen readers.
- Phone optional, clearly marked.

---

## 6. Backend — API Reference

**Base URL (local):** `http://localhost:5000/api`
**Base URL (production):** `https://your-app.onrender.com/api`

### Bookings

| Method | Path | Description |
|---|---|---|
| `GET` | `/bookings/dates` | Array of booked `YYYY-MM-DD` strings (calendar) |
| `GET` | `/bookings` | All bookings — admin use |
| `POST` | `/bookings` | Create booking → emails owners + guest |
| `PATCH` | `/bookings/:id/status` | `{ status: "confirmed" \| "cancelled" \| "completed" }` |
| `DELETE` | `/bookings/:id` | Hard delete |

**On `POST /bookings`:**
- Server validates required fields (name, email, dateFrom, dateTo, address).
- Sends a detailed HTML email to both owner addresses with all booking fields, pet table, and an attached `.ics` file (Google Calendar import).
- Sends an auto-reply confirmation email to the guest.

**On `PATCH /bookings/:id/status`:**
- `confirmed` → sends confirmation email + `.ics` to guest.
- `cancelled` → sends cancellation email to guest.

### Reviews

| Method | Path | Description |
|---|---|---|
| `GET` | `/reviews` | Approved reviews only (public) |
| `GET` | `/reviews/all` | All reviews including pending (admin) |
| `POST` | `/reviews` | Submit review — starts `approved: false` |
| `PATCH` | `/reviews/:id/approve` | Approve a review (admin) |
| `DELETE` | `/reviews/:id` | Delete a review (admin) |

### Contact & Meet & Greet

| Method | Path | Description |
|---|---|---|
| `POST` | `/contact` | Sends enquiry email to both owners |
| `POST` | `/meetgreet` | Sends meet & greet request email to both owners |

### Blocked Dates (Admin)

| Method | Path | Description |
|---|---|---|
| `GET` | `/blocked` | List all manually blocked dates |
| `POST` | `/blocked` | Block a date `{ date: "YYYY-MM-DD", reason?: string }` |
| `DELETE` | `/blocked/:date` | Unblock a date |

### Health Check

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Returns `{ status: "ok", env, time }` — used by Render |

---

## 7. Email System

### How it works

All emails are sent via **Nodemailer using Gmail SMTP** with an App Password (not your real Gmail password). Every email is a fully-formatted HTML email matching the site's green brand colours.

### What gets sent and when

| Trigger | Recipients | Subject |
|---|---|---|
| Guest submits booking | Both owners | `🏠 New Booking Request — [Name] ([dates])` |
| Guest submits booking | Guest | `Booking Request Received — Gonubie House Sitting` |
| Owner confirms booking | Guest | `✅ Booking Confirmed — Gonubie House Sitting` |
| Owner cancels booking | Guest | `Booking Cancellation — Gonubie House Sitting` |
| Contact form submitted | Both owners | `📩 Website Enquiry — [Name]` |
| Meet & greet submitted | Both owners | `☕ Meet & Greet Request — [Name]` |

### Google Calendar Integration

Every booking email sent to the owners includes a **`booking.ics` attachment** — a standard iCalendar file. When you open the email on your phone or in Gmail:
- **Gmail on Android/iOS:** Tap the `.ics` attachment → "Add to Calendar" — it opens in Google Calendar with all event details pre-filled.
- **Gmail on desktop:** Open the attachment → Google Calendar import dialog appears.
- The event title is `🏠 House Sit — [Guest Name]` with check-in/check-out as all-day event dates.

This is the most reliable, zero-cost Google Calendar integration — no OAuth, no API keys, no setup.

### Configuring Gmail SMTP

1. Log in to your **business Gmail account** (e.g. `gonubiehousesit@gmail.com`).
2. Go to **Google Account → Security → 2-Step Verification** — enable it if not already on.
3. Go to **Google Account → Security → 2-Step Verification → App Passwords**.
4. Select app: **Mail**, device: **Other (custom name)** → type "House Sitting Server" → **Generate**.
5. Copy the 16-character code (shown once). Paste it as `GMAIL_APP_PASSWORD` in your `.env`.

---

## 8. Environment Variables

### Backend (`backend/.env`)

> Copy `backend/.env.example` → `backend/.env` and fill in every value.

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development` locally, `production` on Render |
| `PORT` | No | Default `5000` |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string |
| `GMAIL_USER` | **Yes** | Business Gmail address |
| `GMAIL_APP_PASSWORD` | **Yes** | 16-char Gmail App Password (not your login password) |
| `OWNER_EMAIL_1` | **Yes** | Your email — receives all notifications |
| `OWNER_EMAIL_2` | **Yes** | Layla's email — receives all notifications |
| `FRONTEND_URL` | **Yes** | Your Vercel URL (for CORS) |

### Frontend — Production

In production Vercel pulls env vars you set in the dashboard. For the frontend the only variable needed is the backend API URL, which is handled by the Vite proxy in development and by setting the correct URL in axios calls for production.

**To point the frontend at the production backend:** in `frontend/vite.config.js` the proxy handles this in dev. For production builds deployed to Vercel, all `/api/*` calls need to reach your Render backend. The cleanest approach is to set a Vercel environment variable:

```
VITE_API_URL=https://your-app.onrender.com
```

Then in each component that uses `axios`, update the base URL:
```js
// src/utils/api.js  (create this file)
import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' })
export default api
```

Or use a `vercel.json` rewrite (simpler — see Deployment section below).

---

## 9. Running Locally

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- A MongoDB Atlas free cluster (or local MongoDB)
- A Gmail account with an App Password generated

### Steps

**1. Clone and install**
```bash
git clone https://github.com/your-username/housesitting-website.git
cd housesitting-website
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env
# → Open .env and fill in MONGO_URI, GMAIL_USER, GMAIL_APP_PASSWORD,
#   OWNER_EMAIL_1, OWNER_EMAIL_2, FRONTEND_URL=http://localhost:3000
npm run dev
# → API running on http://localhost:5000
```

**3. Frontend** (new terminal)
```bash
cd frontend
npm install
npm run dev
# → App running on http://localhost:3000
# → /api/* calls are proxied to localhost:5000 automatically
```

---

## 10. Deployment Guide

### Backend → Render (free)

1. Push the `backend/` folder to a GitHub repository (can be the same repo).
2. Go to [render.com](https://render.com) → **New Web Service**.
3. Connect your GitHub repo. Set:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
   - **Node version:** 18 (add env var `NODE_VERSION=18` if needed)
4. Add all environment variables from `.env.example` in the **Environment** tab.
5. Deploy. Note the URL — e.g. `https://gonubie-housesit-api.onrender.com`.

> **⚠️ Free tier cold starts:** Render free services spin down after 15 minutes of inactivity and take ~30 seconds to wake up on the next request. The first booking form submission after a quiet period may be slow. This is acceptable for a small business — upgrade to a paid tier ($7/mo) when traffic justifies it.

### Frontend → Vercel (free)

1. Push the `frontend/` folder to GitHub (or the whole repo).
2. Go to [vercel.com](https://vercel.com) → **New Project** → import repo.
3. Set:
   - **Framework preset:** Vite
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
4. Add environment variable: `VITE_API_URL=https://your-app.onrender.com`
5. Add a `frontend/vercel.json` to proxy API calls to Render (avoids CORS issues in production):

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-app.onrender.com/api/:path*"
    }
  ]
}
```

6. Deploy → your custom domain (already set up) will serve the site.

### MongoDB Atlas (free)

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Create free cluster (M0).
2. **Database Access** → Add user with read/write permissions.
3. **Network Access** → Add IP `0.0.0.0/0` (allows Render's dynamic IPs).
4. **Connect** → Drivers → Copy connection string → paste into `MONGO_URI`.

---

## 11. Before Going Live — Checklist

Go through every item before sharing the QR code / flyer:

### 🔴 Required — won't work without these
- [ ] `MONGO_URI` set in Render environment variables
- [ ] `GMAIL_USER` set to your business Gmail
- [ ] `GMAIL_APP_PASSWORD` set (16-char App Password, not login password)
- [ ] `OWNER_EMAIL_1` set to your email
- [ ] `OWNER_EMAIL_2` set to Layla's email
- [ ] `FRONTEND_URL` set to your Vercel domain on Render
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] `vercel.json` rewrite pointing `/api/*` to your Render URL

### 🟡 Important — personalise before launching
- [ ] Replace `Your Name` in `AboutSection.jsx` with your real name
- [ ] Replace `+27 XXX XXX XXXX` phone numbers in `Footer.jsx` and `ContactSection.jsx`
- [ ] Replace `housesit@gonubie.co.za` with your real email in `Footer.jsx` and `ContactSection.jsx`
- [ ] Add your real photos (see [Adding Your Photos](#12-adding-your-photos))
- [ ] Add a real hero background photo (see comment in `Hero.jsx`)
- [ ] Update the `<title>` and `og:*` meta tags in `index.html` with your real domain

### 🟢 Nice to have before launch
- [ ] Test full booking flow end-to-end (submit → check Gmail → verify `.ics` imports to Google Calendar)
- [ ] Test contact form and meet & greet request
- [ ] Submit one test review → approve it via API → verify it appears publicly
- [ ] Test on real mobile devices (iOS Safari, Android Chrome)
- [ ] Check Render logs for any startup errors

---

## 12. Adding Your Photos

### Profile photos (About section)

1. Go to [cloudinary.com](https://cloudinary.com) → sign up free.
2. Upload your photos.
3. Copy the image URL (e.g. `https://res.cloudinary.com/your-cloud/image/upload/v1/your-photo.jpg`).
4. In `frontend/src/components/AboutSection.jsx`, find the `SITTERS` array and replace `photo: null` with your URL:

```js
const SITTERS = [
  {
    name:  'Your Real Name',
    photo: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/your-name.jpg',
    // ...
  },
  {
    name:  'Layla',
    photo: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v1/layla.jpg',
    // ...
  },
]
```

### Hero background photo

1. Place the photo at `frontend/public/images/hero-home.jpg`.
2. In `frontend/src/components/Hero.jsx`, find the comment `/* REAL PHOTO SETUP */` and follow the instructions — remove the gradient div, uncomment the `<img>` and overlay div.

**Tip:** For the best Cloudinary URL, use their transformation API to ensure photos are optimised for web. Example: add `/w_800,f_auto,q_auto/` before the filename in the URL.

---

## 13. Known Limitations & Future Work

| Item | Notes |
|---|---|
| **No admin dashboard** | Currently, managing bookings (confirming, cancelling, approving reviews) requires calling the API directly (e.g. via Postman or a tool like `curl`). A simple password-protected admin page is the most valuable next feature to build. |
| **Render cold starts** | Free Render services sleep after 15 min. First request after sleep takes ~30s. Acceptable for now. |
| **No real-time availability** | The calendar fetches booked dates once on mount. If someone else books while a user has the page open, the newly blocked dates won't appear until page refresh. Acceptable for a small business with low concurrent usage. |
| **Reviews manually approved** | There is no UI to approve reviews — you must call `PATCH /api/reviews/:id/approve` via API. Build an admin page or use MongoDB Atlas UI to approve. |
| **No WhatsApp integration** | Twilio's WhatsApp API has a free trial. Adding a WhatsApp notification alongside email is a natural next step. |
| **No payment processing** | Out of scope for MVP — bookings are confirmed by the owners manually. |
| **Hero needs a real photo** | A gradient placeholder is used. Replace with a real photo of a cosy Gonubie home or your own photo for maximum trust impact. |

---

## Appendix — Quick Command Reference

```bash
# Backend
cd backend && npm run dev          # Start with nodemon (auto-restarts)
cd backend && npm start            # Start without nodemon (production)

# Frontend
cd frontend && npm run dev         # Vite dev server on :3000
cd frontend && npm run build       # Production build → dist/
cd frontend && npm run preview     # Preview production build locally

# Approve a review (replace <id> with the MongoDB _id)
curl -X PATCH https://your-app.onrender.com/api/reviews/<id>/approve

# Block a date manually
curl -X POST https://your-app.onrender.com/api/blocked \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-08-15","reason":"Personal trip"}'

# Confirm a booking
curl -X PATCH https://your-app.onrender.com/api/bookings/<id>/status \
  -H "Content-Type: application/json" \
  -d '{"status":"confirmed"}'
```

---

*Built with ❤️ in Gonubie, East London · © 2025 Gonubie House Sitting*
