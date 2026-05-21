import { Helmet } from "react-helmet-async";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { Services } from "../components/sections/Services";
import { Portfolio } from "../components/sections/Portfolio";
import { Proofs } from "../components/sections/Proofs";
import { About } from "../components/sections/About";
import { Testimonials } from "../components/sections/Testimonials";
import { Packages } from "../components/sections/Packages";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/layout/Footer";

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Janine Dequiros | Premium Virtual Assistant</title>
      </Helmet>

      <Header />

      <main className="overflow-hidden">
        <Hero />
        <Stats />
        <Services />
        <Portfolio />
        <Proofs />
        <About />
        <Testimonials />
        <Packages />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
