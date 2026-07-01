// apps\frontend\src\main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import App from "./App.tsx";
import { LenisProvider } from "./components/LenisProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </HelmetProvider>
  </StrictMode>,
);
