"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/form";

export function SubmissionActions({
  approve,
  reject,
}: {
  approve: () => Promise<void>;
  reject: (formData: FormData) => Promise<void>;
}) {
  const [rejecting, setRejecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(work: () => Promise<void>) {
    setError("");
    setBusy(true);
    try {
      await work();
      setRejecting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setBusy(false);
  }

  if (rejecting) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          run(() => reject(formData));
        }}
        className="space-y-2"
      >
        <Textarea
          name="reviewNote"
          rows={3}
          required
          autoFocus
          placeholder="What does the host need to fix? They see this verbatim."
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send back"}
          </button>
          <button
            type="button"
            onClick={() => setRejecting(false)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => run(approve)}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? "Publishing…" : "Approve & publish"}
        </button>
        <button
          type="button"
          onClick={() => setRejecting(true)}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Send back
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
