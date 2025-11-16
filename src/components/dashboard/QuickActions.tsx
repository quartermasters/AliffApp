/**
 * Quick Actions Component
 *
 * Quick action buttons for Super Admin dashboard
 */

import Link from 'next/link';
import { Plus, FolderKanban, Workflow, Users, Shield, FileCheck } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      title: 'New Project',
      description: 'Create a new RFP/Proposal project',
      href: '/dashboard/super-admin/projects/new',
      icon: Plus,
      color: 'blue',
    },
    {
      title: 'View Projects',
      description: 'Manage all active projects',
      href: '/dashboard/super-admin/projects',
      icon: FolderKanban,
      color: 'purple',
    },
    {
      title: 'SDL Queue',
      description: 'Monitor AI processing tasks',
      href: '/dashboard/super-admin/sdl',
      icon: Workflow,
      color: 'cyan',
    },
    {
      title: 'Quality Gates',
      description: 'Review pending approvals',
      href: '/dashboard/super-admin/gates',
      icon: Shield,
      color: 'green',
    },
    {
      title: 'Team Providers',
      description: 'Manage provider assignments',
      href: '/dashboard/super-admin/providers',
      icon: Users,
      color: 'pink',
    },
    {
      title: 'Deliverables',
      description: 'Review submitted work',
      href: '/dashboard/super-admin/deliverables',
      icon: FileCheck,
      color: 'amber',
    },
  ];

  const colorClasses = {
    blue: {
      bg: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      hover: 'hover:border-blue-400',
    },
    purple: {
      bg: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      hover: 'hover:border-purple-400',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-blue-500/10',
      border: 'border-cyan-500/30',
      text: 'text-cyan-400',
      hover: 'hover:border-cyan-400',
    },
    green: {
      bg: 'from-green-500/10 to-emerald-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      hover: 'hover:border-green-400',
    },
    pink: {
      bg: 'from-pink-500/10 to-rose-500/10',
      border: 'border-pink-500/30',
      text: 'text-pink-400',
      hover: 'hover:border-pink-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      hover: 'hover:border-amber-400',
    },
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          const colors = colorClasses[action.color as keyof typeof colorClasses];

          return (
            <Link
              key={action.title}
              href={action.href}
              className={`group relative overflow-hidden flex items-center gap-4 p-4 rounded-lg bg-gradient-to-br ${colors.bg} border ${colors.border} ${colors.hover} transition-all duration-300 hover:scale-105`}
            >
              <div className={`p-3 rounded-lg bg-slate-900/50 border ${colors.border}`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>

              <div className="flex-1">
                <h3 className={`font-semibold ${colors.text} mb-1`}>
                  {action.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
