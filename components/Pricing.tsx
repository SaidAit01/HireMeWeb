import Link from "next/link";
import clsx from "clsx";

const tiers = [
  {
    name: "Basic",
    target: "Budget-conscious grads",
    retailPrice: 198,
    studentPrice: 99,
    features: [
      "Single-page layout",
      "About Me & Education",
      "Simple contact form",
      "2-3 Days delivery",
    ],
    recommended: false,
  },
  {
    name: "Standard",
    target: "Most popular choice",
    retailPrice: 398,
    studentPrice: 199,
    features: [
      "Multi-page layout",
      "Project/Case Study gallery",
      "Downloadable CV button",
      "5-7 Days delivery",
    ],
    recommended: true,
  },
  {
    name: "Complex",
    target: "Tech/Design grads",
    retailPrice: 798,
    studentPrice: 399,
    features: [
      "Fully custom design",
      "CMS (blog/updates)",
      "SEO optimization",
      "10-14 Days delivery",
    ],
    recommended: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-white sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Exclusive 50% Discount for UK Students
          </p>
        </div>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={clsx(
                tier.recommended
                  ? "ring-2 ring-blue-600"
                  : "ring-1 ring-gray-200",
                "rounded-3xl p-8 xl:p-10 transition-all hover:scale-105 bg-white",
              )}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">
                  {tier.name}
                </h3>
                {tier.recommended && (
                  <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
                    Most Popular
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                {tier.target}
              </p>
              <div className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  £{tier.studentPrice}
                </span>
                <span className="text-sm font-semibold leading-6 text-gray-400 line-through">
                  £{tier.retailPrice}
                </span>
              </div>
              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      className="h-6 w-5 flex-none text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/onboarding"
                className={clsx(
                  tier.recommended
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-blue-600 ring-1 ring-inset ring-blue-200 hover:ring-blue-300",
                  "mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                )}
              >
                Select {tier.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
