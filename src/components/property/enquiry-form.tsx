"use client";

import { useActionState } from "react";
import { Input, Label, SubmitButton, Textarea } from "@/components/ui/form";
import {
  createEnquiry,
  type EnquiryFormState,
} from "@/server/actions/enquiries";

const initialState: EnquiryFormState = { status: "idle", message: "" };

export function EnquiryForm({ propertyId }: { propertyId: number }) {
  const [state, formAction, pending] = useActionState(
    createEnquiry,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
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
        <Label htmlFor="enquiry-message">Message (optional)</Label>
        <Textarea
          id="enquiry-message"
          name="message"
          rows={3}
          placeholder="When do you want to move in?"
        />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}
      <SubmitButton disabled={pending} className="w-full">
        {pending ? "Sending…" : "Request a callback"}
      </SubmitButton>
    </form>
  );
}
