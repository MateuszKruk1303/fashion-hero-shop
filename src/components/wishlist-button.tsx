"use client";

import { useState } from "react";
import { HeartIcon, HeartFilledIcon } from "./icons";
import { useWishlist } from "./wishlist-provider";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(productId);
  const [animating, setAnimating] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleWishlist(productId);
    posthog.capture(wishlisted ? "wishlist_item_removed" : "wishlist_item_added", {
      product_id: productId,
    });
    setTimeout(() => setAnimating(false), 300);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "transition-transform duration-200 ease-out",
        animating && "scale-125",
        className
      )}
    >
      {wishlisted ? (
        <HeartFilledIcon className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5" />
      )}
    </button>
  );
}
