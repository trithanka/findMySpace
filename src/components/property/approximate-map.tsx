"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { MapAttribution } from "@/components/ui/map-attribution";
import { APPROXIMATE_RADIUS_METRES, OSM_TILE_URL } from "@/lib/map";

/**
 * The public location view: a shaded circle, no marker.
 *
 * `center` is already the blurred point — `approximateLocation` runs on the
 * server and the exact coordinates never leave it, so there is nothing precise
 * in this component's props for anyone to read out of the page source.
 */
export function ApproximateMap({
  center,
  localityName,
}: {
  center: { lat: number; lng: number };
  localityName: string;
}) {
  const node = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import("leaflet")
      .then((mod) => {
        const L = mod.default ?? mod;
        if (cancelled || !node.current || mapRef.current) return;

        const map = L.map(node.current, {
          center,
          zoom: 14,
          // The map is an illustration, not a tool — it must not swallow the
          // page scroll on a phone as the reader passes over it.
          scrollWheelZoom: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          keyboard: false,
          zoomControl: false,
          // Credit is rendered under the map by <MapAttribution /> instead.
          attributionControl: false,
        });
        mapRef.current = map;

        L.tileLayer(OSM_TILE_URL, { maxZoom: 19 }).addTo(map);

        L.circle(center, {
          radius: APPROXIMATE_RADIUS_METRES,
          color: "#e8241f",
          weight: 2,
          opacity: 0.5,
          fillColor: "#fb413e",
          fillOpacity: 0.15,
          interactive: false,
        }).addTo(map);

        setTimeout(() => map.invalidateSize(), 0);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center]);

  if (failed) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-zinc-900">
        Where you&apos;ll be
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        Approximate area in {localityName}. We share the exact address once you
        enquire.
      </p>
      <div
        ref={node}
        data-testid="approximate-map"
        className="mt-3 h-64 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 sm:h-80"
      />
      <MapAttribution />
    </section>
  );
}
