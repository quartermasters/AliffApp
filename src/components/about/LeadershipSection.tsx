"use client";

import { useState } from "react";
import Image from "next/image";

const founders = [
  {
    name: "Haroon Haider",
    title: "Chief Executive Officer & Co-Founder",
    bio: "Twenty years of federal-contract leadership and capture strategy. Led teams that secured $400M+ in GOVCON awards across Middle East theater operations. Guides Aliff's strategic vision and ensures every engagement is engineered to win and deliver.",
    highlights: [
      "20 years federal contracting",
      "$400M+ programs led",
      "GWOT-era theater operations",
      "Strategic vision & execution",
    ],
    initials: "HH",
    gradient: "from-gold-400 via-gold-500 to-gold-600",
    image: "/images/team/haroon-haider.jpg",
  },
  {
    name: "Sumera Khan",
    title: "VP Client Relationships & Co-Founder",
    bio: "Seventeen years in international banking, procurement, and government-contract finance. Architected the financial structures and global partnerships that enable Aliff to scale complex service delivery across borders with fiscal resilience.",
    highlights: [
      "17 years banking & procurement",
      "International finance expert",
      "Partnership architecture",
      "Cross-border operations",
    ],
    initials: "SK",
    gradient: "from-teal-400 via-teal-500 to-teal-600",
    image: "/images/team/sumera-khan.jpg",
  },
  {
    name: "Sana Rehman",
    title: "VP Resources & Co-Founder",
    bio: "CIPD-qualified HR leader with 13 years delivering digital HR transformations and strategic talent programs. Built the culture, systems, and AI frameworks that attract, develop, and orchestrate the people and technology that power Aliff's delivery.",
    highlights: [
      "CIPD-qualified HR leader",
      "13 years HR transformation",
      "AI workforce orchestration",
      "Culture & systems builder",
    ],
    initials: "SR",
    gradient: "from-gold-300 via-teal-400 to-gold-500",
    image: "/images/team/sana-rehman.jpg",
  },
];

const aiPrograms = [
  {
    name: "Dr. Fatima Hassan",
    role: "GOVCON Program Director",
    expertise: "Federal contracting, compliance, proposal strategy",
    manages: "10-15 GOVCON proposals, 3-5 Project Managers",
  },
  {
    name: "James 'JM' Mitchell",
    role: "SLED Program Director",
    expertise: "State & local government contracting",
    manages: "15-20 SLED proposals across all states",
  },
  {
    name: "Priya Sharma",
    role: "Technology Program Director",
    expertise: "Software development, cloud architecture, AI systems",
    manages: "8-12 technology projects, dev teams",
  },
  {
    name: "Robert 'Bob' Chen",
    role: "Content & Writing Program Director",
    expertise: "Editorial strategy, brand voice, content systems",
    manages: "20-30 content projects, writer teams",
  },
  {
    name: "Aisha Malik",
    role: "Operations Program Director",
    expertise: "Cross-functional coordination, process optimization",
    manages: "Multi-stakeholder programs, RACI frameworks",
  },
];

export function LeadershipSection() {
  const [showAITeam, setShowAITeam] = useState(false);

  return (
    <section className="py-20 bg-navy-900">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-display-md font-bold text-white mb-4">
              Our Leadership
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Founded by three complementary experts, powered by AI-orchestrated teams
            </p>
          </div>

          {/* Founders Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {founders.map((founder, index) => (
              <div
                key={founder.name}
                className="group relative"
              >
                {/* Gradient border effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${founder.gradient} rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition-all duration-500`} />

                {/* Card content */}
                <div className="relative bg-navy-800 rounded-2xl p-8 h-full border border-navy-700 hover:border-transparent transition-all duration-500">
                  {/* Avatar with image or gradient fallback */}
                  <div className="relative w-32 h-32 mb-6 mx-auto">
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${founder.gradient} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`} />
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      {founder.image ? (
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover transition-all duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 128px, 128px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {/* Fallback initials overlay (shows if image fails or doesn't exist) */}
                      <div className={`absolute inset-0 flex items-center justify-center text-navy-900 text-4xl font-bold bg-gradient-to-br ${founder.gradient} ${founder.image ? 'opacity-0' : 'opacity-100'}`}>
                        {founder.initials}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-gold-400 transition-colors duration-300">
                    {founder.name}
                  </h3>
                  <p className="text-sm text-gold-400 font-semibold mb-4 uppercase tracking-wide">
                    {founder.title}
                  </p>
                  <p className="text-base text-gray-300 mb-6 leading-relaxed">
                    {founder.bio}
                  </p>

                  {/* Highlights with better contrast */}
                  <div className="space-y-3 pt-4 border-t border-navy-700">
                    {founder.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${founder.gradient} mt-2 flex-shrink-0`} />
                        <span className="text-sm text-gray-200 leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent mb-12" />

          {/* AI Program Directors Section */}
          <div className="text-center">
            <button
              onClick={() => setShowAITeam(!showAITeam)}
              className="inline-flex items-center gap-3 px-6 py-3 bg-navy-800/60 border border-teal-600 rounded-lg text-white font-semibold hover:bg-navy-800 hover:border-teal-500 transition-all duration-300 group"
            >
              <span className="text-teal-400 text-xl group-hover:scale-110 transition-transform">
                {showAITeam ? "▼" : "▶"}
              </span>
              <span>Meet Our AI Program Directors</span>
              <span className="text-xs text-gray-400">(Tier 2 Management)</span>
            </button>

            {/* AI Team Accordion */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                showAITeam ? "max-h-[2000px] opacity-100 mt-8" : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiPrograms.map((pm) => (
                  <div
                    key={pm.name}
                    className="group relative"
                  >
                    {/* Gradient border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 rounded-xl opacity-50 group-hover:opacity-100 blur-sm group-hover:blur transition-all duration-300" />

                    {/* Card content */}
                    <div className="relative bg-navy-800 border border-navy-700 rounded-xl p-6 hover:border-transparent transition-all duration-300 text-left h-full">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-navy-900 text-base font-bold mb-4 shadow-xl shadow-teal-500/30 transform group-hover:scale-110 transition-transform duration-300">
                        AI
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1 group-hover:text-teal-400 transition-colors duration-300">
                        {pm.name}
                      </h4>
                      <p className="text-sm text-teal-400 font-semibold mb-4 uppercase tracking-wide">
                        {pm.role}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">Expertise:</strong> {pm.expertise}
                        </p>
                        <p className="text-sm text-gray-300">
                          <strong className="text-white">Manages:</strong> {pm.manages}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400 mt-8 max-w-3xl mx-auto leading-relaxed">
                Our AI Program Directors are fully trained personas with deep domain expertise,
                distinct personalities, and human-like communication. They manage programs,
                coordinate teams, and ensure flawless execution—available 24/7 via Aliff Workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
