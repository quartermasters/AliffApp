const phases = [
  {
    phase: 1,
    years: "2009-2013",
    title: "The Bootstrap Years",
    subtitle: "Learning to Deliver in the Theater",
    story:
      "Our first clients were federal contractors operating in GWOT-era Middle East—defense logistics in Afghanistan, IT contractors in Iraq, construction under fire, translation services for coalition forces. They needed proposals written fast (7-14 day RFP cycles), compliant (FAR/DFARS), and persuasive. We became their execution layer.",
    milestones: [
      "Founded in Dubai during global recession",
      "First clients: GOVCON contractors (Afghanistan, Iraq theater)",
      "Manual operations: email, phone, Skype coordination",
      "Discovered Pakistan talent market goldmine",
    ],
    color: "gold",
  },
  {
    phase: 2,
    years: "2014-2017",
    title: "The Scaling Challenge",
    subtitle: "Growing Pains & Process Discipline",
    story:
      "By 2014, success was killing us. We'd grown to 50+ clients and 200+ providers. Revenue climbed but profit margins shrank. Why? Human bottlenecks. Every project required manual intake, provider matching, coordination chaos, and founder-level QA. We realized: unstructured talent is just expensive chaos.",
    milestones: [
      "Built structured onboarding (skill assessments, work samples)",
      "Created process documentation (SOPs, quality frameworks)",
      "Implemented performance tracking (Time Doctor, output metrics)",
      "Transformed from talent marketplace to delivery operating system",
    ],
    color: "gold",
  },
  {
    phase: 3,
    years: "2018-2021",
    title: "The Digital Transformation",
    subtitle: "Building the Platform, Discovering the Pattern",
    story:
      "We bet two years of profits on building Aliff Workspace—a custom platform replacing our duct-taped Trello/Slack/Google Docs chaos. Then COVID-19 validated everything. The world suddenly needed what we'd perfected: remote, asynchronous, globally distributed knowledge work. We grew 300% in 18 months. But our best project managers were pattern-matching, not inventing. The question emerged: What if AI could do tier-1 coordination?",
    milestones: [
      "Built custom Aliff Workspace platform",
      "COVID-19 catalyst: 300% growth in 18 months",
      "Discovered PM pattern-matching insight",
      "Started experimenting with AI assistance tools",
    ],
    color: "teal",
  },
  {
    phase: 4,
    years: "2022-2025",
    title: "The AI Revolution",
    subtitle: "Teaching Machines to Manage Humans",
    story:
      "In 2022, we fed GPT-3 ten winning proposals and asked it to draft an executive summary. It was 80% there. The implications were staggering. We built iteratively: ALIFF-SALES (2022), ALIFF-OPS (2023), ALIFF-CLIENT (2023), ALIFF-TRAINER (2024), ALIFF-RECRUITER (2024), ALIFF-CEO (2024). Then came the final breakthrough: AI Program Manager personas with backstories, personalities, and domain expertise. Not chatbots—fully realized human-like managers.",
    milestones: [
      "2022: First GPT-3 proposal experiment (80% quality)",
      "2023: Deployed 6-role AI system (SALES, OPS, CLIENT, TRAINER, RECRUITER, CEO)",
      "2024: Created 10 AI Program/Project Manager personas",
      "2025: World's first fully AI-orchestrated workforce platform",
    ],
    color: "teal",
  },
];

export function StoryPhases() {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-display-md font-bold text-navy-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From mint tea in Dubai to AI revolution—four phases, sixteen years
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-12">
            {phases.map((phase, index) => (
              <div
                key={phase.phase}
                className={`relative ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Phase Number Circle */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ${
                        phase.color === "gold"
                          ? "bg-gold-400 text-navy-900 shadow-gold-500/30"
                          : "bg-teal-600 text-white shadow-teal-500/30"
                      }`}
                    >
                      {phase.phase}
                    </div>
                    <div className="text-center mt-2 text-sm font-bold text-gray-500">
                      {phase.years}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`flex-1 rounded-xl p-8 border-2 transition-all duration-300 hover:shadow-xl ${
                      phase.color === "gold"
                        ? "bg-white border-gold-400/30 hover:border-gold-400 hover:shadow-gold-500/10"
                        : "bg-white border-teal-600/30 hover:border-teal-600 hover:shadow-teal-500/10"
                    }`}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">
                      {phase.title}
                    </h3>
                    <p
                      className={`text-lg font-semibold mb-4 ${
                        phase.color === "gold" ? "text-gold-600" : "text-teal-600"
                      }`}
                    >
                      {phase.subtitle}
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-6">{phase.story}</p>

                    {/* Milestones */}
                    <div className="space-y-2">
                      {phase.milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                              phase.color === "gold" ? "bg-gold-400" : "bg-teal-600"
                            }`}
                          />
                          <span className="text-sm text-gray-600">{milestone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connecting line (desktop only) */}
                {index < phases.length - 1 && (
                  <div className="hidden md:block absolute left-10 top-20 w-0.5 h-12 bg-gradient-to-b from-gray-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
