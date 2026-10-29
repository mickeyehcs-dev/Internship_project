// ==============================================================================
// VyūhaPot: Edge Worker, Firewall Layer, Auth Gate & SOC Controller
// ==============================================================================

import { Env, IncidentTelemetry, AttackLogRecord, BlockedIpRecord, SocDashboardStats } from './types';
import { sha256Hex, generateSecureRandomToken, timingSafeEqual, verifySignedQuickBlock } from './crypto';
import { dispatchIncidentAlertEmail } from './email';
import { renderLoginPage, renderDashboardPage, renderQuickBlockConfirmationPage } from './dashboard';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const clientIp = getClientIp(request);

    // --------------------------------------------------------------------------
    // 1. Edge Firewall Layer: Inspect blocked_ips at Cloudflare Edge
    // --------------------------------------------------------------------------
    try {
      const blockCheck = await env.DB.prepare(
        'SELECT ip, reason, blocked_at FROM blocked_ips WHERE ip = ? LIMIT 1'
      ).bind(clientIp).first<BlockedIpRecord>();

      if (blockCheck) {
        return new Response(
          JSON.stringify({
            status: 'error',
            code: 'FIREWALL_EDGE_DROP',
            error: 'Forbidden',
            message: 'Access dropped by VyūhaPot active defense edge policy.',
            incident_ref: `EDGE_BAN_${clientIp}`,
            timestamp: new Date().toISOString()
          }, null, 2),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              'X-Vyuhapot-Firewall': 'BLOCKED_AT_EDGE',
              'Cache-Control': 'no-store, no-cache, must-revalidate'
            }
          }
        );
      }
    } catch (dbErr) {
      console.error('[VyūhaPot Firewall Check DB Error]:', dbErr);
      // Fall through if database warm-up is in progress
    }

    // --------------------------------------------------------------------------
    // 2. Domain & Route Resolution
    //    - vault.vyuha.me/* -> Deception Bait Subdomain
    //    - pot.vyuha.me/*   -> Administrative SOC Console & Auth Gate
    //    - Local / Dev Fallback: Support /vault/* or host-based inspection
    // --------------------------------------------------------------------------
    const isVaultHost = url.hostname === 'vault.vyuha.me' || 
                        url.hostname.startsWith('vault.') || 
                        url.pathname.startsWith('/vault');

    if (isVaultHost) {
      return handleVaultDeception(request, env, ctx, clientIp, url);
    }

    return handleAdministrativeConsole(request, env, ctx, clientIp, url);
  }
};

// ==============================================================================
// DECEPTION SUBSYSTEM: vault.vyuha.me
// ==============================================================================

async function handleVaultDeception(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  clientIp: string,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname + url.search;
  const userAgent = request.headers.get('user-agent') || 'Unknown User-Agent';

  // Extract edge geo-telemetry from Cloudflare edge headers and cf object
  const country = request.headers.get('cf-ipcountry') || 
                  (request as any).cf?.country || 
                  'XX';
  const city = request.headers.get('cf-ipcity') || 
               (request as any).cf?.city || 
               'Unknown';
  const asnOrg = (request as any).cf?.asOrganization || 
                 ((request as any).cf?.asn ? `AS${(request as any).cf.asn}` : 'Unknown ASN');

  // Extract and serialize ingress headers for forensics
  const rawHeadersObj: Record<string, string> = {};
  for (const [key, val] of request.headers.entries()) {
    // Preserve security headers, authorization tokens, user agents, cookies
    rawHeadersObj[key] = val;
  }
  const headersJson = JSON.stringify(rawHeadersObj);

  const trapName = env.HONEYPOT_NAME || 'vault-connector-edge';
  const nowIso = new Date().toISOString();

  // 1. Synchronously commit intrusion event to Cloudflare D1
  try {
    await env.DB.prepare(
      `INSERT INTO attack_logs 
        (trap_name, ip, country, city, asn_org, user_agent, method, path, headers_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(
      trapName,
      clientIp,
      country,
      city,
      asnOrg,
      userAgent,
      method,
      path,
      headersJson
    ).run();
  } catch (logErr) {
    console.error('[VyūhaPot D1 Telemetry Ingestion Error]:', logErr);
  }

  // 2. Dispatch Incident Alert Email asynchronously (Zero worker latency penalty)
  const telemetry: IncidentTelemetry = {
    trapName,
    ip: clientIp,
    country,
    city,
    asnOrg,
    userAgent,
    method,
    path,
    headersJson,
    timestamp: nowIso
  };

  const socDomain = (url.hostname.includes('localhost') || url.hostname.includes('127.0.0.1'))
    ? `${url.protocol}//${url.host}`
    : 'https://pot.vyuha.me';

  ctx.waitUntil(dispatchIncidentAlertEmail(env, telemetry, socDomain));

  // 3. Implement Asynchronous Tarpit Delay (Slows down automated credential scanners)
  const delayMs = parseInt(env.TARPIT_DELAY_MS || '2500', 10);
  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }

  // 4. Return Plausible Microservice Error Response
  const realm = env.HONEYPOT_REALM || 'internal-vault-cluster';
  const decoyResponsePayload = {
    status: 'error',
    code: 'AUTH_TOKEN_EXPIRED',
    realm: realm,
    message: 'Key revoked by policy'
  };

  return new Response(JSON.stringify(decoyResponsePayload), {
    status: 401,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'WWW-Authenticate': `Bearer realm="${realm}", error="invalid_token", error_description="The token expired or was revoked"`,
      'X-Vault-Cluster': 'prod-us-east-v2',
      'X-Vault-Revocation-Id': `rev_${Math.random().toString(36).substring(2, 10)}`,
      'Cache-Control': 'no-store, no-cache, private'
    }
  });
}

// ==============================================================================
// ADMINISTRATIVE SOC SUBSYSTEM: pot.vyuha.me
// ==============================================================================

async function handleAdministrativeConsole(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
  _clientIp: string,
  url: URL
): Promise<Response> {
  const method = request.method;
  const path = url.pathname;

  // 1-Click Quick Block Link from Email Report: /admin/quick-block
  if (path === '/admin/quick-block') {
    return handleQuickBlock(request, env, url);
  }

  // Login Gate: GET /login or POST /login
  if (path === '/login') {
    if (method === 'GET') {
      const html = renderLoginPage();
      return htmlResponse(html);
    }
    if (method === 'POST') {
      return handleLoginPost(request, env);
    }
  }

  // Session Logout: /logout
  if (path === '/logout') {
    return handleLogout(request, env);
  }

  // Verify Authentication Session for all protected SOC endpoints
  const sessionToken = getSessionCookie(request);
  const isAuthenticated = sessionToken ? await verifySession(env.DB, sessionToken) : false;

  if (!isAuthenticated) {
    if (path.startsWith('/admin/api/')) {
      return jsonResponse({ error: 'Unauthorized', message: 'Valid SOC session token required.' }, 401);
    }
    // Redirect unauthenticated web access to /login
    return Response.redirect(`${url.origin}/login`, 302);
  }

  // --------------------------------------------------------------------------
  // Protected SOC Administrative APIs
  // --------------------------------------------------------------------------
  if (path === '/admin/api/block' && method === 'POST') {
    return handleApiBlockIp(request, env);
  }

  if (path === '/admin/api/unblock' && method === 'POST') {
    return handleApiUnblockIp(request, env);
  }

  if (path === '/admin/api/clear-logs' && method === 'POST') {
    return handleApiClearLogs(env);
  }

  if (path === '/admin/api/stats' && method === 'GET') {
    const stats = await fetchSocStats(env.DB);
    return jsonResponse(stats);
  }

  // --------------------------------------------------------------------------
  // Protected SOC Dashboard View: /dashboard or root /
  // --------------------------------------------------------------------------
  if (path === '/dashboard' || path === '/' || path === '') {
    const stats = await fetchSocStats(env.DB);
    const attackLogsResult = await env.DB.prepare(
      'SELECT id, trap_name, ip, country, city, asn_org, user_agent, method, path, headers_json, created_at FROM attack_logs ORDER BY created_at DESC LIMIT 100'
    ).all<AttackLogRecord>();

    const blockedIpsResult = await env.DB.prepare(
      'SELECT ip, reason, blocked_at FROM blocked_ips ORDER BY blocked_at DESC'
    ).all<BlockedIpRecord>();

    const html = renderDashboardPage(
      stats,
      attackLogsResult.results || [],
      blockedIpsResult.results || [],
      env.ADMIN_USER || 'vyuha_admin'
    );
    return htmlResponse(html);
  }

  return new Response('Not Found', { status: 404 });
}

// ==============================================================================
// AUTHENTICATION & SESSION MANAGEMENT
// ==============================================================================

async function handleLoginPost(request: Request, env: Env): Promise<Response> {
  try {
    let username = '';
    let password = '';

    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      username = String(formData.get('username') || '').trim();
      password = String(formData.get('password') || '');
    } else if (contentType.includes('application/json')) {
      const body = await request.json() as any;
      username = String(body.username || '').trim();
      password = String(body.password || '');
    }

    if (!username || !password) {
      return htmlResponse(renderLoginPage('Both Username and Passphrase are required.'), 400);
    }

    // Verify username
    const expectedUser = env.ADMIN_USER || 'vyuha_admin';
    if (username !== expectedUser) {
      return htmlResponse(renderLoginPage('Invalid SOC Operator Credentials.'), 401);
    }

    // Verify password hash
    const inputHash = await sha256Hex(password);
    const expectedHash = env.ADMIN_PASSWORD_HASH;

    if (!timingSafeEqual(inputHash, expectedHash)) {
      return htmlResponse(renderLoginPage('Invalid SOC Operator Credentials.'), 401);
    }

    // Issue cryptographically secure session
    const sessionToken = generateSecureRandomToken(32);
    const tokenHash = await sha256Hex(sessionToken);

    // Save session in D1 with 24-hour expiration
    await env.DB.prepare(
      "INSERT INTO admin_sessions (token_hash, expires_at) VALUES (?, datetime('now', '+1 day'))"
    ).bind(tokenHash).run();

    // Construct secure cookie
    const isLocal = request.url.includes('localhost') || request.url.includes('127.0.0.1');
    const secureFlag = isLocal ? '' : 'Secure; ';
    const cookieHeader = `vyuhapot_session=${sessionToken}; Path=/; HttpOnly; ${secureFlag}SameSite=Strict; Max-Age=86400`;

    const url = new URL(request.url);
    return new Response(null, {
      status: 302,
      headers: {
        'Location': `${url.origin}/dashboard`,
        'Set-Cookie': cookieHeader
      }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return htmlResponse(renderLoginPage(`Authentication Exception: ${errorMsg}`), 500);
  }
}

async function handleLogout(request: Request, env: Env): Promise<Response> {
  const sessionToken = getSessionCookie(request);
  if (sessionToken) {
    try {
      const tokenHash = await sha256Hex(sessionToken);
      await env.DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(tokenHash).run();
    } catch {
      // Ignore cleanup error
    }
  }

  const url = new URL(request.url);
  return new Response(null, {
    status: 302,
    headers: {
      'Location': `${url.origin}/login`,
      'Set-Cookie': 'vyuhapot_session=deleted; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
    }
  });
}

async function verifySession(db: D1Database, sessionToken: string): Promise<boolean> {
  try {
    const tokenHash = await sha256Hex(sessionToken);
    const record = await db.prepare(
      'SELECT token_hash FROM admin_sessions WHERE token_hash = ? AND expires_at > CURRENT_TIMESTAMP LIMIT 1'
    ).bind(tokenHash).first();

    return !!record;
  } catch (err) {
    console.error('[VyūhaPot Session Verification Error]:', err);
    return false;
  }
}

function getSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const c of cookies) {
    const [name, val] = c.trim().split('=');
    if (name === 'vyuhapot_session') {
      return val || null;
    }
  }
  return null;
}

// ==============================================================================
// 1-CLICK QUICK BLOCK HANDLER (FROM ALERT EMAILS)
// ==============================================================================

async function handleQuickBlock(request: Request, env: Env, url: URL): Promise<Response> {
  const ip = url.searchParams.get('ip') || '';
  const exp = url.searchParams.get('exp') || '';
  const sig = url.searchParams.get('sig') || '';

  const socDomain = `${url.protocol}//${url.host}`;

  if (!ip || !exp || !sig) {
    return htmlResponse(
      renderQuickBlockConfirmationPage(
        ip || 'Unspecified',
        false,
        'Missing required cryptographic verification parameters in quick-block payload.',
        socDomain
      ),
      400
    );
  }

  // Cryptographically verify HMAC-SHA256 signature
  const verification = await verifySignedQuickBlock(ip, exp, sig, env.SESSION_SECRET);
  if (!verification.valid) {
    return htmlResponse(
      renderQuickBlockConfirmationPage(
        ip,
        false,
        `Authorization Failed: ${verification.reason}`,
        socDomain
      ),
      403
    );
  }

  // Apply ban in D1 database
  try {
    await env.DB.prepare(
      `INSERT OR REPLACE INTO blocked_ips (ip, reason, blocked_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)`
    ).bind(ip, 'Automated 1-Click Quick Block via Incident Email').run();

    return htmlResponse(
      renderQuickBlockConfirmationPage(
        ip,
        true,
        `IP ${ip} has been successfully added to Cloudflare D1 distributed edge blocklist. Subsequent requests will be terminated with HTTP 403 Forbidden.`,
        socDomain
      )
    );
  } catch (dbErr: unknown) {
    const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
    return htmlResponse(
      renderQuickBlockConfirmationPage(
        ip,
        false,
        `Database enforcement error: ${msg}`,
        socDomain
      ),
      500
    );
  }
}

// ==============================================================================
// ADMINISTRATIVE API CONTROLLERS
// ==============================================================================

async function handleApiBlockIp(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const ip = String(body.ip || '').trim();
    const reason = String(body.reason || 'Manual Admin Block via SOC Console').trim();

    if (!ip) {
      return jsonResponse({ success: false, error: 'Target IP is required' }, 400);
    }

    await env.DB.prepare(
      `INSERT OR REPLACE INTO blocked_ips (ip, reason, blocked_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)`
    ).bind(ip, reason).run();

    return jsonResponse({ success: true, message: `IP ${ip} added to Edge Blocklist` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ success: false, error: msg }, 500);
  }
}

async function handleApiUnblockIp(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const ip = String(body.ip || '').trim();

    if (!ip) {
      return jsonResponse({ success: false, error: 'Target IP is required' }, 400);
    }

    await env.DB.prepare('DELETE FROM blocked_ips WHERE ip = ?').bind(ip).run();
    return jsonResponse({ success: true, message: `IP ${ip} removed from Edge Blocklist` });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ success: false, error: msg }, 500);
  }
}

async function handleApiClearLogs(env: Env): Promise<Response> {
  try {
    await env.DB.prepare('DELETE FROM attack_logs').run();
    return jsonResponse({ success: true, message: 'All attack logs have been purged.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return jsonResponse({ success: false, error: msg }, 500);
  }
}

// ==============================================================================
// METRICS & TELEMETRY AGGREGATION
// ==============================================================================

async function fetchSocStats(db: D1Database): Promise<SocDashboardStats> {
  try {
    const totalInterceptionsRow = await db.prepare(
      'SELECT COUNT(*) as cnt FROM attack_logs'
    ).first<{ cnt: number }>();

    const totalBlockedRow = await db.prepare(
      'SELECT COUNT(*) as cnt FROM blocked_ips'
    ).first<{ cnt: number }>();

    const activeTrapsRow = await db.prepare(
      'SELECT COUNT(DISTINCT trap_name) as cnt FROM attack_logs'
    ).first<{ cnt: number }>();

    const last24hRow = await db.prepare(
      "SELECT COUNT(*) as cnt FROM attack_logs WHERE created_at >= datetime('now', '-24 hours')"
    ).first<{ cnt: number }>();

    const topCountryRow = await db.prepare(
      'SELECT country, COUNT(*) as cnt FROM attack_logs GROUP BY country ORDER BY cnt DESC LIMIT 1'
    ).first<{ country: string; cnt: number }>();

    const topAsnRow = await db.prepare(
      'SELECT asn_org, COUNT(*) as cnt FROM attack_logs GROUP BY asn_org ORDER BY cnt DESC LIMIT 1'
    ).first<{ asn_org: string; cnt: number }>();

    return {
      totalInterceptions: totalInterceptionsRow?.cnt || 0,
      totalBlocked: totalBlockedRow?.cnt || 0,
      activeTrapsCount: Math.max(1, activeTrapsRow?.cnt || 1),
      last24hInterceptions: last24hRow?.cnt || 0,
      topAttackerCountry: topCountryRow?.country || 'N/A',
      topAttackerAsn: topAsnRow?.asn_org || 'N/A'
    };
  } catch (err) {
    console.error('[VyūhaPot Stats Aggregation Error]:', err);
    return {
      totalInterceptions: 0,
      totalBlocked: 0,
      activeTrapsCount: 1,
      last24hInterceptions: 0,
      topAttackerCountry: 'N/A',
      topAttackerAsn: 'N/A'
    };
  }
}

// ==============================================================================
// UTILITY HELPERS
// ==============================================================================

function getClientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') || 
         request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
         '127.0.0.1';
}

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}

function htmlResponse(html: string, status: number = 200): Response {
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate'
    }
  });
}
