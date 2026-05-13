import type { SellerSegment } from "@/types/seller";

export type CpcEventType = "banner_view" | "banner_click" | "waitlist_submit";

export interface CpcEvent {
  event: CpcEventType;
  sellerId: string;
  segment: SellerSegment;
  timestamp: string;
  answers?: {
    goals: string[];
    budget: string;
  };
}

const STORAGE_KEY = "cpc_fakedoor_events";

export function logCpcEvent(event: Omit<CpcEvent, "timestamp">): void {
  if (typeof window === "undefined") return;
  const entry: CpcEvent = { ...event, timestamp: new Date().toISOString() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const events: CpcEvent[] = raw ? JSON.parse(raw) : [];
    events.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function getCpcEvents(): CpcEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface CpcAnalyticsSummary {
  bannerViews: number;
  bannerClicks: number;
  waitlistSubmits: number;
  ctr: number;
  completionRate: number;
  goalDistribution: Record<string, number>;
  budgetDistribution: Record<string, number>;
  bySegment: Record<string, { views: number; clicks: number; submits: number }>;
}

export function getCpcAnalyticsSummary(): CpcAnalyticsSummary {
  const events = getCpcEvents();

  const bannerViews = events.filter((e) => e.event === "banner_view").length;
  const bannerClicks = events.filter((e) => e.event === "banner_click").length;
  const waitlistSubmits = events.filter((e) => e.event === "waitlist_submit").length;

  const goalDistribution: Record<string, number> = {};
  const budgetDistribution: Record<string, number> = {};
  const bySegment: Record<string, { views: number; clicks: number; submits: number }> = {};

  for (const e of events) {
    const seg = e.segment;
    if (!bySegment[seg]) bySegment[seg] = { views: 0, clicks: 0, submits: 0 };
    if (e.event === "banner_view") bySegment[seg].views++;
    if (e.event === "banner_click") bySegment[seg].clicks++;
    if (e.event === "waitlist_submit") bySegment[seg].submits++;

    if (e.answers) {
      for (const goal of e.answers.goals) {
        goalDistribution[goal] = (goalDistribution[goal] ?? 0) + 1;
      }
      if (e.answers.budget) {
        budgetDistribution[e.answers.budget] = (budgetDistribution[e.answers.budget] ?? 0) + 1;
      }
    }
  }

  return {
    bannerViews,
    bannerClicks,
    waitlistSubmits,
    ctr: bannerViews > 0 ? bannerClicks / bannerViews : 0,
    completionRate: bannerClicks > 0 ? waitlistSubmits / bannerClicks : 0,
    goalDistribution,
    budgetDistribution,
    bySegment,
  };
}
