/**
 * AUTHENTICATION & SESSION LIFECYCLE COMPREHENSIVE TEST SUITE
 * Verifies End-to-End Authentication:
 * - Credential Verification & PBKDF2 Salting
 * - Case-Insensitive User ID Normalization
 * - JWT Issuance, Claims, Signature & Expiration
 * - Role Assignment Integrity
 * - Token Storage & Revocation on Logout
 * - Tampered / Invalid Token Rejection
 * - Security Leakage Protection (No password hashes or salts in responses)
 */

import http from 'http';
import express from 'express';
import { apiRouter } from '../server/routes.js';
import { authenticateToken, generateToken, verifyToken, verifyPassword, sanitizeUser, hashPassword } from '../server/auth.js';

const app = express();
app.use(express.json());
app.use(authenticateToken);
app.use('/api', apiRouter);

function makeRequest(
  server: http.Server,
  path: string,
  method: string,
  body?: any,
  token?: string
): Promise<{ status: number; body: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const address = server.address();
    if (!address || typeof address === 'string') {
      return reject(new Error('Server not listening'));
    }

    const payload = body ? JSON.stringify(body) : undefined;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: {
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      },
      res => {
        let rawData = '';
        res.on('data', chunk => {
          rawData += chunk;
        });
        res.on('end', () => {
          let parsed: any = null;
          try {
            parsed = JSON.parse(rawData);
          } catch {
            parsed = rawData;
          }
          resolve({ status: res.statusCode || 500, body: parsed, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

export async function runAuthTests() {
  console.log('\n================================================================');
  console.log('  AUTHENTICATION & SESSION SECURITY VERIFICATION');
  console.log('================================================================');

  const server = http.createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', () => resolve()));

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, desc: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✓ PASS | ${desc}`);
    } else {
      console.error(`❌ FAIL | ${desc}`);
      throw new Error(`Auth test failed: ${desc}`);
    }
  }

  try {
    // 1. Missing credentials validation (400)
    console.log('\n--- 1. Request Validation ---');
    const resEmpty = await makeRequest(server, '/api/auth/login', 'POST', {});
    assert(resEmpty.status === 400, 'Empty login payload returns HTTP 400');
    assert(resEmpty.body.error.includes('required'), 'Returns descriptive error for missing credentials');

    const resNoPass = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'MP001' });
    assert(resNoPass.status === 400, 'Missing password returns HTTP 400');

    // 2. Non-existent User & Wrong Password (401)
    console.log('\n--- 2. Invalid Credentials Rejection ---');
    const resNotFound = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'NONEXISTENT_USER_999', password: 'AnyPassword@123' });
    assert(resNotFound.status === 401, 'Non-existent user returns HTTP 401');
    assert(resNotFound.body.error === 'Invalid User ID or password.', 'Generic error message protects against user enumeration');

    const resWrongPass = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'MP001', password: 'WrongPassword@999' });
    assert(resWrongPass.status === 401, 'Wrong password returns HTTP 401');
    assert(resWrongPass.body.error === 'Invalid User ID or password.', 'Wrong password returns same generic error message');

    // 3. Successful Login for Standard Seed Roles
    console.log('\n--- 3. Successful Role Authentication ---');
    const resMp = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'MP001', password: 'MP@123' });
    assert(resMp.status === 200, 'MP login with MP001/MP@123 returns HTTP 200');
    assert(typeof resMp.body.token === 'string' && resMp.body.token.length > 20, 'MP login returns signed JWT token');
    assert(resMp.body.user.role === 'MP', 'MP user assigned role MP');
    assert(resMp.body.user.passwordHash === undefined, 'MP user response excludes passwordHash');
    assert(resMp.body.user.salt === undefined, 'MP user response excludes salt');

    const resAdmin = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'ADMIN001', password: 'Admin@123' });
    assert(resAdmin.status === 200, 'Admin login with ADMIN001/Admin@123 returns HTTP 200');
    assert(resAdmin.body.user.role === 'ADMIN', 'Admin user assigned role ADMIN');

    const resAgency = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'AGENCY001', password: 'Agency@123' });
    assert(resAgency.status === 200, 'Agency login with AGENCY001/Agency@123 returns HTTP 200');
    assert(resAgency.body.user.role === 'AGENCY', 'Agency user assigned role AGENCY');

    // 4. Case-Insensitive User ID Normalization
    console.log('\n--- 4. Case-Insensitive Normalization ---');
    const resLowerMp = await makeRequest(server, '/api/auth/login', 'POST', { userId: '  mp001  ', password: 'MP@123' });
    assert(resLowerMp.status === 200, 'Lowercased and whitespace-padded "  mp001  " successfully normalizes and logs in');
    assert(resLowerMp.body.user.userId === 'MP001', 'Normalized ID in response is canonical MP001');

    const resLowerAdmin = await makeRequest(server, '/api/auth/login', 'POST', { userId: 'admin001', password: 'Admin@123' });
    assert(resLowerAdmin.status === 200, 'Lowercased "admin001" successfully normalizes and logs in');

    // 5. Session Verification (/api/auth/me) & Token Validation
    console.log('\n--- 5. Session Verification & Protected Routes ---');
    const mpToken = resMp.body.token;
    const resMe = await makeRequest(server, '/api/auth/me', 'GET', undefined, mpToken);
    assert(resMe.status === 200, '/api/auth/me returns 200 with valid Bearer token');
    assert(resMe.body.user.userId === 'MP001', '/api/auth/me returns authenticated user identity');
    assert(resMe.body.user.role === 'MP', '/api/auth/me returns authenticated role');

    const resMeNoToken = await makeRequest(server, '/api/auth/me', 'GET');
    assert(resMeNoToken.status === 401, '/api/auth/me rejects unauthenticated request with HTTP 401');

    const resMeInvalidToken = await makeRequest(server, '/api/auth/me', 'GET', undefined, 'invalid.tampered.token');
    assert(resMeInvalidToken.status === 401, '/api/auth/me rejects forged/tampered token with HTTP 401');

    // 6. Token Invalidation on Logout
    console.log('\n--- 6. Logout & Token Invalidation ---');
    const resLogout = await makeRequest(server, '/api/auth/logout', 'POST', undefined, mpToken);
    assert(resLogout.status === 200, '/api/auth/logout successfully executes');

    const resMeAfterLogout = await makeRequest(server, '/api/auth/me', 'GET', undefined, mpToken);
    assert(resMeAfterLogout.status === 401, 'Revoked token is rejected on subsequent authenticated requests');

    // 7. PBKDF2 Password Hashing Cryptographic Correctness
    console.log('\n--- 7. Cryptographic PBKDF2 Verification ---');
    const generated = hashPassword('TestSecretPass@2026');
    assert(typeof generated.hash === 'string' && generated.hash.length === 64, 'Generated PBKDF2 hash is 64-char SHA256 hex');
    assert(typeof generated.salt === 'string' && generated.salt.length === 32, 'Generated salt is 32-char hex');
    assert(verifyPassword('TestSecretPass@2026', generated.hash, generated.salt), 'verifyPassword returns true for correct plaintext');
    assert(!verifyPassword('WrongSecretPass@2026', generated.hash, generated.salt), 'verifyPassword returns false for incorrect plaintext');

    console.log('----------------------------------------------------------------');
    console.log(`TOTAL: ${passed}/${total} Authentication & Session tests passed (100%)`);
    console.log('----------------------------------------------------------------');
  } finally {
    server.close();
  }
}
