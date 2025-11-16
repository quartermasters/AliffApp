/**
 * Active SDL Tasks Component
 *
 * Displays active SDL processing tasks with AI providers
 */

import Link from 'next/link';
import { ArrowRight, Zap, Brain, Sparkles } from 'lucide-react';

export default function ActiveSDLTasks() {
  // Mock data - replace with actual data from database
  const tasks = [
    {
      id: 'SDL-001',
      projectCode: 'PROJ-2025-001',
      taskNumber: 5,
      taskName: 'Competitive Analysis',
      phase: 'PHASE1_TRIAGE',
      primaryAI: 'GPT-4',
      status: 'PROCESSING',
      progress: 65,
    },
    {
      id: 'SDL-002',
      projectCode: 'PROJ-2025-001',
      taskNumber: 12,
      taskName: 'Win Probability Assessment',
      phase: 'PHASE2_STRATEGIC_INTEL',
      primaryAI: 'Claude',
      status: 'PROCESSING',
      progress: 42,
    },
    {
      id: 'SDL-003',
      projectCode: 'PROJ-2025-002',
      taskNumber: 8,
      taskName: 'Past Performance Review',
      phase: 'PHASE1_TRIAGE',
      primaryAI: 'Gemini',
      status: 'PROCESSING',
      progress: 88,
    },
  ];

  const getAIIcon = (ai: string) => {
    const icons: Record<string, { icon: any; color: string }> = {
      'GPT-4': { icon: Sparkles, color: 'green' },
      'Claude': { icon: Brain, color: 'purple' },
      'Gemini': { icon: Zap, color: 'blue' },
    };
    return icons[ai] || icons['GPT-4'];
  };

  const getPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      PHASE1_TRIAGE: 'blue',
      PHASE2_STRATEGIC_INTEL: 'purple',
      PHASE3_WIN_STRATEGY: 'cyan',
    };
    return colors[phase] || 'blue';
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Active SDL Tasks</h2>
        <Link
          href="/dashboard/super-admin/sdl"
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          View queue
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <Zap className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No active SDL tasks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const aiInfo = getAIIcon(task.primaryAI);
            const AIIcon = aiInfo.icon;
            const phaseColor = getPhaseColor(task.phase);

            return (
              <div
                key={task.id}
                className="p-4 rounded-lg bg-slate-900/50 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-mono text-slate-500">
                        {task.projectCode}
                      </p>
                      <span className="text-xs text-slate-600">•</span>
                      <p className="text-xs text-slate-500">
                        Task #{task.taskNumber}
                      </p>
                    </div>
                    <h3 className="text-white font-medium text-sm mb-1">
                      {task.taskName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${phaseColor}-500/10 text-${phaseColor}-400 border border-${phaseColor}-500/30`}>
                        {task.phase.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-${aiInfo.color}-500/10 border border-${aiInfo.color}-500/30`}>
                    <AIIcon className={`w-3.5 h-3.5 text-${aiInfo.color}-400`} />
                    <span className={`text-xs font-medium text-${aiInfo.color}-400`}>
                      {task.primaryAI}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                      Processing
                    </span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r from-${aiInfo.color}-500 to-${aiInfo.color}-400 rounded-full transition-all duration-300`}
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SDL Info */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">
          <span className="font-semibold text-slate-400">SDL</span> = Solicitation Diagnosis Lab
          <br />
          34 AI-powered tasks across 3 phases
        </p>
      </div>
    </div>
  );
}
