import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import Layout from "@/components/Layout";
import Services from "@/pages/Services";
import CircuitDetail from "@/pages/CircuitDetail";

const Home = lazy(() => import("@/pages/Home"));
const FrenchHome = lazy(() => import("@/pages/FrenchHome"));
const FrenchCommercialLanding = lazy(() => import("@/pages/FrenchCommercialLanding"));
const Circuits = lazy(() => import("@/pages/Circuits"));
const Destinations = lazy(() => import("@/pages/Destinations"));
const DestinationDetail = lazy(() => import("@/pages/DestinationDetail"));
const About = lazy(() => import("@/pages/About"));
const MICE = lazy(() => import("@/pages/MICE"));
const B2B = lazy(() => import("@/pages/B2B"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const Contact = lazy(() => import("@/pages/Contact"));
const Quote = lazy(() => import("@/pages/Quote"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const DmcMoroccoLanding = lazy(() =>
  import("@/pages/SEOLandingPage").then((module) => ({ default: module.DmcMoroccoLanding })),
);
const IncomingAgencyMoroccoLanding = lazy(() =>
  import("@/pages/SEOLandingPage").then((module) => ({ default: module.IncomingAgencyMoroccoLanding })),
);
const MoroccoToursForTravelAgenciesLanding = lazy(() =>
  import("@/pages/SEOLandingPage").then((module) => ({ default: module.MoroccoToursForTravelAgenciesLanding })),
);
const MoroccoGroupToursLanding = lazy(() =>
  import("@/pages/SEOLandingPage").then((module) => ({ default: module.MoroccoGroupToursLanding })),
);
const MiceMoroccoLanding = lazy(() =>
  import("@/pages/SEOLandingPage").then((module) => ({ default: module.MiceMoroccoLanding })),
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="min-h-[50vh] grid place-items-center bg-[#F9F7F4]" role="status" aria-live="polite">
            <span className="text-sm text-[#4B5563]">Loading…</span>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/fr" element={<FrenchHome />} />
            <Route path="/circuits" element={<Circuits />} />
            <Route path="/fr/circuits" element={<Circuits />} />
            <Route path="/circuits/:slug" element={<CircuitDetail />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:slug" element={<DestinationDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/fr/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/fr/about" element={<About />} />
            <Route path="/mice" element={<MICE />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/quote" element={<Quote />} />
            <Route path="/fr/quote" element={<Quote />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dmc-morocco" element={<DmcMoroccoLanding />} />
            <Route path="/incoming-agency-morocco" element={<IncomingAgencyMoroccoLanding />} />
            <Route path="/fr/incoming-agency-morocco" element={<FrenchCommercialLanding pageKey="incomingAgency" />} />
            <Route path="/morocco-tours-for-travel-agencies" element={<MoroccoToursForTravelAgenciesLanding />} />
            <Route path="/fr/morocco-tours-for-travel-agencies" element={<FrenchCommercialLanding pageKey="toursForAgencies" />} />
            <Route path="/morocco-group-tours" element={<MoroccoGroupToursLanding />} />
            <Route path="/mice-morocco" element={<MiceMoroccoLanding />} />
            <Route path="/fr/mice-morocco" element={<FrenchCommercialLanding pageKey="miceMorocco" />} />
            <Route path="/fr/circuits/:slug" element={<CircuitDetail />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminDashboard />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
