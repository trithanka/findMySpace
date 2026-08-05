"use client";

import { useState } from "react";
import Link from "next/link";
import type { ActionResult } from "@/server/actions/host";

type Props = {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel?: string;
  backHref?: string;
  /**
   * Runs before the action, e.g. to upload photos and fold their URLs into the
   * form data. Throwing from here surfaces inline like a validation error.
   */
  prepare?: (formData: FormData, setProgress: (text: string) => void) => Promise<void>;
};

/**
 * One wizard step. On success the action redirects, so `busy` is deliberately
 * left on — the button must not flick back to "Next" while the next page is
 * still being fetched.
 */
export function StepForm({
  action,
  children,
  submitLabel = "Next",
  backHref,
  prepare,
}: Props) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const formData = new FormData(event.currentTarget);

    try {
      await prepare?.(formData, setProgress);
      setProgress("Saving…");
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
        setBusy(false);
        setProgress("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {children}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-zinc-100 pt-5">
        {backHref && (
          <Link
            href={backHref}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100"
          >
            Back
          </Link>
        )}
        <button
          type="submit"
          disabled={busy}
          className="ml-auto inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? progress || "Working…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
