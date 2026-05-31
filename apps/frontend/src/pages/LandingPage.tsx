// apps\frontend\src\pages\LandingPage.tsx
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { About } from "../components/sections/About";
import { Services } from "../components/sections/Services";
import { Rates } from "../components/sections/Rates";
import { Portfolio } from "../components/sections/Portfolio";
import { Proofs } from "../components/sections/Proofs";
import { Testimonials } from "../components/sections/Testimonials";
import { FAQ } from "../components/sections/FAQ";
import { Contact } from "../components/sections/Contact";

import { FloatingContact } from "../components/ui/FloatingContact";
import { fetchPublicContent } from "../lib/publicContent";
import type { PublicContent } from "../lib/publicContent";

export function LandingPage() {
  const [content, setContent] = useState<PublicContent>({});

  useEffect(() => {
    let mounted = true;

    fetchPublicContent()
      .then((data) => {
        if (mounted) setContent(data);
      })
      .catch(() => {
        if (mounted) setContent({});
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Janine Ayven Dequiros | Virtual Assistant</title>

        <meta
          name="description"
          content="Janine Ayven Dequiros - Virtual Assistant specializing in social media management, graphic design, illustration, research assistance, and creative support."
        />
      </Helmet>

      <Header />

      <main className="overflow-hidden">
        <Hero />
        <Stats />
        <About />
        <Services
          services={content.services?.length ? content.services : undefined}
        />
        <Rates
          rateCategories={
            content.rateCategories?.length ? content.rateCategories : undefined
          }
        />
        <Portfolio
          categories={
            content.categories?.length ? content.categories : undefined
          }
          portfolioItems={
            content.portfolioItems?.length ? content.portfolioItems : undefined
          }
        />
        <Proofs
          proofs={content.proofItems?.length ? content.proofItems : undefined}
        />
        <Testimonials
          testimonials={
            content.testimonials?.length ? content.testimonials : undefined
          }
        />
        <FAQ faqs={content.faqs?.length ? content.faqs : undefined} />
        <Contact />
      </main>

      <Footer />

      <FloatingContact />
    </>
  );
}
