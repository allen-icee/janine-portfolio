# JaneDesk

A professional, dynamic freelance portfolio and Content Management System (CMS) designed for a Virtual Assistant. This application serves as a client-facing landing page to showcase services and rates, while also providing a secure administrative dashboard where the site owner can manage inquiries and update site content dynamically without modifying code.

---

## ✨ Features

- Dynamic public landing page highlighting services, rates, portfolio items, and testimonials.
- Secure, authenticated admin dashboard for full CMS control.
- Inquiry management and contact form handling.
- Granular control over service categories, pricing groups, and rate items.
- Portfolio and client proofs showcase management.
- Global site configuration, bio, and experience timeline management.

---

<h3>Languages & Tools (⌐■_■)</h3>

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="35" title="React" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="35" title="Vite" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" width="35" title="Laravel" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="35" title="TypeScript" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" width="35" title="PHP" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="35" title="Tailwind CSS" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg" width="35" title="Supabase" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" width="35" title="PostgreSQL" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="35" title="Node.js" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" width="35" title="npm" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" width="35" title="Vercel" />
</p>

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Composer and PHP 8.3+ (if using the Laravel API)
- Supabase Project

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd janine-portfolio
   ```

2. Install frontend dependencies:
   ```bash
   cd apps/frontend
   npm install
   ```

3. Install backend dependencies (optional, for Laravel extension):
   ```bash
   cd ../api
   composer install
   ```

### Environment Variables

Create a `.env` file in `apps/frontend/` with your Supabase configuration:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Run

Start the frontend development server:
```bash
cd apps/frontend
npm run dev
```

---

## 📄 License

Copyright (c) 2026 JaneDesk

This project is shared for portfolio, educational, and learning purposes.

You are welcome to study the codebase and use it as inspiration for your own projects.

Copying substantial portions of this project, redistributing it, submitting it as your own work, or creating direct clones is not permitted without explicit permission.

If this project inspires your work, please build your own implementation rather than copying the source code.

All rights reserved.
