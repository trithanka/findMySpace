"use client";

import { useState } from "react";
import { HeartIcon, ShareIcon } from "@/components/ui/icons";

interface PropertyActionsProps {
  propertyId: number;
  title: string;
  localityName: string;
}

export function PropertyActions({ propertyId, title, localityName }: PropertyActionsProps) {
  const [isSaved, setIsSaved] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      const savedList = JSON.parse(localStorage.getItem("fms_saved_properties") || "[]");
      return savedList.includes(propertyId);
    } catch {
      return false;
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleSave = () => {
    try {
      const savedList: number[] = JSON.parse(localStorage.getItem("fms_saved_properties") || "[]");
      let updated: number[];
      if (savedList.includes(propertyId)) {
        updated = savedList.filter((id) => id !== propertyId);
        setIsSaved(false);
        showToast("Removed from saved places");
      } else {
        updated = [...savedList, propertyId];
        setIsSaved(true);
        showToast("Saved to your wishlist!");
      }
      localStorage.setItem("fms_saved_properties", JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${title} | FindMySpace`,
      text: `Check out ${title} in ${localityName} on FindMySpace`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback to copy link if share is dismissed/failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Listing link copied to clipboard!");
      } catch {
        showToast("Failed to copy link");
      }
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-700 shadow-xs transition hover:border-zinc-300 hover:bg-zinc-50 active:scale-95 sm:text-sm"
        aria-label="Share property"
      >
        <ShareIcon className="h-4 w-4 text-zinc-600" />
        <span>Share</span>
      </button>

      <button
        type="button"
        onClick={handleToggleSave}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-xs transition active:scale-95 sm:text-sm ${
          isSaved
            ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
            : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
        }`}
        aria-label={isSaved ? "Remove from saved" : "Save property"}
      >
        <HeartIcon
          className={`h-4 w-4 ${isSaved ? "text-rose-500 fill-rose-500" : "text-zinc-600"}`}
          filled={isSaved}
        />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3 duration-200 sm:bottom-8">
          <div className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl backdrop-blur-md sm:text-sm">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
