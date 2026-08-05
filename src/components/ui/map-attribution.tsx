/**
 * OpenStreetMap credit, rendered under the map instead of inside it.
 *
 * This is not decoration and must not be deleted: OSM's data is ODbL-licensed
 * and crediting "© OpenStreetMap contributors" is the condition of using the
 * free tiles this site runs on. What the licence does *not* dictate is how loud
 * it has to be — so Leaflet's in-map control is switched off (along with its
 * own optional "Leaflet" credit) and the requirement is met by this one faint
 * line, which keeps the map itself clean.
 */
export function MapAttribution({ className = "" }: { className?: string }) {
  return (
    <p className={`mt-1 text-[10px] leading-none text-zinc-400 ${className}`}>
      Map data ©{" "}
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-zinc-600 hover:underline"
      >
        OpenStreetMap
      </a>{" "}
      contributors
    </p>
  );
}
