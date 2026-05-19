"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Megaphone, X } from "lucide-react";
import posthog from "posthog-js";
import type { Seller } from "@/types";
import { logCpcEvent } from "@/lib/cpc-analytics";

interface CpcBannerProps {
  seller: Seller;
  onDismiss: () => void;
}

const COPY = {
  control: {
    headline: "Uruchom swoją pierwszą kampanię za darmo — 7 dni na nasz koszt",
    sub: "Promuj swoje produkty i zdobywaj nowych klientów bez ryzyka.",
  },
  test: {
    headline: "Twoje produkty do 3× więcej zamówień — pierwsze 7 dni gratis",
    sub: "Promuj swoje produkty i zdobywaj nowych klientów bez ryzyka.",
  },
};

export function CpcBanner({ seller, onDismiss }: CpcBannerProps) {
  const viewLogged = useRef(false);

  const [variant, setVariant] = useState<"control" | "test">("control");

  useEffect(() => {
    posthog.onFeatureFlags(() => {
      const flag = posthog.getFeatureFlag("ab-testing-for-promoted-listings-campaign");
      if (flag === "test") setVariant("test");
    });
  }, []);

  const { headline, sub } = COPY[variant];

  useEffect(() => {
    if (viewLogged.current) return;
    viewLogged.current = true;
    logCpcEvent({ event: "banner_view", sellerId: seller.id, segment: seller.segment });
  }, [seller.id, seller.segment]);

  function handleCtaClick() {
    logCpcEvent({ event: "banner_click", sellerId: seller.id, segment: seller.segment });
  }

  return (
    <div className="relative flex items-center gap-4 rounded-xl bg-charcoal text-white px-5 py-4 mb-8">
      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
        <Megaphone className="size-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold leading-snug">
          {headline}
        </p>
        <p className="text-[12px] text-white/60 mt-0.5">
          {sub}
        </p>
      </div>

      <Link
        href={`/seller/campaigns/waitlist?seller=${seller.id}`}
        onClick={handleCtaClick}
        className="shrink-0 btn-cta bg-white text-charcoal hover:opacity-90 text-[11px]"
      >
        Chcę spróbować
      </Link>

      <button
        onClick={onDismiss}
        aria-label="Zamknij"
        className="shrink-0 ml-1 text-white/40 hover:text-white/80 transition-colors"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
