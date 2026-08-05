"use client";

import { useEffect, useState } from "react";
import { EnquiryForm } from "@/components/property/enquiry-form";

interface MobileEnquiryDrawerProps {
  propertyId: number;
  propertyTitle: string;
}

export function MobileEnquiryDrawer({
  propertyId,
  propertyTitle,
}: MobileEnquiryDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700 active:scale-[0.98]"
      >
        Request Callback
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Request callback form"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-opacity sm:items-center sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Request Callback</h3>
                <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">{propertyTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-lg leading-none text-zinc-500 hover:bg-zinc-200"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <div className="pt-4">
              <EnquiryForm propertyId={propertyId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
