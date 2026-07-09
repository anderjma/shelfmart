// This file centralizes currency formatting so prices render consistently (thousands
// separators, fixed decimals) everywhere in the app instead of each screen picking its own.
export function formatCurrency(amount: number): string {
    return `₡${amount.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
