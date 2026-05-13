"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  TrendingUp,
  ShoppingBag,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";
import { getSellerById } from "@/data/sellers";
import { CpcBanner } from "@/components/seller/cpc-banner";

// Demo seller — UrbanEdge (s1): 180 active offers, 0 campaigns, high-GMV segment
const DEMO_SELLER_ID = "s1";

const mockStats = {
  ordersThisMonth: 312,
  ordersLastMonth: 287,
  avgOrderValue: 135,
  conversionRate: 3.2,
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl px-5 py-4 flex items-start gap-4 border border-black/5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream">
        <Icon className="size-4 text-charcoal" />
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.6px] text-warm-gray font-medium">{label}</p>
        <p className="text-xl font-semibold text-charcoal mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-warm-gray mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  const seller = getSellerById(DEMO_SELLER_ID);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (!seller) return null;

  const showBanner = !bannerDismissed && seller.activeOfferCount >= 1 && seller.campaignCount === 0;

  const gmvFormatted = seller.monthlyGMV.toLocaleString("pl-PL") + " PLN";
  const gmvChange = "+8% vs. poprzedni miesiąc";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Panel sprzedawcy</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-charcoal">{seller.name}</h1>
          <p className="text-[13px] text-warm-gray mt-1">
            Segment:{" "}
            <span className="font-medium text-charcoal capitalize">
              {seller.segment === "high-gmv" ? "High GMV" : seller.segment === "high-margin" ? "High Margin" : seller.segment}
            </span>
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-[12px] text-warm-gray hover:text-charcoal transition-colors">
          <Settings className="size-3.5" />
          Ustawienia konta
        </button>
      </div>

      {/* CPC Fake Door Banner */}
      {showBanner && (
        <CpcBanner seller={seller} onDismiss={() => setBannerDismissed(true)} />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Aktywne oferty"
          value={seller.activeOfferCount.toString()}
          icon={Package}
        />
        <StatCard
          label="GMV / miesiąc"
          value={gmvFormatted}
          sub={gmvChange}
          icon={TrendingUp}
        />
        <StatCard
          label="Zamówienia (maj)"
          value={mockStats.ordersThisMonth.toString()}
          sub={`${mockStats.ordersLastMonth} w poprzednim miesiącu`}
          icon={ShoppingBag}
        />
        <StatCard
          label="Ocena sprzedawcy"
          value={seller.rating.toFixed(1)}
          sub="na podstawie opinii"
          icon={Star}
        />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard
          label="Śr. wartość zamówienia"
          value={mockStats.avgOrderValue + " PLN"}
          icon={BarChart3}
        />
        <StatCard
          label="Konwersja"
          value={mockStats.conversionRate + "%"}
          sub="sesje → zamówienia"
          icon={TrendingUp}
        />
      </div>

      {/* Campaigns section */}
      <section>
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-black/10">
          <h2 className="text-[12px] font-medium uppercase tracking-[0.8px] text-charcoal">
            Kampanie reklamowe
          </h2>
        </div>

        {seller.campaignCount === 0 ? (
          <div className="rounded-xl bg-white border border-black/5 px-6 py-8 text-center">
            <p className="text-[13px] text-warm-gray">
              Nie masz jeszcze żadnych kampanii.
            </p>
            {showBanner && (
              <Link
                href={`/seller/campaigns/waitlist?seller=${seller.id}`}
                className="inline-block mt-4 btn-cta-outline text-[11px]"
              >
                Dowiedz się o darmowej kampanii →
              </Link>
            )}
          </div>
        ) : (
          <p className="text-[13px] text-warm-gray">
            Masz {seller.campaignCount} aktywn{seller.campaignCount === 1 ? "ą" : "e"} kampanię.
          </p>
        )}
      </section>
    </div>
  );
}
