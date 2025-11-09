"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Header({ user }: { user?: { name?: string | null; email?: string | null } }) {
  const router = useRouter();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <header className="bg-white dark:bg-navy-800 border-b border-gray-200 dark:border-navy-700">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline">
              Aliff Services
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium hover:text-gold-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/jobs"
              className="text-sm font-medium hover:text-gold-400 transition-colors"
            >
              Jobs
            </Link>
            <Link
              href="/dashboard/applications"
              className="text-sm font-medium hover:text-gold-400 transition-colors"
            >
              Applications
            </Link>
            <Link
              href="/dashboard/leads"
              className="text-sm font-medium hover:text-gold-400 transition-colors"
            >
              Leads
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </div>
            )}
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
