/**
 * Fixes Supabase Storage URLs that mistakenly contain the "db." prefix
 * (the "db." subdomain is the PostgreSQL host, not the Storage host).
 *
 * Example:
 *   "https://db.xxxx.supabase.co/storage/..."  →  "https://xxxx.supabase.co/storage/..."
 */
export function sanitizeImageUrl(url: string | undefined | null): string {
    if (!url) return "";
    // Replaces "://db." only when followed by ".supabase.co"
    return url.replace(
        /^(https?:\/\/)db\.([a-z0-9]+\.supabase\.co)/i,
        "$1$2",
    );
}
