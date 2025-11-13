import { Search, Zap, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Strategic Intelligence",
    description:
      "We diagnose the real problem. Senior experts analyze what's stated and discover what's unstated. Most competitors skip this - they rush to compliance and lose.",
    icon: <Search className="w-8 h-8" />,
    color: "teal",
  },
  {
    number: "02",
    title: "AI-Powered Execution",
    description:
      "AI handles 80-90% of work at 10x speed. Research, drafting, compliance checking, formatting. Human strategy drives what AI builds.",
    icon: <Zap className="w-8 h-8" />,
    color: "govcon",
  },
  {
    number: "03",
    title: "Expert Refinement",
    description:
      "Humans ensure strategic excellence. Quality control, differentiation, authentic voice. Your deliverable reads like an expert wrote it - because one did.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "success",
  },
];

const colorClasses = {
  teal: {
    bg: "bg-teal-100",
    text: "text-teal-600",
    border: "border-teal-200",
    iconBg: "bg-teal-600",
  },
  govcon: {
    bg: "bg-govcon/10",
    text: "text-govcon",
    border: "border-govcon/20",
    iconBg: "bg-govcon",
  },
  success: {
    bg: "bg-success-100",
    text: "text-success-600",
    border: "border-success-200",
    iconBg: "bg-success-600",
  },
};

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl lg:text-display-md font-bold text-navy-900 mb-4">
            How Aliff Works
          </h2>
          <p className="text-lg text-gray-700">
            Strategic thinking comes first. AI execution scales it. Human refinement perfects it.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const colors = colorClasses[step.color as keyof typeof colorClasses];

              return (
                <div key={index} className="relative">
                  {/* Connector Line (hidden on mobile, shown on md+) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -ml-6" />
                  )}

                  {/* Step Card */}
                  <div className="relative">
                    {/* Step Number */}
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className={`text-5xl font-bold ${colors.text} opacity-20`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${colors.iconBg} text-white mb-4 shadow-lg`}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-navy-900 mb-3">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Callout */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full border border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                Result: Strategic differentiation that wins, delivered at AI speed
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
