type IconProps = { className?: string };

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function BedIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3 18v-7h13a4 4 0 0 1 4 4v3" />
      <path d="M3 11V6" />
      <path d="M3 18h18" />
      <circle cx="7.5" cy="8.5" r="1.6" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9.8V20h12V9.8" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

export function SuitcaseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="8" width="18" height="12" rx="2.5" />
      <path d="M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
    </svg>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8 8" />
      <path d="m16 16-2 2 2 2 2-2" />
    </svg>
  );
}

export function ShareIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export function HeartIcon({ className, filled }: IconProps & { filled?: boolean }) {
  return (
    <svg
      {...base}
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "currentColor" : "currentColor"}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export function CheckVerifiedIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-2.852 0-5.483-.896-7.647-2.423l-.548-.388-3.15.826.84-3.07-.384-.559C.46 13.97.28 11.23.86 8.528c.99-4.606 4.96-8.08 9.692-8.08 5.762 0 10.45 4.688 10.45 10.45 0 5.762-4.688 10.45-10.45 10.45m0-19.103c-4.767 0-8.653 3.886-8.653 8.653 0 1.956.643 3.766 1.733 5.228l.385.518-.567 2.072 2.118-.555.503.35c1.4.974 3.093 1.54 4.881 1.54 4.767 0 8.653-3.886 8.653-8.653s-3.886-8.653-8.653-8.653" />
    </svg>
  );
}

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function ShieldCheckIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function WifiIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 12.55a11 11 0 0 1 14 0" />
      <path d="M8.5 16.42a6 6 0 0 1 7 0" />
      <path d="M12 20h.01" />
    </svg>
  );
}

export function AcIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="4" width="20" height="8" rx="2" />
      <path d="M6 16v3" />
      <path d="M12 16v4" />
      <path d="M18 16v3" />
    </svg>
  );
}

export function ParkingIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

export function UtensilsIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M18 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
    </svg>
  );
}

export function TvIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="2" y="7" width="20" height="13" rx="2" />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
}

export function SparklesIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export const TYPE_ICONS = {
  pg: BedIcon,
  rent: HomeIcon,
  homestay: SuitcaseIcon,
} as const;

/** Helper to render visual amenity icon based on amenity text string */
export function getAmenityIcon(amenityName: string) {
  const lower = amenityName.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return WifiIcon;
  if (lower.includes("ac") || lower.includes("air condition") || lower.includes("cooling")) return AcIcon;
  if (lower.includes("park")) return ParkingIcon;
  if (lower.includes("food") || lower.includes("meal") || lower.includes("mess") || lower.includes("kitchen")) return UtensilsIcon;
  if (lower.includes("tv") || lower.includes("television")) return TvIcon;
  if (lower.includes("security") || lower.includes("cctv") || lower.includes("guard")) return ShieldCheckIcon;
  return SparklesIcon;
}

