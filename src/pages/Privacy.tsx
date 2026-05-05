import { Helmet } from "react-helmet-async";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Suenos Travel</title>
        <meta name="description" content="Privacy policy of Suenos Travel DMC Morocco." />
      </Helmet>

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-[#1F2937] mb-8">Privacy Policy</h1>
          <div className="prose text-[#4B5563] space-y-4">
            <p>Last updated: January 1, 2026</p>
            <p>Suenos Travel respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Information We Collect</h2>
            <p>We may collect personal information including your name, email address, phone number, company name, and travel preferences when you contact us or request a quote.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">How We Use Your Information</h2>
            <p>We use your information to respond to inquiries, provide quotes, process bookings, and improve our services. We do not sell or share your personal data with third parties for marketing purposes.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Data Security</h2>
            <p>We implement appropriate security measures to protect your personal data from unauthorized access, alteration, or disclosure.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Contact</h2>
            <p>If you have any questions about this privacy policy, please contact us at resa@suenos-travel.com.</p>
          </div>
        </div>
      </section>
    </>
  );
}
