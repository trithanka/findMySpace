"use client";

import { useState, type ChangeEvent } from "react";
import { StepForm } from "@/components/host/step-form";
import { Input, Label } from "@/components/ui/form";
import { uploadPhotos } from "@/lib/cloudinary-upload";
import type { ActionResult } from "@/server/actions/host";

type Props = {
  action: (formData: FormData) => Promise<ActionResult>;
  backHref: string;
  existingUrls: string[];
};

/**
 * Photos step. Already-saved photos stay listed so a returning host can drop
 * one without re-uploading the rest; new files only leave the browser when the
 * step is submitted, straight to Cloudinary.
 */
export function PhotoStepForm({ action, backHref, existingUrls }: Props) {
  const [saved, setSaved] = useState(existingUrls);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(event.target.files ?? []);
    setFiles(picked);
    setPreviews(picked.map((file) => URL.createObjectURL(file)));
  }

  async function prepare(
    formData: FormData,
    setProgress: (text: string) => void,
  ) {
    const uploaded = await uploadPhotos(files, setProgress);
    formData.set("imageUrls", [...saved, ...uploaded].join("\n"));
  }

  const total = saved.length + files.length;

  return (
    <StepForm action={action} backHref={backHref} prepare={prepare}>
      {saved.length > 0 && (
        <div>
          <Label>Photos on this listing</Label>
          <div className="flex flex-wrap gap-3">
            {saved.map((url) => (
              <div key={url} className="group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="h-24 w-24 rounded-lg border border-zinc-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setSaved(saved.filter((u) => u !== url))}
                  aria-label="Remove photo"
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-xs text-white shadow transition hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 p-4">
        <Label htmlFor="photos">Add photos</Label>
        <Input
          id="photos"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
        />
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3 pt-2">
            {previews.map((src, index) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`New photo ${index + 1}`}
                className="h-24 w-24 rounded-lg border border-zinc-200 object-cover"
              />
            ))}
          </div>
        )}
        <p className="text-xs text-zinc-500">
          The first photo becomes the cover. Straight from your phone is fine —
          large files are shrunk before upload.
        </p>
      </div>

      {/* Set by `prepare` once the uploads finish; kept in the form so the
          action always receives the full list, new photos and kept ones. */}
      <input type="hidden" name="imageUrls" value={saved.join("\n")} />

      <p className="text-sm text-zinc-500">
        {total === 0
          ? "Add at least one photo to continue."
          : `${total} photo${total === 1 ? "" : "s"} on this listing.`}
      </p>
    </StepForm>
  );
}
