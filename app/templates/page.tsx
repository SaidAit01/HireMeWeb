import Link from "next/link";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* HERO SECTION */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Recruiter-Optimized{" "}
            <span className="text-blue-600">Architectures</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            We don't use bloated website builders. Below are our live
            foundational architectures. Depending on your chosen{" "}
            <strong>Tier</strong>, we adapt the colors, typography, and content
            structure to perfectly match your industry and personal brand.
          </p>
        </div>

        {/* HOW IT ADAPTS SECTION */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="font-bold text-gray-900 mb-2">Custom Branding</h3>
            <p className="text-sm text-gray-600">
              Your chosen color palette, fonts, and visual identity are applied
              to the base structure.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-2xl mb-3">⚙️</div>
            <h3 className="font-bold text-gray-900 mb-2">
              Tier-Based Features
            </h3>
            <p className="text-sm text-gray-600">
              Standard and Complex tiers unlock custom domains, advanced
              analytics, and deeper case studies.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-bold text-gray-900 mb-2">
              Responsive by Default
            </h3>
            <p className="text-sm text-gray-600">
              Every adaptation perfectly resizes for mobile, ensuring your
              Digital Networking Card looks flawless.
            </p>
          </div>
        </div>

        {/* LIVE EXAMPLES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Persona 1: Software Engineer */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 text-xl border border-blue-100">
                💻
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                The Technologist
              </h3>
              <p className="text-sm font-semibold text-blue-600 mb-4">
                Live Example: Software Engineering
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Adapted for technical roles. Heavily emphasizes GitHub
                repositories, tech stacks, and live project links. Features
                high-contrast, modern styling.
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              {/* NOTE: Replace 'INSERT-DAVIDS-ID-HERE' with the real Supabase ID */}
              <Link
                href="/portfolio/2fc2b954-1c8f-4e43-84cd-df83b8a1f134"
                target="_blank"
                className="block w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-center font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-sm"
              >
                View Live Example ↗
              </Link>
            </div>
          </div>

          {/* Persona 2: Finance / Corporate */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 text-xl border border-emerald-100">
                📊
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                The Analyst
              </h3>
              <p className="text-sm font-semibold text-emerald-600 mb-4">
                Live Example: Corporate Finance
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Engineered for Finance, Consulting, and Business graduates.
                Focuses on clean typography, ROI metrics, academic achievements,
                and executive summaries.
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              {/* NOTE: Replace 'INSERT-SARAHS-ID-HERE' with the real Supabase ID */}
              <Link
                href="/portfolio/Iaa06ea8a-bbc6-4f69-8fa6-b35982ee407d"
                target="_blank"
                className="block w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-center font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-sm"
              >
                View Live Example ↗
              </Link>
            </div>
          </div>

          {/* Persona 3: Creative / Marketing */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
            <div className="p-8 flex-grow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 text-xl border border-purple-100">
                ✨
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                The Creative
              </h3>
              <p className="text-sm font-semibold text-purple-600 mb-4">
                Live Example: Marketing & Design
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Adapted for visually driven roles. Utilizes bold color accents,
                expansive project galleries, and narrative-driven case studies
                to showcase creative flair.
              </p>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
              {/* NOTE: Replace 'INSERT-EMMAS-ID-HERE' with the real Supabase ID */}
              <Link
                href="/portfolio/d596c374-643b-4a71-8d90-ec1a6a1f67f5"
                target="_blank"
                className="block w-full py-3 px-4 bg-white border border-gray-300 rounded-xl text-center font-bold text-gray-900 hover:bg-gray-900 hover:text-white transition-colors shadow-sm"
              >
                View Live Example ↗
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-20 text-center bg-blue-600 rounded-3xl p-12 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">
            Ready to build your digital presence?
          </h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">
            Choose your tier, submit your CV, and let our team engineer a
            portfolio tailored specifically to your industry and brand.
          </p>
          <Link
            href="/#pricing"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-md relative z-10"
          >
            View Pricing & Tiers
          </Link>
        </div>
      </div>
    </main>
  );
}
