"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Dev override: if NEXT_PUBLIC_SKIP_AUTH is set to "true" we bypass auth checks
  if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
    return <>{children}</>;
  }

  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return <>{children}</>;
}
