// ==============================================================================
// VyūhaPot: TypeScript Type Definitions & Environment Contracts
// ==============================================================================

export interface Env {
  // Cloudflare D1 Database Binding
  DB: D1Database;

  // Administrative Credentials & Security Tokens
  ADMIN_USER: string;
  ADMIN_PASSWORD_HASH: string;
  SESSION_SECRET: string;

  // Incident Notification Gateway Config
  ALERT_EMAIL_TO: string;
  EMAIL_API_KEY: string;
  EMAIL_SENDER_ID: string;
  EMAIL_API_ENDPOINT?: string;

  // Honeypot Tuning Configuration
  TARPIT_DELAY_MS?: string;
  HONEYPOT_REALM?: string;
  HONEYPOT_NAME?: string;
}

export interface AttackLogRecord {
  id: number;
  trap_name: string;
  ip: string;
  country: string | null;
  city: string | null;
  asn_org: string | null;
  user_agent: string | null;
  method: string;
  path: string;
  headers_json: string | null;
  created_at: string;
}

export interface BlockedIpRecord {
  ip: string;
  reason: string;
  blocked_at: string;
}

export interface AdminSessionRecord {
  token_hash: string;
  expires_at: string;
}

export interface IncidentTelemetry {
  trapName: string;
  ip: string;
  country: string;
  city: string;
  asnOrg: string;
  userAgent: string;
  method: string;
  path: string;
  headersJson: string;
  timestamp: string;
}

export interface EmailDispatchPayload {
  to: string;
  subject: string;
  html: string;
  sender_id: string;
}

export interface SocDashboardStats {
  totalInterceptions: number;
  totalBlocked: number;
  activeTrapsCount: number;
  last24hInterceptions: number;
  topAttackerCountry: string;
  topAttackerAsn: string;
}
