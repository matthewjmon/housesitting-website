# 🏠 Home & Away — React Frontend

> Gonubie House Sitting · React + Vite + Tailwind CSS

---

## 🚀 Getting Started in 3 Steps

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Opens at **http://localhost:3000**

### 3. Connect to backend (optional for dev)

The frontend talks to `/api/*` which Vite proxies to `http://localhost:5000`.
All sections work in demo mode with sample data if the backend isn't running yet.

To disable the proxy or point at your deployed backend, edit `vite.config.js`:
```js
proxy: {
  '/api': {
    target: 'https://your-app.onrender.com',  // your Render URL
    changeOrigin: true,
  }
}
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx            ← Fixed top nav, mobile hamburger menu
│   ├── Hero.jsx              ← Full-screen dark hero with CTAs
│   ├── AvailabilitySection.jsx  ← Interactive calendar, date range picker
│   ├── BookingModal.jsx      ← 6-step booking form modal with sidebar nav
│   ├── AboutSection.jsx      ← Photo cards with profile info + trust badges
│   ├── ReviewsSection.jsx    ← 2×2 review grid, avg rating, leave review modal
│   ├── MeetGreetSection.jsx  ← Centered card with checklist + request modal
│   ├── ContactSection.jsx    ← 2-col contact info + form
│   └── Footer.jsx            ← Dark footer, 3-column layout
├── pages/
│   └── Home.jsx              ← Assembles all sections, manages modal state
├── App.jsx                   ← Router + layout wrapper
├── main.jsx                  ← Entry point
└── index.css                 ← Tailwind + custom styles + FullCalendar overrides
```

---

## 🎨 Design System

All colours follow the wireframe exactly:

| Token | Value | Use |
|---|---|---|
| `primary-600` | `#16a34a` | CTAs, active states, accent |
| `primary-50`  | `#f0fdf4` | Card backgrounds (mint tint) |
| `primary-100` | `#dcfce7` | Hover fills, badges |
| `gray-900`    | `#111827` | Dark headings |
| `gray-500`    | `#6b7280` | Body text |
| `amber-400`   | `#fbbf24` | Star ratings |

Fonts: **Syne** (headings) + **DM Sans** (body) — loaded via Google Fonts in `index.html`

---

## 📸 Adding Real Photos (About Section)

1. Upload your photos to [Cloudinary](https://cloudinary.com) (free tier)
2. Copy the image URLs
3. In `src/components/AboutSection.jsx`, replace `photo: null` with your URLs:

```js
const SITTERS = [
  {
    name:  'Your Name',
    photo: 'https://res.cloudinary.com/your-cloud/image/upload/v1/your-photo.jpg',
    // ...
  },
  {
    name:  'Layla',
    photo: 'https://res.cloudinary.com/your-cloud/image/upload/v1/layla-photo.jpg',
    // ...
  },
]
```

---

## 🔗 API Integration

All components gracefully fall back to demo data if the backend is offline.
When the backend is running, they hit these endpoints automatically:

| Component | Endpoint |
|---|---|
| `AvailabilitySection` | `GET /api/bookings/dates` |
| `BookingModal` | `POST /api/bookings` |
| `ReviewsSection` | `GET /api/reviews` · `POST /api/reviews` |
| `MeetGreetSection` | `POST /api/meetgreet` |
| `ContactSection` | `POST /api/contact` |

---

## 🌐 Deploying to Vercel (Free)

```bash
npm run build   # Creates /dist folder
```

Then:
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add env variable: `VITE_API_URL=https://your-backend.onrender.com`
7. Deploy → done!

---

## ✅ Personal Details to Update

Search for these placeholders and replace with your real info:

- `Your Name` → your actual name
- `+27 XXX XXX XXXX` → both your phone numbers  
- `housesit@gonubie.co.za` → your email(s)
- `photo: null` → Cloudinary URLs
- Hero background → replace gradient with a real photo (see `Hero.jsx` comments)

---

Built with ❤️ in Gonubie · © 2025
