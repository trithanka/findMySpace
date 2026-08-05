"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { PinIcon } from "@/components/ui/icons";
import { MapAttribution } from "@/components/ui/map-attribution";
import { siteConfig } from "@/config/site";
import { APPROXIMATE_RADIUS_METRES, OSM_TILE_URL } from "@/lib/map";

export function ApproximateMap({
  center,
  localityName,
  precise = false,
  addressLine,
}: {
  center: { lat: number; lng: number };
  localityName: string;
  precise?: boolean;
  addressLine?: string | null;
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
          zoom: precise ? 16 : 14,
          scrollWheelZoom: false,
          dragging: false,
          touchZoom: false,
          doubleClickZoom: false,
          keyboard: false,
          zoomControl: false,
          attributionControl: false,
        });
        mapRef.current = map;

        L.tileLayer(OSM_TILE_URL, { maxZoom: 19 }).addTo(map);

        if (precise) {
          L.marker(center, {
            icon: L.divIcon({
              className: "",
              html: `<svg viewBox="0 0 24 32" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z" fill="#e8241f"/>
                <circle cx="12" cy="12" r="4.5" fill="#fff"/>
              </svg>`,
              iconSize: [30, 40],
              iconAnchor: [15, 40],
            }),
            interactive: false,
          }).addTo(map);
        } else {
          L.circle(center, {
            radius: APPROXIMATE_RADIUS_METRES,
            color: "#e8241f",
            weight: 2,
            opacity: 0.5,
            fillColor: "#fb413e",
            fillOpacity: 0.15,
            interactive: false,
          }).addTo(map);
        }

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
  }, [center, precise]);

  if (failed) return null;

  return (
    <section className="mt-10 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PinIcon className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold text-zinc-900">
              Where you&apos;ll be
            </h2>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {precise
              ? (addressLine ?? `${localityName}, ${siteConfig.city}`)
              : `Approximate area in ${localityName}, ${siteConfig.city}.`}
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
          {localityName}
        </span>
      </div>

      <div
        ref={node}
        data-testid="approximate-map"
        className="mt-4 h-64 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 sm:h-80 shadow-inner"
      />
      <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
        <span>{!precise && "Exact address provided after booking/enquiry."}</span>
        <MapAttribution />
      </div>
    </section>
  );
}
