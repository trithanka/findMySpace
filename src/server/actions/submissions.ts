"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { requireAdmin } from "@/server/auth-guard";

/**
 * Approving is what actually puts a host's listing on the public site — until
 * this runs, `submissionStatus` keeps it out of every public query regardless
 * of its publication status.
 */
export async function approveSubmission(id: number) {
  await requireAdmin();
  await db
    .update(properties)
    .set({
      submissionStatus: "approved",
      reviewNote: null,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, id));

  revalidatePath("/admin", "layout");
  revalidatePath("/host/listings");
  revalidatePath("/", "layout");
}

/** Sends it back to the host with a note explaining what to fix. */
export async function rejectSubmission(id: number, formData: FormData) {
  await requireAdmin();
  const note = String(formData.get("reviewNote") ?? "").trim();
  if (!note) throw new Error("Tell the host what needs changing.");

  await db
    .update(properties)
    .set({
      submissionStatus: "rejected",
      reviewNote: note,
      updatedAt: new Date(),
    })
    .where(eq(properties.id, id));

  revalidatePath("/admin", "layout");
  revalidatePath("/host/listings");
}
