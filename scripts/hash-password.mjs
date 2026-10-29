#!/usr/bin/env node
// ==============================================================================
// VyuhaPot Operator Passphrase Hash Generator (Node.js CLI)
// ==============================================================================

import crypto from 'node:crypto';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const passArg = process.argv[2];

if (passArg) {
  generateAndPrint(passArg);
  process.exit(0);
}

rl.question('Enter Passphrase to Hash for VyuhaPot ADMIN_PASSWORD_HASH: ', (answer) => {
  if (!answer) {
    console.error('Passphrase cannot be empty.');
    process.exit(1);
  }
  generateAndPrint(answer);
  rl.close();
});

function generateAndPrint(password) {
  const hash = crypto.createHash('sha256').update(password).digest('hex');
  console.log('\n======================================================');
  console.log('   VyuhaPot Operator Credential Hash Generated');
  console.log('======================================================');
  console.log(`Original Passphrase:  ${password}`);
  console.log(`SHA-256 Hash:         ${hash}`);
  console.log('\nTo set this in wrangler.toml or as a Cloudflare Secret:');
  console.log(`ADMIN_PASSWORD_HASH = "${hash}"`);
  console.log('Or via Cloudflare CLI:');
  console.log(`npx wrangler secret put ADMIN_PASSWORD_HASH`);
  console.log('======================================================\n');
}
