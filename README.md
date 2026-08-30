<p align="center">
  <img src="./public/forke-assets/email-banners/main-banner.png" width="100%" alt="Forke Banner" />
</p>

# 🌐 Forke Marketing & Public Web

<p align="center">
  <i>The public face of Forke — high-performance landing experience, developer showcase, blogs, and public portfolios.</i>
</p>

<p align="center">
  <a href="https://www.forke.space/?source=github"><strong>Official Website</strong></a> ·
  <a href="https://github.com/forke-org/.github"><strong>Org Profile</strong></a> ·
  <a href="https://github.com/forke-org/forke-dashboard"><strong>Dashboard Repo</strong></a> ·
  <a href="https://github.com/forke-org/forke-admin"><strong>Admin Repo</strong></a> ·
  <a href="https://github.com/forke-org/forke-backend"><strong>Backend Repo</strong></a>
</p>

---

## 📖 Overview

`forke-marketing` is the marketing website and public portal for **Forke**. It delivers an engaging visual experience with 3D elements, interactive physics, developer storyboards, blog posts, waitlists, and public developer profiles (`/[username]`) showcasing real-time proof-of-work.

### ✨ Key Features
* 🎨 **Interactive 3D & Micro-interactions:** Built with Three.js, React Three Fiber, Rapier physics, and GSAP animations.
* 📝 **Rich Content & Blogs:** TipTap-powered editor and rendering for technical articles and release notes.
* 👤 **Public Developer Showcase:** Dedicated proof-of-work portfolio pages (`/[username]`) linking verified GitHub commits, task history, and RPG skill badges.
* 📈 **Automated Changelog:** Pre-build script generation for seamless product updates.
* 🔒 **Unified Auth:** Seamless authentication via Auth.js (GitHub & Google OAuth) with PostgreSQL database sessions.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **3D & Animation:** Three.js, `@react-three/fiber`, `@react-three/rapier`, GSAP
* **Database & ORM:** PostgreSQL, [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication:** NextAuth / [Auth.js v5](https://authjs.dev/)
* **Storage & CDN:** Cloudflare R2 (S3-compatible)
* **Email:** Resend

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js:** `v20.x` or `v22.x`+
* **Package Manager:** `npm`, `pnpm`, or `bun`
* **PostgreSQL:** Local PostgreSQL instance or Docker container

### 1. Clone the repository
```bash
git clone https://github.com/forke-org/forke-marketing.git
cd forke-marketing
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file by copying the sample:
```bash
cp .env.example .env.local
```

Ensure your `.env.local` includes the following core values for local development:
```env
# Database
DATABASE_URL="postgresql://forke:forke_secret@localhost:5433/forke_dev"

# Auth.js / NextAuth
AUTH_SECRET="your_generated_secret_here" # generate with: npx auth secret
AUTH_TRUST_HOST="true"
AUTH_URL="http://localhost:3000"

# Analytics IP Salt & Encryption
ANALYTICS_IP_SALT="local_dev_salt_string"
FILE_ENCRYPTION_KEY="0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"

# OAuth (Optional for basic local browsing)
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

### 4. Run the development server
```bash
npm run dev
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Generates changelog and starts the Next.js dev server |
| `npm run build` | Builds the production bundle with increased Node memory allowance |
| `npm run start` | Runs the production server |
| `npm run lint` | Runs ESLint to check for code quality issues |

---

## 📂 Project Structure

```
forke-marketing/
├── app/              # Next.js App Router (pages, layouts, API routes)
├── components/       # Reusable UI components (Hero, 3D Canvas, Features, Footer)
├── constants/        # System constants and navigation configs
├── lib/              # Database client (Drizzle), auth configuration, helpers
├── public/           # Static assets, branding logos, forky illustrations
├── scripts/          # Prebuild and changelog generation scripts
├── types/            # TypeScript type definitions
└── ...
```

---

## 🍊 Meet Forky!

<p align="center">
  <img src="./public/forke-assets/forky-reactions/locked_in_forky.png" width="160" alt="Locked In Forky" /> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./public/forke-assets/forky-reactions/grind_mode_forky.png" width="160" alt="Grind Mode Forky" /> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./public/forke-assets/forky-reactions/loot_goblin_forky.png" width="160" alt="Loot Goblin Forky" /> &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="./public/forke-assets/forky-reactions/confused_forky.png" width="160" alt="Confused Forky" />
</p>

---

## 📄 License

This repository is **source-available, not open-source**. The code is public for
transparency and reference, but **all rights are reserved** — you may read and fork
it on GitHub, but you may **not** use, deploy, copy, or commercialize it without
prior written permission. See [LICENSE](./LICENSE) for the full terms.
