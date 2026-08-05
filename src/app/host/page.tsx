import Link from "next/link";
import { redirect } from "next/navigation";
import { GoogleSignInButton } from "@/components/host/google-sign-in-button";
import { HostEmailForm } from "@/components/host/host-email-form";
import { siteConfig } from "@/config/site";
import { googleAuthEnabled } from "@/lib/auth";
import { getUserSession } from "@/server/auth-guard";

const STEPS = [
  {
    title: "Pin your place",
    body: "Search your address or drag the pin on the map. The exact spot stays private — visitors only ever see the locality.",
  },
  {
    title: "Photos and price",
    body: "A few pictures from your phone, the rent, and how we reach you. About five minutes in all.",
  },
  {
    title: "We verify, then it goes live",
    body: `Our team checks every listing before it appears on ${siteConfig.name}. Enquiries come to us first, so your number stays off the public page.`,
  },
];

/**
 * The single host entry point. "List your property" lands here, and an owner
 * who is not signed in sees the sign-in/register choice immediately rather
 * than a marketing page they have to click through — the context they need to
 * decide sits beside the form instead of in front of it.
 */
export default async function HostPage() {
  const session = await getUserSession();
  if (session) redirect("/host/listings");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
            For property owners
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            List your PG, rental or homestay in {siteConfig.city}
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Free to list. We verify the details, screen the enquiries and only
            pass on people who are actually looking.
          </p>

          <ol className="mt-10 space-y-7">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
                  {index + 1}
                </span>
                <div>
                  <h2 className="font-semibold text-zinc-900">{step.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:pt-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Sign in or create an account
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              One account manages every listing you have with us.
            </p>

            <div className="mt-6 space-y-5">
              {googleAuthEnabled ? (
                <>
                  <GoogleSignInButton />
                  <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-zinc-400">
                    <span className="h-px flex-1 bg-zinc-200" />
                    or use email
                    <span className="h-px flex-1 bg-zinc-200" />
                  </div>
                </>
              ) : (
                // Dev-only: a missing button is otherwise indistinguishable
                // from a bug. Never rendered in production, where the row is
                // simply absent until the credentials are set.
                process.env.NODE_ENV === "development" && (
                  <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
                    &ldquo;Continue with Google&rdquo; is hidden because{" "}
                    <code className="font-mono">GOOGLE_CLIENT_ID</code> and{" "}
                    <code className="font-mono">GOOGLE_CLIENT_SECRET</code> are
                    empty in <code className="font-mono">.env</code>. Fill them
                    in and restart to show it.
                  </p>
                )
              )}
              <HostEmailForm />
            </div>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-zinc-400">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-zinc-600">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-zinc-600">
              Privacy Policy
            </Link>
            . We only ever use your email to reach you about your listings.
          </p>
        </div>
      </div>
    </div>
  );
}
