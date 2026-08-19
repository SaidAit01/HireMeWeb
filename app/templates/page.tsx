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
            Below are examples of the design architectures we use to build your
            site. Depending on your chosen <strong>Tier</strong>, we adapt the
            colors, typography, and content structure to perfectly match your
            industry and personal brand.
          </p>
        </div>

        {/* STATIC IMAGE MOCKUPS (No Database Links!) */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Persona 1: The Technologist */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                The Technologist
              </h3>
              <p className="text-xs font-semibold text-blue-600">
                Architecture for Engineering
              </p>
            </div>
            <div className="relative border-t border-gray-100 bg-gray-100 h-96 group">
              {/* Mock Browser Bar */}
              <div className="absolute top-0 w-full bg-white/90 backdrop-blur-sm px-3 py-2 flex gap-1.5 border-b border-gray-200 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-7 w-full h-[calc(100%-28px)] overflow-y-auto scrollbar-hide">
                {/* Image 1 */}
                <img
                  src="templates/tech.webp"
                  alt="Tech Portfolio Preview"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Persona 2: The Analyst */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                The Analyst
              </h3>
              <p className="text-xs font-semibold text-emerald-600">
                Architecture for Finance
              </p>
            </div>
            <div className="relative border-t border-gray-100 bg-gray-100 h-96 group">
              <div className="absolute top-0 w-full bg-white/90 backdrop-blur-sm px-3 py-2 flex gap-1.5 border-b border-gray-200 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-7 w-full h-[calc(100%-28px)] overflow-y-auto scrollbar-hide">
                {/* Image 2 */}
                <img
                  src="templates/analyst.avif"
                  alt="Finance Portfolio Preview"
                  className="w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Persona 3: The Creative */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 pb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                The Creative
              </h3>
              <p className="text-xs font-semibold text-purple-600">
                Architecture for Marketing
              </p>
            </div>
            <div className="relative border-t border-gray-100 bg-gray-100 h-96 group">
              <div className="absolute top-0 w-full bg-white/90 backdrop-blur-sm px-3 py-2 flex gap-1.5 border-b border-gray-200 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>
              <div className="absolute top-7 w-full h-[calc(100%-28px)] overflow-y-auto scrollbar-hide">
                {/* Image 3 */}
                <img
                  src="templates/creative.avif"
                  alt="Creative Portfolio Preview"
                  className="w-full object-cover"
                />
              </div>
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
