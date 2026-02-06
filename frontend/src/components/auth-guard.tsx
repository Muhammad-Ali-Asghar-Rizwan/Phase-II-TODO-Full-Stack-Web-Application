"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Dev override: if NEXT_PUBLIC_SKIP_AUTH is set to "true" we bypass auth checks
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
    return <>{children}</>;
  }

  const { user: session, isLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.push("/auth");
    }
  }, [session, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!session) return null;

  return <>{children}</>;
}
