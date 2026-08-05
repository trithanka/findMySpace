import "server-only";
import { APPROXIMATE_RADIUS_METRES } from "@/lib/map";

const METRES_PER_DEGREE_LAT = 111_320;

/**
 * Blurs an exact pin into a point the public site can safely show.
 *
 * The circle centre is nudged off the real location, because a circle drawn
 * *around* the true point still gives the true point away — its centre is the
 * answer. The offset is derived from `seed` (the property id) so it is stable
 * across renders and machines: a centre that jittered on every reload could be
 * averaged back to the real one over a few visits.
 *
 * `server-only` is load-bearing, not decorative. The seed is public — it is the
 * property id behind the `FMS-1024` display code — so if this function ever
 * reached the browser, anyone could compute `exact = approximate − offset(id)`
 * for every listing on the site. Keeping the algorithm on the server is what
 * makes the blurring irreversible; relying on a bundler to tree-shake it out
 * would not be.
 */
export function approximateLocation(
  latitude: number,
  longitude: number,
  seed: number,
): { lat: number; lng: number } {
  // Cheap deterministic hash — two uncorrelated values in [0, 1).
  const angle = (((seed * 2654435761) % 3600) / 3600) * 2 * Math.PI;
  const distance =
    (((seed * 40503) % 997) / 997) * (APPROXIMATE_RADIUS_METRES * 0.6);

  const deltaLat = (distance * Math.cos(angle)) / METRES_PER_DEGREE_LAT;
  const deltaLng =
    (distance * Math.sin(angle)) /
    (METRES_PER_DEGREE_LAT * Math.cos((latitude * Math.PI) / 180));

  return { lat: latitude + deltaLat, lng: longitude + deltaLng };
}
