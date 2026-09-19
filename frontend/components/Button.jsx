/**
 * Button with a few variants, built on the theme tokens so every variant
 * inverts correctly in dark mode.
 *
 * - primary: brand accent (the main call to action)
 * - strong:  highest-contrast colour — black in light mode, near-white in dark
 * - outline: bordered, transparent
 *
 * 44px minimum height to meet the HIG minimum control size.
 */
const VARIANTS = {
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  strong: "bg-strong text-on-strong hover:opacity-90",
  outline: "border border-link text-link hover:bg-hover",
};

export default function Button({ variant = "primary", block = false, className = "", children, ...rest }) {
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4 ${VARIANTS[variant]} ${block ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
