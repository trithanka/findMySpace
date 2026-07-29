"use client";

import { useTransition } from "react";
import { STATUS_LABELS } from "@/lib/constants";
import { setPropertyStatus } from "@/server/actions/properties";

type Status = "available" | "occupied" | "hidden";

export function StatusSelect({
  propertyId,
  status,
}: {
  propertyId: number;
  status: Status;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(event) => {
        const next = event.target.value as Status;
        startTransition(() => setPropertyStatus(propertyId, next));
      }}
      className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 disabled:opacity-50"
    >
      {Object.entries(STATUS_LABELS).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
