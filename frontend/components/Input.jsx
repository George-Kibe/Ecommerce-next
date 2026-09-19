/** Text input on the theme tokens. 44px tall to meet the minimum target size. */
export default function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`mb-2 min-h-11 w-full rounded-md border border-field-line bg-field px-3 text-base text-fg ${className}`}
    />
  );
}
