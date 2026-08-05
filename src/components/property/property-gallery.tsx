"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ReelModal } from "@/components/property/reel-modal";

interface ImageItem {
  id: number;
  url: string;
}

export function PropertyGallery({
  images,
  title,
  instagramShortcode,
}: {
  images: ImageItem[];
  title: string;
  instagramShortcode?: string | null;
}) {
  const [showAllModal, setShowAllModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [mobileSlideIndex, setMobileSlideIndex] = useState(0);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeImageIndex === null && !showAllModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowAllModal(false);
        setActiveImageIndex(null);
      } else if (e.key === "ArrowLeft" && activeImageIndex !== null && activeImageIndex > 0) {
        setActiveImageIndex(activeImageIndex - 1);
      } else if (
        e.key === "ArrowRight" &&
        activeImageIndex !== null &&
        activeImageIndex < images.length - 1
      ) {
        setActiveImageIndex(activeImageIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeImageIndex, showAllModal, images.length]);

  const handleMobileScroll = () => {
    if (!mobileCarouselRef.current) return;
    const { scrollLeft, clientWidth } = mobileCarouselRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      setMobileSlideIndex(newIndex);
    }
  };

  if (images.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 flex flex-col items-center justify-center text-zinc-400 border border-zinc-200">
        <svg className="h-10 w-10 text-zinc-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>No photos uploaded yet</span>
      </div>
    );
  }

  const cover = images[0];
  const sideImages = images.slice(1, 3);
  const remainingCount = images.length - 3;

  return (
    <>
      {/* ---------- MOBILE TOUCH SLIDER (< 768px) ---------- */}
      <div className="relative block md:hidden">
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          className="flex w-full snap-x snap-mandatory overflow-x-auto scrollbar-none rounded-2xl border border-zinc-200/80 shadow-xs"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((img, index) => (
            <div
              key={img.id}
              onClick={() => setActiveImageIndex(index)}
              className="relative aspect-[4/3] w-full flex-shrink-0 snap-start bg-zinc-900 overflow-hidden cursor-pointer"
            >
              <Image
                src={img.url}
                alt={`${title} - Photo ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Mobile Reel Button Overlay */}
        {instagramShortcode && (
          <div className="absolute bottom-3 left-3 z-10">
            <ReelModal shortcode={instagramShortcode} title={title} />
          </div>
        )}

        {/* Mobile Page Pill */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-zinc-900/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <svg className="h-3.5 w-3.5 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>
            {mobileSlideIndex + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* ---------- DESKTOP GRID (>= 768px) ---------- */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-3">
        {/* Main Cover Image */}
        <div
          onClick={() => setActiveImageIndex(0)}
          className="group relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 md:col-span-2 border border-zinc-200/80 shadow-xs"
        >
          <Image
            src={cover.url}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

          {instagramShortcode && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-4 left-4 z-10"
            >
              <ReelModal shortcode={instagramShortcode} title={title} />
            </div>
          )}
        </div>

        {/* Side Stack */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
          {sideImages.map((image, idx) => {
            const globalIndex = idx + 1;
            const isLastSide = idx === 1 && remainingCount > 0;

            return (
              <div
                key={image.id}
                onClick={() =>
                  isLastSide ? setShowAllModal(true) : setActiveImageIndex(globalIndex)
                }
                className="group relative aspect-[3/2] cursor-pointer overflow-hidden rounded-2xl bg-zinc-100 border border-zinc-200/80 shadow-xs"
              >
                <Image
                  src={image.url}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/10" />

                {/* Overlay for additional photos count */}
                {isLastSide && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/70 text-white backdrop-blur-xs transition group-hover:bg-zinc-950/80">
                    <span className="text-2xl font-bold">+{remainingCount + 1}</span>
                    <span className="text-xs font-semibold tracking-wide uppercase opacity-90 mt-0.5">
                      View all photos
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- LIGHTBOX / FULLSCREEN MODAL ---------- */}
      {(showAllModal || activeImageIndex !== null) && (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-md text-white transition-opacity">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold sm:text-base line-clamp-1 max-w-xs sm:max-w-md">
                {title}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-zinc-300">
                {activeImageIndex !== null ? `${activeImageIndex + 1} of ${images.length}` : `${images.length} photos`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (activeImageIndex !== null) {
                    setActiveImageIndex(null);
                    setShowAllModal(true);
                  } else {
                    setActiveImageIndex(0);
                  }
                }}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:bg-white/20 sm:text-sm"
              >
                {activeImageIndex !== null ? "Grid View" : "Slideshow"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAllModal(false);
                  setActiveImageIndex(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg leading-none text-white transition hover:bg-white/20"
                aria-label="Close photo gallery"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          {activeImageIndex !== null ? (
            <div className="relative flex flex-1 flex-col justify-between overflow-hidden p-4">
              {/* Main Photo Display */}
              <div className="relative flex flex-1 items-center justify-center">
                <div className="relative aspect-[4/3] w-full max-w-5xl max-h-[72vh] overflow-hidden rounded-2xl">
                  <Image
                    src={images[activeImageIndex].url}
                    alt={`${title} - image ${activeImageIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>

                {/* Left Control */}
                {activeImageIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                    className="absolute left-2 sm:left-6 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-105 active:scale-95"
                    aria-label="Previous image"
                  >
                    ◀
                  </button>
                )}

                {/* Right Control */}
                {activeImageIndex < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                    className="absolute right-2 sm:right-6 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/80 hover:scale-105 active:scale-95"
                    aria-label="Next image"
                  >
                    ▶
                  </button>
                )}
              </div>

              {/* Bottom Thumbnail Navigation Strip */}
              <div className="mt-4 flex w-full justify-center overflow-x-auto py-2 scrollbar-none">
                <div className="flex gap-2 px-4">
                  {images.map((img, idx) => (
                    <div
                      key={img.id}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-14 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition ${
                        idx === activeImageIndex
                          ? "border-brand-500 opacity-100 scale-105"
                          : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Full Grid View */
            <div className="flex-1 overflow-y-auto p-4 sm:p-8">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 max-w-6xl mx-auto pb-12">
                {images.map((img, i) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImageIndex(i)}
                    className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-zinc-900 border border-white/10"
                  >
                    <Image
                      src={img.url}
                      alt={`${title} - photo ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/20 flex items-end p-2">
                      <span className="text-[10px] font-medium text-white/80 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                        #{i + 1}
                      </span>
                    </div>
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
