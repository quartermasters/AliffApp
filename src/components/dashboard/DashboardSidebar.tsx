'use client';

/**
 * Dashboard Sidebar Component
 *
 * Modern sidebar navigation for Super Admin dashboard
 * Responsive with mobile drawer
 */

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@prisma/client';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  Shield,
  Workflow,
  FileCheck,
  DollarSign,
  History,
  Menu,
  X,
  Sparkles,
  Building2,
  UserCog,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  roles: Role[];
}

const navigation: NavItem[] = [
  {
    name: 'Overview',
    href: '/dashboard/super-admin',
    icon: LayoutDashboard,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Projects',
    href: '/dashboard/super-admin/projects',
    icon: FolderKanban,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'SDL Processing',
    href: '/dashboard/super-admin/sdl',
    icon: Workflow,
    badge: 'AI',
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Quality Gates',
    href: '/dashboard/super-admin/gates',
    icon: Shield,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Deliverables',
    href: '/dashboard/super-admin/deliverables',
    icon: FileCheck,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Team Providers',
    href: '/dashboard/super-admin/providers',
    icon: UserCheck,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Clients',
    href: '/dashboard/super-admin/clients',
    icon: Building2,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Users',
    href: '/dashboard/super-admin/users',
    icon: Users,
    roles: [Role.SUPER_ADMIN],
  },
  {
    name: 'Analytics',
    href: '/dashboard/super-admin/analytics',
    icon: BarChart3,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
  {
    name: 'Payroll',
    href: '/dashboard/super-admin/payroll',
    icon: DollarSign,
    roles: [Role.SUPER_ADMIN],
  },
  {
    name: 'Audit Logs',
    href: '/dashboard/super-admin/audit',
    icon: History,
    roles: [Role.SUPER_ADMIN],
  },
  {
    name: 'Settings',
    href: '/dashboard/super-admin/settings',
    icon: Settings,
    roles: [Role.SUPER_ADMIN, Role.ADMIN],
  },
];

interface DashboardSidebarProps {
  role: Role;
  userName: string;
}

export default function DashboardSidebar({ role, userName }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              ALIFF
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 transform transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          bg-slate-900/95 backdrop-blur-xl border-r border-slate-800
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                ALIFF
              </h1>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-slate-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{userName}</p>
                <p className="text-xs text-slate-400">{role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
