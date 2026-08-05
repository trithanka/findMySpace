"use client";

import { useState } from "react";
import { CheckVerifiedIcon, SparklesIcon } from "@/components/ui/icons";
import { formatPrice } from "@/lib/utils";

const PLATFORM_RATES = [
  { name: "FindMySpace", rate: "12%", pct: 12, highlight: true, note: "Flat & Lowest Rate" },
  { name: "Airbnb", rate: "~15–15.5%", pct: 15.25, highlight: false },
  { name: "Booking.com", rate: "15–20%", pct: 17.5, highlight: false },
  { name: "Agoda", rate: "15–22%", pct: 18.5, highlight: false },
  { name: "MakeMyTrip / Goibibo", rate: "15–25%", pct: 20, highlight: false },
  { name: "Expedia", rate: "15–25%", pct: 20, highlight: false },
  { name: "OYO", rate: "20–25%+", pct: 22.5, highlight: false },
];

export function CommissionCalculator() {
  const [tab, setTab] = useState<"homestay" | "rentals">("homestay");
  const [bookingAmount, setBookingAmount] = useState<number>(35000);

  // Homestay comparison calculation vs avg competitor (18%)
  const competitorRate = 0.18;
  const findMySpaceRate = 0.12;

  const competitorCommission = Math.round(bookingAmount * competitorRate);
  const findMySpaceCommission = Math.round(bookingAmount * findMySpaceRate);
  const hostSavings = competitorCommission - findMySpaceCommission;
  const hostTakeHome = bookingAmount - findMySpaceCommission;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-brand-200/80 bg-gradient-to-br from-white via-brand-50/40 to-indigo-50/20 p-6 sm:p-10 shadow-2xl shadow-brand-950/5 backdrop-blur-xl">
      {/* Ambient Decorative Orbs */}
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-400/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-100/80 px-3.5 py-1 text-xs font-extrabold text-brand-800 border border-brand-200/80 shadow-2xs">
            <SparklesIcon className="h-3.5 w-3.5 text-brand-600" />
            Host & Renter Financial Advantage
          </div>
          <h3 className="mt-2.5 text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
            Compare Platform Earnings
          </h3>
        </div>

        {/* Premium Tab Selector */}
        <div className="flex rounded-2xl bg-zinc-200/60 p-1.5 border border-zinc-300/50 shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => setTab("homestay")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              tab === "homestay"
                ? "bg-zinc-900 text-white shadow-md scale-[1.02]"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Homestays (12% Fee)
          </button>
          <button
            type="button"
            onClick={() => setTab("rentals")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-300 ${
              tab === "rentals"
                ? "bg-zinc-900 text-white shadow-md scale-[1.02]"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            PG & Rentals (Free)
          </button>
        </div>
      </div>

      {/* Mode 1: Homestay Host Commission Calculator & Rate Chart */}
      {tab === "homestay" ? (
        <div className="relative mt-8 space-y-8">
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            While major Indian and global platforms charge hosts <strong className="text-zinc-900">15% to 25%+</strong> in commissions, FindMySpace keeps it transparent with a flat <strong className="text-brand-700 font-extrabold">12% host fee</strong>.
          </p>

          {/* Revenue Slider Card */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-zinc-200/90 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label htmlFor="booking-range" className="text-xs font-extrabold uppercase tracking-widest text-zinc-400">
                  Estimated Monthly Booking Revenue
                </label>
                <div className="text-xs text-zinc-500 mt-0.5">Drag to estimate host take-home profit</div>
              </div>

              <div className="rounded-2xl bg-zinc-950 px-4 py-2 text-white shadow-md">
                <span className="text-2xl font-black font-mono tracking-tight text-white">
                  {formatPrice(bookingAmount, "month").split("/")[0]}
                </span>
              </div>
            </div>

            <input
              id="booking-range"
              type="range"
              min={5000}
              max={200000}
              step={5000}
              value={bookingAmount}
              onChange={(e) => setBookingAmount(Number(e.target.value))}
              className="mt-6 h-3 w-full cursor-pointer appearance-none rounded-xl bg-zinc-100 accent-brand-600 shadow-inner"
            />

            <div className="mt-3 flex justify-between text-xs font-bold text-zinc-400">
              <span>₹5,000</span>
              <span>₹100,000</span>
              <span>₹200,000+</span>
            </div>
          </div>

          {/* Savings Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-zinc-100/70 p-5 border border-zinc-200/80">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">Other OTAs (Avg. 18%)</div>
              <div className="mt-2 text-2xl font-black text-red-600">
                {formatPrice(competitorCommission, "month").split("/")[0]}
              </div>
              <div className="text-xs text-zinc-500 mt-1">High platform commission fee</div>
            </div>

            <div className="rounded-3xl bg-brand-500 p-5 text-white shadow-xl shadow-brand-600/25 border border-brand-400">
              <div className="flex items-center justify-between text-xs font-bold text-brand-100">
                <span>FindMySpace (12%)</span>
                <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] uppercase font-black text-white backdrop-blur-md">
                  Flat Rate
                </span>
              </div>
              <div className="mt-2 text-2xl font-black text-white">
                {formatPrice(findMySpaceCommission, "month").split("/")[0]}
              </div>
              <div className="text-xs text-brand-100 mt-1">Lowest host fee guaranteed</div>
            </div>

            <div className="rounded-3xl bg-emerald-500 p-5 text-white shadow-xl shadow-emerald-600/25 border border-emerald-400 sm:col-span-1 col-span-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-100">
                <span>Your Take-Home Profit</span>
                <CheckVerifiedIcon className="h-4 w-4 text-emerald-100" />
              </div>
              <div className="mt-2 text-3xl font-black text-white">
                {formatPrice(hostTakeHome, "month").split("/")[0]}
              </div>
              <div className="text-xs font-bold text-emerald-100 mt-1">
                You save <span className="font-black text-white">+{formatPrice(hostSavings, "month").split("/")[0]}</span> extra profit!
              </div>
            </div>
          </div>

          {/* Visual Platform Rate Bar Chart */}
          <div className="rounded-3xl bg-white p-6 sm:p-7 border border-zinc-200/90 shadow-md">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-5">
              Platform Commission Rate Comparison
            </h4>

            <div className="space-y-4">
              {PLATFORM_RATES.map((p) => (
                <div key={p.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-extrabold ${p.highlight ? "text-brand-700 flex items-center gap-2" : "text-zinc-800"}`}>
                      {p.name} {p.note && <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-[10px] font-black text-brand-800">{p.note}</span>}
                    </span>
                    <span className={`font-black font-mono ${p.highlight ? "text-brand-700 text-base" : "text-zinc-900"}`}>
                      {p.rate}
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-100 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        p.highlight
                          ? "bg-gradient-to-r from-brand-500 via-brand-600 to-indigo-600 shadow-sm"
                          : "bg-zinc-300"
                      }`}
                      style={{ width: `${(p.pct / 25) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Rental & PG Unlimited Free Listings */
        <div className="relative mt-8 space-y-6">
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-base">
            For rental flats, PGs, and long-term space owners, FindMySpace offers <strong className="text-emerald-700 font-extrabold">Unlimited FREE Listings</strong> with zero upfront posting charges.
          </p>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="group rounded-3xl bg-white p-6 sm:p-7 border border-zinc-200/90 shadow-md transition duration-300 hover:border-emerald-300 hover:shadow-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-900">
                For PG & Rental Hosts
              </span>
              <h4 className="mt-4 text-xl font-extrabold text-zinc-900">Unlimited Free Listings</h4>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span> No listing fees or package limits
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span> Direct tenant callback requests
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓</span> Phone number protected from broker spam
                </li>
              </ul>
            </div>

            <div className="group rounded-3xl bg-white p-6 sm:p-7 border border-zinc-200/90 shadow-md transition duration-300 hover:border-brand-300 hover:shadow-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-900">
                For Renters & Students
              </span>
              <h4 className="mt-4 text-xl font-extrabold text-zinc-900">100% Free Renter Experience</h4>
              <ul className="mt-4 space-y-3 text-xs sm:text-sm text-zinc-600">
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">✓</span> Zero brokerage or service fees
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">✓</span> Personally verified photos & locations
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">✓</span> Direct WhatsApp enquiries & visits
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
