/** Page-width container, aligned with the navbar and footer. */
export default function Center({ children, className = "" }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 md:px-8 ${className}`}>{children}</div>;
}
