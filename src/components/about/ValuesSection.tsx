import { Target, Zap, Users, Rocket } from "lucide-react";

const values = [
  {
    Icon: Target,
    title: "Integrity First",
    description:
      "We protect client confidentiality with ironclad security. We pay providers fairly and on time. We never overpromise. Trust is our only currency.",
    color: "gold",
  },
  {
    Icon: Zap,
    title: "Relentless Delivery",
    description:
      "Winning the contract is just the beginning. We execute with precision, meet deadlines, and treat every deliverable as a reputation-defining moment.",
    color: "teal",
  },
  {
    Icon: Users,
    title: "People at the Core",
    description:
      "AI handles coordination. Humans handle creativity. We invest in both—continuously training our technology and our talent to raise the ceiling on what's possible.",
    color: "gold",
  },
  {
    Icon: Rocket,
    title: "Practical Innovation",
    description:
      "We don't chase hype. We spent 13 years perfecting service delivery before teaching AI to do it better. Innovation must serve execution, not distract from it.",
    color: "teal",
  },
];

export function ValuesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-display-md font-bold text-navy-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision, every project, every partnership
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => {
              const IconComponent = value.Icon;
              return (
                <div
                  key={value.title}
                  className={`bg-white rounded-xl p-8 border-l-4 transition-all duration-300 hover:shadow-lg ${
                    value.color === "gold"
                      ? "border-gold-400 hover:shadow-gold-500/10"
                      : "border-teal-600 hover:shadow-teal-500/10"
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      value.color === "gold"
                        ? "bg-gold-400/10 text-gold-600"
                        : "bg-teal-600/10 text-teal-600"
                    }`}
                  >
                    <IconComponent className="w-8 h-8" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900 mb-3">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
