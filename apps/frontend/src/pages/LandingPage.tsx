import { Helmet } from "react-helmet-async";
import { Header } from "../components/layout/Header";
import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Portfolio } from "../components/sections/Portfolio";
import { Proofs } from "../components/sections/Proofs";
import { Testimonials } from "../components/sections/Testimonials";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";
import { Footer } from "../components/layout/Footer";

export function LandingPage() {
  return (
    <>
      <Helmet>
        {/* Full name explicitly set here */}
        <title>Janine Ayven Dequiros | Virtual Assistant</title>
      </Helmet>

      <Header />

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

      <Footer />
    </>
  );
}
