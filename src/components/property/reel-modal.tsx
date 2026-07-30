"use client";

import { useEffect, useState } from "react";
import { instagramEmbedUrl, instagramPermalink } from "@/lib/instagram";

export function ReelModal({
  shortcode,
  title,
}: {
  shortcode: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-zinc-900/85 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-zinc-900"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
        >
          <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
        </svg>
        Watch reel
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Instagram reel for ${title}`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-[420px]"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <a
                href={instagramPermalink(shortcode)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                Open on Instagram ↗
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close reel"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg leading-none text-white transition hover:bg-white/25"
              >
                ×
              </button>
            </div>
            <iframe
              src={instagramEmbedUrl(shortcode)}
              title={`Instagram reel for ${title}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              scrolling="no"
              className="h-[min(78vh,700px)] w-full rounded-2xl border-0 bg-white"
            />
          </div>
        </div>
      )}
    </>
  );
}
