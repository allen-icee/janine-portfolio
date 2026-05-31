// apps\frontend\src\App.tsx
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((module) => ({
    default: module.LandingPage,
  })),
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((module) => ({
    default: module.AdminDashboard,
  })),
);
const AdminLogin = lazy(() =>
  import("./pages/AdminLogin").then((module) => ({
    default: module.AdminLogin,
  })),
);
const AdminFaqsPage = lazy(() =>
  import("./pages/admin/AdminFaqsPage").then((module) => ({
    default: module.AdminFaqsPage,
  })),
);
const AdminInquiriesPage = lazy(() =>
  import("./pages/admin/AdminInquiriesPage").then((module) => ({
    default: module.AdminInquiriesPage,
  })),
);
const AdminPortfolioPage = lazy(() =>
  import("./pages/admin/AdminPortfolioPage").then((module) => ({
    default: module.AdminPortfolioPage,
  })),
);
const AdminRatesPage = lazy(() =>
  import("./pages/admin/AdminRatesPage").then((module) => ({
    default: module.AdminRatesPage,
  })),
);
const AdminProofsPage = lazy(() =>
  import("./pages/admin/AdminProofsPage").then((module) => ({
    default: module.AdminProofsPage,
  })),
);
const AdminTestimonialsPage = lazy(() =>
  import("./pages/admin/AdminTestimonialsPage").then((module) => ({
    default: module.AdminTestimonialsPage,
  })),
);
const AdminProfilePage = lazy(() =>
  import("./pages/admin/AdminProfilePage").then((module) => ({
    default: module.AdminProfilePage,
  })),
);
function AppFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f9f6f3] text-[#3c232c]">
      <div className="rounded-2xl border border-[#efdad0] bg-white/70 px-6 py-4 text-sm font-bold shadow-sm">
        Loading JaneDesk...
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            border: "1px solid #efdad0",
            background: "#fffaf7",
            color: "#3c232c",
          },
        }}
      />
      <Suspense fallback={<AppFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
          <Route path="/admin/rates" element={<AdminRatesPage />} />
          <Route path="/admin/proofs" element={<AdminProofsPage />} />
          <Route
            path="/admin/testimonials"
            element={<AdminTestimonialsPage />}
          />
          <Route path="/admin/faqs" element={<AdminFaqsPage />} />
          <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
