import Link from "next/link";
import { Pricing } from "../components/Pricing";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-900 overflow-hidden">
      {/* 1. HERO SECTION (Main Service) */}
      <section className="w-full px-6 py-24 sm:py-32 flex flex-col items-center text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-800 shadow-sm">
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
          Trusted by UK Students and Graduates
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
            Land Your Dream Job with a{" "}
            <span className="text-blue-600">Standout Portfolio</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Don't let your paper CV get lost in the pile. We build professional,
            stunning personal websites for students and graduates to help you
            secure interviews faster.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            href="#pricing"
            className="rounded-md bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-105"
          >
            View Student Pricing
          </Link>
          <Link
            href="#features"
            className="rounded-md bg-white border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm transition-all hover:bg-gray-50"
          >
            See Why We're Different
          </Link>
        </div>
      </section>
      {/* ADD How it Works */}

      {/* 2.5 HOW IT WORKS (The 3-Step Process) */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 border-t border-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            From checkout to a live professional portfolio, We handle all the
            heavy lifting.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line behind the steps (desktop only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-blue-100 -z-10 w-2/3 mx-auto"></div>

          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md border-4 border-white">
              1
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Secure Your Spot
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose your package and pay a secure 50% deposit to get started.
              No hidden fees.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md border-4 border-white">
              2
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Submit Your Data
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Log into your student dashboard, fill out our quick intake form,
              and upload your current CV.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center relative z-10">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md border-4 border-white">
              3
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Go Live</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We build, optimize, and host your new portfolio. You receive your
              live link and digital business card in 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* 2. PRICING SECTION (Transparency First) */}
      <div id="pricing" className="w-full">
        <Pricing />
      </div>

      {/* 3. THE FEATURES & DIFFERENTIATORS (Why Choose Us) */}
      <section id="features" className="w-full max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Why HireMeWeb is Different
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Generic website builders like Wix or Squarespace are bloated and
            time-consuming. We hand-craft fast, recruiter-approved tools
            designed specifically to get you hired.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Feature 1: The Digital Business Card */}
          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl border border-blue-100">
              📱
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              The Frictionless Networking Card
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Stop carrying stacks of paper CVs that end up in the bin. Every
              HireMeWeb portfolio comes with a custom, mobile-optimized Digital
              Business Card.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>{" "}
                <strong>Zero apps required:</strong> Recruiters simply scan your
                screen.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>{" "}
                <strong>Instant impact:</strong> Your portfolio loads on their
                phone instantly.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span>{" "}
                <strong>Eco-Friendly:</strong> Stand out, save paper, get hired.
              </li>
            </ul>
          </div>

          {/* Feature 2: Recruiter Analytics */}
          <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-2xl border border-blue-100">
              📊
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Live Recruiter Analytics
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Ever wonder if hiring managers actually read your CV? Now you will
              know for sure. We integrate professional analytics into every
              build.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span> Track how
                many recruiters view your profile.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span> See which of
                your projects gets clicked the most.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">✓</span> Get monthly
                traffic reports sent to your email.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. THE VALUE STACK BUNDLE (Redesigned to match the brand) */}
      <section className="w-full max-w-3xl mx-auto mb-32 px-6">
        <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
          {/* Subtle blue top border accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">
            The Complete Graduate Career Bundle
          </h2>

          <div className="space-y-4 mb-8 text-left max-w-md mx-auto text-gray-700 font-medium">
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span>Premium Next.js Portfolio Build</span>
              <span className="line-through text-gray-400">£350</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span>1-Year Custom Domain & Hosting</span>
              <span className="line-through text-gray-400">£50</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span>Mobile QR Networking Card</span>
              <span className="line-through text-gray-400">£50</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-3">
              <span>LinkedIn Brand Match Kit</span>
              <span className="line-through text-gray-400">£20</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <div className="text-center sm:text-right">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">
                Total Value: £470
              </p>
              <p className="text-4xl font-extrabold text-blue-600">
                Student Price: £99
              </p>
            </div>
            <Link
              href="/pricing"
              className="rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
            >
              Claim Your Bundle
            </Link>
          </div>
        </div>
      </section>
      {/* 6. CREATIVE FAQ SECTION */}
      <section className="w-full relative py-32 overflow-hidden bg-white">
        {/* Soft background aesthetic blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Got Questions?
            </h2>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto text-lg">
              Everything you need to know before securing your portfolio build.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* FAQ Card 1 */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300 text-xl">
                  💻
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Do I need to know how to code?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Not at all. We handle 100% of the design, development, and
                  hosting. You simply fill out an intake form with your
                  experience, and our engineering team does the rest.
                </p>
              </div>
            </div>

            {/* FAQ Card 2 */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300 text-xl">
                  🎓
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  What if I don't have much experience?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  That is completely fine. Our templates are specifically
                  designed for graduates, highlighting your university modules,
                  academic projects, and core skills over corporate experience.
                </p>
              </div>
            </div>

            {/* FAQ Card 3 */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300 text-xl">
                  🛡️
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Are there hidden hosting fees?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Your first year of enterprise-grade hosting and domain
                  connection is completely included in the upfront price. No
                  hidden fees, no surprises.
                </p>
              </div>
            </div>

            {/* FAQ Card 4 */}
            <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 group-hover:scale-110 transition-transform duration-300 text-xl">
                  🔄
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  Can I update my site later?
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  Yes! If you land a new internship or finish a new personal
                  project, just send us an email. We offer minor text and
                  project updates to keep your site fresh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
