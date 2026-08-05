"use client";

import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker } from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input, Label } from "@/components/ui/form";
import { MapAttribution } from "@/components/ui/map-attribution";
import {
  formatCoord,
  GUWAHATI_CENTER,
  OSM_TILE_URL,
  reverseGeocode,
  searchPlaces,
  type PlaceSuggestion,
} from "@/lib/map";

type Props = {
  defaultLat?: number | null;
  defaultLng?: number | null;
  defaultAddress?: string | null;
  /** Homestays publish the pin and address; PGs and rentals do not. */
  addressIsPublic?: boolean;
};

const ZOOM_CITY = 12;
const ZOOM_PINNED = 17;
const SEARCH_DEBOUNCE_MS = 350;

/**
 * Exact-location step, on Leaflet + OpenStreetMap so it needs no API key and
 * cannot generate a bill. The host searches an address or drags the pin; we
 * keep the precise coordinates. They are private — the public property page
 * renders an approximate circle from them, never this marker.
 *
 * Everything is reported through hidden inputs so the surrounding plain `<form>`
 * and its server action need to know nothing about maps. If the tiles or the
 * geocoder are unreachable, the manual latitude/longitude fields below stay
 * usable, so the step never becomes a dead end.
 */
export function LocationPicker({
  defaultLat,
  defaultLng,
  defaultAddress,
  addressIsPublic = false,
}: Props) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const searchAbort = useRef<AbortController | null>(null);

  const [lat, setLat] = useState<number | null>(defaultLat ?? null);
  const [lng, setLng] = useState<number | null>(defaultLng ?? null);
  const [address, setAddress] = useState(defaultAddress ?? "");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [mapError, setMapError] = useState("");
  const [locating, setLocating] = useState(false);

  const placePin = useCallback(
    (position: { lat: number; lng: number }, lookupAddress = true) => {
      setLat(position.lat);
      setLng(position.lng);

      const marker = markerRef.current;
      const map = mapRef.current;
      if (marker) {
        marker.setLatLng(position);
        marker.addTo(map!);
      }
      if (map) {
        map.setView(position, Math.max(map.getZoom(), ZOOM_PINNED));
      }
      if (lookupAddress) {
        reverseGeocode(position.lat, position.lng).then((found) => {
          if (found) setAddress(found);
        });
      }
    },
    [],
  );

  // ---- map setup ----
  useEffect(() => {
    let cancelled = false;

    // Leaflet touches `window` at import time, so it cannot be a static import
    // in a file Next.js also renders on the server.
    import("leaflet")
      .then((mod) => {
        const L = mod.default ?? mod;
        if (cancelled || !mapNode.current || mapRef.current) return;

        const start =
          defaultLat != null && defaultLng != null
            ? { lat: defaultLat, lng: defaultLng }
            : GUWAHATI_CENTER;

        const map = L.map(mapNode.current, {
          center: start,
          zoom: defaultLat != null ? ZOOM_PINNED : ZOOM_CITY,
          // Credit is rendered under the map by <MapAttribution /> instead, so
          // the map surface stays clean. See that component before removing it.
          attributionControl: false,
        });
        mapRef.current = map;

        L.tileLayer(OSM_TILE_URL, { maxZoom: 19 }).addTo(map);

        // A divIcon rather than Leaflet's default marker: the default pulls PNGs
        // by relative path, which bundlers rewrite and break. Inline SVG has no
        // asset to resolve and picks up the brand colour.
        const icon = L.divIcon({
          className: "",
          html: `<svg viewBox="0 0 24 32" width="30" height="40" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20c0-6.6-5.4-12-12-12z" fill="#e8241f"/>
            <circle cx="12" cy="12" r="4.5" fill="#fff"/>
          </svg>`,
          iconSize: [30, 40],
          iconAnchor: [15, 40],
        });

        const marker = L.marker(start, { icon, draggable: true });
        markerRef.current = marker;
        if (defaultLat != null) marker.addTo(map);

        marker.on("dragend", () => placePin(marker.getLatLng()));
        map.on("click", (event) => placePin(event.latlng));

        // The container is often still being laid out on first paint, which
        // leaves Leaflet measuring zero and rendering a grey strip.
        setTimeout(() => map.invalidateSize(), 0);
      })
      .catch(() => {
        if (!cancelled) {
          setMapError(
            "The map could not load — enter the coordinates manually below.",
          );
        }
      });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Mount-only: `defaultLat`/`defaultLng` seed the initial view, and rebuilding
    // the map when the pin moves would fight the user mid-drag.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- address search ----
  useEffect(() => {
    // Clearing is handled by the input's own handler — setting state
    // synchronously in an effect body would cascade an extra render.
    if (query.trim().length < 3) return;

    // Debounced, and the previous request is aborted rather than left to land
    // late and overwrite newer results with older ones.
    const timer = setTimeout(() => {
      searchAbort.current?.abort();
      const controller = new AbortController();
      searchAbort.current = controller;
      setSearching(true);

      searchPlaces(query, controller.signal)
        .then((results) => {
          if (controller.signal.aborted) return;
          setSuggestions(results);
          setSearching(false);
          if (results.length === 0) {
            setMapError("No match for that address — try the landmark, or click the map.");
          } else {
            setMapError("");
          }
        })
        .catch((error: Error) => {
          if (error.name === "AbortError") return;
          setSearching(false);
          setMapError("Address search is unavailable — click the map to drop the pin.");
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  function chooseSuggestion(suggestion: PlaceSuggestion) {
    setQuery("");
    setSuggestions([]);
    setAddress(suggestion.label);
    // The suggestion already carries its address; re-geocoding it would only
    // overwrite a better string with a worse one.
    placePin({ lat: suggestion.lat, lng: suggestion.lng }, false);
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setMapError("Your browser cannot share a location.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocating(false);
        placePin({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setLocating(false);
        setMapError("We could not read your location — drop the pin manually.");
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  /** Typed coordinates still have to move the marker, not just the inputs. */
  function handleManualCoord(which: "lat" | "lng", raw: string) {
    const parsed = raw === "" ? null : Number.parseFloat(raw);
    const next = parsed !== null && Number.isFinite(parsed) ? parsed : null;
    if (which === "lat") setLat(next);
    else setLng(next);

    const nextLat = which === "lat" ? next : lat;
    const nextLng = which === "lng" ? next : lng;
    if (nextLat !== null && nextLng !== null && mapRef.current) {
      markerRef.current?.setLatLng({ lat: nextLat, lng: nextLng });
      markerRef.current?.addTo(mapRef.current);
      mapRef.current.setView({ lat: nextLat, lng: nextLng });
    }
  }

  const pinned = lat !== null && lng !== null;

  return (
    <div className="space-y-3">
      <input type="hidden" name="latitude" value={lat ?? ""} />
      <input type="hidden" name="longitude" value={lng ?? ""} />

      <div className="relative">
        <Label htmlFor="place-search">Search your address</Label>
        <Input
          id="place-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (value.trim().length < 3) setSuggestions([]);
          }}
          onKeyDown={(event) => {
            // This lives inside the step form; Enter must pick a suggestion,
            // not submit the half-filled step.
            if (event.key === "Enter") {
              event.preventDefault();
              if (suggestions[0]) chooseSuggestion(suggestions[0]);
            }
          }}
          placeholder="e.g. Zoo Road Tiniali, Guwahati"
        />
        {searching && (
          <span className="absolute right-3 top-9 text-xs text-zinc-400">
            Searching…
          </span>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-[1100] mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg">
            {suggestions.map((suggestion) => (
              <li key={`${suggestion.lat},${suggestion.lng},${suggestion.label}`}>
                <button
                  type="button"
                  onClick={() => chooseSuggestion(suggestion)}
                  className="block w-full px-3 py-2 text-left text-sm text-zinc-700 transition hover:bg-brand-50"
                >
                  {suggestion.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div
          ref={mapNode}
          data-testid="location-map"
          className="h-72 w-full overflow-hidden rounded-xl border border-zinc-300 bg-zinc-100 sm:h-96"
        />
        <MapAttribution />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {locating ? "Locating…" : "Use my current location"}
        </button>
        <p className="text-sm text-zinc-500" data-testid="pin-status">
          {pinned
            ? `Pinned at ${formatCoord(lat)}, ${formatCoord(lng)}`
            : "Click the map or search an address to drop the pin."}
        </p>
      </div>

      <div>
        <Label htmlFor="addressLine">
          Full address {addressIsPublic ? "(shown to guests)" : "(private)"}
        </Label>
        <Input
          id="addressLine"
          name="addressLine"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="House / flat number, street, area"
        />
        <p
          className={`mt-1 text-xs ${addressIsPublic ? "text-amber-700" : "text-zinc-500"}`}
        >
          {addressIsPublic
            ? "This appears on your public listing so guests can find the place."
            : "Only we see this. Public pages show the locality and a rough map circle, never your exact address."}
        </p>
      </div>

      <details className="text-sm">
        <summary className="cursor-pointer text-zinc-500 hover:text-zinc-700">
          Enter coordinates manually
        </summary>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="manual-lat">Latitude</Label>
            <Input
              id="manual-lat"
              type="number"
              step="any"
              value={lat ?? ""}
              onChange={(event) => handleManualCoord("lat", event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="manual-lng">Longitude</Label>
            <Input
              id="manual-lng"
              type="number"
              step="any"
              value={lng ?? ""}
              onChange={(event) => handleManualCoord("lng", event.target.value)}
            />
          </div>
        </div>
      </details>

      {mapError && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {mapError}
        </p>
      )}
    </div>
  );
}
