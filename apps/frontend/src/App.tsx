import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { AdminFaqsPage } from './pages/admin/AdminFaqsPage'
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage'
import { AdminProofsPage } from './pages/admin/AdminProofsPage'
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
        <Route path="/admin/proofs" element={<AdminProofsPage />} />
        <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
        <Route path="/admin/faqs" element={<AdminFaqsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
