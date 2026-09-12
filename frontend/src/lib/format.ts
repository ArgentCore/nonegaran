/**
 * Formats a Toman price using Persian digits and the Persian thousands
 * separator (e.g. 185000 -> "۱۸۵٬۰۰۰"). Centralized here so every price on
 * the site is formatted identically.
 */
export function formatToman(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount);
}
