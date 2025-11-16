/**
 * RBAC Permission System
 *
 * Defines granular permissions and role-based access control
 * for the Aliff Services Dashboard
 */

import { Role } from '@prisma/client';

// Permission definitions based on dashboard.md Section 11
export enum Permission {
  // Project Management
  PROJECT_CREATE = 'PROJECT_CREATE',
  PROJECT_VIEW_ALL = 'PROJECT_VIEW_ALL',
  PROJECT_VIEW_ASSIGNED = 'PROJECT_VIEW_ASSIGNED',
  PROJECT_EDIT = 'PROJECT_EDIT',
  PROJECT_DELETE = 'PROJECT_DELETE',

  // SDL Operations
  SDL_VIEW = 'SDL_VIEW',
  SDL_EXECUTE = 'SDL_EXECUTE',
  SDL_OVERRIDE = 'SDL_OVERRIDE',

  // Provider/Team Management
  PROVIDER_MANAGE = 'PROVIDER_MANAGE',
  PROVIDER_VIEW = 'PROVIDER_VIEW',
  TEAM_ASSIGN = 'TEAM_ASSIGN',

  // Quality Gates
  GATE_PINK_APPROVE = 'GATE_PINK_APPROVE',     // AI Validation Gate
  GATE_RED_APPROVE = 'GATE_RED_APPROVE',       // Expert Review Gate
  GATE_GOLD_APPROVE = 'GATE_GOLD_APPROVE',     // Client Approval Gate

  // Financial
  FINANCE_VIEW = 'FINANCE_VIEW',
  PAYROLL_PROCESS = 'PAYROLL_PROCESS',
  PRICING_VIEW = 'PRICING_VIEW',

  // Analytics
  ANALYTICS_VIEW_ALL = 'ANALYTICS_VIEW_ALL',
  ANALYTICS_VIEW_OWN = 'ANALYTICS_VIEW_OWN',

  // User Management
  USER_MANAGE = 'USER_MANAGE',
  USER_VIEW = 'USER_VIEW',

  // Audit
  AUDIT_VIEW = 'AUDIT_VIEW',

  // Client Portal
  FEEDBACK_SUBMIT = 'FEEDBACK_SUBMIT',
  DELIVERABLE_VIEW = 'DELIVERABLE_VIEW',
}

/**
 * Role-to-Permissions mapping
 * Defines which permissions each role has
 */
export const RolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    // God mode - all permissions
    Permission.PROJECT_CREATE,
    Permission.PROJECT_VIEW_ALL,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_DELETE,
    Permission.SDL_VIEW,
    Permission.SDL_EXECUTE,
    Permission.SDL_OVERRIDE,
    Permission.PROVIDER_MANAGE,
    Permission.PROVIDER_VIEW,
    Permission.TEAM_ASSIGN,
    Permission.GATE_PINK_APPROVE,
    Permission.GATE_RED_APPROVE,
    Permission.GATE_GOLD_APPROVE,
    Permission.FINANCE_VIEW,
    Permission.PAYROLL_PROCESS,
    Permission.PRICING_VIEW,
    Permission.ANALYTICS_VIEW_ALL,
    Permission.USER_MANAGE,
    Permission.USER_VIEW,
    Permission.AUDIT_VIEW,
  ],

  CLIENT: [
    // View-only + feedback
    Permission.PROJECT_VIEW_ASSIGNED,
    Permission.DELIVERABLE_VIEW,
    Permission.FEEDBACK_SUBMIT,
    Permission.GATE_GOLD_APPROVE,
    Permission.ANALYTICS_VIEW_OWN,
  ],

  TEAM_PROVIDER: [
    // Anonymized execution
    Permission.PROJECT_VIEW_ASSIGNED,
    Permission.DELIVERABLE_VIEW,
    Permission.ANALYTICS_VIEW_OWN,
  ],

  CANDIDATE: [
    // Application tracking only
    Permission.ANALYTICS_VIEW_OWN,
  ],

  // Legacy roles (to be deprecated)
  ADMIN: [
    Permission.PROJECT_CREATE,
    Permission.PROJECT_VIEW_ALL,
    Permission.PROJECT_EDIT,
    Permission.SDL_VIEW,
    Permission.SDL_EXECUTE,
    Permission.PROVIDER_VIEW,
    Permission.TEAM_ASSIGN,
    Permission.ANALYTICS_VIEW_ALL,
    Permission.USER_VIEW,
  ],

  RECRUITER: [
    Permission.PROVIDER_VIEW,
    Permission.PROVIDER_MANAGE,
    Permission.ANALYTICS_VIEW_ALL,
  ],

  INTERVIEWER: [
    Permission.PROVIDER_VIEW,
    Permission.ANALYTICS_VIEW_OWN,
  ],

  USER: [
    Permission.ANALYTICS_VIEW_OWN,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const rolePermissions = RolePermissions[role];
  return rolePermissions?.includes(permission) ?? false;
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return RolePermissions[role] ?? [];
}

/**
 * Role hierarchy for organizational structure
 */
export const RoleHierarchy: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 75,          // Legacy
  CLIENT: 50,
  RECRUITER: 40,      // Legacy
  TEAM_PROVIDER: 30,
  INTERVIEWER: 20,    // Legacy
  CANDIDATE: 10,
  USER: 0,            // Legacy
};

/**
 * Check if a role has higher or equal authority than another role
 */
export function hasHigherOrEqualAuthority(role: Role, targetRole: Role): boolean {
  return RoleHierarchy[role] >= RoleHierarchy[targetRole];
}

/**
 * Field-level data access control
 * Defines which fields are visible to each role
 */
export const FieldLevelAccess = {
  Project: {
    clientName: [Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENT],
    clientEmail: [Role.SUPER_ADMIN, Role.ADMIN],
    clientPhone: [Role.SUPER_ADMIN, Role.ADMIN],
    contractValue: [Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENT],
    hourlyRatePKR: [Role.SUPER_ADMIN], // CONFIDENTIAL - admin only
  },
  Candidate: {
    email: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECRUITER],
    phone: [Role.SUPER_ADMIN, Role.ADMIN, Role.RECRUITER],
    hourlyRatePKR: [Role.SUPER_ADMIN], // CONFIDENTIAL - admin only
    currentSalary: [Role.SUPER_ADMIN, Role.ADMIN],
    expectedSalary: [Role.SUPER_ADMIN, Role.ADMIN],
  },
};

/**
 * Check if a role can access a specific field
 */
export function canAccessField(
  role: Role,
  model: keyof typeof FieldLevelAccess,
  field: string
): boolean {
  const modelAccess = FieldLevelAccess[model];
  if (!modelAccess) return false;

  const fieldAccess = modelAccess[field as keyof typeof modelAccess] as Role[] | undefined;
  if (!fieldAccess) return true; // If not restricted, allow access

  return fieldAccess.includes(role);
}

/**
 * Route-based access control
 * Defines which routes are accessible to each role
 */
export const RouteAccess: Record<string, Role[]> = {
  '/dashboard/admin': [Role.SUPER_ADMIN, Role.ADMIN],
  '/dashboard/client': [Role.CLIENT, Role.SUPER_ADMIN],
  '/dashboard/provider': [Role.TEAM_PROVIDER, Role.SUPER_ADMIN],
  '/dashboard/candidate': [Role.CANDIDATE, Role.SUPER_ADMIN],
  '/dashboard/sdl': [Role.SUPER_ADMIN, Role.ADMIN],
  '/dashboard/analytics': [Role.SUPER_ADMIN, Role.ADMIN, Role.CLIENT],
  '/dashboard/users': [Role.SUPER_ADMIN],
  '/dashboard/audit': [Role.SUPER_ADMIN],
  '/dashboard/payroll': [Role.SUPER_ADMIN],
};

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: Role, route: string): boolean {
  // Check exact match first
  if (RouteAccess[route]) {
    return RouteAccess[route].includes(role);
  }

  // Check pattern matches (e.g., /dashboard/admin/*)
  const matchingRoute = Object.keys(RouteAccess).find(key => {
    if (key.endsWith('/*')) {
      const baseRoute = key.slice(0, -2);
      return route.startsWith(baseRoute);
    }
    return false;
  });

  if (matchingRoute) {
    return RouteAccess[matchingRoute].includes(role);
  }

  // Default: deny access if not explicitly allowed
  return false;
}
