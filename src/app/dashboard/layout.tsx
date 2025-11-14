/**
 * Dashboard Layout
 *
 * Wraps all dashboard pages with tRPC provider and common layout
 */

import { TRPCProvider } from '@/lib/trpc/Provider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
