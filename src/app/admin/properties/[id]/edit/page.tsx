import { notFound } from "next/navigation";
import { PropertyForm } from "@/components/admin/property-form";
import { propertyCode } from "@/lib/utils";
import { updateProperty } from "@/server/actions/properties";
import { requireAdmin } from "@/server/auth-guard";
import { getPropertyById } from "@/server/queries/admin";
import { getLocalities } from "@/server/queries/localities";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const propertyId = Number.parseInt(id, 10);
  if (Number.isNaN(propertyId)) notFound();

  const [property, localities] = await Promise.all([
    getPropertyById(propertyId),
    getLocalities(),
  ]);
  if (!property) notFound();

  const action = updateProperty.bind(null, property.id);

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-zinc-900">
        Edit {propertyCode(property.id)}
      </h1>
      <PropertyForm
        action={action}
        localities={localities}
        property={property}
      />
    </div>
  );
}
