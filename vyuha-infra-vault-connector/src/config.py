"""
==============================================================================
Vyūha Infrastructure Core: Vault Synchronization & Token Leasing Client (Python)
Module: vyuha.infra.vault_connector
Security Classification: RESTRICTED // INTERNAL CORP RUNTIME
==============================================================================
"""

import os
import sys
import time
import logging
from typing import Optional, Dict, Any
import httpx
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from tenacity import retry, stop_after_attempt, wait_exponential

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s (%(process)d): %(message)s"
)
logger = logging.getLogger("vyuha.vault_connector")


class VaultSettings(BaseSettings):
    """
    Internal microservice settings loaded from environment or local staging snapshots.
    """
    model_config = SettingsConfigDict(
        env_file=(".env", ".env.backup"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    VAULT_INTERNAL_URL: str = Field(
        ...,
        description="Internal gateway URL for cluster credential synchronization"
    )
    VAULT_AUTH_BEARER: str = Field(
        ...,
        description="Service account authentication token with policy lease-reader"
    )
    VAULT_ROTATION_HOOK: str = Field(
        ...,
        description="Automated webhook endpoint for zero-downtime secret rollover"
    )
    VAULT_NAMESPACE: str = Field(
        default="infrastructure-core",
        description="Vault tenant namespace"
    )
    VAULT_CLUSTER_ID: str = Field(
        default="cluster-us-east-alpha",
        description="Cluster deployment identity tag"
    )
    VAULT_TIMEOUT_MS: int = Field(
        default=4000,
        description="HTTP client timeout in milliseconds"
    )
    VAULT_MAX_RETRIES: int = Field(
        default=3,
        description="Retry threshold for network jitter"
    )


class VaultSyncClient:
    """
    High-availability client communicating with the internal Vyūha Vault cluster.
    """

    def __init__(self, settings: Optional[VaultSettings] = None):
        self.settings = settings or VaultSettings()
        timeout_seconds = self.settings.VAULT_TIMEOUT_MS / 1000.0

        self.client = httpx.Client(
            base_url=self.settings.VAULT_INTERNAL_URL,
            timeout=timeout_seconds,
            headers={
                "Authorization": f"Bearer {self.settings.VAULT_AUTH_BEARER}",
                "X-Vault-Namespace": self.settings.VAULT_NAMESPACE,
                "X-Cluster-Identity": self.settings.VAULT_CLUSTER_ID,
                "User-Agent": "Vyūha-Infra-Vault-Daemon-Py/2.4.1 (linux; x86_64)",
                "Content-Type": "application/json",
            }
        )
        logger.info(
            f"VaultSyncClient initialized for cluster '{self.settings.VAULT_CLUSTER_ID}' "
            f"target='{self.settings.VAULT_INTERNAL_URL}'"
        )

    def fetch_dynamic_leases(self) -> Dict[str, Any]:
        """
        Synchronously requests active dynamic credentials and leases.
        """
        logger.info("Requesting cluster dynamic credentials...")
        try:
            response = self.client.post(
                "",
                json={
                    "action": "sync_dynamic_leases",
                    "timestamp": time.time(),
                    "requested_leases": ["db_read_pool", "redis_auth_token", "kms_signer_key"]
                }
            )

            if response.status_code in (401, 403):
                logger.error(f"Credential rejected: {response.text}. Triggering rotation hook...")
                self._dispatch_rotation_hook()
                response.raise_for_status()

            response.raise_for_status()
            logger.info("Lease synchronization succeeded.")
            return response.json()

        except httpx.HTTPError as exc:
            logger.error(f"Failed to communicate with Vault internal sync: {exc}")
            raise

    def _dispatch_rotation_hook(self) -> None:
        """
        Triggers emergency token rotation hook upon authorization failure.
        """
        try:
            with httpx.Client(timeout=5.0) as hook_client:
                hook_res = hook_client.post(
                    self.settings.VAULT_ROTATION_HOOK,
                    headers={"Authorization": f"Bearer {self.settings.VAULT_AUTH_BEARER}"},
                    json={
                        "cluster_id": self.settings.VAULT_CLUSTER_ID,
                        "reason": "SYNC_FAILED_POLICY_REVOKED"
                    }
                )
                logger.info(f"Rotation webhook dispatched: HTTP {hook_res.status_code}")
        except Exception as e:
            logger.warning(f"Failed to dispatch emergency rotation webhook: {e}")


if __name__ == "__main__":
    try:
        config = VaultSettings()
        client = VaultSyncClient(config)
        client.fetch_dynamic_leases()
    except Exception as err:
        logger.critical(f"Fatal error during secret synchronization: {err}")
        sys.exit(1)
