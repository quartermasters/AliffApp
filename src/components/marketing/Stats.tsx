"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: "22", suffix: "%", label: "Win Rate (vs 4% industry avg)" },
  { value: "5-7", label: "Day Turnaround" },
  { value: "20", suffix: "+", label: "Years Combined Expertise" },
  { value: "100", suffix: "%", label: "Compliance Guaranteed" },
];

export function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 lg:py-16 bg-navy-900"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-700 delay-${index * 100} ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="text-4xl lg:text-5xl font-bold text-teal-400 mb-2">
                {stat.value}
                {stat.suffix && <span className="text-3xl">{stat.suffix}</span>}
              </div>
              <div className="text-sm lg:text-base text-gray-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
