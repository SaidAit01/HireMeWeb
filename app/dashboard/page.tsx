import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex-1 bg-gray-50 py-12 px-6 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Welcome back, Buddy
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Track your portfolio build and manage your files.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          {/* 1. Hero Tile: Project Status (Spans 2 columns) */}
          <div className="md:col-span-2 rounded-3xl bg-white p-8 sm:p-10 border border-gray-200 shadow-sm flex flex-col justify-center transition-shadow hover:shadow-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Build Status</h2>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-sm font-semibold inline-block text-center">
                In Progress
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full relative"
                style={{ width: "50%" }}
              >
                {/* Pulse indicator at the end of the bar */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 bg-blue-600 border-4 border-white rounded-full"></div>
              </div>
            </div>

            <div className="flex justify-between text-sm font-medium mb-6">
              <span className="text-gray-500">Order Placed</span>
              <span className="text-blue-600 font-bold">First Draft</span>
              <span className="text-gray-400">Final Delivery</span>
            </div>

            <p className="mt-auto text-gray-600 text-sm leading-relaxed">
              Our team is currently designing your first draft. We will send you
              a private review link via WhatsApp within the next 48 hours to get
              your feedback before finalising the build.
            </p>
          </div>

          {/* 2. Accent Tile: Quick Action (Fitts's Law applied) */}
          <div className="rounded-3xl bg-blue-600 p-8 border border-blue-700 shadow-sm text-white flex flex-col justify-between transition-transform hover:-translate-y-1">
            <div>
              <h2 className="text-xl font-bold mb-3">Missing Files?</h2>
              <p className="text-blue-100 text-sm leading-relaxed">
                Forgot to include a project? You can still upload an updated CV
                or a new professional headshot for us to use.
              </p>
            </div>
            <button className="mt-8 w-full bg-white text-blue-600 font-bold py-3.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              Upload Documents
            </button>
          </div>

          {/* 3. Feature Tile: Order Details */}
          <div className="rounded-3xl bg-white p-8 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span>Package:</span>
                <span className="font-semibold text-gray-900">
                  Standard Tier
                </span>
              </li>
              <li className="flex justify-between items-center border-b border-gray-100 pb-3">
                <span>Target Delivery:</span>
                <span className="font-semibold text-gray-900">Oct 24</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  £100 (50% Deposit)
                </span>
              </li>
            </ul>
          </div>

          {/* 4. Feature Tile: Support & Communication */}
          <div className="md:col-span-2 rounded-3xl bg-white p-8 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Need Help?</h2>
              <p className="text-gray-600 text-sm mt-2">
                Have a question about your build? Chat directly with your
                assigned designer on WhatsApp.
              </p>
            </div>
            <button className="w-full sm:w-auto whitespace-nowrap bg-gray-900 text-white font-semibold py-3.5 px-8 rounded-xl hover:bg-gray-800 transition-colors">
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
