import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const benefits = [
  "White-label our services as your own",
  "Volume discounts available",
  "Superior quality at lower rates",
  "Pay per project, no platform fees",
];

export function B2BCallout() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-teal-50 to-teal-100/50 border-y-2 border-teal-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Headline and Benefits */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-600/10 border border-teal-600/20 mb-4">
                <span className="text-sm font-semibold text-teal-700">For GOVCON Agencies</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl lg:text-4xl font-bold text-navy-900 mb-3">
                Are You a GOVCON Agency?
              </h2>

              {/* Subheadline */}
              <p className="text-lg text-gray-700 mb-6">
                Scale your delivery without adding headcount. Win more while maintaining margins.
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-6 h-6 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-800 font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: CTA and Social Proof */}
            <div className="lg:text-left">
              {/* CTA Box */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-teal-200">
                <h3 className="text-2xl font-bold text-navy-900 mb-3">
                  Partner With Us
                </h3>
                <p className="text-gray-700 mb-6">
                  Join several leading GOVCON agencies who trust Aliff to deliver exceptional results for their clients.
                </p>

                {/* CTA Button */}
                <Link href="/for-agencies" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-lg py-6 rounded-lg shadow-md hover:shadow-xl transition-all group"
                  >
                    View Agency Solutions
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                {/* Trust Signal */}
                <p className="text-sm text-gray-600 text-center mt-4">
                  Trusted by several leading GOVCON agencies
                </p>
              </div>

              {/* Additional benefit callout */}
              <div className="mt-6 p-6 bg-white/60 backdrop-blur rounded-lg border border-teal-200/50">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold text-teal-700">Confidential Partnership:</span> Your clients never know we exist. All deliverables branded as yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
