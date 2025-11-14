"use client";

import { useState } from "react";

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
            {founders.map((founder) => (
              <div
                key={founder.name}
                className="glass rounded-xl p-6 border-2 border-gold-400/30 hover:border-gold-400 transition-all duration-300 hover:shadow-xl hover:shadow-gold-500/10"
              >
                {/* Avatar placeholder */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-lg shadow-gold-500/30">
                  {founder.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{founder.name}</h3>
                <p className="text-sm text-gold-400 font-semibold mb-4">{founder.title}</p>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">{founder.bio}</p>

                {/* Highlights */}
                <div className="space-y-2">
                  {founder.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-gold-400 text-xs mt-1">▸</span>
                      <span className="text-xs text-gray-400">{highlight}</span>
                    </div>
                  ))}
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
                    className="bg-navy-800/60 border border-teal-600/30 rounded-lg p-6 hover:border-teal-600 transition-all duration-300 text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-sm font-bold mb-4 shadow-lg shadow-teal-500/30">
                      AI
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{pm.name}</h4>
                    <p className="text-sm text-teal-400 font-semibold mb-3">{pm.role}</p>
                    <p className="text-xs text-gray-400 mb-2">
                      <strong className="text-gray-300">Expertise:</strong> {pm.expertise}
                    </p>
                    <p className="text-xs text-gray-400">
                      <strong className="text-gray-300">Manages:</strong> {pm.manages}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-6 max-w-3xl mx-auto">
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
