"use client";

import { useState } from "react";
import type { ActionResult } from "@/server/actions/host";

export function SubmitListingButton({
  action,
  label,
  disabled,
}: {
  action: () => Promise<ActionResult>;
  label: string;
  disabled?: boolean;
}) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError("");
    setBusy(true);
    try {
      const result = await action();
      // Success redirects, so `busy` only resets when something went wrong.
      if (result?.error) {
        setError(result.error);
        setBusy(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={submit}
        disabled={busy || disabled}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {busy ? "Submitting…" : label}
      </button>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
