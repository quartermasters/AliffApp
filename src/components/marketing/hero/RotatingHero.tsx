"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type HeroVariant = "govcon" | "it" | "writing";

interface HeroContent {
  id: HeroVariant;
  headline: string;
  subheadline: string;
  metrics: Array<{ label: string; value: string }>;
  cta: { primary: string; secondary: string; primaryLink: string; secondaryLink: string };
  accent: string; // Tailwind color class
}

const heroVariants: HeroContent[] = [
  {
    id: "govcon",
    headline: "Win 22% of Federal Contracts. Not 4%.",
    subheadline:
      "While competitors submit AI-generated proposals, we deliver strategic intelligence that evaluators actually read. Human diagnosis + AI execution.",
    metrics: [
      { label: "Win Rate", value: "22%" },
      { label: "Turnaround", value: "5-7 days" },
      { label: "Industry Avg", value: "4%" },
    ],
    cta: {
      primary: "Analyze Your Next RFP",
      secondary: "View GOVCON Services",
      primaryLink: "/contact",
      secondaryLink: "/services/govcon",
    },
    accent: "govcon",
  },
  {
    id: "it",
    headline: "Enterprise Architecture. Startup Speed.",
    subheadline:
      "Senior architects design your system strategy. AI generates 80% of code. You get sustainable solutions, not technical debt.",
    metrics: [
      { label: "Architecture First", value: "100%" },
      { label: "AI Execution", value: "80-90%" },
      { label: "Expert Refinement", value: "10-20%" },
    ],
    cta: {
      primary: "Discuss Your Project",
      secondary: "View IT Services",
      primaryLink: "/contact",
      secondaryLink: "/services/it",
    },
    accent: "it",
  },
  {
    id: "writing",
    headline: "Strategic Content. Authentic Voice. Not AI Slop.",
    subheadline:
      "Content strategists develop your brand voice and messaging framework. AI scales production. Your audience reads authentic insights, not template blog posts.",
    metrics: [
      { label: "Strategic First", value: "100%" },
      { label: "AI Production", value: "80-90%" },
      { label: "Editorial Polish", value: "10-20%" },
    ],
    cta: {
      primary: "Get Content Strategy",
      secondary: "View Writing Services",
      primaryLink: "/contact",
      secondaryLink: "/services/writing",
    },
    accent: "writing",
  },
];

const ROTATION_INTERVAL = 8000; // 8 seconds
const TRANSITION_DURATION = 600; // 0.6 seconds

export function RotatingHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentVariant = heroVariants[currentIndex];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % heroVariants.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return;

    setIsTransitioning(true);
    setIsPaused(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
      // Resume auto-rotation after 2 full cycles
      setTimeout(() => setIsPaused(false), ROTATION_INTERVAL * 2);
    }, TRANSITION_DURATION);
  };

  const getAccentClasses = (accent: string) => {
    const accentMap: Record<string, string> = {
      govcon: "from-govcon/10 to-transparent",
      it: "from-it/10 to-transparent",
      writing: "from-writing/10 to-transparent",
    };
    return accentMap[accent] || accentMap.govcon;
  };

  const getDotColor = (variant: HeroVariant) => {
    const colorMap: Record<HeroVariant, string> = {
      govcon: "bg-govcon",
      it: "bg-it",
      writing: "bg-writing",
    };
    return colorMap[variant];
  };

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden bg-navy-900">
      {/* Background gradient - changes based on variant */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getAccentClasses(
          currentVariant.accent
        )} transition-all duration-1000`}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content with transition */}
          <div
            className={`transition-all duration-600 ${
              isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            }`}
          >
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-display-lg font-bold text-white mb-6 leading-tight">
              {currentVariant.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {currentVariant.subheadline}
            </p>

            {/* Metrics */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10">
              {currentVariant.metrics.map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gold-400">
                    {metric.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-400 mt-1 uppercase tracking-wide font-semibold">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={currentVariant.cta.primaryLink}>
                <Button
                  size="xl"
                  className="px-8"
                >
                  {currentVariant.cta.primary}
                </Button>
              </Link>
              <Link href={currentVariant.cta.secondaryLink}>
                <Button
                  size="xl"
                  variant="darkOutline"
                  className="px-8"
                >
                  {currentVariant.cta.secondary}
                </Button>
              </Link>
            </div>
          </div>

          {/* Rotation Dots */}
          <div className="flex justify-center gap-3 mt-12">
            {heroVariants.map((variant, index) => (
              <button
                key={variant.id}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? `w-8 h-3 ${getDotColor(variant.id)}`
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Show ${variant.id} hero`}
              />
            ))}
          </div>

          {/* Service labels below dots */}
          <div className="flex justify-center gap-8 mt-4 text-sm text-gray-400">
            <span className={currentIndex === 0 ? "font-semibold text-gold-400" : ""}>
              GOVCON
            </span>
            <span className={currentIndex === 1 ? "font-semibold text-gold-400" : ""}>
              IT Services
            </span>
            <span className={currentIndex === 2 ? "font-semibold text-gold-400" : ""}>
              Writing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
