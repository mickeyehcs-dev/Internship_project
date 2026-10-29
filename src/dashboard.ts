// ==============================================================================
// VyuhaPot: Administrative SOC Console & Login Gate Template Engine
// Includes Interactive Global Ingress Threat Map & Live IP Threat Intel Panel
// Free Open-Source Map Engine (Zero API Keys, No Watermarks)
// ==============================================================================

import { AttackLogRecord, BlockedIpRecord, SocDashboardStats } from './types';

/**
 * Renders the high-security dark-mode SOC Operator Login Gate
 */
export function renderLoginPage(errorMessage?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VyuhaPot // SOC Authentication Gate</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #060911;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(220, 38, 38, 0.15), transparent 45%),
        radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.08), transparent 40%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 32px 32px, 32px 32px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #f1f5f9;
      padding: 24px;
    }
    .login-container {
      width: 100%;
      max-width: 440px;
      background: rgba(14, 22, 38, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(220, 38, 38, 0.2);
      overflow: hidden;
    }
    .login-header {
      padding: 36px 36px 24px 36px;
      text-align: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .brand-emblem {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(153, 27, 27, 0.4));
      border: 1px solid rgba(239, 68, 68, 0.5);
      box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(to right, #ffffff, #cbd5e1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin-top: 6px;
      letter-spacing: 0.3px;
    }
    .login-body {
      padding: 32px 36px 36px 36px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    .form-label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      color: #94a3b8;
      margin-bottom: 8px;
    }
    .form-input {
      width: 100%;
      background: rgba(8, 12, 20, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 12px 16px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .form-input:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
    }
    .btn-submit {
      width: 100%;
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 14px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);
      transition: all 0.2s ease;
      margin-top: 8px;
    }
    .btn-submit:hover {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      transform: translateY(-1px);
    }
    .error-banner {
      background: rgba(220, 38, 38, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .login-footer {
      padding: 16px 36px;
      background: rgba(6, 9, 17, 0.6);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
      font-size: 11px;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <div class="login-header">
      <div class="brand-emblem">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
      </div>
      <h1 class="brand-title">VyuhaPot</h1>
      <p class="brand-subtitle">Active Defense & Deception Telemetry SOC</p>
    </div>

    <div class="login-body">
      ${errorMessage ? `<div class="error-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        ${escapeHtml(errorMessage)}
      </div>` : ''}

      <form method="POST" action="/login">
        <div class="form-group">
          <label class="form-label" for="username">Operator Identity</label>
          <input class="form-input" type="text" id="username" name="username" placeholder="vyuha_admin" required autocomplete="username" autofocus>
        </div>

        <div class="form-group">
          <label class="form-label" for="password">Cryptographic Passphrase</label>
          <input class="form-input" type="password" id="password" name="password" placeholder="••••••••••••••••" required autocomplete="current-password">
        </div>

        <button type="submit" class="btn-submit">
          Authenticate Session &rarr;
        </button>
      </form>
    </div>

    <div class="login-footer">
      EDGE NODE AUTH GATE // CLOUDFLARE D1 TELEMETRY
    </div>
  </div>
</body>
</html>`;
}

/**
 * Renders the High-Performance Dark-Themed SOC Operations Interface
 * Enhanced with 100% Free Open-Source Threat Map (No API Key Required) and Deep IP Details Forensics Panel
 */
export function renderDashboardPage(
  stats: SocDashboardStats,
  attackLogs: AttackLogRecord[],
  blockedIps: BlockedIpRecord[],
  adminUser: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VyuhaPot // Active Defense SOC Operations</title>
  
  <!-- Leaflet CSS for Map Panel -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    :root {
      --bg-base: #060911;
      --bg-surface: #0e1626;
      --bg-elevated: #152238;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-medium: rgba(255, 255, 255, 0.15);
      --accent-red: #ef4444;
      --accent-red-glow: rgba(239, 68, 68, 0.35);
      --accent-blue: #38bdf8;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Top Navigation Bar */
    .navbar {
      height: 64px;
      background: rgba(14, 22, 38, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .nav-logo {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(220, 38, 38, 0.3), rgba(153, 27, 27, 0.6));
      border: 1px solid var(--accent-red);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 14px var(--accent-red-glow);
    }

    .nav-title {
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .operator-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      padding: 6px 12px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 8px var(--accent-emerald);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.9); }
    }

    .btn {
      font-family: inherit;
      font-size: 13px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 6px;
      border: 1px solid transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--border-subtle);
      color: var(--text-main);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-medium);
    }

    .btn-danger {
      background: rgba(220, 38, 38, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      color: #fca5a5;
    }
    .btn-danger:hover {
      background: #dc2626;
      color: #ffffff;
      border-color: #dc2626;
      box-shadow: 0 0 12px var(--accent-red-glow);
    }

    .btn-emerald {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.4);
      color: #6ee7b7;
    }
    .btn-emerald:hover {
      background: #10b981;
      color: #ffffff;
    }

    /* Main Container */
    .main-content {
      flex: 1;
      padding: 24px 32px;
      max-width: 1720px;
      margin: 0 auto;
      width: 100%;
    }

    /* Stat Cards Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 20px;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-medium);
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--card-accent, var(--accent-red)), transparent);
    }

    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 10px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
      color: #ffffff;
      line-height: 1;
      margin-bottom: 6px;
    }

    .stat-footer {
      font-size: 12px;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ==========================================================================
       MAP & IP INTEL SPLIT SECTION
       ========================================================================== */
    .intel-grid {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    @media (max-width: 1280px) {
      .intel-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Map Panel */
    .map-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .map-header {
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .map-title {
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radar-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      color: var(--accent-emerald);
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 2px 8px;
      border-radius: 9999px;
    }

    #threat-map {
      height: 220px;
      width: 100%;
      background: #060911 !important;
      z-index: 1;
      border-radius: 0;
      transition: height 0.25s ease;
    }

    /* 100% Free OpenStreetMap with Stealth Cyber Dark Mode Filter (Zero API Key, No Watermark) */
    #threat-map.cyber-dark-mode .leaflet-tile {
      filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(115%) saturate(25%) !important;
      -webkit-filter: invert(100%) hue-rotate(180deg) brightness(85%) contrast(115%) saturate(25%) !important;
    }

    .map-footer {
      padding: 10px 18px;
      background: rgba(6, 9, 17, 0.7);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: var(--text-dim);
    }

    .map-legend {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .legend-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    /* IP Forensics Inspector Panel */
    .ip-inspector-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .inspector-header {
      padding: 16px 20px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
    }

    .inspector-title {
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .inspector-body {
      padding: 16px 20px;
      overflow-y: auto;
      max-height: 290px;
      flex: 1;
    }

    .active-target-banner {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid var(--border-medium);
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    .target-ip-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .target-ip-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-dim);
    }

    .target-ip-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .intel-section {
      background: rgba(8, 12, 20, 0.6);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 14px;
    }

    .intel-section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--text-muted);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .intel-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      font-size: 12px;
    }
    .intel-row:last-child {
      border-bottom: none;
    }

    .intel-label {
      color: var(--text-dim);
      font-weight: 500;
    }

    .intel-val {
      color: #f1f5f9;
      font-family: 'JetBrains Mono', monospace;
      text-align: right;
      word-break: break-all;
    }

    .pivot-links {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .pivot-btn {
      flex: 1;
      min-width: 90px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-subtle);
      color: #93c5fd;
      padding: 7px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .pivot-btn:hover {
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent-blue);
      color: #ffffff;
    }

    .inspector-actions {
      padding: 14px 20px;
      background: rgba(6, 9, 17, 0.6);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    /* Panels & Tables */
    .panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      overflow: hidden;
      margin-bottom: 28px;
    }

    .panel-header {
      padding: 18px 24px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .panel-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .search-input {
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: 6px;
      padding: 7px 12px;
      color: #ffffff;
      font-size: 13px;
      width: 240px;
      outline: none;
      transition: all 0.2s ease;
    }
    .search-input:focus {
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }

    .table-container {
      overflow-x: auto;
      max-height: 520px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }

    th {
      background: rgba(6, 9, 17, 0.5);
      color: var(--text-muted);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
      position: sticky;
      top: 0;
      z-index: 10;
    }

    td {
      padding: 12px 18px;
      border-bottom: 1px solid var(--border-subtle);
      color: #e2e8f0;
      vertical-align: middle;
    }

    tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    tr.row-selected td {
      background: rgba(56, 189, 248, 0.08) !important;
      border-color: rgba(56, 189, 248, 0.3);
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }

    .ip-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 600;
      color: #f87171;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.25);
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ip-badge:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
    }

    .ip-badge.is-blocked {
      background: rgba(220, 38, 38, 0.25);
      border-color: #ef4444;
      color: #fca5a5;
    }

    .trap-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--accent-blue);
    }

    .copy-btn {
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      padding: 2px;
      display: inline-flex;
      transition: color 0.15s ease;
    }
    .copy-btn:hover {
      color: #ffffff;
    }

    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--text-dim);
      font-size: 14px;
    }

    /* Forensics Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      border-radius: 12px;
      max-width: 680px;
      width: 100%;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);
    }

    .modal-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-body {
      padding: 20px;
      overflow-y: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #cbd5e1;
      background: #080c14;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .modal-footer {
      padding: 14px 20px;
      border-top: 1px solid var(--border-subtle);
      text-align: right;
    }

    /* Toast Notification */
    #toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      background: #111827;
      border: 1px solid var(--accent-emerald);
      color: #6ee7b7;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 2000;
    }
    #toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* Custom Leaflet Dark Mode Popup */
    .leaflet-popup-content-wrapper {
      background: #0e1626 !important;
      color: #f1f5f9 !important;
      border: 1px solid #ef4444 !important;
      border-radius: 8px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.8) !important;
    }
    .leaflet-popup-tip {
      background: #0e1626 !important;
      border: 1px solid #ef4444 !important;
    }
    .leaflet-container {
      font-family: inherit !important;
    }
  </style>
</head>
<body>
  <!-- Top Navigation -->
  <header class="navbar">
    <div class="nav-brand">
      <div class="nav-logo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        </svg>
      </div>
      <div class="nav-title">
        VyuhaPot <span class="nav-badge">Edge Active Defense</span>
      </div>
    </div>

    <div class="nav-actions">
      <div class="operator-tag">
        <span class="status-dot"></span>
        OPERATOR: <strong>${escapeHtml(adminUser)}</strong>
      </div>
      <button class="btn btn-secondary" onclick="window.location.reload()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        Refresh
      </button>
      <a href="/logout" class="btn btn-secondary">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Logout
      </a>
    </div>
  </header>

  <main class="main-content">
    <!-- Stat Cards -->
    <div class="stats-grid">
      <div class="stat-card" style="--card-accent: var(--accent-red);">
        <div class="stat-header">
          <span>Total Interceptions</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div class="stat-value" id="stat-total-interceptions">${stats.totalInterceptions}</div>
        <div class="stat-footer">Cumulative sprung bait tripwires</div>
      </div>

      <div class="stat-card" style="--card-accent: #f59e0b;">
        <div class="stat-header">
          <span>Edge Blocked Entities</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <div class="stat-value" id="stat-total-blocked" style="color: #f59e0b;">${stats.totalBlocked}</div>
        <div class="stat-footer">Active 403 Forbidden edge drop rules</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--accent-blue);">
        <div class="stat-header">
          <span>Active Honeypot Nodes</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
        </div>
        <div class="stat-value" style="color: var(--accent-blue);">${stats.activeTrapsCount}</div>
        <div class="stat-footer">Listening on vault.vyuha.me cluster</div>
      </div>

      <div class="stat-card" style="--card-accent: var(--accent-emerald);">
        <div class="stat-header">
          <span>24h Interceptions</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="stat-value" style="color: var(--accent-emerald);">${stats.last24hInterceptions}</div>
        <div class="stat-footer">Top Origin: <strong>${escapeHtml(stats.topAttackerCountry || 'N/A')}</strong></div>
      </div>
    </div>

    <!-- ====================================================================
         LIVE THREAT MAP & IP DETAILS FORENSICS SECTION
         (Powered by 100% Free Open-Source Tiles - Zero API Keys, No Watermarks)
         ==================================================================== -->
    <div class="intel-grid">
      <!-- Left Panel: Global Ingress Threat Map -->
      <div class="map-panel">
        <div class="map-header">
          <div class="map-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Global Ingress Threat Map // Live Anycast Radar
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="radar-indicator">
              <span class="status-dot"></span>
              RADAR ACTIVE
            </span>
            <select id="map-style-select" onchange="setMapLayer(this.value)" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: #cbd5e1; font-size: 11px; padding: 4px 8px; border-radius: 6px; outline: none; cursor: pointer;">
              <option value="dark" selected>Tactical Dark (Free)</option>
              <option value="satellite">Satellite Recon (Free)</option>
              <option value="standard">Standard Map (Free)</option>
            </select>
            <select id="map-size-select" onchange="setMapHeight(this.value)" title="Adjust map radar display height" style="background: rgba(255,255,255,0.06); border: 1px solid var(--border-subtle); color: #cbd5e1; font-size: 11px; padding: 4px 8px; border-radius: 6px; outline: none; cursor: pointer;">
              <option value="180">Mini (180px)</option>
              <option value="220" selected>Compact (220px)</option>
              <option value="300">Standard (300px)</option>
            </select>
            <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="resetMapView()">
              Reset
            </button>
          </div>
        </div>

        <!-- Leaflet Map Container with default cyber-dark-mode class -->
        <div id="threat-map" class="cyber-dark-mode"></div>

        <div class="map-footer">
          <div class="map-legend">
            <div class="legend-item">
              <div class="legend-dot" style="background: #ef4444; box-shadow: 0 0 6px #ef4444;"></div>
              <span>Blocked IP (403 Drop)</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot" style="background: #f59e0b; box-shadow: 0 0 6px #f59e0b;"></div>
              <span>Active Tripwire Trigger</span>
            </div>
          </div>
          <div id="map-stats-text">Tracking ${attackLogs.length} recent telemetry points (Free Tiles / No API Key)</div>
        </div>
      </div>

      <!-- Right Panel: IP Forensics & Deep Threat Intel Panel -->
      <div class="ip-inspector-panel" id="ip-inspector-card">
        <div class="inspector-header">
          <div class="inspector-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>
            IP Details & Threat Intelligence Inspector
          </div>
          <span id="inspector-status-badge" class="nav-badge" style="background: rgba(56, 189, 248, 0.15); border-color: rgba(56, 189, 248, 0.4); color: #93c5fd;">
            SELECT TARGET
          </span>
        </div>

        <div class="inspector-body" id="inspector-content">
          <!-- Dynamic IP Inspector Content Populated via JS -->
          <div class="empty-state">
            Click on any IP address or map marker to load deep threat forensics.
          </div>
        </div>

        <div class="inspector-actions" id="inspector-actions-bar" style="display: none;">
          <button id="inspector-block-btn" class="btn btn-danger" onclick="triggerInspectorBlock()">
            [Block at Edge]
          </button>
          <button class="btn btn-secondary" onclick="triggerInspectorHeaders()">
            Raw Headers
          </button>
          <button class="btn btn-secondary" onclick="exportActiveIpJson()">
            Export Dossier
          </button>
        </div>
      </div>
    </div>

    <!-- Active Incident Telemetry Table -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Ingress Attack Telemetry & Bait Interceptions
        </div>
        <div class="panel-controls">
          <input type="text" id="log-search" class="search-input" placeholder="Filter by IP, Trap, Country..." onkeyup="filterTable('incident-table', this.value)">
          <button class="btn btn-secondary" onclick="exportLogsJson()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export JSON
          </button>
          <button class="btn btn-secondary" style="color: #f87171;" onclick="clearLogs()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Clear Logs
          </button>
        </div>
      </div>

      <div class="table-container">
        <table id="incident-table">
          <thead>
            <tr>
              <th>Timestamp (UTC)</th>
              <th>Trigger Trap</th>
              <th>Attacker IP</th>
              <th>Geolocation</th>
              <th>ASN / ISP</th>
              <th>Method & Path</th>
              <th>User-Agent</th>
              <th style="text-align: right;">Edge Action</th>
            </tr>
          </thead>
          <tbody>
            ${attackLogs.length === 0 ? `
              <tr>
                <td colspan="8" class="empty-state">
                  No intrusions detected yet. Deception tripwires are standing by on bait nodes.
                </td>
              </tr>
            ` : attackLogs.map(log => {
              const isBlocked = blockedIps.some(b => b.ip === log.ip);
              return `
                <tr id="log-row-${log.id}" onclick="selectIncidentById('${log.id}')" style="cursor: pointer;">
                  <td class="font-mono" style="color: var(--text-dim); white-space: nowrap;">${escapeHtml(log.created_at)}</td>
                  <td><span class="trap-tag">${escapeHtml(log.trap_name)}</span></td>
                  <td>
                    <span class="ip-badge ${isBlocked ? 'is-blocked' : ''}" onclick="event.stopPropagation(); selectIncidentById('${log.id}')">
                      ${escapeHtml(log.ip)}
                      <button class="copy-btn" title="Copy IP" onclick="event.stopPropagation(); copyText('${escapeHtml(log.ip)}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      </button>
                    </span>
                  </td>
                  <td>
                    <strong>${escapeHtml(log.country || 'XX')}</strong> ${escapeHtml(log.city ? '· ' + log.city : '')}
                  </td>
                  <td style="color: var(--text-muted); max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${escapeHtml(log.asn_org || 'Unknown ASN')}
                  </td>
                  <td class="font-mono">
                    <span style="color: #f59e0b;">${escapeHtml(log.method)}</span> 
                    <span style="color: #cbd5e1;">${escapeHtml(log.path)}</span>
                  </td>
                  <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-muted);" title="${escapeHtml(log.user_agent || '')}">
                    ${escapeHtml(log.user_agent || 'None')}
                  </td>
                  <td style="text-align: right; white-space: nowrap;" onclick="event.stopPropagation()">
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="viewForensics('${log.id}')">
                      Headers
                    </button>
                    ${isBlocked ? `
                      <span style="font-size: 11px; color: #ef4444; font-weight: 700; margin-left: 6px;">BLOCKED</span>
                    ` : `
                      <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px; margin-left: 6px;" onclick="blockIp('${escapeHtml(log.ip)}', 'Honeypot Trigger: ${escapeHtml(log.trap_name)}')">
                        [Block]
                      </button>
                    `}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edge Blocklist Manager Table -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Edge Blocklist Manager (403 Drops)
        </div>
        <div class="panel-controls">
          <input type="text" id="manual-block-ip" class="search-input" placeholder="Manual IP (e.g. 198.51.100.4)">
          <button class="btn btn-danger" onclick="manualBlock()">
            + Block at Edge
          </button>
        </div>
      </div>

      <div class="table-container">
        <table id="blocklist-table">
          <thead>
            <tr>
              <th>Blocked IP Address</th>
              <th>Isolation Reason</th>
              <th>Enforcement Timestamp (UTC)</th>
              <th style="text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody id="blocklist-tbody">
            ${blockedIps.length === 0 ? `
              <tr>
                <td colspan="4" class="empty-state">
                  No IP addresses currently banned at the edge.
                </td>
              </tr>
            ` : blockedIps.map(entry => `
              <tr id="block-row-${entry.ip.replace(/[^a-zA-Z0-9]/g, '_')}">
                <td>
                  <span class="ip-badge is-blocked">${escapeHtml(entry.ip)}</span>
                </td>
                <td style="color: var(--text-muted);">${escapeHtml(entry.reason)}</td>
                <td class="font-mono" style="color: var(--text-dim);">${escapeHtml(entry.blocked_at)}</td>
                <td style="text-align: right;">
                  <button class="btn btn-emerald" style="padding: 4px 10px; font-size: 11px;" onclick="unblockIp('${escapeHtml(entry.ip)}')">
                    [Unblock]
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Forensics Modal -->
  <div id="forensics-modal" class="modal-overlay" onclick="closeModal(event)">
    <div class="modal-card" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="font-size: 14px; font-weight: 700;">Captured Request Headers Forensics</h3>
        <button class="btn btn-secondary" style="padding: 4px 8px;" onclick="closeModal()">✕</button>
      </div>
      <div id="modal-content" class="modal-body"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  </div>

  <!-- Toast Element -->
  <div id="toast"></div>

  <!-- Leaflet JS for Interactive Map -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <!-- Client-Side Map, Threat Intel & Telemetry Controller -->
  <script>
    // Injected Data Models
    const ATTACK_LOGS = ${JSON.stringify(attackLogs)};
    const BLOCKED_IPS = ${JSON.stringify(blockedIps)};
    let activeSelectedLog = null;
    let threatMap = null;
    let markersLayer = null;
    let currentTileLayer = null;
    const markerMap = new Map();

    // ISO Country Centroid Fallbacks
    const COUNTRY_COORDS = {
      'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'GB': [55.3781, -3.4360],
      'DE': [51.1657, 10.4515], 'FR': [46.2276, 2.2137], 'NL': [52.1326, 5.2913],
      'RU': [61.5240, 105.3188], 'CN': [35.8617, 104.1954], 'IN': [20.5937, 78.9629],
      'JP': [36.2048, 138.2529], 'SG': [1.3521, 103.8198], 'AU': [-25.2744, 133.7751],
      'BR': [-14.2350, -51.9253], 'ZA': [-30.5595, 22.9375], 'IE': [53.1424, -7.6921],
      'SE': [60.1282, 18.6435], 'FI': [61.9241, 25.7482], 'PL': [51.9194, 19.1451],
      'UA': [48.3794, 31.1656], 'RO': [45.9432, 24.9668], 'CH': [46.8182, 8.2275],
      'AT': [47.5162, 14.5501], 'IT': [41.8719, 12.5674], 'ES': [40.4637, -3.7492],
      'IL': [31.0461, 34.8516], 'KR': [35.9078, 127.7669], 'HK': [22.3193, 114.1694]
    };

    // Initialize Dashboard on Load
    document.addEventListener('DOMContentLoaded', () => {
      initThreatMap();
      if (ATTACK_LOGS.length > 0) {
        selectIncidentById(ATTACK_LOGS[0].id);
      }
    });

    // --------------------------------------------------------------------------
    // 1. Interactive Leaflet Map Subsystem (100% Free - Zero API Keys, No Watermarks)
    // --------------------------------------------------------------------------
    function initThreatMap() {
      try {
        threatMap = L.map('threat-map', {
          zoomControl: true,
          attributionControl: false,
          minZoom: 1,
          maxZoom: 18
        }).setView([20, 0], 1.6);

        // Load Default 100% Free OpenStreetMap with Cyber Dark Mode Filter
        setMapLayer('dark');

        markersLayer = L.layerGroup().addTo(threatMap);
        plotThreatMarkers();
      } catch (err) {
        console.error('Failed to initialize Leaflet Map:', err);
      }
    }

    function setMapLayer(type) {
      if (!threatMap) return;
      if (currentTileLayer) {
        threatMap.removeLayer(currentTileLayer);
      }
      const mapEl = document.getElementById('threat-map');

      if (type === 'satellite') {
        mapEl.classList.remove('cyber-dark-mode');
        // Free Public Esri World Imagery (No API key, No watermark)
        currentTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 18,
          attribution: 'Esri Satellite'
        }).addTo(threatMap);
      } else if (type === 'standard') {
        mapEl.classList.remove('cyber-dark-mode');
        // Free Public OpenStreetMap (No API key, No watermark)
        currentTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: 'OpenStreetMap'
        }).addTo(threatMap);
      } else {
        // Default: Free OpenStreetMap with Tactical Cyber Dark Mode CSS Filter
        mapEl.classList.add('cyber-dark-mode');
        currentTileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: 'OpenStreetMap'
        }).addTo(threatMap);
      }

      if (markersLayer) {
        markersLayer.bringToFront();
      }
    }

    function setMapHeight(heightVal) {
      const mapEl = document.getElementById('threat-map');
      if (!mapEl) return;
      mapEl.style.height = heightVal + 'px';
      setTimeout(() => {
        if (threatMap) {
          threatMap.invalidateSize();
        }
      }, 150);
    }

    function plotThreatMarkers() {
      if (!markersLayer) return;
      markersLayer.clearLayers();
      markerMap.clear();

      const bounds = [];

      ATTACK_LOGS.forEach(log => {
        const coords = resolveCoordinates(log);
        if (!coords) return;

        const isBlocked = BLOCKED_IPS.some(b => b.ip === log.ip);
        const markerColor = isBlocked ? '#ef4444' : '#f59e0b';
        const pulseColor = isBlocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)';

        // Pulsing SVG Tactical Radar Icon
        const iconHtml = \`
          <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 22px; height: 22px; border-radius: 50%; background: \${pulseColor}; animation: pulse 1.8s infinite;"></div>
            <div style="width: 10px; height: 10px; border-radius: 50%; background: \${markerColor}; border: 2px solid #ffffff; box-shadow: 0 0 8px \${markerColor};"></div>
          </div>
        \`;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-radar-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker([coords[0], coords[1]], { icon: customIcon });

        const popupContent = \`
          <div style="font-family: inherit; font-size: 12px; min-width: 200px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; font-family: monospace; color: \${markerColor}; font-size: 13px;">\${escapeHtml(log.ip)}</span>
              <span style="font-size: 10px; padding: 2px 5px; border-radius: 4px; background: rgba(255,255,255,0.08);">\${escapeHtml(log.country || 'XX')}</span>
            </div>
            <div style="color: #cbd5e1; margin-bottom: 4px;">\${escapeHtml(log.city || 'Unknown City')}, \${escapeHtml(log.country || 'Unknown')}</div>
            <div style="color: #94a3b8; font-size: 11px; margin-bottom: 8px;">ASN: \${escapeHtml(log.asn_org || 'N/A')}</div>
            <div style="display: flex; gap: 6px;">
              <button onclick="selectIncidentById('\${log.id}')" style="flex: 1; background: #1e293b; color: #38bdf8; border: 1px solid #334155; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                Inspect Intel
              </button>
              \${!isBlocked ? \`
                <button onclick="blockIp('\${escapeHtml(log.ip)}')" style="background: #dc2626; color: #fff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;">
                  Block
                </button>
              \` : ''}
            </div>
          </div>
        \`;

        marker.bindPopup(popupContent);
        marker.on('click', () => selectIncidentById(log.id));

        marker.addTo(markersLayer);
        markerMap.set(String(log.id), marker);
        bounds.push(coords);
      });

      if (bounds.length > 0 && threatMap) {
        threatMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
      }
    }

    function resolveCoordinates(log) {
      // 1. Direct coordinates from Cloudflare
      if (log.latitude && log.longitude && log.latitude !== 0 && log.longitude !== 0) {
        return [log.latitude, log.longitude];
      }

      // 2. Parse from headers_json telemetry payload if present
      try {
        const parsed = JSON.parse(log.headers_json || '{}');
        if (parsed.telemetry?.latitude && parsed.telemetry?.longitude) {
          const lat = parseFloat(parsed.telemetry.latitude);
          const lng = parseFloat(parsed.telemetry.longitude);
          if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            return [lat, lng];
          }
        }
      } catch {}

      // 3. Fallback to Country centroid with subtle hash-based jitter
      const countryCode = (log.country || '').toUpperCase();
      if (COUNTRY_COORDS[countryCode]) {
        const base = COUNTRY_COORDS[countryCode];
        // Jitter based on IP string to separate multiple pins in the same country
        const hash = Array.from(log.ip).reduce((acc, c) => acc + c.charCodeAt(0), 0);
        const jitterLat = ((hash % 100) - 50) * 0.05;
        const jitterLng = (((hash * 3) % 100) - 50) * 0.05;
        return [base[0] + jitterLat, base[1] + jitterLng];
      }

      return null;
    }

    function resetMapView() {
      if (!threatMap) return;
      threatMap.setView([20, 0], 1.6);
      threatMap.invalidateSize();
    }

    // --------------------------------------------------------------------------
    // 2. IP Forensics & Deep Threat Intel Inspector
    // --------------------------------------------------------------------------
    function selectIncidentById(id) {
      const log = ATTACK_LOGS.find(l => String(l.id) === String(id));
      if (!log) return;

      activeSelectedLog = log;

      // Highlight selected table row
      document.querySelectorAll('#incident-table tbody tr').forEach(tr => {
        tr.classList.remove('row-selected');
      });
      const targetRow = document.getElementById('log-row-' + log.id);
      if (targetRow) {
        targetRow.classList.add('row-selected');
      }

      // Pan map to attacker coordinates
      const coords = resolveCoordinates(log);
      if (coords && threatMap) {
        threatMap.flyTo([coords[0], coords[1]], 6, { duration: 1.2 });
        const marker = markerMap.get(String(log.id));
        if (marker) {
          setTimeout(() => marker.openPopup(), 1250);
        }
      }

      // Populate Inspector Card
      renderInspectorPanel(log);
    }

    function renderInspectorPanel(log) {
      const isBlocked = BLOCKED_IPS.some(b => b.ip === log.ip);

      // Parse metadata from headers_json
      let parsedMetadata = {};
      try {
        const obj = JSON.parse(log.headers_json || '{}');
        parsedMetadata = obj.telemetry || {};
      } catch {}

      const coords = resolveCoordinates(log);
      const coordsText = coords ? \`\${coords[0].toFixed(4)}, \${coords[1].toFixed(4)}\` : 'Undetermined';
      const coloText = log.colo || parsedMetadata.colo || 'Global Anycast';
      const regionText = log.region || parsedMetadata.region || 'N/A';
      const timezoneText = parsedMetadata.timezone || 'UTC';
      const protocolText = parsedMetadata.httpProtocol || 'HTTP/2';
      const tlsCipher = parsedMetadata.tlsCipher || 'TLS_AES_256_GCM_SHA384';

      // Status Badge
      const statusBadge = document.getElementById('inspector-status-badge');
      if (isBlocked) {
        statusBadge.textContent = 'BLOCKED AT EDGE (403)';
        statusBadge.style.background = 'rgba(239, 68, 68, 0.2)';
        statusBadge.style.borderColor = '#ef4444';
        statusBadge.style.color = '#fca5a5';
      } else {
        statusBadge.textContent = 'ACTIVE THREAT (MONITORED)';
        statusBadge.style.background = 'rgba(245, 158, 11, 0.2)';
        statusBadge.style.borderColor = '#f59e0b';
        statusBadge.style.color = '#fde68a';
      }

      // Build Inspector HTML
      const html = \`
        <!-- Target IP Header Banner -->
        <div class="active-target-banner">
          <div class="target-ip-wrap">
            <span class="target-ip-label">Target Adversary Identity</span>
            <div class="target-ip-val">
              <span>\${escapeHtml(log.ip)}</span>
              <button class="copy-btn" title="Copy IP" onclick="copyText('\${escapeHtml(log.ip)}')">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </button>
            </div>
          </div>
          <div>
            <span class="trap-tag">\${escapeHtml(log.trap_name)}</span>
          </div>
        </div>

        <!-- Section 1: Physical Geolocation & Edge PoP -->
        <div class="intel-section">
          <div class="intel-section-title">
            <span>Physical Geolocation & Edge Ingress</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          </div>
          <div class="intel-row">
            <span class="intel-label">Country:</span>
            <span class="intel-val"><strong>\${escapeHtml(log.country || 'Unknown')}</strong></span>
          </div>
          <div class="intel-row">
            <span class="intel-label">City / Metro:</span>
            <span class="intel-val">\${escapeHtml(log.city || 'Unknown')}\${regionText !== 'N/A' ? ' (' + escapeHtml(regionText) + ')' : ''}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">GPS Coordinates:</span>
            <span class="intel-val" style="color: #38bdf8;">\${coordsText}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Cloudflare Edge PoP (Colo):</span>
            <span class="intel-val">\${escapeHtml(coloText)}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Timezone:</span>
            <span class="intel-val">\${escapeHtml(timezoneText)}</span>
          </div>
        </div>

        <!-- Section 2: Autonomous System (ASN) & Network Infrastructure -->
        <div class="intel-section">
          <div class="intel-section-title">
            <span>Network & Autonomous System (ASN)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          </div>
          <div class="intel-row">
            <span class="intel-label">ASN / Organization:</span>
            <span class="intel-val">\${escapeHtml(log.asn_org || 'Unknown ASN')}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Protocol:</span>
            <span class="intel-val">\${escapeHtml(protocolText)}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Cipher Suite:</span>
            <span class="intel-val" style="font-size: 11px;">\${escapeHtml(tlsCipher)}</span>
          </div>
        </div>

        <!-- Section 3: Adversary Tooling & Attack Vector -->
        <div class="intel-section">
          <div class="intel-section-title">
            <span>Adversary Tooling & Vector</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6"/><path d="M12 19h8"/></svg>
          </div>
          <div class="intel-row">
            <span class="intel-label">Target Path:</span>
            <span class="intel-val" style="color: #f59e0b;">\${escapeHtml(log.method)} \${escapeHtml(log.path)}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">User-Agent:</span>
            <span class="intel-val" style="font-size: 11px; max-width: 260px;" title="\${escapeHtml(log.user_agent || '')}">
              \${escapeHtml(log.user_agent || 'Empty User-Agent')}
            </span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Incident Timestamp:</span>
            <span class="intel-val">\${escapeHtml(log.created_at)} UTC</span>
          </div>
        </div>

        <!-- Section 4: External Threat Intelligence OSINT Pivots -->
        <div class="intel-section">
          <div class="intel-section-title">
            <span>External Threat Intelligence Pivots</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <div class="pivot-links">
            <a href="https://www.abuseipdb.com/check/\${encodeURIComponent(log.ip)}" target="_blank" class="pivot-btn">
              AbuseIPDB &nearr;
            </a>
            <a href="https://www.virustotal.com/gui/ip-address/\${encodeURIComponent(log.ip)}" target="_blank" class="pivot-btn">
              VirusTotal &nearr;
            </a>
            <a href="https://viz.greynoise.io/ip/\${encodeURIComponent(log.ip)}" target="_blank" class="pivot-btn">
              GreyNoise &nearr;
            </a>
            <a href="https://www.shodan.io/host/\${encodeURIComponent(log.ip)}" target="_blank" class="pivot-btn">
              Shodan &nearr;
            </a>
          </div>
        </div>
      \`;

      document.getElementById('inspector-content').innerHTML = html;

      // Update Actions Bar
      const actionsBar = document.getElementById('inspector-actions-bar');
      actionsBar.style.display = 'flex';

      const blockBtn = document.getElementById('inspector-block-btn');
      if (isBlocked) {
        blockBtn.textContent = 'Unblock IP';
        blockBtn.className = 'btn btn-emerald';
        blockBtn.onclick = () => unblockIp(log.ip);
      } else {
        blockBtn.textContent = '[Block at Edge]';
        blockBtn.className = 'btn btn-danger';
        blockBtn.onclick = () => blockIp(log.ip, 'Honeypot Trigger: ' + log.trap_name);
      }
    }

    function triggerInspectorBlock() {
      if (activeSelectedLog) {
        blockIp(activeSelectedLog.ip, 'Honeypot Trigger: ' + activeSelectedLog.trap_name);
      }
    }

    function triggerInspectorHeaders() {
      if (activeSelectedLog) {
        viewForensics(activeSelectedLog.id);
      }
    }

    function exportActiveIpJson() {
      if (!activeSelectedLog) return;
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeSelectedLog, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "vyuha_ip_dossier_" + activeSelectedLog.ip.replace(/[^a-zA-Z0-9]/g, '_') + ".json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    // --------------------------------------------------------------------------
    // 3. UI Helpers, API Interactivity, & Modals
    // --------------------------------------------------------------------------
    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3500);
    }

    function copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard: ' + text);
      });
    }

    function viewForensics(id) {
      const log = ATTACK_LOGS.find(l => String(l.id) === String(id));
      const raw = log?.headers_json || '{}';
      try {
        const parsed = JSON.parse(raw);
        document.getElementById('modal-content').textContent = JSON.stringify(parsed, null, 2);
      } catch {
        document.getElementById('modal-content').textContent = raw;
      }
      document.getElementById('forensics-modal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('forensics-modal').style.display = 'none';
    }

    function filterTable(tableId, query) {
      const filter = query.toLowerCase();
      const rows = document.getElementById(tableId).querySelectorAll('tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
      });
    }

    async function blockIp(ip, reason) {
      if (!confirm('Are you sure you want to enforce an immediate Edge Drop (403) for ' + ip + '?')) return;
      try {
        const res = await fetch('/admin/api/block', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip, reason: reason || 'Manual Admin Action via SOC Console' })
        });
        const data = await res.json();
        if (data.success) {
          showToast('IP ' + ip + ' blocked at edge firewall');
          setTimeout(() => window.location.reload(), 800);
        } else {
          alert('Error blocking IP: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('API Network Failure: ' + err.message);
      }
    }

    async function manualBlock() {
      const input = document.getElementById('manual-block-ip');
      const ip = input.value.trim();
      if (!ip) return;
      await blockIp(ip, 'Manual SOC Addition');
    }

    async function unblockIp(ip) {
      if (!confirm('Lift Edge ban for IP ' + ip + '?')) return;
      try {
        const res = await fetch('/admin/api/unblock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ip })
        });
        const data = await res.json();
        if (data.success) {
          showToast('IP ' + ip + ' unblocked successfully');
          setTimeout(() => window.location.reload(), 800);
        } else {
          alert('Error unblocking: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('API Network Failure: ' + err.message);
      }
    }

    async function clearLogs() {
      if (!confirm('Permanently purge all intrusion incident records from D1?')) return;
      try {
        const res = await fetch('/admin/api/clear-logs', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          showToast('Attack logs cleared');
          setTimeout(() => window.location.reload(), 800);
        }
      } catch (err) {
        alert('Failed to clear logs: ' + err.message);
      }
    }

    function exportLogsJson() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ATTACK_LOGS, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "vyuhapot_telemetry_" + new Date().toISOString() + ".json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    function escapeHtml(text) {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  </script>
</body>
</html>`;
}

/**
 * Renders confirmation page when an operator activates the 1-Click Quick Block link in an alert email
 */
export function renderQuickBlockConfirmationPage(
  ip: string,
  success: boolean,
  message: string,
  socDomain: string = 'https://pot.vyuha.me'
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VyuhaPot // Edge Ban Confirmation</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #060911;
      font-family: 'Inter', -apple-system, sans-serif;
      color: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
    }
    .card {
      background: #0e1626;
      border: 1px solid ${success ? '#ef4444' : '#64748b'};
      border-radius: 14px;
      padding: 36px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
    }
    .icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${success ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.2)'};
      border: 1px solid ${success ? '#ef4444' : '#64748b'};
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 10px;
    }
    .ip {
      font-family: 'JetBrains Mono', monospace;
      color: #ef4444;
      font-size: 16px;
      font-weight: 700;
      background: rgba(239, 68, 68, 0.1);
      padding: 4px 12px;
      border-radius: 6px;
      display: inline-block;
      margin: 12px 0 20px 0;
    }
    .desc {
      color: #94a3b8;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-block;
      background: #1e293b;
      border: 1px solid #334155;
      color: #38bdf8;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;
    }
    .btn:hover {
      background: #334155;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      ${success ? `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      ` : `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      `}
    </div>
    <h2 class="title">${success ? 'Edge Isolation Enforced' : 'Quick Block Inactive'}</h2>
    <div class="ip">${escapeHtml(ip)}</div>
    <p class="desc">${escapeHtml(message)}</p>
    <a href="${socDomain}/dashboard" class="btn">Proceed to VyuhaPot SOC Console &rarr;</a>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
