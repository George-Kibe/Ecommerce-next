"use client"
import ErrorState from "@/components/ErrorState";

// Next passes `reset` to error boundaries; it re-renders this segment.
export default function Error({ reset }) {
  return <ErrorState reset={reset} />;
}
