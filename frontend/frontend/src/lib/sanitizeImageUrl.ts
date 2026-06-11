/**
 * Corrige URLs de Supabase Storage que contengan el prefijo "db."
 * por error (el subdominio "db." es el host de PostgreSQL, no de Storage).
 *
 * Ejemplo:
 *   "https://db.xxxx.supabase.co/storage/..."  →  "https://xxxx.supabase.co/storage/..."
 */
export function sanitizeImageUrl(url: string | undefined | null): string {
    if (!url) return "";
    // Reemplaza "://db." solo cuando va seguido de ".supabase.co"
    return url.replace(
        /^(https?:\/\/)db\.([a-z0-9]+\.supabase\.co)/i,
        "$1$2",
    );
}
