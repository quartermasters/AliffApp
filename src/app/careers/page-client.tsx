/**
 * Modern Careers Listing Page
 *
 * Features:
 * - Filter sidebar (Department, Type, Location, Compensation)
 * - Search bar with real-time filtering
 * - Modern job cards with hover animations
 * - Featured jobs section
 * - Clean, professional design
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { JobType, JobLocation } from '@prisma/client';
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  Clock,
  Users,
  Filter,
  X,
  TrendingUp
} from 'lucide-react';

interface Job {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  type: JobType;
  location: JobLocation;
  salary: string | null;
  description: string;
  publishedAt: Date | null;
  _count: {
    applications: number;
  };
}

interface CareersPageProps {
  jobs: Job[];
}

export default function CareersPage({ jobs }: CareersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique departments
  const departments = useMemo(() => {
    const depts = jobs
      .map(job => job.department)
      .filter((dept): dept is string => dept !== null);
    return Array.from(new Set(depts)).sort();
  }, [jobs]);

  // Filter jobs based on search and filters
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery ||
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.department?.toLowerCase().includes(searchLower);

      // Type filter
      const matchesType = selectedType === 'all' || job.type === selectedType;

      // Location filter
      const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;

      // Department filter
      const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;

      return matchesSearch && matchesType && matchesLocation && matchesDepartment;
    });
  }, [jobs, searchQuery, selectedType, selectedLocation, selectedDepartment]);

  // Featured jobs (first 3)
  const featuredJobs = jobs.slice(0, 3);

  const formatJobType = (type: JobType) => type.replace('_', ' ');
  const formatLocation = (location: JobLocation) => location.replace('_', ' ');

  const getTypeColor = (type: JobType) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PART_TIME': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONTRACT': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'INTERNSHIP': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedLocation('all');
    setSelectedDepartment('all');
  };

  const activeFiltersCount = [
    selectedType !== 'all',
    selectedLocation !== 'all',
    selectedDepartment !== 'all',
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Join Our Team
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              Build your career with Aliff Services. Remote opportunities with competitive PKR-based compensation.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400 mt-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>100% Remote</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{jobs.length} Open Positions</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5-7 Day Process</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="group bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200 hover:border-teal-400 transition-all hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(job.type)}`}>
                      {formatJobType(job.type)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {job.title}
                  </h3>
                  {job.department && (
                    <p className="text-sm text-slate-600 mb-3">{job.department}</p>
                  )}
                  {job.salary && (
                    <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs by title, department, or description..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-900"
                />
              </div>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-600">Active filters:</span>
              {selectedType !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm flex items-center gap-2">
                  {formatJobType(selectedType as JobType)}
                  <button onClick={() => setSelectedType('all')} className="hover:text-purple-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm flex items-center gap-2">
                  {formatLocation(selectedLocation as JobLocation)}
                  <button onClick={() => setSelectedLocation('all')} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedDepartment !== 'all' && (
                <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-sm flex items-center gap-2">
                  {selectedDepartment}
                  <button onClick={() => setSelectedDepartment('all')} className="hover:text-teal-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-slate-600 hover:text-slate-900 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl p-6 border border-slate-200 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Job Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Employment Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Locations</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON_SITE">On Site</option>
                </select>
              </div>

              {/* Department Filter */}
              {departments.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">{filteredJobs.length}</span>{' '}
                {filteredJobs.length === 1 ? 'position' : 'positions'} found
              </p>
            </div>

            {/* Job Cards */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    className="group block bg-white rounded-2xl p-6 border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getTypeColor(job.type)}`}>
                            {formatJobType(job.type)}
                          </span>
                          {job.department && (
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.department}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                          {job.description.substring(0, 150)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <span>{formatLocation(job.location)}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-2 text-teal-700 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-slate-500">
                            <Users className="w-4 h-4" />
                            <span>{job._count.applications} applicants</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end gap-3">
                        <span className="px-6 py-3 bg-teal-600 group-hover:bg-teal-700 text-white rounded-lg font-semibold transition-colors text-sm whitespace-nowrap">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Don't see the right role?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join our talent pool and we'll notify you when positions matching your skills become available. Chat with ALIFF using the widget at the bottom-right for more information.
          </p>
          <Link
            href="/candidate-portal"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <span>Access Candidate Portal</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
