/**
 * Recent Projects Component
 *
 * Displays recent projects with status badges
 */

import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function RecentProjects() {
  // Mock data - replace with actual data from database
  const projects = [
    {
      id: 'PROJ-2025-001',
      title: 'DOD Cybersecurity RFP',
      client: 'Department of Defense',
      stage: 'SDL_PROCESSING',
      progress: 45,
      deadline: '2025-12-15',
    },
    {
      id: 'PROJ-2025-002',
      title: 'Healthcare IT Modernization',
      client: 'VA Medical Center',
      stage: 'TEAM_EXECUTION',
      progress: 78,
      deadline: '2025-11-30',
    },
    {
      id: 'PROJ-2025-003',
      title: 'State Procurement Portal',
      client: 'California SLED',
      stage: 'AI_VALIDATION',
      progress: 92,
      deadline: '2025-11-25',
    },
  ];

  const getStageInfo = (stage: string) => {
    const stages: Record<string, { label: string; color: string; icon: any }> = {
      SDL_PROCESSING: {
        label: 'SDL Processing',
        color: 'blue',
        icon: Clock,
      },
      TEAM_EXECUTION: {
        label: 'Team Execution',
        color: 'purple',
        icon: Clock,
      },
      AI_VALIDATION: {
        label: 'AI Validation',
        color: 'green',
        icon: CheckCircle2,
      },
      PENDING_REVIEW: {
        label: 'Pending Review',
        color: 'amber',
        icon: AlertCircle,
      },
    };
    return stages[stage] || stages.PENDING_REVIEW;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Recent Projects</h2>
        <Link
          href="/dashboard/super-admin/projects"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">No projects yet</p>
          <Link
            href="/dashboard/super-admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => {
            const stageInfo = getStageInfo(project.stage);
            const StageIcon = stageInfo.icon;

            return (
              <Link
                key={project.id}
                href={`/dashboard/super-admin/projects/${project.id}`}
                className="block p-4 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-sm font-mono text-slate-500 mb-1">
                      {project.id}
                    </p>
                    <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {project.client}
                    </p>
                  </div>

                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-${stageInfo.color}-500/10 text-${stageInfo.color}-400 border border-${stageInfo.color}-500/30`}>
                    <StageIcon className="w-3.5 h-3.5" />
                    {stageInfo.label}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
