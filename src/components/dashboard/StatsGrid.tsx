/**
 * Stats Grid Component
 *
 * Modern stats cards for Super Admin dashboard
 */

import { FolderKanban, TrendingUp, Target, Trophy, Zap, Clock } from 'lucide-react';

export default function StatsGrid() {
  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      change: '+3 this month',
      trend: 'up' as const,
      icon: FolderKanban,
      color: 'blue',
    },
    {
      title: 'Win Rate',
      value: '22%',
      change: 'vs 18% last quarter',
      trend: 'up' as const,
      icon: Trophy,
      color: 'green',
    },
    {
      title: 'SDL Processing',
      value: '5',
      change: 'Tasks in queue',
      trend: 'neutral' as const,
      icon: Zap,
      color: 'purple',
    },
    {
      title: 'Avg Win Probability',
      value: '68%',
      change: 'SDL Analysis',
      trend: 'up' as const,
      icon: Target,
      color: 'cyan',
    },
    {
      title: 'Projects Won',
      value: '8',
      change: 'This quarter',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'emerald',
    },
    {
      title: 'Pending Approvals',
      value: '3',
      change: 'Requires action',
      trend: 'neutral' as const,
      icon: Clock,
      color: 'amber',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const gradientColors = {
          blue: 'from-blue-500 to-cyan-500',
          green: 'from-green-500 to-emerald-500',
          purple: 'from-purple-500 to-pink-500',
          cyan: 'from-cyan-500 to-blue-500',
          emerald: 'from-emerald-500 to-teal-500',
          amber: 'from-amber-500 to-orange-500',
        };

        return (
          <div
            key={stat.title}
            className="relative overflow-hidden bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all duration-300 group"
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientColors[stat.color as keyof typeof gradientColors]} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />

            {/* Content */}
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientColors[stat.color as keyof typeof gradientColors]} bg-opacity-10 border border-${stat.color}-500/30`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                </div>
                {stat.trend === 'up' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500/10 text-green-400 border border-green-500/30">
                    ↑ Up
                  </span>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500">
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
