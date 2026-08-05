import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Returns the session if the current user is an allowed admin, else null. */
export async function getAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  if (!adminEmails().includes(session.user.email.toLowerCase())) return null;
  return session;
}

/** For admin pages/actions: redirects to the login page when not an admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** The signed-in user, whoever they are — no admin allowlist check. */
export async function getUserSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * For host pages/actions. Deliberately not `requireAdmin`: every host is outside
 * `ADMIN_EMAILS`, so the admin guard would lock all of them out. Ownership is
 * enforced per-row in the host actions, not here.
 */
export async function requireUser() {
  const session = await getUserSession();
  if (!session) redirect("/host");
  return session;
}
