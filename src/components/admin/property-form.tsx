"use client";

import { useState, type ChangeEvent } from "react";
import { Input, Label, Select, SubmitButton, Textarea } from "@/components/ui/form";
import {
  AMENITIES,
  FURNISHING_LABELS,
  GENDER_PREFERENCE_LABELS,
  PROPERTY_TYPE_CONFIG,
  PROPERTY_TYPES,
  STATUS_LABELS,
} from "@/lib/constants";
import { instagramPermalink } from "@/lib/instagram";
import type { getPropertyById } from "@/server/queries/admin";
import type { Locality } from "@/server/queries/localities";

type PropertyWithImages = NonNullable<
  Awaited<ReturnType<typeof getPropertyById>>
>;

export function PropertyForm({
  action,
  localities,
  property,
}: {
  action: (formData: FormData) => Promise<void>;
  localities: Locality[];
  property?: PropertyWithImages;
}) {
  const [selectedPreviews, setSelectedPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setSelectedPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  /**
   * Photos go browser → Cloudinary directly. Sending them through the server
   * action instead would put the raw bytes in the POST body, which Vercel
   * rejects with 413 once they pass ~4.5MB.
   */
  async function uploadToCloudinary(file: File): Promise<string> {
    const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
    if (!signRes.ok) {
      throw new Error("Could not authorise the upload. Are you still signed in?");
    }
    const { cloudName, apiKey, timestamp, folder, signature } =
      await signRes.json();

    const body = new FormData();
    body.append("file", file);
    body.append("api_key", apiKey);
    body.append("timestamp", String(timestamp));
    body.append("folder", folder);
    body.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body },
    );
    if (!res.ok) {
      throw new Error(`${file.name} failed to upload (${res.status})`);
    }
    return (await res.json()).secure_url as string;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    const formData = new FormData(event.currentTarget);

    try {
      const uploaded: string[] = [];
      for (const [index, file] of selectedFiles.entries()) {
        setProgress(`Uploading photo ${index + 1} of ${selectedFiles.length}…`);
        uploaded.push(await uploadToCloudinary(file));
      }

      if (uploaded.length > 0) {
        const pasted = String(formData.get("imageUrls") ?? "").trim();
        formData.set(
          "imageUrls",
          [pasted, ...uploaded].filter(Boolean).join("\n"),
        );
      }

      setProgress("Saving property…");
      await action(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      setProgress("");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-5 rounded-xl border border-zinc-200 bg-white p-6"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={property?.title}
          placeholder="e.g. Boys PG near Ganeshguri flyover"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select id="type" name="type" required defaultValue={property?.type}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {PROPERTY_TYPE_CONFIG[type].label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="price">Price (₹, per month / night)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            required
            defaultValue={property?.price}
          />
        </div>
        <div>
          <Label htmlFor="deposit">Deposit (₹, optional)</Label>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            min={0}
            defaultValue={property?.deposit ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="localityId">Locality</Label>
          <Select
            id="localityId"
            name="localityId"
            required
            defaultValue={property?.localityId}
          >
            {localities.map((locality) => (
              <option key={locality.id} value={locality.id}>
                {locality.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="landmark">Landmark (approximate area hint)</Label>
          <Input
            id="landmark"
            name="landmark"
            defaultValue={property?.landmark ?? ""}
            placeholder="e.g. Near Zoo Road Tiniali"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="bedrooms">Bedrooms (optional)</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={property?.bedrooms ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="furnishing">Furnishing</Label>
          <Select
            id="furnishing"
            name="furnishing"
            defaultValue={property?.furnishing ?? ""}
          >
            <option value="">Not specified</option>
            {Object.entries(FURNISHING_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="genderPreference">Gender preference (PG)</Label>
          <Select
            id="genderPreference"
            name="genderPreference"
            defaultValue={property?.genderPreference ?? "any"}
          >
            {Object.entries(GENDER_PREFERENCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-700">
          Amenities
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 text-sm text-zinc-600"
            >
              <input
                type="checkbox"
                name="amenities"
                value={amenity}
                defaultChecked={property?.amenities.includes(amenity)}
                className="h-4 w-4 rounded border-zinc-300 accent-brand-600"
              />
              {amenity}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={5}
          required
          defaultValue={property?.description}
        />
      </div>

      <div>
        <Label htmlFor="instagramUrl">Instagram reel link (optional)</Label>
        <Input
          id="instagramUrl"
          name="instagramUrl"
          defaultValue={
            property?.instagramShortcode
              ? instagramPermalink(property.instagramShortcode)
              : ""
          }
          placeholder="https://www.instagram.com/reel/ABC123/"
          pattern="\s*|.*instagram\.com/(?:reels?|p|tv)/[A-Za-z0-9_-]{5,30}.*"
          title="Paste a full Instagram reel URL, e.g. https://www.instagram.com/reel/ABC123/"
        />
        <p className="mt-1 text-xs text-zinc-500">
          Plays inside the property page. Paste the full reel URL — share links
          (instagram.com/share/…) won&apos;t work.
        </p>
      </div>

      <div className="space-y-2 rounded-lg border border-dashed border-zinc-300 p-4 bg-zinc-50/50">
        <Label htmlFor="imageFiles">Upload Image Files (from computer/phone)</Label>
        {/* Deliberately has no `name`: the files are uploaded by JS above, so
            they must not be serialised into the server action's POST body. */}
        <Input
          id="imageFiles"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700"
        />
        {selectedPreviews.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {selectedPreviews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Preview ${i + 1}`}
                className="h-20 w-20 rounded-lg object-cover border border-zinc-300 shadow-xs"
              />
            ))}
          </div>
        )}
        <p className="text-xs text-zinc-500">
          Uploaded straight to Cloudinary from your browser, so large phone
          photos are fine.
        </p>
      </div>

      <div>
        <Label htmlFor="imageUrls">Or paste Image URLs (one per line, optional)</Label>
        <Textarea
          id="imageUrls"
          name="imageUrls"
          rows={3}
          defaultValue={property?.images.map((image) => image.url).join("\n")}
          placeholder={"https://…/photo-1.jpg\nhttps://…/photo-2.jpg"}
        />
      </div>

      <div className="grid gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="ownerName">Owner name (private)</Label>
          <Input
            id="ownerName"
            name="ownerName"
            defaultValue={property?.ownerName ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="ownerPhone">Owner phone (private)</Label>
          <Input
            id="ownerPhone"
            name="ownerPhone"
            defaultValue={property?.ownerPhone ?? ""}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            name="status"
            defaultValue={property?.status ?? "available"}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      <SubmitButton disabled={busy}>
        {busy
          ? progress || "Working…"
          : property
            ? "Save changes"
            : "Create property"}
      </SubmitButton>
    </form>
  );
}
