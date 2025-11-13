import type { Metadata } from "next";
import { ROICalculator } from "@/components/agency/ROICalculator";

export const metadata: Metadata = {
  title: "ROI Calculator - White-Label Partnership Savings | Aliff Services",
  description:
    "Calculate the cost savings of white-label partnership vs hiring or using freelancers. See your potential ROI in real-time.",
};

export default function ROICalculatorPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-navy py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-display-lg font-bold text-white mb-6">
              White-Label Partnership ROI Calculator
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Calculate the cost savings of white-label partnership vs hiring employees or managing
              freelancers. See your potential ROI in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-16">
        <div className="container-custom">
          <ROICalculator />
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-navy-900 text-center">
              Why White-Label Partnership?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Variable Costs",
                  desc: "Pay only for active projects. No fixed salaries, benefits, or overhead during slow periods.",
                },
                {
                  title: "Immediate Capacity",
                  desc: "Scale up instantly without hiring lag. Take on more work without the 6-month ramp time.",
                },
                {
                  title: "Maintained Quality",
                  desc: "Specialized partners deliver consistent quality. No training, no junior staff learning curve.",
                },
              ].map((benefit, i) => (
                <div key={i} className="card p-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-700">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
