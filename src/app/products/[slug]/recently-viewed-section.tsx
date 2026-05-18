"use client";

import { useEffect } from "react";
import { RecentlyViewed, trackRecentlyViewed } from "@/components/recently-viewed";
import posthog from "posthog-js";

export function RecentlyViewedSection({ productId }: { productId: string }) {
  useEffect(() => {
    trackRecentlyViewed(productId);
    posthog.capture("product_viewed", { product_id: productId });
  }, [productId]);

  return <RecentlyViewed currentProductId={productId} />;
}
