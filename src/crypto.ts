// ==============================================================================
// VyūhaPot: Cryptographic Utilities (Web Crypto API for Edge Workers)
// ==============================================================================

/**
 * Computes SHA-256 hexadecimal hash using the Web Crypto API
 */
export async function sha256Hex(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a cryptographically secure random hexadecimal string (default: 32 bytes / 64 hex chars)
 */
export function generateSecureRandomToken(byteLength: number = 32): string {
  const randomBytes = new Uint8Array(byteLength);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Constant-time string equality check to prevent side-channel timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Signs a message with HMAC-SHA256 using the provided secret
 */
export async function createHmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyBuffer = encoder.encode(secret);
  const messageBuffer = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a signed 1-click Edge IP Quick-Block URL for alert emails
 */
export async function generateSignedQuickBlockUrl(
  baseUrl: string,
  ip: string,
  secret: string,
  expiresInSeconds: number = 86400 * 7 // 7 days validity
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = `block:${ip}:${timestamp}`;
  const signature = await createHmacSha256(payload, secret);
  const cleanBase = baseUrl.replace(/\/+$/, '');
  return `${cleanBase}/admin/quick-block?ip=${encodeURIComponent(ip)}&exp=${timestamp}&sig=${signature}`;
}

/**
 * Verifies a signed 1-click Edge IP Quick-Block request
 */
export async function verifySignedQuickBlock(
  ip: string,
  expString: string,
  signature: string,
  secret: string
): Promise<{ valid: boolean; reason?: string }> {
  const exp = parseInt(expString, 10);
  if (isNaN(exp)) {
    return { valid: false, reason: 'Invalid expiration timestamp format' };
  }

  const currentSeconds = Math.floor(Date.now() / 1000);
  if (currentSeconds > exp) {
    return { valid: false, reason: 'Quick-block authorization link has expired' };
  }

  const payload = `block:${ip}:${exp}`;
  const expectedSig = await createHmacSha256(payload, secret);

  if (!timingSafeEqual(expectedSig, signature)) {
    return { valid: false, reason: 'Cryptographic signature mismatch' };
  }

  return { valid: true };
}
