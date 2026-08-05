"use client";

import { useState } from "react";

export function DeleteListingButton({
  action,
}: {
  action: () => Promise<void>;
}) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-zinc-400 transition hover:text-red-600"
      >
        Delete this listing
      </button>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="text-zinc-600">Delete for good?</span>
      <button
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          action();
        }}
        className="font-semibold text-red-600 hover:underline disabled:opacity-60"
      >
        {busy ? "Deleting…" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="text-zinc-500 hover:underline"
      >
        Cancel
      </button>
    </span>
  );
}
