import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-gray-900 tracking-tight"
            >
              HireMe<span className="text-blue-600">Web</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              We engineer custom, recruiter-optimized portfolio websites to help
              UK students and graduates bypass the algorithm and land their
              dream jobs.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  href="/templates"
                  className="hover:text-blue-600 transition-colors"
                >
                  Architectures
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-blue-600 transition-colors"
                >
                  Pricing & Tiers
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="hover:text-blue-600 transition-colors"
                >
                  Student Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a
                  href="mailto:hello@hiremeweb.co.uk"
                  className="hover:text-blue-600 transition-colors"
                >
                  hello@hiremeweb.co.uk
                </a>
              </li>
              <li className="pt-2">
                <span className="block font-medium text-gray-900 mb-1">
                  Legal
                </span>
                <Link
                  href="/terms"
                  className="hover:text-blue-600 transition-colors block mb-2"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-blue-600 transition-colors block"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} HireMeWeb UK. All rights reserved.
          </p>
          <div className="text-gray-400 text-xs">
            Designed for UK University Students.
          </div>
        </div>
      </div>
    </footer>
  );
}
