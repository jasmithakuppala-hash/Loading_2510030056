# CINEVERSE 🎬

> **"Discover. Explore. Save. Watch."**

Cineverse is a modern, high-performance, cinematic TMDB-powered Movie & TV Discovery web application built from scratch for **Deploython 2.0**.

---

## 🌟 Key Features

- 🎭 **Cinematic Hero**: Rotating full-screen hero banner featuring top TMDB backdrops, metadata badges, ratings, synopsis, and quick action CTAs.
- 🔥 **Trending & Carousels**: Smooth horizontal scrolling carousels for Trending Now (with rank indicators), Popular Movies, Top Rated, and Popular TV Series.
- 🍿 **HD Trailer Experience**: Seamless YouTube video modal for instant trailer previews.
- 🔍 **Global Search & Command Palette**: Interactive multi-tab search across Movies, TV Shows, and People with `Ctrl + K` quick shortcut.
- 🎨 **Signature Mood Discovery**: Personalized filter engine based on user mood (*Adrenaline, Mind-Bending, Romance, Feel-Good, Dark, Sci-Fi, Emotional, Drama*).
- 💖 **Persistent Watchlist**: LocalStorage-persisted watchlist with quick heart toggles, badge counter, and animated toasts.
- 🌗 **Dark / Light Mode**: Dual theme design preserving Cineverse's cinematic visual identity.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom Glassmorphism & Animations
- **Icons**: Lucide React
- **API**: TMDB (The Movie Database v3 API)
- **State & Storage**: React Context API & LocalStorage

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jasmithakuppala-hash/Loading_2510030056.git
cd Loading_2510030056
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 4. Run locally
```bash
npm run dev
```

---

## 📜 License & Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
Crafted with precision for **Deploython 2.0**.
