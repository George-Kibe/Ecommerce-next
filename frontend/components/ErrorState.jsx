"use client"
import Link from "next/link";

/**
 * Shared error UI for every route's error boundary.
 *
 * The three error.jsx files were byte-identical copies, each with a red
 * "Go back" button. Red is reserved for destructive actions, and going back
 * isn't one — so this offers "Try again" (Next's `reset`, which re-renders the
 * segment without a full reload) as the primary action, with a plain link home
 * as the escape hatch. history.back() was also a dead end for anyone who
 * landed on the page directly.
 */
export default function ErrorState({ reset }) {
  return (
    <div role="alert" className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <h1 className="mb-3 text-3xl font-bold text-fg md:text-4xl">Something went wrong</h1>
      <p className="mb-8 text-lg text-fg-muted">
        We couldn&apos;t load this page. It&apos;s usually temporary — please try again.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {reset && (
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 font-medium text-on-accent hover:bg-accent-hover"
          >
            Try again
          </button>
        )}
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-lg border border-link px-5 font-medium text-link hover:bg-hover"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  );
}
