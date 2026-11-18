export function normalizeHttpUrl(rawUrl: string): string | null {
  try {
    const url = new URL((rawUrl || "").trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
