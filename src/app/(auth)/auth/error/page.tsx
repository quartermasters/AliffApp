import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-navy py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Authentication Error
          </h1>
          <p className="text-white/70 mb-8">
            Something went wrong during authentication. Please try again.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="w-full">
              Back to Login
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
