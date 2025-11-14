"use client";

import { useState, useEffect } from "react";

const timelineYears = [
  { year: "2009", label: "Founded", color: "gold" },
  { year: "2013", label: "Scaled", color: "gold" },
  { year: "2017", label: "Digital", color: "teal" },
  { year: "2021", label: "AI Era", color: "teal" },
  { year: "2025", label: "AI Revolution", color: "gold" },
];

export function TimelineHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % timelineYears.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden bg-navy-900">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      <div className="container-custom relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-400 text-gold-400 text-sm font-bold tracking-wide uppercase shadow-md mb-8">
            16 YEARS • GWOT ERA TO AI ERA
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-bold text-white mb-6 leading-tight">
            From Dubai 2009 to AI Revolution 2025
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            From a napkin sketch over mint tea to the world&apos;s first fully AI-orchestrated
            service delivery platform. This is our story.
          </p>

          {/* Animated Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-navy-700 -translate-y-1/2" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-gold-400 to-teal-600 -translate-y-1/2 transition-all duration-1000"
              style={{ width: `${(activeIndex / (timelineYears.length - 1)) * 100}%` }}
            />

            {/* Timeline points */}
            <div className="relative flex justify-between items-center">
              {timelineYears.map((item, index) => (
                <div
                  key={item.year}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => setActiveIndex(index)}
                >
                  {/* Point */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                      index <= activeIndex
                        ? item.color === "gold"
                          ? "bg-gold-400 border-gold-400 scale-125 shadow-lg shadow-gold-500/50"
                          : "bg-teal-600 border-teal-600 scale-125 shadow-lg shadow-teal-500/50"
                        : "bg-navy-900 border-navy-600"
                    }`}
                  />

                  {/* Year */}
                  <div
                    className={`mt-4 text-2xl font-bold transition-all duration-500 ${
                      index === activeIndex
                        ? item.color === "gold"
                          ? "text-gold-400 scale-110"
                          : "text-teal-400 scale-110"
                        : "text-gray-500"
                    }`}
                  >
                    {item.year}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 text-xs uppercase tracking-wide font-semibold transition-all duration-500 ${
                      index === activeIndex ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
