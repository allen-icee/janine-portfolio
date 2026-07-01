# Janine Portfolio

A professional, dynamic freelance portfolio and Content Management System (CMS) designed for a Virtual Assistant. This application serves as a client-facing landing page to showcase services and rates, while also providing a secure administrative dashboard where the site owner can manage inquiries and update site content dynamically without modifying code.

---

## Features

- Dynamic public landing page highlighting services, rates, portfolio items, and testimonials.
- Secure, authenticated admin dashboard for full CMS control.
- Inquiry management and contact form handling.
- Granular control over service categories, pricing groups, and rate items.
- Portfolio and client proofs showcase management.
- Global site configuration, bio, and experience timeline management.

---

## Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite

**Backend**
- Supabase (PostgreSQL, Auto-generated REST API)
- Laravel (API Scaffold)

**Authentication**
- Supabase Auth

**Styling & UI**
- Tailwind CSS v4
- Framer Motion
- Lenis
- Embla Carousel

**Deployment**
- Configured for Vercel

---

## Getting Started

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

### Run Locally

Start the frontend development server:
```bash
cd apps/frontend
npm run dev
```

---

## Live Demo

[Insert Deployed URL Here]

---

## Repository Usage

This repository is shared for learning, inspiration, and portfolio purposes. You are welcome to explore the codebase and learn from the implementation.

Please do not copy, redistribute, submit, or present this project as your own work. If you create something inspired by this project, build your own implementation and give appropriate credit where applicable.

---

## License

Unless otherwise stated, this repository is intended for portfolio and educational purposes. All rights are reserved.
