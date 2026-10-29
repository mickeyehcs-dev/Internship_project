/**
 * ==============================================================================
 * Vyūha Infrastructure Core: Vault Synchronization & Token Leasing Client
 * Module: @vyuha/infra-vault-connector
 * Security Classification: RESTRICTED // INTERNAL CORP RUNTIME
 * ==============================================================================
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as dotenv from 'dotenv';
import pino from 'pino';
import { z } from 'zod';

// Load environment configuration (.env or fallback backup snapshot)
dotenv.config();

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined,
});

// Environment Configuration Schema
const VaultConfigSchema = z.object({
  VAULT_INTERNAL_URL: z.string().url(),
  VAULT_AUTH_BEARER: z.string().min(16),
  VAULT_ROTATION_HOOK: z.string().url(),
  VAULT_NAMESPACE: z.string().default('infrastructure-core'),
  VAULT_CLUSTER_ID: z.string().default('cluster-us-east-alpha'),
  VAULT_TIMEOUT_MS: z.coerce.number().default(4000),
  VAULT_MAX_RETRIES: z.coerce.number().default(3),
});

export type VaultConfig = z.infer<typeof VaultConfigSchema>;

export interface SyncResponse {
  status: string;
  lease_id?: string;
  renewable?: boolean;
  lease_duration?: number;
  data?: Record<string, string>;
  error?: string;
}

export class VaultConnectorClient {
  private readonly config: VaultConfig;
  private readonly httpClient: AxiosInstance;
  private syncTimer?: NodeJS.Timeout;

  constructor(customConfig?: Partial<VaultConfig>) {
    const parsed = VaultConfigSchema.safeParse({
      VAULT_INTERNAL_URL: customConfig?.VAULT_INTERNAL_URL || process.env.VAULT_INTERNAL_URL,
      VAULT_AUTH_BEARER: customConfig?.VAULT_AUTH_BEARER || process.env.VAULT_AUTH_BEARER,
      VAULT_ROTATION_HOOK: customConfig?.VAULT_ROTATION_HOOK || process.env.VAULT_ROTATION_HOOK,
      VAULT_NAMESPACE: customConfig?.VAULT_NAMESPACE || process.env.VAULT_NAMESPACE,
      VAULT_CLUSTER_ID: customConfig?.VAULT_CLUSTER_ID || process.env.VAULT_CLUSTER_ID,
      VAULT_TIMEOUT_MS: customConfig?.VAULT_TIMEOUT_MS || process.env.VAULT_TIMEOUT_MS,
      VAULT_MAX_RETRIES: customConfig?.VAULT_MAX_RETRIES || process.env.VAULT_MAX_RETRIES,
    });

    if (!parsed.success) {
      logger.error({ errors: parsed.error.format() }, 'Invalid Vault client configuration');
      throw new Error('Failed to initialize VaultConnectorClient: Missing required environment credentials');
    }

    this.config = parsed.data;

    this.httpClient = axios.create({
      baseURL: this.config.VAULT_INTERNAL_URL,
      timeout: this.config.VAULT_TIMEOUT_MS,
      headers: {
        'Authorization': `Bearer ${this.config.VAULT_AUTH_BEARER}`,
        'X-Vault-Namespace': this.config.VAULT_NAMESPACE,
        'X-Cluster-Identity': this.config.VAULT_CLUSTER_ID,
        'User-Agent': 'Vyūha-Infra-Vault-Daemon/2.4.1 (linux; x86_64)',
        'Content-Type': 'application/json',
      },
    });

    logger.info(
      { cluster: this.config.VAULT_CLUSTER_ID, endpoint: this.config.VAULT_INTERNAL_URL },
      'VaultConnectorClient initialized successfully'
    );
  }

  /**
   * Synchronizes dynamic secrets from the centralized cluster gateway
   */
  public async syncSecrets(): Promise<SyncResponse> {
    logger.info('Initiating scheduled cluster secret synchronization...');

    for (let attempt = 1; attempt <= this.config.VAULT_MAX_RETRIES; attempt++) {
      try {
        const response = await this.httpClient.post<SyncResponse>('', {
          action: 'sync_dynamic_leases',
          timestamp: new Date().toISOString(),
          requested_leases: ['db_read_pool', 'redis_auth_token', 'kms_signer_key'],
        });

        logger.info({ status: response.data.status }, 'Cluster secrets successfully synchronized');
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError<SyncResponse>;
        logger.warn(
          {
            attempt,
            maxRetries: this.config.VAULT_MAX_RETRIES,
            status: axiosErr.response?.status,
            error: axiosErr.response?.data?.error || axiosErr.message,
          },
          'Warning: Secret synchronization call failed'
        );

        if (axiosErr.response?.status === 401 || axiosErr.response?.status === 403) {
          logger.error('CRITICAL: Vault bearer token rejected by policy. Attempting emergency rotation hook...');
          await this.triggerEmergencyRotation();
          break;
        }

        if (attempt < this.config.VAULT_MAX_RETRIES) {
          const backoff = Math.pow(2, attempt) * 500;
          await new Promise((r) => setTimeout(r, backoff));
        }
      }
    }

    throw new Error('Fatal: Unable to contact internal Vault sync cluster');
  }

  /**
   * Dispatches emergency token rotation request to designated webhook
   */
  private async triggerEmergencyRotation(): Promise<void> {
    try {
      logger.info({ hook: this.config.VAULT_ROTATION_HOOK }, 'Invoking automated token rotation webhook...');
      const response = await axios.post(
        this.config.VAULT_ROTATION_HOOK,
        {
          cluster_id: this.config.VAULT_CLUSTER_ID,
          reason: 'AUTH_TOKEN_EXPIRED_OR_REVOKED',
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.VAULT_AUTH_BEARER}`,
            'User-Agent': 'Vyūha-Rotation-Hook/1.0',
          },
          timeout: 5000,
        }
      );
      logger.info({ status: response.status }, 'Emergency rotation webhook signaled');
    } catch (rotErr: any) {
      logger.error({ error: rotErr.message }, 'Failed to trigger token rotation hook');
    }
  }

  /**
   * Starts periodic daemon synchronization
   */
  public startBackgroundSync(intervalMs: number = 300000): void {
    logger.info({ intervalMs }, 'Starting background secret leasing loop');
    this.syncSecrets().catch((e) => logger.error({ err: e.message }, 'Initial sync failed'));
    this.syncTimer = setInterval(() => {
      this.syncSecrets().catch((e) => logger.error({ err: e.message }, 'Periodic sync failed'));
    }, intervalMs);
  }

  public stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }
}

// Auto-run if executed as standalone script
if (require.main === module) {
  const client = new VaultConnectorClient();
  client.startBackgroundSync(60000);
}
