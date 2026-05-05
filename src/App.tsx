import { Routes, Route } from "react-router";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Circuits from "@/pages/Circuits";
import CircuitDetail from "@/pages/CircuitDetail";
import Destinations from "@/pages/Destinations";
import DestinationDetail from "@/pages/DestinationDetail";
import Services from "@/pages/Services";
import About from "@/pages/About";
import MICE from "@/pages/MICE";
import B2B from "@/pages/B2B";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Contact from "@/pages/Contact";
import Quote from "@/pages/Quote";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/circuits" element={<Circuits />} />
        <Route path="/circuits/:slug" element={<CircuitDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/mice" element={<MICE />} />
        <Route path="/b2b" element={<B2B />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<AdminDashboard />} />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
