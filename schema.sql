-- ==============================================================================
-- VyuhaPot: Enterprise Active Defense & Deception Security Platform
-- Persistence & Telemetry Correlation Schema (Cloudflare D1 / SQLite Engine)
-- ==============================================================================

-- 1. Ingress Telemetry & Attack Event Records
CREATE TABLE IF NOT EXISTS attack_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trap_name TEXT NOT NULL,
    ip TEXT NOT NULL,
    country TEXT,
    city TEXT,
    asn_org TEXT,
    user_agent TEXT,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    headers_json TEXT,
    latitude REAL,
    longitude REAL,
    region TEXT,
    colo TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for high-throughput SOC queries and chronological telemetry indexing
CREATE INDEX IF NOT EXISTS idx_attack_logs_ip ON attack_logs(ip);
CREATE INDEX IF NOT EXISTS idx_attack_logs_created ON attack_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attack_logs_trap ON attack_logs(trap_name);

-- 2. Edge-Level Banlist & Real-Time Firewall Enforcement Table
CREATE TABLE IF NOT EXISTS blocked_ips (
    ip TEXT PRIMARY KEY,
    reason TEXT NOT NULL DEFAULT 'Automated Honeypot Trap Trigger',
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_timestamp ON blocked_ips(blocked_at DESC);

-- 3. Administrative Authentication & Ephemeral Session Store
CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    expires_at DATETIME NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry ON admin_sessions(expires_at);
