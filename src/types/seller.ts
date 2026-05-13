export type SellerSegment = "high-gmv" | "high-margin" | "new" | "standard";

export interface Seller {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  joinedYear: number;
  rating: number;
  activeOfferCount: number;
  campaignCount: number;
  monthlyGMV: number;
  segment: SellerSegment;
}
