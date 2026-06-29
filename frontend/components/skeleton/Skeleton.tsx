import { CSSProperties } from "react";

interface SkeletonProps {
  /** Extra Tailwind / CSS classes — use these to set width, height, border-radius etc. */
  className?: string;
  style?: CSSProperties;
}

/**
 * Skeleton — a single shimmer block.
 *
 * Examples:
 *   <Skeleton className="h-4 w-3/4" />              → text line
 *   <Skeleton className="h-11 w-11 rounded-full" />  → avatar circle
 *   <Skeleton className="h-48 w-full rounded-xl" />  → image block
 */
export default function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton ${className}`}
      style={style}
    />
  );
}
