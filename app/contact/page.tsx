"use client"; // <-- This is the magic line that fixes the error!

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Contact Our Team
          </h1>
          <p className="text-gray-600">
            Have a question about our process or need help with an existing
            order? We are here to help.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 sm:p-12">
          <div className="grid sm:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Email Us
                </h3>
                <a
                  href="mailto:hello@hiremeweb.co.uk"
                  className="text-lg font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  hello@hiremeweb.co.uk
                </a>
                <p className="text-sm text-gray-500 mt-2">
                  We aim to respond to all inquiries within 24 hours.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Office Hours
                </h3>
                <p className="text-gray-900 font-medium">Monday - Friday</p>
                <p className="text-gray-500 text-sm">9:00 AM - 6:00 PM (GMT)</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Company Info
                </h3>
                <p className="text-gray-900 font-medium">HireMeWeb UK</p>
                <p className="text-gray-500 text-sm">
                  Dedicated to helping UK students and graduates launch their
                  careers.
                </p>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4">
                Send a quick message
              </h3>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message sent! We will reply shortly.");
                }}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="How can we help?"
                    rows={4}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-lg hover:bg-gray-800 transition-colors text-sm"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
