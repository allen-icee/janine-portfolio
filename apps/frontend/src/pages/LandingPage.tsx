import { Helmet } from "react-helmet-async";

import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Portfolio } from "../components/sections/Portfolio";
import { Proofs } from "../components/sections/Proofs";
import { Testimonials } from "../components/sections/Testimonials";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";

import { FloatingContact } from "../components/ui/FloatingContact";

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Janine Ayven Dequiros | Virtual Assistant</title>

        <meta
          name="description"
          content="Janine Ayven Dequiros — Virtual Assistant specializing in social media management, graphic design, illustration, research assistance, and creative support."
        />
      </Helmet>

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="overflow-hidden">
        <Hero />
        <Stats />
        <About />
        <Services />
        <Portfolio />
        <Proofs />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING CONTACT BUTTONS */}
      <FloatingContact />
    </>
  );
}
