import Link from "next/link";
import { HostShell } from "@/components/host/host-shell";
import { ProfileForm } from "@/components/host/profile-form";
import { Badge } from "@/components/ui/badge";
import { legalConfig } from "@/config/site";
import { SUBMISSION_STATUS_LABELS } from "@/lib/host-steps";
import { requireUser } from "@/server/auth-guard";
import { getHostAccount } from "@/server/queries/host";

const PROVIDER_LABELS: Record<string, string> = {
  credential: "Email and password",
  google: "Google",
};

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-zinc-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function HostAccountPage() {
  const session = await requireUser();
  const { profile, providers, counts, totalListings } = await getHostAccount(
    session.user.id,
  );

  const name = profile?.name ?? session.user.name ?? "";
  const email = profile?.email ?? session.user.email;
  const memberSince = profile?.createdAt?.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const breakdown = (
    ["approved", "submitted", "draft", "rejected"] as const
  ).filter((key) => counts[key] > 0);

  return (
    <HostShell user={{ name, email, image: profile?.image }}>
      <div className="space-y-5">
        <Card
          title="Your details"
          description="This is the name our team sees when they review your listings."
        >
          <ProfileForm name={name} />
        </Card>

        <Card title="Sign-in">
          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-zinc-500">Email</dt>
              <dd className="font-medium text-zinc-800">{email}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-zinc-500">You sign in with</dt>
              <dd className="flex flex-wrap gap-1.5">
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <Badge key={provider} variant="outline">
                      {PROVIDER_LABELS[provider] ?? provider}
                    </Badge>
                  ))
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </dd>
            </div>
            {memberSince && (
              <div className="flex flex-wrap justify-between gap-2">
                <dt className="text-zinc-500">With us since</dt>
                <dd className="font-medium text-zinc-800">{memberSince}</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-zinc-500">
            To change the email on your account, or to close it and delete your
            data, write to{" "}
            <a
              href={`mailto:${legalConfig.contactEmail}`}
              className="font-medium text-brand-700 hover:underline"
            >
              {legalConfig.contactEmail}
            </a>
            . Your rights over your data are set out in our{" "}
            <Link href="/privacy" className="font-medium text-brand-700 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Card>

        <Card title="Your listings">
          {totalListings === 0 ? (
            <div className="text-sm text-zinc-500">
              <p>You have not listed a property yet.</p>
              <Link
                href="/host/listings/new"
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Start a listing
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {breakdown.map((key) => (
                  <span
                    key={key}
                    className="rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
                  >
                    <strong className="font-semibold text-zinc-900">
                      {counts[key]}
                    </strong>{" "}
                    {SUBMISSION_STATUS_LABELS[key].toLowerCase()}
                  </span>
                ))}
              </div>
              <Link
                href="/host/listings"
                className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Manage listings →
              </Link>
            </>
          )}
        </Card>
      </div>
    </HostShell>
  );
}
