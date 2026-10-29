// ==============================================================================
// VyuhaPot: Automated Incident Email Dispatcher & HTML Telemetry Formatter
// ==============================================================================

import { Env, IncidentTelemetry } from './types';
import { generateSignedQuickBlockUrl } from './crypto';

/**
 * Formats a high-fidelity, responsive HTML security incident report for SOC analysts
 */
export function buildIncidentEmailHtml(
  telemetry: IncidentTelemetry,
  quickBlockUrl: string,
  socDashboardUrl: string
): string {
  const {
    trapName,
    ip,
    country,
    city,
    asnOrg,
    userAgent,
    method,
    path,
    headersJson,
    timestamp
  } = telemetry;

  // Format headers for readable inspection
  let formattedHeaders = 'None';
  try {
    const parsed = JSON.parse(headersJson);
    formattedHeaders = JSON.stringify(parsed, null, 2)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  } catch {
    formattedHeaders = headersJson || 'None';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚨 [VyuhaPot Security Alert] Intrusion Detected</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f17;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f17;
      padding: 30px 0;
    }
    .container {
      max-width: 680px;
      margin: 0 auto;
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 50%, #450a0a 100%);
      padding: 28px 32px;
      border-bottom: 2px solid #ef4444;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background-color: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(239, 68, 68, 0.6);
      border-radius: 9999px;
      color: #fca5a5;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .title {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }
    .subtitle {
      margin: 6px 0 0 0;
      color: #fecaca;
      font-size: 13px;
    }
    .content {
      padding: 32px;
    }
    .card {
      background-color: #1a2234;
      border: 1px solid #2d3748;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card-title {
      margin-top: 0;
      margin-bottom: 14px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #94a3b8;
      display: flex;
      align-items: center;
    }
    .table-data {
      width: 100%;
      border-collapse: collapse;
    }
    .table-data td {
      padding: 9px 0;
      border-bottom: 1px solid #26334d;
      font-size: 13px;
      vertical-align: top;
    }
    .table-data tr:last-child td {
      border-bottom: none;
    }
    .label {
      width: 150px;
      color: #94a3b8;
      font-weight: 600;
    }
    .value {
      color: #f1f5f9;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      word-break: break-all;
    }
    .highlight-ip {
      color: #ef4444;
      font-weight: 700;
      background: rgba(239, 68, 68, 0.12);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .highlight-trap {
      color: #38bdf8;
      font-weight: 600;
    }
    .action-container {
      margin: 28px 0;
      text-align: center;
    }
    .btn-block {
      display: inline-block;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 14px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 14px 0 rgba(220, 38, 38, 0.39);
      transition: all 0.2s ease;
      text-transform: uppercase;
    }
    .btn-dashboard {
      display: inline-block;
      background: #1f2937;
      color: #93c5fd !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      padding: 10px 20px;
      border-radius: 6px;
      margin-top: 12px;
      border: 1px solid #374151;
    }
    .forensics-box {
      background-color: #0d1117;
      border: 1px solid #21262d;
      border-radius: 6px;
      padding: 14px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 11px;
      color: #8b949e;
      overflow-x: auto;
      max-height: 220px;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #0d121d;
      padding: 20px 32px;
      border-top: 1px solid #1f2937;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Alert Header -->
      <div class="header">
        <div class="badge">Active Defense Deception Intercept</div>
        <h1 class="title">Intrusion Detected on Bait Node</h1>
        <p class="subtitle">VyuhaPot Honeypot tripwire sprang at Cloudflare Edge network node</p>
      </div>

      <!-- Main Body -->
      <div class="content">
        <!-- Key Incident Metadata Card -->
        <div class="card">
          <div class="card-title">Interception Telemetry</div>
          <table class="table-data">
            <tr>
              <td class="label">Tripwire Trap:</td>
              <td class="value highlight-trap">${escapeHtml(trapName)}</td>
            </tr>
            <tr>
              <td class="label">Attacker IP:</td>
              <td class="value"><span class="highlight-ip">${escapeHtml(ip)}</span></td>
            </tr>
            <tr>
              <td class="label">Geolocation:</td>
              <td class="value">${escapeHtml(city || 'Unknown')}, ${escapeHtml(country || 'Unknown')}</td>
            </tr>
            <tr>
              <td class="label">ASN / ISP:</td>
              <td class="value">${escapeHtml(asnOrg || 'Unknown ASN')}</td>
            </tr>
            <tr>
              <td class="label">HTTP Vector:</td>
              <td class="value"><strong>${escapeHtml(method)}</strong> ${escapeHtml(path)}</td>
            </tr>
            <tr>
              <td class="label">User-Agent:</td>
              <td class="value">${escapeHtml(userAgent || 'Empty User-Agent')}</td>
            </tr>
            <tr>
              <td class="label">Detected At:</td>
              <td class="value">${escapeHtml(timestamp)} UTC</td>
            </tr>
          </table>
        </div>

        <!-- 1-Click Action Callout -->
        <div class="action-container">
          <a href="${quickBlockUrl}" class="btn-block" target="_blank">
            🛡️ Block Attacker IP at Edge Now
          </a>
          <br>
          <a href="${socDashboardUrl}" class="btn-dashboard" target="_blank">
            Inspect in VyuhaPot SOC Operations Console
          </a>
          <p style="margin-top: 10px; font-size: 11px; color: #64748b;">
            Clicking the button immediately updates the Cloudflare D1 distributed edge firewall and drops subsequent traffic with HTTP 403 Forbidden.
          </p>
        </div>

        <!-- Raw Captured Headers Forensics -->
        <div class="card" style="margin-bottom: 0;">
          <div class="card-title">Raw Request Forensics (Captured Headers)</div>
          <div class="forensics-box">${formattedHeaders}</div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        VyuhaPot Autonomous Deception Engine • Cloudflare Workers + D1 Persistence • Confidential Security Dispatch
      </div>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Dispatches the asynchronous incident notification via the external email gateway
 */
export async function dispatchIncidentAlertEmail(
  env: Env,
  telemetry: IncidentTelemetry,
  socDomain: string = 'https://pot.vyuha.me'
): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const quickBlockUrl = await generateSignedQuickBlockUrl(
      socDomain,
      telemetry.ip,
      env.SESSION_SECRET
    );

    const socDashboardUrl = `${socDomain.replace(/\/+$/, '')}/dashboard`;
    const htmlReport = buildIncidentEmailHtml(telemetry, quickBlockUrl, socDashboardUrl);

    const endpoint = env.EMAIL_API_ENDPOINT || 'https://sender-api.mickey.qzz.io/api/v1/send';
    const payload = {
      to: env.ALERT_EMAIL_TO,
      subject: `🚨 [VyuhaPot Security Alert] Intrusion Detected on Bait Node (${telemetry.ip})`,
      html: htmlReport,
      sender_id: env.EMAIL_SENDER_ID || 'snd_mv3h6ko5'
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': env.EMAIL_API_KEY
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[VyuhaPot Email Dispatch Failure] Status: ${response.status}, Detail: ${errText}`);
      return { success: false, status: response.status, error: errText };
    }

    console.log(`[VyuhaPot Email Dispatch Success] Incident alert sent to ${env.ALERT_EMAIL_TO} for IP ${telemetry.ip}`);
    return { success: true, status: response.status };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[VyuhaPot Email Dispatch Exception]: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}
