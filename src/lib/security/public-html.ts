import { lookup } from "node:dns/promises";
import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIP } from "node:net";

// Reject non-public and special-purpose IPv4 ranges. IPv6 is rejected rather
// than attempting to classify mapped, tunneled, or local IPv6 addresses.
export function isPublicIpv4(address: string): boolean {
  if (isIP(address) !== 4) return false;
  const [a, b, c] = address.split(".").map(Number);
  return !(
    a === 0 || a === 10 || a === 127 || a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && (c === 0 || c === 2)) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) ||
    (a === 203 && b === 0 && c === 113)
  );
}

export async function fetchPublicHtml(rawUrl: string): Promise<{ html: string; url: string; status: number }> {
  let url = new URL(rawUrl);
  const signal = AbortSignal.timeout(8000);
  for (let redirects = 0; redirects <= 3; redirects++) {
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || (url.port && !["80", "443"].includes(url.port))) {
      throw new Error("Unsupported URL");
    }
    if (isIP(url.hostname) === 6 || url.hostname.startsWith("[")) throw new Error("IPv6 is not supported");
    const addresses = await lookup(url.hostname, { all: true, verbatim: true, family: 4 });
    if (!addresses.length || addresses.some(({ address }) => !isPublicIpv4(address))) throw new Error("Non-public address");
    const address = addresses[0].address;
    const response = await new Promise<IncomingMessage>((resolve, reject) => {
      const request = url.protocol === "https:" ? httpsRequest : httpRequest;
      const req = request(url, {
        signal,
        family: 4,
        lookup: (_host, _options, callback) => callback(null, address, 4),
        headers: { "user-agent": "Mozilla/5.0 (compatible; BDC-LinkPreview/1.0)", accept: "text/html,application/xhtml+xml" },
      }, resolve);
      req.on("error", reject);
      req.end();
    });
    const status = response.statusCode || 0;
    if ([301, 302, 303, 307, 308].includes(status) && response.headers.location) {
      response.destroy();
      if (redirects === 3) throw new Error("Too many redirects");
      url = new URL(response.headers.location, url);
      continue;
    }
    const chunks: Buffer[] = [];
    let size = 0;
    for await (const chunk of response) {
      const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      const remaining = 512 * 1024 - size;
      chunks.push(bytes.subarray(0, remaining));
      size += Math.min(bytes.length, remaining);
      if (size >= 512 * 1024) {
        response.destroy();
        break;
      }
    }
    return { html: Buffer.concat(chunks).toString("utf8"), url: url.toString(), status };
  }
  throw new Error("Too many redirects");
}
