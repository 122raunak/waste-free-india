# Waste Free India

A full-stack marketplace connecting waste sellers with scrap buyers — built to make recycling accessible, trackable, and rewarding for everyday citizens and waste collectors across India.

Live site: https://waste-free-india.vercel.app/

---

## Why I built this

Waste segregation and recycling in India is fragmented — sellers don't know who to contact, buyers spend time driving around looking for scrap, and there's no reliable way to coordinate pickups. Waste Free India solves this by connecting both sides directly: sellers list their waste with photos and a price, buyers browse nearby listings and confirm pickups, and both parties get each other's contact details automatically. The whole flow — from listing to collected — is tracked in one place.

---

## Features

- **Dual-role authentication** — separate seller (citizen) and buyer (scrap dealer) accounts with session-based auth via Passport.js, Google OAuth, and protected routes per role
- **Waste listing flow** — sellers upload images (with client-side compression), set category, quantity, estimated price, and weight. Listings are immediately visible to buyers
- **Buyer-seller connection** — buyers browse pending listings, view seller contact details, and confirm pickups. Both parties receive each other's phone, address, and business details on confirmation
- **Email notifications** — sellers get a branded HTML email when a buyer accepts their listing; buyers get updates when sellers mark status as collected or completed (Nodemailer + Gmail SMTP)
- **Status lifecycle** — listings move through `pending → assigned → collected → completed`, with sellers controlling status updates and buyers notified at each step
- **AI chatbot** — Westie, a Gemini 2.0 Flash powered assistant that answers waste management questions in any language, with suggested prompts and a clean chat UI
- **Address autocomplete** — Google Places API integration in profile edit forms
- **Educational content** — Home page with clickable waste management video tutorials, recycling games, and a leaderboard
- **Responsive UI** — mobile-first design built with Tailwind CSS, works across all screen sizes

---

## Tech stack

**Frontend:** React 18 (Vite), React Router v6, Axios, Tailwind CSS, GSAP, Lucide React

**Backend:** Node.js, Express.js, MongoDB (Mongoose)

**Auth:** Passport.js (local strategy + Google OAuth 2.0), express-session, passport-local-mongoose

**AI:** Google Gemini 2.0 Flash via `@google/generative-ai` SDK

**Email:** Nodemailer with Gmail SMTP (App Password)

**File uploads:** Multer (memory storage), browser-image-compression (client-side)

**Maps:** Google Places API (address autocomplete)

**Hosting:** Render (backend), Vercel (frontend), MongoDB Atlas (database)

---

## Architecture notes

- **Separate Passport strategies** — `user-local` and `buyer-local` are registered independently, with a shared `deserializeUser` that checks both collections. This means a user and a buyer can share the same session store without conflicts
- **Role-based middleware** — `isLoggedInUser` blocks buyers from seller routes and vice versa, enforced at the route level rather than the controller level so it's impossible to bypass
- **Image pipeline** — images are compressed on the client before upload (browser-image-compression, max 1MB), stored as Buffers in MongoDB, and converted to base64 strings server-side before sending to the frontend. This avoids needing a separate object storage service for a project at this scale
- **Email is non-blocking** — email sends use `.catch()` so a failed SMTP call never breaks the main API response. The confirmation still succeeds even if the email bounces
- **AppContext role flags** — login as one role always clears the other role's localStorage flag, preventing the navbar from showing seller and buyer icons simultaneously when switching accounts in the same browser

---

## Running locally

**Backend**
```bash
cd backend
npm install
# create .env — see .env.example below
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**`.env` for backend:**
```
secretKey=your_random_secret_here
Google_Client_ID=your_google_oauth_client_id
Google_Client_Secret=your_google_oauth_client_secret
GOOGLE_MAP_API=your_google_places_api_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_gmail_app_password
MONGODB_URI=mongodb://127.0.0.1:27017/WasteManagementSystem
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**`.env` for frontend:**
```
VITE_BACKEND_URL=http://localhost:3000
```

The app expects a running MongoDB instance. For local dev, MongoDB Community Edition works. For production, use MongoDB Atlas (free M0 tier).

---

## Email setup (Gmail)

1. Enable 2-Step Verification on your Google account
2. Go to **Google Account → Security → App passwords**
3. Generate a 16-character App Password for "Mail"
4. Use that as `EMAIL_PASS` in your `.env` — never your real Gmail password

---

## What I'd add next

- **Real-time notifications** with Socket.io — currently notifications are email-only; a live bell icon would improve UX significantly
- **Location-based filtering** — show buyers only listings within a configurable radius using MongoDB's `$geoNear` operator (location fields are already in the schema)
- **Razorpay integration** — allow buyers to pay sellers through the platform rather than cash on pickup, with automatic commission tracking
- **Admin dashboard** — verify buyer businesses, moderate listings, and view platform-wide recycling stats
- **Push notifications** — PWA service worker for mobile push, so sellers know instantly when a buyer confirms without needing to open email