"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", text: "Dashboard" },
  { href: "/templates", text: "Templates" },
  { href: "/pricing", text: "Pricing" },
  { href: "/contact", text: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    // ADDED w-full here to fix the spacing issue!
    <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
      <Link href="/" className="text-xl font-bold text-gray-900 tracking-tight">
        HireMeWeb
      </Link>
      <div className="flex items-center space-x-8">
        {" "}
        {/* Increased space-x-6 to space-x-8 for breathing room */}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "text-sm font-medium transition-colors hover:text-blue-600",
              pathname === item.href ? "text-blue-600" : "text-gray-500",
            )}
          >
            {item.text}
          </Link>
        ))}
        <Link
          href="/pricing"
          className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:scale-105 shadow-sm"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
