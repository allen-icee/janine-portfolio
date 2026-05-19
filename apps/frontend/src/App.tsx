import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminLogin } from './pages/AdminLogin'
import { AdminFaqsPage } from './pages/admin/AdminFaqsPage'
import { AdminClientsPage } from './pages/admin/AdminClientsPage'
import { AdminFinancePage } from './pages/admin/AdminFinancePage'
import { AdminInquiriesPage } from './pages/admin/AdminInquiriesPage'
import { AdminPortfolioPage } from './pages/admin/AdminPortfolioPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { AdminProofsPage } from './pages/admin/AdminProofsPage'
import { AdminServicesPage } from './pages/admin/AdminServicesPage'
import { AdminTestimonialsPage } from './pages/admin/AdminTestimonialsPage'
import { LandingPage } from './pages/LandingPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfilePage />} />
        <Route path="/admin/services" element={<AdminServicesPage />} />
        <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
        <Route path="/admin/proofs" element={<AdminProofsPage />} />
        <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
        <Route path="/admin/faqs" element={<AdminFaqsPage />} />
        <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
        <Route path="/admin/clients" element={<AdminClientsPage />} />
        <Route path="/admin/finance" element={<AdminFinancePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
