import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600">
            Last Updated: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12 space-y-8 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p>
              Welcome to HireMeWeb ("we", "our", "us"). By using our website and
              purchasing our digital portfolio engineering services, you ("the
              Client", "the Student") agree to be bound by the following Terms
              of Service. Please read them carefully before submitting your
              onboarding details or paying a deposit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              2. Services & Scope of Work
            </h2>
            <p>
              HireMeWeb provides custom-coded portfolio websites engineered
              specifically for UK university graduates. The specific features,
              sections, and design architecture delivered to you will depend on
              the Tier (Basic, Standard, or Complex) selected during checkout.
              Any additional requests outside the scope of your selected tier
              may incur additional development fees.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              3. Payments & 50% Deposit Policy
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Deposit:</strong> To commence development, a 50%
                non-refundable upfront deposit is required. This secures your
                spot in our engineering queue.
              </li>
              <li>
                <strong>Final Payment:</strong> The remaining 50% balance is due
                upon completion and your approval of the final portfolio, prior
                to the live domain handover.
              </li>
              <li>
                <strong>Student Discount:</strong> The 50% graduate discount is
                strictly reserved for current students or those who have
                graduated within the last 2 years. We reserve the right to
                verify this via your .ac.uk email address.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              4. Client Responsibilities
            </h2>
            <p>
              To ensure timely delivery, the Client must provide all necessary
              materials (CV, personal bio, project links, and images) during the
              onboarding process. Delays in providing this information will
              result in a delay in the delivery of your portfolio. We are not
              responsible for spelling errors or inaccurate information provided
              in your submitted CV.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              5. Hosting, Domains, and Maintenance
            </h2>
            <p>
              For relevant tiers, the initial purchase includes the first 12
              months of hosting and custom domain registration.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong>Renewals:</strong> After 12 months, an optional "Keep It
                Live" retainer (e.g., £29/year) will apply to maintain hosting,
                domain renewal, and allow for one minor CV update per year.
              </li>
              <li>
                If the Client chooses not to renew, the portfolio will be taken
                offline, though the codebase remains the property of HireMeWeb.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              6. Revisions
            </h2>
            <p>
              We want you to be thrilled with your digital presence. Each
              project includes one round of minor revisions (e.g., text tweaks,
              image swaps, color adjustments) prior to final deployment.
              Complete structural changes or complete redesigns after the
              initial build has commenced are not covered by standard revisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              7. Intellectual Property
            </h2>
            <p>
              The Client retains all ownership and copyright of their personal
              content (text, project descriptions, and personal photos).
              HireMeWeb retains ownership of the underlying Next.js codebase,
              proprietary templates, and structural architectures used to
              engineer the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              8. Contact
            </h2>
            <p>
              If you have any questions regarding these terms, please contact us
              at{" "}
              <a
                href="mailto:hello@hiremeweb.co.uk"
                className="text-blue-600 font-bold hover:underline"
              >
                hello@hiremeweb.co.uk
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
