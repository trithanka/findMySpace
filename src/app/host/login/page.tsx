import { redirect } from "next/navigation";

/**
 * `/host` is the one place hosts sign in, so this old URL just forwards there —
 * bookmarks and any stray link keep working instead of 404ing.
 */
export default function HostLoginPage() {
  redirect("/host");
}
