type SessionIdentity = {
  userId: string;
  role: "learner" | "instructor" | "admin";
  passwordChangedAt?: string;
};

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string): Uint8Array<ArrayBuffer> {
  const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function key(): Promise<CryptoKey> {
  const secret = process.env.SESSION_SECRET;
  if (!secret || encoder.encode(secret).length < 32) throw new Error("SESSION_SECRET is not configured");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signSecurePayload(payload: unknown): Promise<string> {
  const encodedPayload = base64url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await key(), encoder.encode(encodedPayload));
  return `${encodedPayload}.${base64url(new Uint8Array(signature))}`;
}

export async function verifySecurePayload<T>(token: string): Promise<T | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2 || !/^[A-Za-z0-9_-]+$/.test(parts[0]) || !/^[A-Za-z0-9_-]{43}$/.test(parts[1])) return null;
    const valid = await crypto.subtle.verify("HMAC", await key(), decode(parts[1]), encoder.encode(parts[0]));
    if (!valid) return null;
    return JSON.parse(new TextDecoder().decode(decode(parts[0]))) as T;
  } catch {
    return null;
  }
}

export async function signSession(identity: SessionIdentity, exp = Date.now() + 7 * 24 * 60 * 60 * 1000): Promise<string> {
  return signSecurePayload({ ...identity, exp });
}

export async function verifySession(token: string): Promise<SessionIdentity | null> {
  try {
    const payload = await verifySecurePayload<Record<string, unknown>>(token);
    if (!payload) return null;
    if (
      typeof payload.userId !== "string" ||
      !payload.userId ||
      typeof payload.role !== "string" ||
      !["learner", "instructor", "admin"].includes(payload.role) ||
      typeof payload.exp !== "number" ||
      payload.exp <= Date.now()
    ) return null;
    return {
      userId: payload.userId,
      role: payload.role as SessionIdentity["role"],
      passwordChangedAt: typeof payload.passwordChangedAt === "string" ? payload.passwordChangedAt : "",
    };
  } catch {
    return null;
  }
}
