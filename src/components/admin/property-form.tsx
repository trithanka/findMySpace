import { Input, Label, Select, SubmitButton, Textarea } from "@/components/ui/form";
import {
  AMENITIES,
  FURNISHING_LABELS,
  GENDER_PREFERENCE_LABELS,
  PROPERTY_TYPE_CONFIG,
  PROPERTY_TYPES,
  STATUS_LABELS,
} from "@/lib/constants";
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
  return (
    <form
      action={action}
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
                className="h-4 w-4 rounded border-zinc-300 accent-emerald-600"
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
        <Label htmlFor="imageUrls">Image URLs (one per line)</Label>
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

      <SubmitButton>
        {property ? "Save changes" : "Create property"}
      </SubmitButton>
    </form>
  );
}
