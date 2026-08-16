import Link from "next/link";
import { Pricing as PricingComponent } from "../../components/Pricing"; // Assuming your pricing component is here

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Transparent Pricing,{" "}
          <span className="text-blue-600">No Surprises.</span>
        </h1>
        <p className="text-lg text-gray-600">
          We believe in fair pricing for students. Claim your 50% graduate
          discount using your valid .ac.uk university email address at checkout.
        </p>
      </div>

      {/* Render your existing Pricing component here */}
      <PricingComponent />

      <div className="max-w-4xl mx-auto px-6 mt-20 space-y-8">
        <h3 className="text-2xl font-bold text-gray-900 text-center">
          Payment & Discount Details
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-blue-600 text-2xl mb-4">🎓</div>
            <h4 className="font-bold text-gray-900 mb-2">
              The 50% Graduate Discount
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our standard retail price for a custom Next.js portfolio starts at
              £198. If you are a current student or graduated within the last 2
              years, you qualify for the 50% off Student Rate (starting at £99).
              You MUST verify this using your university email during
              onboarding.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="text-blue-600 text-2xl mb-4">💳</div>
            <h4 className="font-bold text-gray-900 mb-2">Secure 50% Deposit</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              We process all payments securely via Stripe. To begin engineering
              your portfolio, we only require a 50% upfront deposit. The
              remaining 50% is only billed once you are completely satisfied and
              your live website is deployed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
