# VyūhaPot: Enterprise Active Defense & Deception Security Platform
## Technical Architecture Whitepaper, Threat Analysis & Operations Runbook
**Document Identifier:** `SEC-ARCH-VYUHA-2025-V1`  
**Classification:** RESTRICTED // CYBERSECURITY ARCHITECTURE SPECIFICATION  
**Platform Target:** Cloudflare Workers (V8 Edge Compute) & Cloudflare D1 (Serverless SQLite)  
**Author:** Vyūha Threat Research & Active Defense Engineering Team  
**Date of Release:** Current Production Baseline  

---

## 1. Executive Summary & Threat Landscape

### 1.1 The Collapse of Perimeter-Only Defense
Modern software delivery pipelines, distributed microservices, and multi-cloud architectures have dissolved the traditional enterprise network perimeter. Organizations no longer operate within well-defined castle-and-moat boundaries. Instead, infrastructure security is governed by identity, cryptographic tokens, and API credentials distributed across hundreds of code repositories, continuous integration runners, and serverless compute nodes.

In this operational reality, credential leakage has become the primary initial access vector (MITRE ATT&CK T1078 - Valid Accounts). Autonomous scraper botnets continuously monitor public source code repositories (e.g., GitHub, GitLab), paste sites, and package registries. Advanced scraping frameworks such as **TruffleHog**, **Gitleaks**, and **Shhgit** monitor public commit streams via the GitHub Events Firehose, indexing and attempting unauthorized authentication against leaked secrets in **under 60 seconds** of code publication.

```
+--------------------------------------------------------------------------------------------------+
|                                    TRADITIONAL VS. ACTIVE DEFENSE                                |
+------------------------------------+-------------------------------------------------------------+
| Classical Signature IDS / SIEM     | VyūhaPot Active Deception                                   |
+------------------------------------+-------------------------------------------------------------+
| High false-positive rate (~85%)    | Absolute zero false-positive rate (P = 1.0)                  |
| Reactive: Detects after breach     | Pre-emptive: Traps attacker during reconnaissance           |
| Vulnerable to obfuscation & 0-days | Protocol-agnostic: Triggered by unauthorized credential use |
| High compute & query costs         | Edge-native: Sub-millisecond correlation via Cloudflare D1  |
| Alert fatigue drowns SOC analysts  | High-fidelity alert with 1-click Edge Ban capability        |
+------------------------------------+-------------------------------------------------------------+
```

### 1.2 The Asymmetric Reality of Adversarial Reconnaissance
Once an attacker or automated scraping bot captures what appears to be a corporate credential, they possess an inherent advantage: they can probe external endpoints anonymously through residential proxy networks, VPN tunnels, or bulletproof hosting providers. Perimeter defenses often fail to distinguish between legitimate developer traffic and an external adversary using valid tokens.

**VyūhaPot** re-engineers this asymmetric relationship. By deliberately seeding high-fidelity decoy credentials into code repositories, VyūhaPot transforms leaked secrets into active tripwires. The adversary incurs computing and operational costs attempting to exploit the bait, while simultaneously forfeiting their IP address, Autonomous System Number (ASN), tooling signatures, and geolocation to the enterprise Security Operations Center (SOC).

---

## 2. Vyūha Strategic Deception Philosophy

### 2.1 The Sanskrit Strategic Formation
The system derives its name from **Vyūha** (व्यूह), the classical Sanskrit military science of dynamic labyrinthine battle formations. In classical strategic treatises (including the *Mahābhārata* and *Arthaśāstra*), a *Vyūha* is not a static wall; it is an active, responsive labyrinth designed to absorb an advancing adversary, entice them into an apparently vulnerable corridor, sever their lines of communication, and neutralize them within a controlled kill zone.

VyūhaPot operationalizes this military doctrine within modern cloud architecture:

1. **The Enticement (Ketu):** High-fidelity decoy repository (`vyuha-infra-vault-connector`) containing realistic configuration artifacts (`.env.backup`).
2. **The Labyrinth (Chakravyūha):** The bait hostname (`vault.vyuha.me`) acts as a convincing microservice gateway that accepts the credential, delays execution through an asynchronous tarpit, and emits authentic enterprise error payloads.
3. **The Trap & Retaliation (Moksha):** The intruder's telemetry is captured at the edge, logged into Cloudflare D1, dispatched to the SOC duty pager via high-speed email, and permanently isolated across the global edge firewall.

```
                           THE VYŪHA STRATEGIC LABYRINTH
                           
        [ Adversary Scraper ]
                 |
                 v
   +---------------------------+
   | Phase 1: Enticement       |  Decoy Repository Artifacts (.env.backup)
   | (Ketu - The Lure)         |  Realistic Vault Token: vyuha_sec_9941a87e...
   +-------------+-------------+
                 |  Scrapes & Executes unauthorized API probe
                 v
   +---------------------------+
   | Phase 2: Labyrinth Trap   |  Target: vault.vyuha.me/api/v2/tokens/sync
   | (Chakravyūha - The Edge)  |  - Synchronous Ingress Forensics committed to D1
   |                           |  - Asynchronous Tarpit (2,500ms Connection Stall)
   |                           |  - Plausible Microservice Failure Emulation
   +-------------+-------------+
                 |
                 v
   +---------------------------+
   | Phase 3: Immediate Defense|  - Real-time Alert Email with 1-Click Ban Link
   | (Moksha - Isolation)      |  - Instant Edge Firewall Rule (HTTP 403 Drop)
   +---------------------------+
```

### 2.2 The Zero False-Positive Axiom
Traditional Intrusion Detection Systems (IDS) evaluate heuristic rules, regular expressions, and anomaly scores, inevitably yielding thousands of false positives daily. In contrast, cyber deception adheres to the **Zero False-Positive Axiom**:

$$\mathbb{P}(\text{Malicious Intent} \mid \text{Bait Interaction}) = 1.0$$

Because decoy credentials are never provisioned to legitimate engineers, integrated into production services, or documented in production registries, **any entity interacting with a VyūhaPot bait node is undeniably an unauthorized intruder or malicious automated scraper**. Every alert emitted by VyūhaPot represents an actionable, verified security incident.

---

## 3. System Architecture & End-to-End Data Flow

VyūhaPot runs entirely on Cloudflare's serverless edge infrastructure, utilizing **Cloudflare Workers** (V8 isolate execution across 300+ global data centers) and **Cloudflare D1** (serverless distributed SQLite database with read-replication).

### 3.1 Architectural Topology

```
+====================================================================================================================+
|                                              VYŪHAPOT SYSTEM ARCHITECTURE                                          |
+====================================================================================================================+

   PUBLIC REPOSITORIES / GITHUB / GITLAB
   +-------------------------------------------------------------+
   | Decoy Repo: vyuha-infra-vault-connector                     |
   | File: .env.backup                                           |
   | Target: https://vault.vyuha.me/api/v2/tokens/sync           |
   | Token:  vyuha_sec_9941a87e02bcf14890a2948e718b              |
   +------------------------------+------------------------------+
                                  |
                                  | 1. Scraped & Exploited by Attacker / Bot
                                  v
+====================================================================================================================+
| CLOUDFLARE EDGE WORKER INFRASTRUCTURE (Global Anycast Network)                                                      |
+====================================================================================================================+
|                                                                                                                    |
|   INCOMING REQUEST (cf-connecting-ip, cf-ipcountry, cf-ipcity, request.cf.asOrganization)                         |
|   |                                                                                                                |
|   v                                                                                                                |
|   +---------------------------------------+                                                                        |
|   | [1] EDGE FIREWALL LAYER               | <==== Queries D1 `blocked_ips` Table                                   |
|   | Check if clientIp is banned           |                                                                        |
|   +-------------------+-------------------+                                                                        |
|                       |                                                                                            |
|           +-----------+-----------+                                                                                |
|           |                       |                                                                                |
|       [IS BANNED]            [NOT BANNED]                                                                          |
|           |                       |                                                                                |
|           v                       v                                                                                |
|    HTTP 403 Forbidden     Domain Routing Evaluation                                                                |
|    (Edge Drop)            +-------+-------+                                                                        |
|                           |               |                                                                        |
|                           v               v                                                                        |
|            [vault.vyuha.me/*]           [pot.vyuha.me/*]                                                           |
|             DECEPTION ENGINE             SOC ADMIN CONSOLE & GATE                                                  |
|                   |                               |                                                                |
|   +---------------+---------------+       +-------+-------+                                                        |
|   | Synchronous Ingestion to D1:  |       | /login        | (Clean Dark-Mode Auth Gate)                            |
|   | - IP, City, Country, ASN      |       | /dashboard    | (Protected Real-Time Operations Interface)             |
|   | - Trap Name, Method, Path     |       | /admin/api/*  | (Block / Unblock / Clear APIs)                         |
|   | - Captured Headers JSON       |       | /admin/quick- | (HMAC-Signed 1-Click Ban Handler)                      |
|   +---------------+---------------+       +-------+-------+                                                        |
|                   |                                                                                                |
|   +---------------+---------------+                                                                                |
|   | Asynchronous Background Task: |                                                                                |
|   | ctx.waitUntil(dispatchEmail)  | ===> POST https://sender-api.mickey.qzz.io/api/v1/send                         |
|   +---------------+---------------+      Headers: X-API-Key: env.EMAIL_API_KEY                                     |
|                   |                      Body: { to, subject, html, sender_id }                                    |
|   +---------------+---------------+                                                                                |
|   | Asynchronous Tarpit:          |                                                                                |
|   | await sleep(2500ms)           |                                                                                |
|   +---------------+---------------+                                                                                |
|                   |                                                                                                |
|   +---------------+---------------+                                                                                |
|   | Plausible Decoy Response:     |                                                                                |
|   | HTTP 401 Unauthorized         |                                                                                |
|   | {"status":"error",            |                                                                                |
|   |  "code":"AUTH_TOKEN_EXPIRED"} |                                                                                |
|   +-------------------------------+                                                                                |
|                                                                                                                    |
+====================================================================================================================+
                                  |
                                  v
+====================================================================================================================+
| INCIDENT DISPATCH & REMEDIATION (Duty SOC Operator)                                                                |
+====================================================================================================================+
|                                                                                                                    |
|   [ Incoming Security Alert Email ]                                                                                |
|   - Attacker IP: 198.51.100.24                                                                                     |
|   - Geolocation: Frankfurt, Germany                                                                                |
|   - ASN: AS16509 (Amazon.com)                                                                                      |
|   - Tooling: TruffleHog/3.14 (linux; x86_64)                                                                       |
|   - Action: [🛡️ BLOCK ATTACKER IP AT EDGE NOW] (Signed HMAC URL)                                                   |
|                                                                                                                    |
|   Operator clicks link  ====>  Worker verifies signature  ====>  Inserts into D1 `blocked_ips`                     |
|                                                                                                                    |
|   Next Attacker Request  ====>  Firewall Layer drops request instantly with HTTP 403 Forbidden!                     |
+====================================================================================================================+
```

---

## 4. Forensics & Telemetry Schema Analysis

Persistence in VyūhaPot is governed by Cloudflare D1. The relational database schema is structured into three discrete operational models:

### 4.1 Ingress Telemetry: `attack_logs`

```sql
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Incident Response Utility Matrix
| Column | Data Source | Tactical Intelligence Value |
| :--- | :--- | :--- |
| `id` | SQLite Auto-increment | Unique incident reference sequence for legal and audit tracking. |
| `trap_name` | Environment binding | Identifies which decoy repository, microservice, or canary lured the attacker. |
| `ip` | `cf-connecting-ip` | True client ingress IP, stripped of proxy headers by Cloudflare edge terminates. |
| `country` | `cf-ipcountry` | ISO 3166-1 alpha-2 geolocation code; essential for geo-blocking policies. |
| `city` | `cf-ipcity` | Metro-level location intelligence aiding physical correlation. |
| `asn_org` | `request.cf.asOrganization` | Identifies the hosting ISP (e.g., DigitalOcean, AWS, OVH, Tor exit node, or consumer ISP). |
| `user_agent` | `request.headers` | Reveals automated scanner signatures (e.g., `TruffleHog/3.0`, `curl/7.88.1`, `Go-http-client`). |
| `method` | `request.method` | Verifies intent (e.g., `POST` token validation vs. `GET` discovery probe). |
| `path` | `request.url` | Pinpoints targeted microservice endpoints and path traversal attempts. |
| `headers_json`| Serialized Headers | Captures raw Authorization bearer tokens, custom trace IDs, and client proxies. |
| `created_at` | D1 Timestamp | High-resolution UTC timestamp used for correlating SIEM and firewall logs. |

### 4.2 Distributed Edge Firewall: `blocked_ips`

```sql
CREATE TABLE IF NOT EXISTS blocked_ips (
    ip TEXT PRIMARY KEY,
    reason TEXT NOT NULL DEFAULT 'Automated Honeypot Trap Trigger',
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
Every edge worker execution queries this table during Phase 1. By leveraging Cloudflare D1 read replication across edge PoPs, blacklisted IPs are neutralized with sub-millisecond overhead.

### 4.3 Operator Authentication: `admin_sessions`

```sql
CREATE TABLE IF NOT EXISTS admin_sessions (
    token_hash TEXT PRIMARY KEY,
    expires_at DATETIME NOT NULL
);
```
Sessions are stored using cryptographic SHA-256 hashes of high-entropy random tokens (32 bytes / 64 hex characters). Session cookies are transmitted exclusively with `HttpOnly; Secure; SameSite=Strict` attributes.

---

## 5. Operator Runbook & Deployment Guide

This section outlines the exact terminal commands, configuration steps, and Standard Operating Procedures (SOPs) required to deploy and operate VyūhaPot in production.

### 5.1 System Prerequisites
- Node.js runtime `>= 18.0.0` and npm `>= 9.0.0`
- Cloudflare account with a registered domain (`vyuha.me`)
- Cloudflare Workers and D1 database enabled
- Wrangler CLI installed globally: `npm install -g wrangler`

### 5.2 Step-by-Step Deployment Protocol

#### Step 1: Initialize Cloudflare D1 Database
Create the distributed SQLite database instance in your Cloudflare account:

```bash
# Authenticate Wrangler with your Cloudflare account
wrangler login

# Provision the D1 database
wrangler d1 create vyuhapot-telemetry
```

Wrangler will output the unique database ID. Update your `wrangler.toml` file with this ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vyuhapot-telemetry"
database_id = "YOUR_ACTUAL_D1_DATABASE_ID_HERE"
```

#### Step 2: Execute Schema Migration
Apply the relational database schema into the production Cloudflare D1 instance:

```bash
# Apply schema to remote Cloudflare D1
wrangler d1 execute vyuhapot-telemetry --file=./schema.sql

# (Optional) Apply schema to local development instance
wrangler d1 execute vyuhapot-telemetry --local --file=./schema.sql
```

#### Step 3: Generate Administrative Credentials
Generate a secure SHA-256 hash for your SOC operator passphrase:

```bash
# Run the included interactive credential hashing utility
node scripts/hash-password.mjs "YourSuperSecurePassphraseHere2025!"
```

Copy the generated 64-character hexadecimal hash.

#### Step 4: Configure Production Secrets
Inject sensitive environment secrets using Wrangler secret storage:

```bash
# Set Admin Passphrase Hash
wrangler secret put ADMIN_PASSWORD_HASH

# Set HMAC Session and Quick-Block Secret Key
wrangler secret put SESSION_SECRET

# Set SOC Incident Notification Recipient
wrangler secret put ALERT_EMAIL_TO

# Set Platform Email Gateway API Key
wrangler secret put EMAIL_API_KEY
```

#### Step 5: Deploy Worker to Global Edge
Compile TypeScript source code and deploy to Cloudflare's Anycast edge network:

```bash
# Dry-run validation
npm run build

# Deploy to Cloudflare Workers
wrangler deploy
```

#### Step 6: Configure DNS Routing
In your Cloudflare DNS dashboard for `vyuha.me`, ensure the following CNAME or Worker custom domains are active:
- `pot.vyuha.me` $\rightarrow$ Routes to `vyuhapot-core` Worker (SOC Console)
- `vault.vyuha.me` $\rightarrow$ Routes to `vyuhapot-core` Worker (Honeypot Bait Subdomain)

---

## 6. Standard Operating Procedure (SOP): Incident Handling

```
+=============================================================================+
|                       VYŪHAPOT INCIDENT HANDLING SOP                        |
+=============================================================================+

  [ ALERT RECEIPT ]
  Operator receives email: "🚨 [VyūhaPot Security Alert] Intrusion Detected..."
         |
         v
  [ PHASE 1: IMMEDIATE THREAT NEUTRALIZATION (< 30 Seconds) ]
  - Review attacker IP and geolocation in email summary.
  - Click the primary action button: [🛡️ BLOCK ATTACKER IP AT CLOUDFLARE EDGE].
  - The signed HMAC link instantly injects the IP into D1 `blocked_ips`.
  - All subsequent traffic from this entity is terminated with HTTP 403.
         |
         v
  [ PHASE 2: TELEMETRY TRIAGE & CORRELATION (< 5 Minutes) ]
  - Navigate to https://pot.vyuha.me/login and authenticate.
  - In the SOC Dashboard, filter the Ingress Attack Telemetry table by Attacker IP.
  - Click "Headers" to inspect raw client request headers.
  - Determine if the probe originated from an automated cloud crawler or a human actor.
         |
         v
  [ PHASE 3: ADVERSARY ATTRIBUTION & INTEL ENRICHMENT ]
  - Verify ASN ownership (e.g., AS16509 AWS, AS14061 DigitalOcean).
  - Submit attacker IP to AbuseIPDB / VirusTotal / GreyNoise for threat profiling.
  - If a corporate subnet or VPN is identified, escalate to CIRT for breach inquiry.
         |
         v
  [ PHASE 4: EVIDENCE EXPORT & CLOSURE ]
  - Click "Export JSON" to preserve forensically sound telemetry.
  - Document the incident ticket referencing the unique D1 log sequence ID.
+=============================================================================+
```

---

## 7. Live Evaluator Demonstration & Proof-of-Concept Script

To validate the end-to-end functionality of VyūhaPot, follow this reproducible demonstration scenario simulating an external threat actor.

### Scenario Narrative
An external bot scans GitHub, discovers the decoy repository `vyuha-infra-vault-connector`, extracts `.env.backup`, and attempts to authenticate against `vault.vyuha.me`.

### Step 1: Reconnaissance (Extracting Leaked Credentials)
The attacker reads `.env.backup` in the decoy repository:
```bash
cat vyuha-infra-vault-connector/.env.backup | grep VAULT
```
**Observed Artifact:**
```env
VAULT_INTERNAL_URL=https://vault.vyuha.me/api/v2/tokens/sync
VAULT_AUTH_BEARER=vyuha_sec_9941a87e02bcf14890a2948e718b
VAULT_ROTATION_HOOK=https://vault.vyuha.me/v1/auth/rotate
```

### Step 2: Exploitation Probe via `curl`
The attacker fires an unauthorized authentication request against the honeypot:

```bash
curl -i -X POST "https://vault.vyuha.me/api/v2/tokens/sync" \
  -H "Authorization: Bearer vyuha_sec_9941a87e02bcf14890a2948e718b" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (TruffleHog-Automated-Scanner/3.14)" \
  -d '{"action":"sync_dynamic_leases"}'
```

### Step 3: Observation of Tarpit & Microservice Emulation
1. **Connection Stall:** The command hangs for approximately **2,500 milliseconds** due to the edge tarpit delay.
2. **Plausible Error Payload:** The honeypot returns an authentic enterprise error response:
```http
HTTP/2 401 Unauthorized
content-type: application/json; charset=utf-8
www-authenticate: Bearer realm="internal-vault-cluster", error="invalid_token", error_description="The token expired or was revoked"
x-vault-cluster: prod-us-east-v2
x-vault-revocation-id: rev_a81f9b2d

{
  "status": "error",
  "code": "AUTH_TOKEN_EXPIRED",
  "realm": "internal-vault-cluster",
  "message": "Key revoked by policy"
}
```

### Step 4: Verification of Automated Security Alert Email
Within seconds of the probe, the platform email gateway delivers a responsive security alert to `security-ops@vyuha.me`:
- **Subject:** `🚨 [VyūhaPot Security Alert] Intrusion Detected on Bait Node`
- **Body Content:**
  - Tripwire Trap: `vault-connector-edge`
  - Attacker IP: *(Your public egress IP)*
  - Geolocation: *(Your city & country)*
  - User-Agent: `Mozilla/5.0 (TruffleHog-Automated-Scanner/3.14)`
  - Direct 1-Click Action Button: `[🛡️ BLOCK ATTACKER IP AT CLOUDFLARE EDGE NOW]`

### Step 5: 1-Click Edge Neutralization
Click the `[🛡️ BLOCK ATTACKER IP AT CLOUDFLARE EDGE NOW]` button directly in the email.
- The browser opens `https://pot.vyuha.me/admin/quick-block?ip=...&sig=...`
- The system validates the HMAC-SHA256 signature against `SESSION_SECRET`.
- The IP is instantly committed to Cloudflare D1 `blocked_ips`.
- A confirmation screen confirms: **"Edge Isolation Enforced for IP ..."**

### Step 6: Verification of Edge Firewall Dropping
Repeat the original `curl` request:

```bash
curl -i -X POST "https://vault.vyuha.me/api/v2/tokens/sync" \
  -H "Authorization: Bearer vyuha_sec_9941a87e02bcf14890a2948e718b"
```

**Immediate Response (Sub-millisecond Edge Drop):**
```http
HTTP/2 403 Forbidden
content-type: application/json
x-vyuhapot-firewall: BLOCKED_AT_EDGE

{
  "status": "error",
  "code": "FIREWALL_EDGE_DROP",
  "error": "Forbidden",
  "message": "Access dropped by VyūhaPot active defense edge policy.",
  "incident_ref": "EDGE_BAN_...",
  "timestamp": "2025-10-29T13:42:01.120Z"
}
```

### Step 7: SOC Operations Dashboard Audit
1. Navigate to `https://pot.vyuha.me/login`.
2. Enter operator credentials (`vyuha_admin` / `VyuhaSentinel2025!`).
3. Observe real-time stats:
   - **Total Interceptions** updated (+1).
   - **Edge Blocked Entities** updated (+1).
   - Incident entry visible in the **Ingress Attack Telemetry** table.
   - Attacker IP displayed in the **Edge Blocklist Manager** with 1-click `[Unblock]` control.

---

## 8. Cryptographic & Operational Hardening Specification

### 8.1 Timing Attack Defense
Authentication passphrase comparison uses constant-time byte-level comparison (`timingSafeEqual`) to prevent side-channel timing analysis attacks:

$$\Delta t(C_{\text{match}}) \equiv \Delta t(C_{\text{mismatch}})$$

### 8.2 Cryptographic HMAC Quick-Block Verification
Quick-block URLs generated for email dispatches are signed using HMAC-SHA256 with an ephemeral expiration window:

$$\text{Payload} = \text{"block:"} \parallel \text{IP} \parallel \text{":"} \parallel T_{\text{exp}}$$

$$\text{Signature} = \text{HMAC}_{\text{SHA-256}}(\text{Payload}, K_{\text{session}})$$

Any tampering with the target IP or expiration timestamp invalidates the signature, preventing attackers from weaponizing the block endpoint against legitimate IP ranges.

### 8.3 Minimal Surface Area & Serverless Resilience
Because VyūhaPot executes entirely within ephemeral V8 isolates across Cloudflare's global edge:
- There is no operating system kernel to exploit.
- There are no container runtimes vulnerable to container escapes.
- Volumetric Distributed Denial of Service (DDoS) attacks are absorbed natively by Cloudflare's Anycast backbone.

---

## 9. Conclusion

VyūhaPot provides modern enterprise organizations with an active defense system capable of turning leaked code artifacts into high-value tactical intelligence. By operating directly at Cloudflare's serverless edge, the platform ensures sub-millisecond firewall enforcement, autonomous incident notification, and zero false-positive detection, shifting the economic and operational balance of power permanently in favor of the enterprise defender.
