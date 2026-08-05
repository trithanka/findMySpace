"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input, Label, SubmitButton, Textarea } from "@/components/ui/form";
import { CheckVerifiedIcon } from "@/components/ui/icons";
import {
  createEnquiry,
  type EnquiryFormState,
} from "@/server/actions/enquiries";

const initialState: EnquiryFormState = { status: "idle", message: "" };

export function EnquiryForm({ propertyId }: { propertyId: number }) {
  const [state, formAction] = useActionState(
    createEnquiry,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 text-center text-sm font-medium text-emerald-900 shadow-xs">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckVerifiedIcon className="h-6 w-6" />
        </div>
        <p className="font-semibold text-emerald-950">Callback Requested!</p>
        <p className="mt-1 text-xs text-emerald-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3.5">
      <input type="hidden" name="propertyId" value={propertyId} />
      <div>
        <Label htmlFor="enquiry-name" className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Your Name
        </Label>
        <Input
          id="enquiry-name"
          name="name"
          required
          placeholder="e.g. Rahul Sharma"
          className="mt-1 bg-zinc-50/50 focus:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="enquiry-phone" className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Phone Number
        </Label>
        <Input
          id="enquiry-phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 98765 43210"
          className="mt-1 bg-zinc-50/50 focus:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="enquiry-move-in" className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Preferred Move-in Date
        </Label>
        <Input
          id="enquiry-move-in"
          name="moveInDate"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          className="mt-1 bg-zinc-50/50 focus:bg-white"
        />
      </div>
      <div>
        <Label htmlFor="enquiry-message" className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
          Message (Optional)
        </Label>
        <Textarea
          id="enquiry-message"
          name="message"
          rows={3}
          placeholder="Specific requirements, duration of stay..."
          className="mt-1 bg-zinc-50/50 focus:bg-white text-sm"
        />
      </div>
      {state.status === "error" && (
        <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
          {state.message}
        </p>
      )}
      <SubmitButton pendingText="Submitting..." className="w-full shadow-xs">
        Request a Callback
      </SubmitButton>
      <p className="text-center text-[11px] leading-relaxed text-zinc-400">
        By requesting a callback you agree to our{" "}
        <Link href="/terms" className="underline hover:text-zinc-600">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline hover:text-zinc-600">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
