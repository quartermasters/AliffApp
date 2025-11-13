"use client";

import { useState, useMemo } from "react";

export function ROICalculator() {
  const [approach, setApproach] = useState<"inhouse" | "freelance">("inhouse");
  const [monthlyProjects, setMonthlyProjects] = useState(8);
  const [projectSize, setProjectSize] = useState<"small" | "medium" | "large" | "enterprise">("medium");

  // In-house inputs
  const [teamSize, setTeamSize] = useState(3);
  const [avgSalary, setAvgSalary] = useState(85000);

  // Freelancer inputs
  const [avgFreelanceCost, setAvgFreelanceCost] = useState(6000);
  const [managementHours, setManagementHours] = useState(10);

  const calculations = useMemo(() => {
    // Current cost calculation
    let currentAnnualCost = 0;
    let currentManagementCost = 0;

    if (approach === "inhouse") {
      const benefitsMultiplier = 1.3; // 30% benefits
      const overheadMultiplier = 1.15; // 15% overhead
      currentAnnualCost = teamSize * avgSalary * benefitsMultiplier * overheadMultiplier;
      currentManagementCost = 0; // Already included in team
    } else {
      currentAnnualCost = avgFreelanceCost * monthlyProjects * 12;
      const internalHourlyRate = 75; // Estimated internal management rate
      currentManagementCost = managementHours * monthlyProjects * 12 * internalHourlyRate;
    }

    const totalCurrentCost = currentAnnualCost + currentManagementCost;

    // Aliff pricing calculation (simplified estimates)
    const pricingTiers = {
      small: { base: 3500, discount15: 0.85, discount20: 0.8, discount25: 0.75 },
      medium: { base: 6500, discount15: 0.85, discount20: 0.8, discount25: 0.75 },
      large: { base: 12000, discount15: 0.85, discount20: 0.8, discount25: 0.75 },
      enterprise: { base: 25000, discount15: 0.85, discount20: 0.8, discount25: 0.75 },
    };

    const pricing = pricingTiers[projectSize];
    const annualVolume = monthlyProjects * 12;

    let discount = 1; // No discount
    if (annualVolume >= 144) discount = pricing.discount25; // 12+ projects/month
    else if (annualVolume >= 96) discount = pricing.discount20; // 8-11 projects/month
    else if (annualVolume >= 48) discount = pricing.discount15; // 4-7 projects/month

    const pricePerProject = pricing.base * discount;
    const aliffAnnualCost = pricePerProject * annualVolume;
    const aliffManagementSavings = currentManagementCost * 0.75; // 75% time savings

    const totalAliffCost = aliffAnnualCost - aliffManagementSavings;
    const savings = totalCurrentCost - totalAliffCost;
    const savingsPercent = (savings / totalCurrentCost) * 100;
    const monthlySavings = savings / 12;

    return {
      currentAnnualCost,
      currentManagementCost,
      totalCurrentCost,
      aliffAnnualCost,
      aliffManagementSavings,
      totalAliffCost,
      savings,
      savingsPercent,
      monthlySavings,
      pricePerProject,
      discount,
    };
  }, [approach, monthlyProjects, projectSize, teamSize, avgSalary, avgFreelanceCost, managementHours]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs Column */}
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-2xl font-bold text-navy-900 mb-6">Your Current Situation</h3>

            {/* Approach Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Current Approach
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setApproach("inhouse")}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    approach === "inhouse"
                      ? "border-teal-600 bg-teal-50 text-teal-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  In-House Team
                </button>
                <button
                  onClick={() => setApproach("freelance")}
                  className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                    approach === "freelance"
                      ? "border-teal-600 bg-teal-50 text-teal-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Freelancers
                </button>
              </div>
            </div>

            {/* Volume */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Projects Per Month: {monthlyProjects}
              </label>
              <input
                type="range"
                min="2"
                max="20"
                value={monthlyProjects}
                onChange={(e) => setMonthlyProjects(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>20</span>
              </div>
            </div>

            {/* Project Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Average Project Size
              </label>
              <select
                value={projectSize}
                onChange={(e) => setProjectSize(e.target.value as any)}
                className="input"
              >
                <option value="small">Small ($3-5K typical)</option>
                <option value="medium">Medium ($6-10K typical)</option>
                <option value="large">Large ($12-20K typical)</option>
                <option value="enterprise">Enterprise ($25K+ typical)</option>
              </select>
            </div>

            {/* Conditional Inputs */}
            {approach === "inhouse" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Team Size: {teamSize} {teamSize === 1 ? "person" : "people"}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Salary per Person
                  </label>
                  <input
                    type="number"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    className="input"
                    step="5000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Includes benefits (1.3x) and overhead (1.15x) in calculations
                  </p>
                </div>
              </>
            )}

            {approach === "freelance" && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Average Cost Per Project
                  </label>
                  <input
                    type="number"
                    value={avgFreelanceCost}
                    onChange={(e) => setAvgFreelanceCost(Number(e.target.value))}
                    className="input"
                    step="500"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Management Hours Per Project: {managementHours} hrs
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    value={managementHours}
                    onChange={(e) => setManagementHours(Number(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Time spent coordinating, reviewing, and fixing freelancer work
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          {/* Current Cost */}
          <div className="card p-6 bg-red-50 border-2 border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-4">Current Annual Cost</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  {approach === "inhouse" ? "Team Costs (with benefits)" : "Freelancer Costs"}
                </span>
                <span className="font-semibold text-gray-900">
                  ${calculations.currentAnnualCost.toLocaleString()}
                </span>
              </div>
              {calculations.currentManagementCost > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Management Overhead</span>
                  <span className="font-semibold text-gray-900">
                    ${calculations.currentManagementCost.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t-2 border-red-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-900">Total Annual Cost</span>
                  <span className="text-2xl font-bold text-red-900">
                    ${calculations.totalCurrentCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Aliff Cost */}
          <div className="card p-6 bg-teal-50 border-2 border-teal-200">
            <h3 className="text-xl font-bold text-teal-900 mb-4">
              With Aliff White-Label Partnership
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Project Delivery Cost</span>
                <span className="font-semibold text-gray-900">
                  ${calculations.aliffAnnualCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-teal-700">
                <span>Management Time Savings (75%)</span>
                <span className="font-semibold">
                  -${calculations.aliffManagementSavings.toLocaleString()}
                </span>
              </div>
              <div className="pt-3 border-t-2 border-teal-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-teal-900">Net Annual Cost</span>
                  <span className="text-2xl font-bold text-teal-900">
                    ${calculations.totalAliffCost.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <div>Cost per project: ${calculations.pricePerProject.toLocaleString()}</div>
                {calculations.discount < 1 && (
                  <div className="text-teal-700 font-semibold">
                    Volume discount applied: {((1 - calculations.discount) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="card p-6 bg-gold-50 border-2 border-gold-400">
            <h3 className="text-xl font-bold text-gold-900 mb-4">Your Savings</h3>
            <div className="space-y-4">
              <div>
                <div className="text-4xl font-bold text-gold-900 mb-1">
                  ${calculations.savings.toLocaleString()}
                </div>
                <div className="text-lg text-gray-700">Annual Savings</div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gold-300">
                <div>
                  <div className="text-2xl font-bold text-gold-900">
                    {calculations.savingsPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-700">Cost Reduction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gold-900">
                    ${calculations.monthlySavings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-700">Monthly Savings</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="card p-6 bg-navy-900 text-white">
            <h3 className="text-xl font-bold mb-3">Ready to See Actual Pricing?</h3>
            <p className="text-gray-300 mb-4">
              These are estimates. Let's discuss your specific needs and get you exact pricing.
            </p>
            <a href="/contact" className="btn-primary btn-md w-full block text-center">
              Schedule Partnership Call
            </a>
          </div>
        </div>
      </div>

      {/* Assumptions */}
      <div className="mt-8 card p-6 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Calculator Assumptions</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• In-house costs include 30% benefits and 15% overhead allocation</li>
          <li>• Volume discounts: 15% (4-7/mo), 20% (8-11/mo), 25% (12+/mo)</li>
          <li>• White-label partnership reduces management time by 75%</li>
          <li>• Pricing estimates shown - actual pricing depends on specific requirements</li>
        </ul>
      </div>
    </div>
  );
}
