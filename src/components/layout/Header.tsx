"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceCategories = [
  {
    title: "GOVCON Services",
    href: "/services/govcon",
    description: "Win federal contracts with strategic diagnosis",
    count: "8 Services",
    accent: "govcon",
  },
  {
    title: "SLED Services",
    href: "/services/sled",
    description: "Dominate state, local, and education markets",
    count: "8 Services",
    accent: "govcon",
  },
  {
    title: "IT Services",
    href: "/services/it",
    description: "Enterprise architecture at startup speed",
    count: "2 Services",
    accent: "it",
  },
  {
    title: "Writing Services",
    href: "/services/writing",
    description: "Strategic content, not AI-generated slop",
    count: "6 Services",
    accent: "writing",
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-900/95 backdrop-blur-sm border-b border-navy-700">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-bold text-white group-hover:text-gold-400 transition-colors">
              Aliff
              <span className="text-gold-400">.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-gold-400 font-medium transition-colors"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 text-gray-300 hover:text-gold-400 font-medium transition-colors">
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Mega Menu Dropdown */}
              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[600px] bg-navy-800 rounded-xl shadow-2xl border border-navy-700 p-6 animate-fade-in">
                  <div className="grid grid-cols-2 gap-4">
                    {serviceCategories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="group p-4 rounded-lg hover:bg-navy-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors">
                            {category.title}
                          </h3>
                          <span className="text-xs font-medium text-gray-400 bg-navy-700 px-2 py-1 rounded">
                            {category.count}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300">{category.description}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/for-agencies"
              className="text-gray-300 hover:text-gold-400 font-medium transition-colors"
            >
              For Agencies
            </Link>

            <Link
              href="/about"
              className="text-gray-300 hover:text-gold-400 font-medium transition-colors"
            >
              About
            </Link>

            <Link
              href="/careers"
              className="text-gray-300 hover:text-gold-400 font-medium transition-colors"
            >
              Careers
            </Link>

            <Link
              href="/contact"
              className="text-gray-300 hover:text-gold-400 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link href="/contact">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-gold-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-navy-700 animate-slide-down">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-gold-400 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Services Section */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Services
                </div>
                {serviceCategories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block pl-4 py-2 text-gray-300 hover:text-gold-400 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>

              <Link
                href="/for-agencies"
                className="text-gray-300 hover:text-gold-400 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Agencies
              </Link>

              <Link
                href="/about"
                className="text-gray-300 hover:text-gold-400 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>

              <Link
                href="/careers"
                className="text-gray-300 hover:text-gold-400 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Careers
              </Link>

              <Link
                href="/contact"
                className="text-gray-300 hover:text-gold-400 font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Mobile CTA */}
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
