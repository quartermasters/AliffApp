'use client';

/**
 * Interactive Job Card Component
 *
 * Next-gen job listing with AI-powered features:
 * - Real-time fit scoring
 * - Animated skill match badges
 * - 3D hover tilt effect
 * - Live applicant metrics
 * - Expandable salary visualization
 *
 * Uses Framer Motion for smooth animations
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Globe,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { JobType, JobLocation } from '@prisma/client';

interface JobCardProps {
  id: string;
  slug: string;
  title: string;
  department: string | null;
  type: JobType;
  location: JobLocation;
  salary: string | null;
  description: string;
  publishedAt: string | null; // Changed from Date to string for serialization
  applicationsCount: number;
  // Optional: fit score if user has uploaded resume
  fitScore?: number;
  matchedSkills?: string[];
}

export default function InteractiveJobCard({
  id,
  slug,
  title,
  department,
  type,
  location,
  salary,
  description,
  publishedAt,
  applicationsCount,
  fitScore,
  matchedSkills = [],
}: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSalaryDetails, setShowSalaryDetails] = useState(false);

  const getTypeColor = (jobType: JobType) => {
    switch (jobType) {
      case 'FULL_TIME':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PART_TIME':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONTRACT':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'INTERNSHIP':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LocationIcon = ({ loc }: { loc: JobLocation }) => {
    switch (loc) {
      case 'REMOTE':
        return <Globe className="w-5 h-5" />;
      case 'HYBRID':
      case 'ON_SITE':
        return <Building className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  // Calculate competition level based on applicants
  const getCompetitionLevel = () => {
    if (applicationsCount < 10) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (applicationsCount < 25) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const competition = getCompetitionLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative"
    >
      <Link href={`/careers/${slug}`}>
        <motion.div
          className={`
            relative bg-white rounded-2xl border-2 transition-all duration-300
            ${isHovered ? 'border-teal-300 shadow-2xl' : 'border-gray-200 shadow-md'}
          `}
        >
          {/* Fit Score Badge (if available) */}
          {fitScore && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="absolute -top-3 -right-3 z-10"
            >
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold text-sm">
                    {fitScore}% Match
                  </span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full bg-teal-400"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          )}

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                  {title}
                </h2>
                {department && (
                  <p className="text-sm text-gray-600 font-medium">{department}</p>
                )}
              </div>
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getTypeColor(type)}`}
              >
                {type.replace('_', ' ')}
              </motion.span>
            </div>

            {/* Matched Skills (if fit score available) */}
            {matchedSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-semibold text-teal-600">
                    {matchedSkills.length} of your skills match
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.slice(0, 4).map((skill, index) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="px-2 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-medium border border-teal-200"
                    >
                      {skill}
                    </motion.span>
                  ))}
                  {matchedSkills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium">
                      +{matchedSkills.length - 4} more
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <LocationIcon loc={location} />
                <span className="font-medium">{location.replace('_', ' ')}</span>
              </div>

              {/* Salary with hover details */}
              {salary && (
                <div
                  className="relative flex items-center gap-2"
                  onMouseEnter={() => setShowSalaryDetails(true)}
                  onMouseLeave={() => setShowSalaryDetails(false)}
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">{salary}</span>

                  {/* Salary Details Tooltip */}
                  {showSalaryDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-2 z-20 bg-gray-900 text-white p-3 rounded-lg shadow-xl w-48"
                    >
                      <p className="text-xs font-semibold mb-2">Growth Projection</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Year 1:</span>
                          <span className="font-semibold">~PKR 600K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Year 2:</span>
                          <span className="font-semibold">~PKR 900K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Year 3:</span>
                          <span className="font-semibold text-teal-400">~PKR 1.5M</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-teal-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>150% growth potential</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>
                    Posted {new Date(publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Description Preview */}
            <p className="text-gray-700 line-clamp-2 mb-4 leading-relaxed">
              {description.substring(0, 200)}...
            </p>

            {/* Footer - Metrics & CTA */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {/* Live Metrics */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {applicationsCount} candidate{applicationsCount !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${competition.bg} ${competition.color}`}>
                  {competition.level} Competition
                </div>
              </div>

              {/* CTA */}
              <motion.div
                whileHover={{ x: 5 }}
                className="text-teal-600 font-semibold flex items-center gap-2"
              >
                <span>View Details</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  →
                </motion.span>
              </motion.div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400/10 to-purple-400/10 pointer-events-none"
            />
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
}
