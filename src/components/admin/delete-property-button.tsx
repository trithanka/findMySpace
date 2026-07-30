"use client";

import { useTransition } from "react";
import { deleteProperty } from "@/server/actions/properties";

export function DeletePropertyButton({ propertyId }: { propertyId: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Delete this property? This cannot be undone.")) {
          return;
        }
        startTransition(() => deleteProperty(propertyId));
      }}
      className="inline-flex min-h-9 items-center rounded-lg px-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
