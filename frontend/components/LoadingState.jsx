/**
 * Shared loading UI for every route's loading boundary.
 *
 * Was `h-screen` inside a layout that already has a navbar and footer, so the
 * loading screen alone overflowed the viewport and pushed the footer below the
 * fold. role="status" lets screen readers announce it; the spinner colours come
 * from the theme tokens so it reads on both backgrounds.
 */
export default function LoadingState() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center px-4 py-24">
      <div
        aria-hidden="true"
        className="h-14 w-14 animate-spin rounded-full border-4 border-line border-t-accent"
      />
      <p className="mt-6 text-lg font-medium text-fg">Loading…</p>
    </div>
  );
}
