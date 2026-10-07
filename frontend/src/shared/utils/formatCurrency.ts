// This file centralizes currency formatting so prices render consistently
// in USD everywhere in the app per international standards.
export function formatCurrency(amount: number, locale = "en-US"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
