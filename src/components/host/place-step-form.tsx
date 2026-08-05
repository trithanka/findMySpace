"use client";

import { useState } from "react";
import { LocationPicker } from "@/components/host/location-picker";
import { StepForm } from "@/components/host/step-form";
import { Input, Label, Select } from "@/components/ui/form";
import { PROPERTY_TYPE_CONFIG, PROPERTY_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/server/actions/host";
import type { Locality } from "@/server/queries/localities";

type Props = {
  action: (formData: FormData) => Promise<ActionResult>;
  localities: Locality[];
  submitLabel?: string;
  backHref?: string;
  defaults?: {
    type?: string;
    localityId?: number;
    latitude?: number | null;
    longitude?: number | null;
    addressLine?: string | null;
    landmark?: string | null;
  };
};

/** Step 1 — what it is and exactly where it is. */
export function PlaceStepForm({
  action,
  localities,
  submitLabel,
  backHref,
  defaults,
}: Props) {
  const [type, setType] = useState(defaults?.type ?? PROPERTY_TYPES[0]);

  return (
    <StepForm action={action} submitLabel={submitLabel} backHref={backHref}>
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-700">
          What are you listing?
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {PROPERTY_TYPES.map((value) => (
            <label
              key={value}
              className={cn(
                "cursor-pointer rounded-xl border-2 px-4 py-3 text-sm font-semibold transition",
                type === value
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
              )}
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="sr-only"
              />
              {PROPERTY_TYPE_CONFIG[value].label}
              <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                Priced per {PROPERTY_TYPE_CONFIG[value].defaultPriceUnit}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="localityId">Locality</Label>
          <Select
            id="localityId"
            name="localityId"
            required
            defaultValue={defaults?.localityId ?? ""}
          >
            <option value="" disabled>
              Choose an area
            </option>
            {localities.map((locality) => (
              <option key={locality.id} value={locality.id}>
                {locality.name}
              </option>
            ))}
          </Select>
          <p className="mt-1 text-xs text-zinc-500">
            This is what visitors see instead of your address.
          </p>
        </div>
        <div>
          <Label htmlFor="landmark">Nearby landmark (optional)</Label>
          <Input
            id="landmark"
            name="landmark"
            defaultValue={defaults?.landmark ?? ""}
            placeholder="e.g. Near Zoo Road Tiniali"
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-700">
          Pin the exact location
        </h2>
        <p className="mb-3 mt-1 text-xs text-zinc-500">
          Accuracy here is what lets us find you for the visit — it is never
          published.
        </p>
        <LocationPicker
          defaultLat={defaults?.latitude}
          defaultLng={defaults?.longitude}
          defaultAddress={defaults?.addressLine}
        />
      </div>
    </StepForm>
  );
}
