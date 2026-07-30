"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await authClient.signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="inline-flex min-h-10 shrink-0 items-center rounded-lg px-3 text-sm font-medium text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
    >
      Sign out
    </button>
  );
}
