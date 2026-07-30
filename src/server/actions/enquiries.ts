"use server";

import { db } from "@/db";
import { enquiries } from "@/db/schema";

export type EnquiryFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const propertyId = Number.parseInt(String(formData.get("propertyId")), 10);
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const moveInDate = String(formData.get("moveInDate") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (Number.isNaN(propertyId) || !name || !phone) {
    return { status: "error", message: "Please fill in your name and phone." };
  }
  if (!/^[+\d][\d\s-]{7,14}$/.test(phone)) {
    return { status: "error", message: "Please enter a valid phone number." };
  }

  await db.insert(enquiries).values({
    propertyId,
    name,
    phone,
    moveInDate: moveInDate || null,
    message: message || null,
  });

  return {
    status: "success",
    message: "Thanks! We'll get back to you shortly.",
  };
}
