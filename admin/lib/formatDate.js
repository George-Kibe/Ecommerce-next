/**
 * Short, human dates without a date library.
 *
 * Replaces moment.js (~70 KB in the client bundle, used only for
 * `.calendar()`): "Today, 14:05", "Yesterday, 09:12", or "12 Mar 2026".
 */
export function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);

  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
