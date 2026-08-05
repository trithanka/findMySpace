"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Input, Label, SubmitButton, Textarea } from "@/components/ui/form";
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
    // Success stays green — a red confirmation reads as an error.
    return (
      <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-800">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="propertyId" value={propertyId} />
      <div>
        <Label htmlFor="enquiry-name">Your name</Label>
        <Input id="enquiry-name" name="name" required placeholder="Full name" />
      </div>
      <div>
        <Label htmlFor="enquiry-phone">Phone</Label>
        <Input
          id="enquiry-phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 …"
        />
      </div>
      <div>
        <Label htmlFor="enquiry-move-in">When do you want to stay from?</Label>
        <Input
          id="enquiry-move-in"
          name="moveInDate"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div>
        <Label htmlFor="enquiry-message">Message (optional)</Label>
        <Textarea
          id="enquiry-message"
          name="message"
          rows={3}
          placeholder="Any special requirements or questions..."
        />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <SubmitButton pendingText="Sending…" className="w-full">
        Request a callback
      </SubmitButton>
      {/* Consent has to be given where the data is actually collected, not
          buried in a footer link — this is what the DPDP Act asks for. */}
      <p className="text-center text-xs leading-relaxed text-zinc-400">
        By requesting a callback you agree to our{" "}
        <Link href="/terms" className="underline hover:text-zinc-600">
          Terms
        </Link>{" "}
        and consent to us contacting you about this property, as described in
        our{" "}
        <Link href="/privacy" className="underline hover:text-zinc-600">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
