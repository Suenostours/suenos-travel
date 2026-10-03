import { Suspense } from "react";
import { Route, Routes } from "react-router";
import Layout from "@/components/Layout";
import About from "@/pages/About";
import CircuitDetail from "@/pages/CircuitDetail";
import Circuits from "@/pages/Circuits";
import FrenchCommercialLanding from "@/pages/FrenchCommercialLanding";
import FrenchHome from "@/pages/FrenchHome";
import Home from "@/pages/Home";
import Quote from "@/pages/Quote";
import Services from "@/pages/Services";
import {
  IncomingAgencyMoroccoLanding,
  MiceMoroccoLanding,
  MoroccoToursForTravelAgenciesLanding,
} from "@/pages/SEOLandingPage";

export default function ServerApp() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] grid place-items-center bg-[#F9F7F4]" role="status" aria-live="polite">
          <span className="text-sm text-[#4B5563]">Loading…</span>
        </div>
      }
    >
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/fr" element={<FrenchHome />} />
          <Route path="/services" element={<Services />} />
          <Route path="/fr/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/fr/about" element={<About />} />
          <Route path="/circuits" element={<Circuits />} />
          <Route path="/fr/circuits" element={<Circuits />} />
          <Route path="/circuits/:slug" element={<CircuitDetail />} />
          <Route path="/fr/circuits/:slug" element={<CircuitDetail />} />
          <Route path="/quote" element={<Quote />} />
          <Route path="/fr/quote" element={<Quote />} />
          <Route path="/incoming-agency-morocco" element={<IncomingAgencyMoroccoLanding />} />
          <Route path="/fr/incoming-agency-morocco" element={<FrenchCommercialLanding pageKey="incomingAgency" />} />
          <Route path="/morocco-tours-for-travel-agencies" element={<MoroccoToursForTravelAgenciesLanding />} />
          <Route path="/fr/morocco-tours-for-travel-agencies" element={<FrenchCommercialLanding pageKey="toursForAgencies" />} />
          <Route path="/mice-morocco" element={<MiceMoroccoLanding />} />
          <Route path="/fr/mice-morocco" element={<FrenchCommercialLanding pageKey="miceMorocco" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
