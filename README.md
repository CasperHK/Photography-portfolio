Casper Photography
> A stunning, high-performance, and immersive photography portfolio website featuring a fullscreen horizontal scroll grid, cinematic animations, and an ultra-slick aesthetic.
> 
🚀 Tech Stack
 * Frontend: Solid.js powered by Rspack / Rsbuild (blazing-fast HMR and compilation with GSAP for fluid horizontal scroll and animations)
 * Backend: Goravel (An elegant Go framework inspired by Laravel)
 * Database: SQLite (Embedded, lightweight, and blazing fast)
 * Infrastructure: Docker & Docker Compose (Production-ready containerization)
📂 Project Architecture (Monorepo)
casper-photography/
├── docker-compose.yml           # Production orchestration (App + Nginx + SQLite)
├── server/                      # Goravel Backend API
│   ├── app/
│   ├── config/                  # SQLite & Database configurations
│   ├── routes/
│   ├── Dockerfile
│   └── main.go
└── web/                         # Solid.js + Rsbuild Frontend
    ├── src/
    ├── public/
    ├── rsbuild.config.ts        # Rspack configuration with Solid plugin
    └── package.json

✨ Key Features
 * Fullscreen Horizontal Scroll Grid: An immersive magazine-style landing experience powered by GSAP and ScrollTrigger.
 * Cinematic Lightbox & EXIF Drawer: Displays precise camera metadata (Camera, Lens, Aperture, Shutter Speed, ISO) on demand.
 * SQLite-Powered Simplicity: Zero external database overhead; all data and media references are securely housed in a single, high-performance portable database.
 * Rspack-Accelerated Frontend: Built using Rust-based Rspack/Rsbuild for near-instantaneous builds and maximum UI responsiveness.
🐳 Deployment with Docker Compose
 * Clone the repository:
   git clone https://github.com/your-username/casper-photography.git
cd casper-photography

 * Build and start services:
   docker compose up -d --build

 * Check container status:
   docker compose ps

🛠️ Local Development
 * Backend (/server):
   go run main.go

 * Frontend (/web):
   npm install
npm run dev

📄 License
MIT License
