"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input, Label } from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";

/**
 * Name editing only. Email is what the account is keyed on and what we use to
 * reach a host about their listings, so changing it is a support request rather
 * than a field — the account page says so.
 */
export function ProfileForm({ name }: { name: string }) {
  const router = useRouter();
  const [value, setValue] = useState(name);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  const dirty = value.trim() !== name && value.trim().length > 0;

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("saving");

    const { error: updateError } = await authClient.updateUser({
      name: value.trim(),
    });

    if (updateError) {
      setError(updateError.message ?? "Could not save your name.");
      setStatus("idle");
      return;
    }

    setStatus("saved");
    // Refresh so the header and shell pick the new name up immediately.
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label htmlFor="displayName">Your name</Label>
        <Input
          id="displayName"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setStatus("idle");
          }}
          placeholder="How owners and our team see you"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!dirty || status === "saving"}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save changes"}
        </button>
        {status === "saved" && !dirty && (
          <span className="text-sm font-medium text-emerald-600">Saved</span>
        )}
      </div>
    </form>
  );
}
