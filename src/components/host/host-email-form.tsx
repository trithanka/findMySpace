"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Label } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

/**
 * Email fallback for hosts without a Google account. Sign-in and sign-up share
 * one form because a host arriving here rarely knows or cares which they need.
 */
export function HostEmailForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    const { error: authError } =
      mode === "signUp"
        ? await authClient.signUp.email({
            email,
            password,
            name: String(formData.get("name") ?? "").trim() || email,
          })
        : await authClient.signIn.email({ email, password });

    if (authError) {
      setError(authError.message ?? "That did not work — check your details.");
      setPending(false);
      return;
    }

    router.push("/host/listings");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === "signUp" && (
        <div>
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" required />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          autoComplete={
            mode === "signUp" ? "new-password" : "current-password"
          }
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 w-full rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {pending
          ? "Please wait…"
          : mode === "signUp"
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        {mode === "signUp" ? "Already listed with us?" : "New here?"}{" "}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "signUp" ? "signIn" : "signUp");
            setError("");
          }}
          className="font-semibold text-brand-700 hover:underline"
        >
          {mode === "signUp" ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}
