"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  serviceCount: number | string;
  href: string;
  accent: "govcon" | "it" | "writing" | "sled";
  icon?: React.ReactNode;
}

const accentColors = {
  govcon: {
    border: "border-govcon/20 hover:border-govcon",
    bg: "bg-govcon/5 hover:bg-govcon/10",
    text: "text-govcon",
    glow: "group-hover:shadow-govcon/20",
  },
  sled: {
    border: "border-govcon/20 hover:border-govcon",
    bg: "bg-govcon/5 hover:bg-govcon/10",
    text: "text-govcon",
    glow: "group-hover:shadow-govcon/20",
  },
  it: {
    border: "border-it/20 hover:border-it",
    bg: "bg-it/5 hover:bg-it/10",
    text: "text-it",
    glow: "group-hover:shadow-it/20",
  },
  writing: {
    border: "border-writing/20 hover:border-writing",
    bg: "bg-writing/5 hover:bg-writing/10",
    text: "text-writing",
    glow: "group-hover:shadow-writing/20",
  },
};

export function ServiceCard({
  title,
  description,
  serviceCount,
  href,
  accent,
  icon,
}: ServiceCardProps) {
  const colors = accentColors[accent];

  return (
    <Link href={href} className="group block">
      <div
        className={`
        relative h-full p-8 rounded-xl border-2
        ${colors.border} ${colors.bg}
        transition-all duration-300
        hover:shadow-xl ${colors.glow}
        hover:-translate-y-1
      `}
      >
        {/* Icon or Service Count Badge */}
        <div className="flex items-start justify-between mb-4">
          {icon ? (
            <div className={`${colors.text}`}>{icon}</div>
          ) : (
            <span
              className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold
              ${colors.bg} ${colors.text}
            `}
            >
              {serviceCount} {typeof serviceCount === 'number' && serviceCount > 1 ? 'Services' : 'Service'}
            </span>
          )}

          {/* Arrow Icon */}
          <ArrowRight
            className={`
            w-6 h-6 ${colors.text}
            transition-transform duration-300
            group-hover:translate-x-1
          `}
          />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-navy-900 mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed">{description}</p>

        {/* Hover indicator */}
        <div
          className={`
          mt-6 inline-flex items-center gap-2 text-sm font-semibold
          ${colors.text}
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
        `}
        >
          Learn more
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
