// ==============================================================================
// VyūhaPot: Administrative SOC Console & Login Gate Template Engine
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
  <title>VyūhaPot // SOC Authentication Gate</title>
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
      <h1 class="brand-title">VyūhaPot</h1>
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
  <title>VyūhaPot // Active Defense SOC Operations</title>
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
      --accent-red-glow: rgba(239, 68, 68, 0.25);
      --accent-blue: #38bdf8;
      --accent-emerald: #10b981;
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
      padding: 28px 32px;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }

    /* Stat Cards Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
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

    /* Modal for forensics preview */
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
      z-index: 100;
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
      z-index: 200;
    }
    #toast.show {
      transform: translateY(0);
      opacity: 1;
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
        VyūhaPot <span class="nav-badge">Edge Active Defense</span>
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
                <tr id="log-row-${log.id}">
                  <td class="font-mono" style="color: var(--text-dim); white-space: nowrap;">${escapeHtml(log.created_at)}</td>
                  <td><span class="trap-tag">${escapeHtml(log.trap_name)}</span></td>
                  <td>
                    <span class="ip-badge ${isBlocked ? 'is-blocked' : ''}">
                      ${escapeHtml(log.ip)}
                      <button class="copy-btn" title="Copy IP" onclick="copyText('${escapeHtml(log.ip)}')">
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
                  <td style="text-align: right; white-space: nowrap;">
                    <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" onclick="viewForensics('${log.id}')">
                      Headers
                    </button>
                    ${isBlocked ? `
                      <span style="font-size: 11px; color: #ef4444; font-weight: 700; margin-left: 6px;">BLOCKED</span>
                    ` : `
                      <button class="btn btn-danger" style="padding: 4px 10px; font-size: 11px; margin-left: 6px;" onclick="blockIp('${escapeHtml(log.ip)}', 'Honeypot Trigger: ${escapeHtml(log.trap_name)}')">
                        [Block at Edge]
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

  <!-- Embedded Raw Headers Dictionary for fast client preview -->
  <script>
    const HEADERS_CACHE = ${JSON.stringify(
      Object.fromEntries(attackLogs.map(l => [String(l.id), l.headers_json || '{}']))
    )};

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
      const raw = HEADERS_CACHE[String(id)] || '{}';
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
          body: JSON.stringify({ ip, reason: reason || 'Manual Admin Action' })
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
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(${JSON.stringify(attackLogs)}, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "vyuhapot_telemetry_" + new Date().toISOString() + ".json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
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
  <title>VyūhaPot // Edge Ban Confirmation</title>
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
    <a href="${socDomain}/dashboard" class="btn">Proceed to VyūhaPot SOC Console &rarr;</a>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
