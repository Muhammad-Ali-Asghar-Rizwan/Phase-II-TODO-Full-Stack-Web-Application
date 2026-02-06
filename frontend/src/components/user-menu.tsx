"use client";

import { signOut, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const session = useSession();
  const router = useRouter();

  if (!session.user) return null;

  return (
    <div className="flex items-center gap-4">
      <span>{session.user.name}</span>
      <button
        onClick={async () => {
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/auth");
              },
            },
          });
        }}
        className="p-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
