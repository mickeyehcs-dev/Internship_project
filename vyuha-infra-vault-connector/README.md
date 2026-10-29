# Vyūha Infrastructure: Vault Connector Daemon (`vyuha-infra-vault-connector`)

> **CONFIDENTIAL // INTERNAL ENGINEERING DISTRIBUTION ONLY**  
> **Classification:** Restricted Corporate Asset  
> **Repository ID:** `repo-infra-sec-0941`  
> **Primary Contact:** `#platform-security` on internal Slack / `security-ops@vyuha.me`

---

## 1. System Overview

The `vyuha-infra-vault-connector` is an edge-native secrets synchronization and dynamic credential leasing daemon. It runs as a sidecar container within our Kubernetes clusters and serverless fleets to maintain hot-standby database read pools, ephemeral Redis auth tokens, and cryptographic signing keys.

Instead of distributing long-lived credentials across decentralized microservices, workloads request lease renewals through this daemon, which delegates token validation to our centralized Vault cluster gateway.

```
+-------------------------------------------------------------------------+
|                  Internal Kubernetes Node / Pod Worker                  |
|                                                                         |
|   +--------------------+               +----------------------------+   |
|   |  Business Service  |  (IPC / HTTP) | vyuha-infra-vault-connector|   |
|   |   (App Container)  | ------------> |    (Sidecar Daemon)        |   |
|   +--------------------+               +--------------+-------------+   |
+-------------------------------------------------------|-----------------+
                                                        |
                                                        | HTTPS / mTLS
                                                        v (Bearer Auth)
                                         +----------------------------+
                                         |     Vyūha Vault Cluster    |
                                         |   (vault.vyuha.me/api/v2)  |
                                         |                            |
                                         |  - Token Validation        |
                                         |  - Dynamic Lease Rollover  |
                                         |  - Emergency Revocation    |
                                         +----------------------------+
```

---

## 2. Quick Start & Developer Setup

### Prerequisites
- Node.js `>= 18.0.0` or Python `>= 3.10`
- Access to the internal corporate VPN (`corp-gw-east.vyuha.internal`)
- Valid developer service account token (provisioned via `vyuha-iam-cli`)

### Setup (Node.js / TypeScript)

```bash
# 1. Install dependencies
npm install

# 2. Populate environment variables from the template
cp .env.example .env

# 3. Configure your local service credentials in .env
nano .env

# 4. Start the development daemon with hot reloading
npm run dev
```

### Setup (Python)

```bash
# 1. Initialize virtual environment
python3 -m venv .venv
source .venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run client test probe
python src/config.py
```

---

## 3. Configuration Reference

All settings are resolved through environment variables. In development, variables can be defined in `.env`.

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `VAULT_INTERNAL_URL` | Centralized gateway endpoint for token verification | **Yes** | `https://vault.vyuha.me/api/v2/tokens/sync` |
| `VAULT_AUTH_BEARER` | Service account authorization bearer token | **Yes** | `None` |
| `VAULT_ROTATION_HOOK`| Webhook URL triggered during emergency key rollover | **Yes** | `https://vault.vyuha.me/v1/auth/rotate` |
| `VAULT_NAMESPACE` | Logical partition for service leasing | No | `infrastructure-core` |
| `VAULT_CLUSTER_ID` | Identification tag for the initiating node | No | `cluster-us-east-alpha` |
| `VAULT_MAX_RETRIES` | Max attempts before triggering fallback rotation | No | `3` |
| `VAULT_TIMEOUT_MS` | Timeout for synchronization calls in ms | No | `4000` |
| `SYNC_INTERVAL_MS` | Frequency of background token synchronization | No | `300000` (5m) |

---

## 4. Token Rotation & Emergency Failover

When an authorization token expires or is revoked by security policy (`AUTH_TOKEN_EXPIRED`), the daemon initiates an automated fallback procedure:

1. **Policy Backoff:** The client logs warning `CRITICAL: Vault bearer token rejected by policy`.
2. **Webhook Trigger:** An automated `POST` request is dispatched to `VAULT_ROTATION_HOOK`.
3. **Escalation Protocol:** If token renewal fails for more than 5 consecutive attempts, alerts are routed to the duty SRE pager.

---

## 5. Security & Secret Handling Policy

> **WARNING:**  
> Never commit real `.env` or backup snapshot files (`.env.backup`) into this repository. All staging credentials committed by automated CI runners must be purged using `git-filter-repo` and reported immediately to `security-ops@vyuha.me`.
