// This file centralizes date formatting according to W3C i18n & ISO 8601 specifications.
export function formatDate(
    date: string | Date | number,
    locale = "es-CR",
    options?: Intl.DateTimeFormatOptions
): string {
    const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";

    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };

    return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
}
