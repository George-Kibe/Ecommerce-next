/**
 * Table with themed headings and dividers.
 *
 * Wrapped in a horizontal scroller: a cart row (image + title + stepper +
 * price) is wider than a phone, and without this the whole page scrolled
 * sideways. Headings use fg-subtle — the original #ccc headings were 1.47:1.
 */
export default function Table({ className = "", ...props }) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        {...props}
        className={`w-full border-collapse [&_td]:border-t [&_td]:border-divider [&_td]:py-2 [&_td]:align-middle [&_th]:pb-2 [&_th]:text-left [&_th]:text-[0.8rem] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-fg-subtle ${className}`}
      />
    </div>
  );
}
