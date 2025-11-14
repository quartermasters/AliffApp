import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-teal-50 to-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-display-md font-bold text-navy-900 mb-6">
            Ready to Work Together?
          </h2>

          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            From a napkin sketch to an AI revolution. From Dubai to the world. From three founders
            to an infinite workforce. This is just the beginning.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-lg"
            >
              Get in Touch
            </Link>
            <Link
              href="/for-agencies"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 text-navy-900 font-semibold rounded-lg border-2 border-navy-900 transition-all duration-200 text-lg"
            >
              Agency Partnerships
            </Link>
          </div>

          {/* Stats Footer */}
          <div className="mt-16 pt-12 border-t border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">16</div>
                <div className="text-sm uppercase tracking-wide text-gray-600 font-semibold">
                  Years in Business
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">2009</div>
                <div className="text-sm uppercase tracking-wide text-gray-600 font-semibold">
                  Founded in Dubai
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">24/7</div>
                <div className="text-sm uppercase tracking-wide text-gray-600 font-semibold">
                  AI-Powered Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
