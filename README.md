# Janine Portfolio

A professional, dynamic freelance portfolio and Content Management System (CMS) designed for a Virtual Assistant. This application serves as both a client-facing landing page to showcase services, rates, and past work, and a secure administrative dashboard where the site owner can manage inquiries, update portfolio items, and customize site content without touching code. It exists to streamline client acquisition and provide a centralized hub for business operations.

---

## Features

- **Dynamic Public Portfolio**: A beautifully designed landing page featuring Hero, Stats, About, Services, Rates, Portfolio, Proofs, Testimonials, and FAQ sections.
- **Secure Admin Dashboard**: Authenticated CMS allowing full CRUD (Create, Read, Update, Delete) control over site content.
- **Inquiry Management**: Built-in contact form handling and inquiry tracking from the admin panel.
- **Service & Rate Configuration**: Granular control over service categories, pricing groups, and individual rate items.
- **Portfolio & Proofs Showcase**: Image and category management for past work and client proofs.
- **Testimonial Engine**: Manage client reviews and ratings.
- **Global Settings & Profile**: Manage site-wide configurations, bio, and experience timeline.
- **Smooth UX/UI**: Implemented with smooth scrolling (Lenis), accessible carousels (Embla), and fluid animations (Framer Motion).

---

## Screenshots

### Homepage
![Homepage Placeholder](#)

### Admin Dashboard
![Dashboard Placeholder](#)

### Mobile View
![Mobile View Placeholder](#)

### Authentication
![Authentication Placeholder](#)

---

## Tech Stack

**Frontend**
- React 19
- TypeScript
- Vite

**Backend**
- Supabase (PostgreSQL, Auto-generated REST API)
- Laravel (API Backend scaffold for extended server-side operations)

**Authentication**
- Supabase Auth

**Styling & UI**
- Tailwind CSS v4
- Framer Motion (Animations)
- Embla Carousel (Sliders)
- Lenis (Smooth Scrolling)
- Lottie React (Vector Animations)
- Lucide React (Icons)

**State Management & Forms**
- React Hooks
- React Hook Form
- Zod (Schema Validation)

**Deployment**
- Configured for Vercel (frontend)

---

## Project Structure

```
.
├── apps/
│   ├── api/          # Laravel backend scaffold and routes
│   └── frontend/     # React frontend application
│       ├── src/
│       │   ├── components/ # Reusable UI components & layouts
│       │   ├── lib/        # Supabase client & utility functions
│       │   ├── pages/      # Route pages (Landing, Admin Dashboard, etc.)
│       │   └── types/      # TypeScript type definitions
├── docs/             # Project documentation
└── packages/         # Shared monorepo packages (if applicable)
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- Composer & PHP 8.3+ (if running the Laravel backend locally)
- A Supabase Project

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd janine-portfolio
   ```

2. Install Frontend Dependencies
   ```bash
   cd apps/frontend
   npm install
   ```

3. Install Backend Dependencies (Optional/If extending Laravel)
   ```bash
   cd ../api
   composer install
   ```

### Environment Variables

Create a `.env` file in `apps/frontend/` and configure your Supabase instance:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: Ensure you set up corresponding `.env` variables for the Laravel API if you plan to use it).*

### Running Locally

Start the frontend development server:
```bash
cd apps/frontend
npm run dev
```

### Build

To create a production build for the frontend:
```bash
cd apps/frontend
npm run build
```

---

## Usage

1. **Client View**: Visitors can navigate the highly-optimized landing page to learn about services, view portfolio items, read FAQs, and submit inquiries via the floating contact widget or contact section.
2. **Admin Access**: Navigate to `/admin/login` to authenticate using your Supabase credentials.
3. **Content Management**: Once authenticated, use the sidebar navigation in the dashboard to review new inquiries, add new portfolio items, update pricing tiers, or moderate testimonials. All changes are instantly reflected on the public landing page.

---

## Architecture Overview

- **Data Flow**: The React frontend interacts directly with a Supabase PostgreSQL database using the `@supabase/supabase-js` client.
- **Backend Interactions**: Content fetches (like `fetchPublicContent`) aggregate necessary data for the public-facing site, while authenticated routes perform secure mutations (inserts, updates, deletes). 
- **Database Relationships**: The schema heavily utilizes relational mapping (e.g., `portfolio_items` linked to `portfolio_categories`, `rate_items` nested under `rate_service_groups` and `rate_categories`).
- **Authentication Flow**: Protected routes in the React app verify the active Supabase session. If no valid session is found, users are redirected to the login page.

---

## Future Improvements

- **Rich Text Editing**: Integrate a rich text editor (like TipTap or Quill) for the admin dashboard to allow formatted descriptions in portfolio items and FAQs.
- **Image Optimization Pipeline**: Implement automatic image resizing and WebP conversion on upload via Supabase Storage triggers to improve load times.
- **Analytics Dashboard**: Add a view in the admin panel to track page visits, inquiry conversion rates, and popular portfolio clicks.
- **Laravel API Integration**: Shift complex, long-running processes (like automated email responses or PDF invoice generation) to the Laravel backend.

---

## Repository Usage Notice

Thank you for checking out this repository! 

This project is shared publicly for learning, inspiration, and portfolio demonstration purposes. Visitors are entirely welcome to study the architecture, implementation details, and coding practices used here.

However, copying this project in its entirety, submitting it as academic work, redistributing it, or claiming it as your original work is not permitted. If you are inspired to build a similar project, you are highly encouraged to create your own unique implementation and adapt these ideas rather than copying the source code directly. 

Please respect the time, design, and engineering effort invested in developing this project.

---

## Contributing

Contributions, issues, and feature requests are welcome for discussion, but this repository is primarily a personal portfolio project and direct pull requests may not be accepted at this time.

---

## License

This project is intended for portfolio and educational purposes. All rights are reserved unless otherwise stated.

---

## Acknowledgements

- [React](https://react.dev/) & [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Laravel](https://laravel.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lenis](https://lenis.darkroom.engineering/)
- [Lucide Icons](https://lucide.dev/)

---

## Contact

- **Portfolio**: [Placeholder URL]
- **LinkedIn**: [Placeholder URL]
- **Email**: [Placeholder Email]
- **GitHub**: [Placeholder URL]
