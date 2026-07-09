// This file centralizes extraction of a human-readable message from a failed API call,
// replacing the same inline `error.response?.data?.message` cast repeated across features.
export function getErrorMessage(err: unknown, fallback: string): string {
    const error = err as { response?: { data?: { message?: string } } };
    return error.response?.data?.message || fallback;
}
