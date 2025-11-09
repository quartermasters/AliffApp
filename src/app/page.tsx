export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="section bg-gradient-navy relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-victory-400 rounded-full blur-3xl opacity-10 animate-pulse delay-1000" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Success Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
              <svg
                className="w-5 h-5 text-gold-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold">
                Proven Winners • $47M+ Secured
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 animate-slide-up">
              <span className="block text-white/90">Join the Elite 5%</span>
              <span className="block text-gradient mt-2">
                Who Actually Win Government Contracts
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto animate-slide-up delay-100">
              AI + 6 Human Experts = Unbeatable Proposals. 5-7 day turnaround.
              22% win rate vs 4% industry average.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-200">
              <button className="btn-primary btn-xl hover-lift">
                Get Your Winning Strategy
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
              <button className="btn-outline btn-xl hover-lift">
                Calculate Your ROI
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-white/10">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                  22%
                </div>
                <div className="text-sm text-white/70">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-victory-400 mb-2">
                  200+
                </div>
                <div className="text-sm text-white/70">Winning Proposals</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold-400 mb-2">
                  5-7
                </div>
                <div className="text-sm text-white/70">Day Turnaround</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-victory-400 mb-2">
                  24/7
                </div>
                <div className="text-sm text-white/70">RFP Intelligence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Proof Section */}
      <section className="section bg-white dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
            <div className="text-center">
              <span className="text-2xl font-bold text-navy-800 dark:text-white">
                $47M+
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Secured
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-navy-800 dark:text-white">
                5.5x
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Better Win Rate
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-navy-800 dark:text-white">
                Zero
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Hallucinations
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-navy-800 dark:text-white">
                100%
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500" />
            </span>
            <span className="text-sm font-semibold">Under Development</span>
          </div>
          <h2 className="mb-4">
            Building Something <span className="text-gradient">Amazing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're rebuilding our platform with cutting-edge technology to serve
            you better. Stay tuned for the launch!
          </p>
        </div>
      </section>
    </main>
  );
}
