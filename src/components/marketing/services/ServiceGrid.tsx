import { ServiceCard } from "./ServiceCard";
import { FileText, Code, Building, FileCheck } from "lucide-react";

const services = [
  {
    title: "GOVCON Services",
    description:
      "Win federal contracts with strategic diagnosis and AI-powered execution. From proposal writing to compliance, we deliver winning responses in 5-7 days.",
    serviceCount: 8,
    href: "/services/govcon",
    accent: "govcon" as const,
    icon: <Building className="w-8 h-8" />,
  },
  {
    title: "SLED Services",
    description:
      "Dominate state, local, and education markets. Our diagnosis lab identifies unstated requirements that competitors miss.",
    serviceCount: 8,
    href: "/services/sled",
    accent: "sled" as const,
    icon: <FileCheck className="w-8 h-8" />,
  },
  {
    title: "IT Services",
    description:
      "Enterprise architecture designed by senior experts. AI generates 80% of code. You get sustainable systems, not technical debt.",
    serviceCount: 2,
    href: "/services/it",
    accent: "it" as const,
    icon: <Code className="w-8 h-8" />,
  },
  {
    title: "Writing Services",
    description:
      "Strategic content that positions your brand. Not AI-generated blog slop. Content strategists develop voice, AI scales production.",
    serviceCount: 6,
    href: "/services/writing",
    accent: "writing" as const,
    icon: <FileText className="w-8 h-8" />,
  },
];

export function ServiceGrid() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-display-md font-bold text-navy-900 mb-4">
            Choose Your Service Category
          </h2>
          <p className="text-lg text-gray-700">
            Strategic thinking + AI execution across government contracting, IT development, and
            content creation.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
