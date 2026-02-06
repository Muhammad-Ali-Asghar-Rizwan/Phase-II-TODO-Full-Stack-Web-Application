"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

// T026a [US1]: Root redirect based on auth status
export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isPending) return;
    
    setIsReady(true);
    if (session?.user) {
      router.replace("/dashboard");
      return;
    }

    router.replace("/login");
  }, [router, session, isPending]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-sm text-gray-600">Redirecting...</div>
    </div>
  );
}

