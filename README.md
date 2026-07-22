# Casper Photography
> A stunning, high-performance, and immersive photography portfolio website featuring a fullscreen horizontal scroll grid, cinematic animations, and an ultra-slick aesthetic.

## 🚀 Tech Stack
 * Frontend: Solid.js powered by Rspack / Rsbuild (blazing-fast HMR and compilation with GSAP for fluid horizontal scroll and animations)
 * Backend: Go HTTP API with chi router and SQLite
 * Database: SQLite (Embedded, lightweight, and blazing fast)
 * Infrastructure: Docker & Docker Compose (Production-ready containerization)

## 📂 Project Architecture (Monorepo)
```
casper-photography/
├── docker-compose.yml           # Full-stack orchestration (backend + frontend)
├── backend/                     # Go Backend API
│   ├── database/
│   │   ├── schema.sql           # SQLite schema
│   │   └── seed.sql             # Sample data
│   ├── storage/                 # Static media files (photos + thumbs)
│   ├── Dockerfile
│   └── main.go
└── frontend/                    # Solid.js + Rsbuild Frontend
    ├── src/
    │   ├── main.tsx
    │   └── App.tsx
    ├── index.html
    ├── rsbuild.config.ts        # Rspack configuration with Solid plugin
    └── package.json
```

## ✨ Key Features
 * Fullscreen Horizontal Scroll Grid: An immersive magazine-style landing experience powered by GSAP and ScrollTrigger.
 * Cinematic Lightbox & EXIF Drawer: Displays precise camera metadata (Camera, Lens, Aperture, Shutter Speed, ISO) on demand.
 * SQLite-Powered Simplicity: Zero external database overhead; all data and media references are securely housed in a single, high-performance portable database.
 * Rspack-Accelerated Frontend: Built using Rust-based Rspack/Rsbuild for near-instantaneous builds and maximum UI responsiveness.
 * Single Repo

## 🌐 API Endpoints
 * `GET /health` — Health check
 * `GET /api/v1/albums` — List all albums
 * `GET /api/v1/albums/{slug}/photos` — Photos in an album (includes EXIF)
 * `GET /api/v1/photos/{id}` — Single photo detail
 * `GET /media/*` — Static media files

## 🐳 Deployment with Docker Compose
 * Clone the repository:
   ```bash
   git clone https://github.com/CasperHK/Photography-portfolio.git
   cd Photography-portfolio
   ```
 * (Optional) Add your images to `backend/storage/photos/` and `backend/storage/thumbs/`.
 * Build and start services:
   ```bash
   docker compose up -d --build
   ```
 * Open in browser:
   * Frontend: http://localhost:3000
   * API health: http://localhost:8080/health
   * API photos: http://localhost:8080/api/v1/albums/portfolio/photos
 * Check container status:
   ```bash
   docker compose ps
   ```

## 🛠️ Local Development
 * Backend (`/backend`):
   ```bash
   cd backend
   go run .
   ```
 * Frontend (`/frontend`):
   ```bash
   cd frontend
   pnpm install
   pnpm run dev
   ```

## 📄 License
MIT License
