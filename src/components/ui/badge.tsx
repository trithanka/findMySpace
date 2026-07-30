import { cn } from "@/lib/utils";

const variants = {
  default: "bg-zinc-100 text-zinc-700",
  accent: "bg-brand-600 text-white",
  outline: "border border-zinc-300 text-zinc-600",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
} as const;

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
