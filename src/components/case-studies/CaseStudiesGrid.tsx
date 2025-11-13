"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/data/caseStudies";

interface CaseStudiesGridProps {
  caseStudies: CaseStudy[];
}

export function CaseStudiesGrid({ caseStudies }: CaseStudiesGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedMetricType, setSelectedMetricType] = useState<string>("all");

  // Filter and search logic
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((study) => {
      // Category filter
      if (selectedCategory !== "all" && study.category !== selectedCategory) {
        return false;
      }

      // Metric type filter
      if (selectedMetricType !== "all" && study.metricType !== selectedMetricType) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        return (
          study.title.toLowerCase().includes(lowerQuery) ||
          study.teaser.toLowerCase().includes(lowerQuery) ||
          study.clientType.toLowerCase().includes(lowerQuery) ||
          study.keyMetric.toLowerCase().includes(lowerQuery)
        );
      }

      return true;
    });
  }, [caseStudies, searchQuery, selectedCategory, selectedMetricType]);

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
              Search
            </label>
            <input
              id="search"
              type="text"
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="all">All Categories</option>
              <option value="govcon">GOVCON</option>
              <option value="sled">SLED</option>
              <option value="it">IT & Development</option>
              <option value="writing">Writing</option>
              <option value="b2b-agency">B2B Agency</option>
            </select>
          </div>

          {/* Metric Type Filter */}
          <div>
            <label htmlFor="metricType" className="block text-sm font-semibold text-gray-700 mb-2">
              Result Type
            </label>
            <select
              id="metricType"
              value={selectedMetricType}
              onChange={(e) => setSelectedMetricType(e.target.value)}
              className="input"
            >
              <option value="all">All Results</option>
              <option value="win-rate">Win Rate Improvement</option>
              <option value="capacity">Capacity Increase</option>
              <option value="revenue">Revenue Growth</option>
              <option value="time-saved">Time Saved</option>
              <option value="cost-saved">Cost Saved</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(selectedCategory !== "all" || selectedMetricType !== "all" || searchQuery) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredCaseStudies.length} of {caseStudies.length} case studies
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedMetricType("all");
                }}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredCaseStudies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No case studies match your filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedMetricType("all");
            }}
            className="mt-4 text-teal-600 hover:text-teal-700 font-semibold"
          >
            Clear filters to see all case studies
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((study) => (
            <CaseStudyCard key={study.slug} caseStudy={study} />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  const categoryColors = {
    govcon: "bg-govcon-600",
    sled: "bg-teal-600",
    it: "bg-it-600",
    writing: "bg-writing-600",
    "b2b-agency": "bg-gold-600",
  };

  const categoryLabels = {
    govcon: "GOVCON",
    sled: "SLED",
    it: "IT & Development",
    writing: "Writing",
    "b2b-agency": "B2B Agency",
  };

  return (
    <Link
      href={`/case-studies/${caseStudy.slug}`}
      className="card-hover p-6 flex flex-col h-full group"
    >
      {/* Category Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
            categoryColors[caseStudy.category]
          }`}
        >
          {categoryLabels[caseStudy.category]}
        </span>
      </div>

      {/* Key Metric - Hero */}
      <div className="mb-4">
        <div className="text-3xl font-bold text-teal-600 mb-1">{caseStudy.keyMetric}</div>
        <div className="text-sm text-gray-500">{caseStudy.clientType}</div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
        {caseStudy.title}
      </h3>

      {/* Teaser */}
      <p className="text-gray-600 mb-4 flex-grow">{caseStudy.teaser}</p>

      {/* Services Used */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-500 mb-2">SERVICES USED:</div>
        <div className="flex flex-wrap gap-2">
          {caseStudy.services.slice(0, 2).map((service) => (
            <span
              key={service}
              className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {formatServiceName(service)}
            </span>
          ))}
          {caseStudy.services.length > 2 && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              +{caseStudy.services.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Read CTA */}
      <div className="text-teal-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
        Read Case Study
        <span aria-hidden="true">→</span>
      </div>
    </Link>
  );
}

function formatServiceName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
