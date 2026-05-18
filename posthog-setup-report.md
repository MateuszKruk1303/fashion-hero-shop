<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the FashionHero Next.js App Router project. Here is a summary of all changes made:

**New files created:**
- `instrumentation-client.ts` — Initializes PostHog client-side using the `instrumentation-client` pattern (Next.js 15.3+), with EU host, reverse proxy, exception capture, and debug mode in development.
- `next.config.ts` — Updated with PostHog reverse proxy rewrites (`/ingest/*` → EU PostHog servers) and `skipTrailingSlashRedirect: true`.
- `.env.local` — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set (EU region).

**Event tracking added to 10 files:**

| Event Name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in; also calls `posthog.identify()` | `src/app/account/login/page.tsx` |
| `user_registered` | User creates a new account; also calls `posthog.identify()` with name | `src/app/account/register/page.tsx` |
| `product_viewed` | User views a product detail page (top of conversion funnel) | `src/app/products/[slug]/recently-viewed-section.tsx` |
| `product_added_to_cart` | User adds a product to cart from the product page | `src/components/product-info.tsx` |
| `product_added_to_cart` | User adds a product to cart from the quick view modal | `src/components/quick-view-modal.tsx` |
| `quick_view_opened` | User opens the quick view modal for a product | `src/components/product-card.tsx` |
| `wishlist_item_added` | User adds a product to their wishlist | `src/components/wishlist-button.tsx` |
| `wishlist_item_removed` | User removes a product from their wishlist | `src/components/wishlist-button.tsx` |
| `checkout_started` | User clicks Checkout in the cart drawer | `src/components/cart-drawer.tsx` |
| `order_placed` | User clicks Place Order on checkout page (bottom of conversion funnel) | `src/app/checkout/page.tsx` |
| `search_submitted` | User submits a search query (Enter key) | `src/components/search-modal.tsx` |
| `search_result_clicked` | User clicks a product in search results | `src/components/search-modal.tsx` |
| `collection_filtered` | User applies a filter (gender, price, shoe type, material) | `src/components/filter-bar.tsx` |
| `collection_sorted` | User changes the sort order on a collection page | `src/components/filter-bar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/686961)
- [Purchase Conversion Funnel](/insights/W28RzmuF) — 4-step funnel: product viewed → added to cart → checkout started → order placed
- [Ecommerce Key Events Over Time](/insights/WaKHgE9A) — Daily trend of add-to-cart, checkout started, and orders placed
- [New User Registrations](/insights/ivMkWUUz) — Daily bar chart of new account signups
- [Wishlist Engagement](/insights/9GhaGh7w) — Items added vs removed from wishlists over time
- [Search & Discovery Activity](/insights/U2qLFuwZ) — Search submissions vs result clicks (product discoverability)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
