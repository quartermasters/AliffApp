import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div>
      <Header user={session?.user} />
      <main>{children}</main>
    </div>
  );
}
