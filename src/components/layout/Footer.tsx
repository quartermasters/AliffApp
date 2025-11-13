import Link from "next/link";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "GOVCON Services", href: "/services/govcon" },
      { label: "SLED Services", href: "/services/sled" },
      { label: "IT Services", href: "/services/it" },
      { label: "Writing Services", href: "/services/writing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "For Agencies", href: "/for-agencies" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold text-white">
                Aliff
                <span className="text-teal-400">.</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Strategic thinking + AI execution. Win government contracts, build better systems,
              create authentic content. Beat AI commodity competitors.
            </p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
              <span className="text-sm text-gray-400">Trusted by leading GOVCON agencies</span>
            </div>
          </div>

          {/* Footer Links Columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {currentYear} Aliff Services. All rights reserved.
            </p>

            {/* Additional Links or Social Icons */}
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-500">
                Built with strategic thinking + AI execution
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
