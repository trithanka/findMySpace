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
      className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
