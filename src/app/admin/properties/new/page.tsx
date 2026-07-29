import { PropertyForm } from "@/components/admin/property-form";
import { createProperty } from "@/server/actions/properties";
import { requireAdmin } from "@/server/auth-guard";
import { getLocalities } from "@/server/queries/localities";

export default async function NewPropertyPage() {
  await requireAdmin();
  const localities = await getLocalities();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-zinc-900">New property</h1>
      <PropertyForm action={createProperty} localities={localities} />
    </div>
  );
}
