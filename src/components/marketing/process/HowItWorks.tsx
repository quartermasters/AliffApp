import { Brain, Users, Shield } from "lucide-react";

const steps = [
  {
    number: "1",
    title: "AI Analysis",
    description:
      "We decode every RFP requirement with GPT-4o-mini precision. Our AI maps compliance requirements, identifies evaluation criteria, and ensures zero missed points.",
    icon: <Brain className="w-8 h-8" />,
    variant: "gold" as const,
    checkmark: "100% compliance coverage guaranteed",
  },
  {
    number: "2",
    title: "6-Expert Human Touch",
    description:
      "Six strategists craft narratives evaluators can't ignore. We transform AI drafts into compelling stories that showcase your unique value and eliminate generic responses.",
    icon: <Users className="w-8 h-8" />,
    variant: "victory" as const,
    checkmark: "Real expertise AI alone can never replicate",
  },
  {
    number: "3",
    title: "Quality Control",
    description:
      "Our Pink-Red-Gold quality system ensures perfection. Three independent reviews catch errors, eliminate AI hallucinations, and polish every proposal to winning standards.",
    icon: <Shield className="w-8 h-8" />,
    variant: "gold" as const,
    checkmark: "Every proposal reviewed 3x before delivery",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 bg-navy-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/20 border border-gold-400 text-gold-400 text-sm font-bold tracking-wide uppercase shadow-md mb-6">
            🏆 THE WINNING FORMULA
          </div>
          <h2 className="text-3xl lg:text-display-md font-bold text-white mb-4">
            How We Help You <span className="text-gradient-win">WIN</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Our 3-step system combines AI precision with 6 expert strategists to deliver proposals that dominate the competition
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={
                step.variant === "victory"
                  ? "card-victory"
                  : "card-gold"
              }
            >
              {/* Step Number Badge */}
              <div className="flex justify-center mb-4">
                <div
                  className={
                    step.variant === "victory"
                      ? "step-number-victory"
                      : "step-number"
                  }
                >
                  {step.number}
                </div>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className={
                    step.variant === "victory"
                      ? "stat-icon-victory"
                      : "stat-icon"
                  }
                >
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3 text-center">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-300 leading-relaxed mb-6 text-center">
                {step.description}
              </p>

              {/* Checkmark Box */}
              <div className="card-checkmark-box mt-auto">
                <span className="text-lg">✓</span>
                <span>{step.checkmark}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 lg:gap-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-gold-400 text-sm uppercase tracking-wide font-semibold mb-2">
              200+ Proposals Won
            </div>
            <div className="h-1 w-16 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="text-gold-400 text-sm uppercase tracking-wide font-semibold mb-2">
              22% Win Rate (47% Above Industry)
            </div>
            <div className="h-1 w-16 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="text-win-400 text-sm uppercase tracking-wide font-semibold mb-2">
              24/7 RFP Intelligence
            </div>
            <div className="h-1 w-16 bg-win-400 mx-auto rounded-full"></div>
          </div>
          <div className="text-center">
            <div className="text-win-400 text-sm uppercase tracking-wide font-semibold mb-2">
              5-7 Day Delivery
            </div>
            <div className="h-1 w-16 bg-win-400 mx-auto rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
