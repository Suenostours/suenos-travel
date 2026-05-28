import SEO from "@/components/SEO";

export default function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Suenos Travel"
        description="Terms and conditions of Suenos Travel DMC Morocco."
        canonical="/terms"
        noindex
      />

      <section className="bg-[#F9F7F4] py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold text-[#1F2937] mb-8">Terms & Conditions</h1>
          <div className="prose text-[#4B5563] space-y-4">
            <p>Last updated: January 1, 2026</p>
            <p>By using the services of Suenos Travel, you agree to these terms and conditions. Please read them carefully.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Bookings & Payments</h2>
            <p>All bookings are subject to availability and confirmation. A deposit may be required to secure reservations. Full payment terms will be specified in your quotation.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Cancellations</h2>
            <p>Cancellation policies vary by service and will be clearly communicated in your booking confirmation. Generally, cancellations made 30 days or more before arrival may be eligible for partial refund minus administrative fees.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Liability</h2>
            <p>Suenos Travel acts as an intermediary between clients and local service providers. While we carefully select our partners, we are not liable for incidents caused by third-party suppliers.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Travel Insurance</h2>
            <p>We strongly recommend that all travelers obtain comprehensive travel insurance covering medical expenses, trip cancellation, and personal belongings.</p>
            <h2 className="text-xl font-bold text-[#1F2937] mt-6">Contact</h2>
            <p>For any questions regarding these terms, please contact us at resa@suenos-travel.com.</p>
          </div>
        </div>
      </section>
    </>
  );
}
