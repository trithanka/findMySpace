/**
 * Map + geocoding helpers, all on free/keyless services.
 *
 * Deliberately not Google Maps: that needs a billing account with a card on
 * file even inside its free tier, which is friction we do not want between an
 * owner and their first listing. OpenStreetMap tiles and Photon geocoding need
 * no key at all, at the cost of weaker address search in Guwahati — hosts lean
 * on dragging the pin, which the picker is built around.
 */

/** Guwahati city centre — where the picker opens when there is no pin yet. */
export const GUWAHATI_CENTER = { lat: 26.1445, lng: 91.7362 } as const;

/**
 * How far the public map may sit from the real pin. Listings show a circle of
 * this radius instead of a marker, so a visitor learns the neighbourhood
 * without being handed the doorstep — enquiries still have to come through us.
 */
export const APPROXIMATE_RADIUS_METRES = 600;

export const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
// The OSM credit these tiles require is rendered by `<MapAttribution />` under
// each map rather than by Leaflet's in-map control — see that component.

/** Rounded for display — six decimals is already sub-metre precision. */
export function formatCoord(value: number): string {
  return value.toFixed(6);
}

export type PlaceSuggestion = {
  label: string;
  lat: number;
  lng: number;
};

type PhotonFeature = {
  geometry?: { coordinates?: [number, number] };
  properties?: Record<string, string | undefined>;
};

/** Builds "12 GS Road, Ulubari, Guwahati" from Photon's separate name parts. */
function describe(properties: Record<string, string | undefined> = {}): string {
  const parts = [
    [properties.housenumber, properties.street].filter(Boolean).join(" "),
    properties.name,
    properties.district,
    properties.city ?? properties.county,
    properties.state,
  ]
    .map((part) => part?.trim())
    .filter(Boolean);

  // Photon repeats values across fields (name === street is common), and a
  // suggestion list that reads "Zoo Road, Zoo Road, Guwahati" looks broken.
  return [...new Set(parts)].join(", ");
}

function toSuggestions(features: PhotonFeature[]): PlaceSuggestion[] {
  return features.flatMap((feature) => {
    const coords = feature.geometry?.coordinates;
    if (!coords) return [];
    const label = describe(feature.properties);
    if (!label) return [];
    // Photon returns GeoJSON, which is [longitude, latitude] — the opposite
    // order to every other coordinate in this codebase.
    return [{ label, lat: coords[1], lng: coords[0] }];
  });
}

/**
 * Address search. Biased towards Guwahati so a query like "Zoo Road" ranks the
 * local street above identically named ones elsewhere.
 */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<PlaceSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  const params = new URLSearchParams({
    q: trimmed,
    lat: String(GUWAHATI_CENTER.lat),
    lon: String(GUWAHATI_CENTER.lng),
    limit: "6",
    lang: "en",
  });

  const res = await fetch(`https://photon.komoot.io/api/?${params}`, { signal });
  if (!res.ok) throw new Error("Address search is unavailable right now.");

  const data = (await res.json()) as { features?: PhotonFeature[] };
  return toSuggestions(data.features ?? []);
}

/** Best-effort address for a dropped pin. Never blocks the host if it fails. */
export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<string | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    lang: "en",
  });

  try {
    const res = await fetch(`https://photon.komoot.io/reverse?${params}`, {
      signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { features?: PhotonFeature[] };
    return toSuggestions(data.features ?? [])[0]?.label ?? null;
  } catch {
    return null;
  }
}
