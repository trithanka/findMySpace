"use client";

import { useState } from "react";
import Image from "next/image";
import { ReelModal } from "@/components/property/reel-modal";

export function PropertyGallery({
  images,
  title,
  instagramShortcode,
}: {
  images: { id: number; url: string }[];
  title: string;
  instagramShortcode?: string | null;
}) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
        No photos yet
      </div>
    );
  }

  const cover = images[0];
  const sideImages = images.slice(1, 3);
  const remainingCount = images.length - 3;

  return (
    <>
      <div className="grid gap-3 lg:grid-cols-3">
        {/* Main cover image */}
        <div
          onClick={() => setActiveImageIndex(0)}
          className="relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 lg:col-span-2 group"
        >
          <Image
            src={cover.url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          {instagramShortcode && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-4"
            >
              <ReelModal shortcode={instagramShortcode} title={title} />
            </div>
          )}
        </div>

        {/* Side images */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {sideImages.map((image, idx) => {
            const globalIndex = idx + 1;
            const isLastSide = idx === 1 && remainingCount > 0;

            return (
              <div
                key={image.id}
                onClick={() =>
                  isLastSide ? setShowAllModal(true) : setActiveImageIndex(globalIndex)
                }
                className="relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 group"
              >
                <Image
                  src={image.url}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />

                {/* +N photos overlay */}
                {isLastSide && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-xs transition hover:bg-black/70">
                    <span className="text-xl font-bold">+{remainingCount + 1}</span>
                    <span className="text-xs font-medium">View all photos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / View All Photos Modal */}
      {(showAllModal || activeImageIndex !== null) && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 sm:p-6 backdrop-blur-md">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 text-white">
            <span className="text-sm font-semibold sm:text-base">
              {title} ({images.length} photos)
            </span>
            <button
              onClick={() => {
                setShowAllModal(false);
                setActiveImageIndex(null);
              }}
              className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Close ✕
            </button>
          </div>

          {/* Body */}
          {activeImageIndex !== null ? (
            <div className="relative flex flex-1 items-center justify-center my-auto py-4">
              <div className="relative aspect-[4/3] w-full max-w-5xl max-h-[80vh] overflow-hidden rounded-2xl">
                <Image
                  src={images[activeImageIndex].url}
                  alt={`${title} - image ${activeImageIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>

              {/* Prev / Next controls */}
              {activeImageIndex > 0 && (
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                  className="absolute left-2 sm:left-6 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
                  aria-label="Previous image"
                >
                  ◀
                </button>
              )}
              {activeImageIndex < images.length - 1 && (
                <button
                  onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                  className="absolute right-2 sm:right-6 rounded-full bg-white/20 p-3 text-white transition hover:bg-white/40"
                  aria-label="Next image"
                >
                  ▶
                </button>
              )}
            </div>
          ) : (
            /* Full Grid View */
            <div className="flex-1 overflow-y-auto pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto pb-10">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImageIndex(i)}
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-zinc-800 group"
                  >
                    <Image
                      src={img.url}
                      alt={`${title} - photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
