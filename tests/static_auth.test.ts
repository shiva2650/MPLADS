/**
 * Client-Side Static Demonstration Authentication Test Suite
 * Validates deterministic static demo authentication for GitHub Pages deployment.
 */

import { staticAuth, STATIC_DEMO_ACCOUNTS } from '../src/services/staticAuth.js';
import { authStorage, AuthService } from '../src/services/authService.js';
import { isStaticMode } from '../src/utils/environment.js';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function runStaticAuthTests() {
  console.log('================================================================');
  console.log('  STATIC DEMO AUTHENTICATION & GITHUB PAGES INTEGRITY SUITE');
  console.log('================================================================\n');

  // Test 1: Authorized Demo Accounts
  console.log('--- 1. Authorized Static Demonstration Accounts ---');

  const mpRes = await staticAuth.login('MP001', 'MP@123');
  assert(mpRes.user.userId === 'MP001', 'MP001 userId matches');
  assert(mpRes.user.role === 'MP', 'MP001 role is MP');
  assert(Boolean(mpRes.token), 'MP001 receives session token');
  console.log('✓ PASS | MP001 / MP@123 logs in with MP role');

  const adminRes = await staticAuth.login('ADMIN001', 'Admin@123');
  assert(adminRes.user.userId === 'ADMIN001', 'ADMIN001 userId matches');
  assert(adminRes.user.role === 'ADMIN', 'ADMIN001 role is ADMIN');
  console.log('✓ PASS | ADMIN001 / Admin@123 logs in with ADMIN role');

  const agencyRes = await staticAuth.login('AGENCY001', 'Agency@123');
  assert(agencyRes.user.userId === 'AGENCY001', 'AGENCY001 userId matches');
  assert(agencyRes.user.role === 'AGENCY', 'AGENCY001 role is AGENCY');
  console.log('✓ PASS | AGENCY001 / Agency@123 logs in with AGENCY role');

  // Test 2: User ID Normalization & Case Insensitivity
  console.log('\n--- 2. User ID Normalization & Whitespace Trimming ---');

  const lowerMp = await staticAuth.login('  mp001  ', 'MP@123');
  assert(lowerMp.user.userId === 'MP001', 'Lowercased & padded mp001 normalizes to MP001');
  console.log('✓ PASS | Lowercased & padded "  mp001  " normalizes and authenticates');

  const lowerAdmin = await staticAuth.login('admin001', 'Admin@123');
  assert(lowerAdmin.user.userId === 'ADMIN001', 'admin001 normalizes to ADMIN001');
  console.log('✓ PASS | Lowercased "admin001" normalizes and authenticates');

  // Test 3: Password Case Sensitivity & Rejection of Bad Credentials
  console.log('\n--- 3. Strict Password Verification & Bad Credential Rejections ---');

  let failedCount = 0;

  try {
    await staticAuth.login('MP001', 'wrongpassword');
  } catch (err: any) {
    assert(err.message === 'Invalid User ID or password.', 'Error message is generic and safe');
    failedCount++;
  }
  assert(failedCount === 1, 'Rejects wrong password');
  console.log('✓ PASS | Rejects wrong password with generic error message');

  try {
    await staticAuth.login('MP001', 'mp@123'); // lower-case password mismatch
  } catch (err: any) {
    assert(err.message === 'Invalid User ID or password.', 'Rejects case-mismatched password');
    failedCount++;
  }
  assert(failedCount === 2, 'Rejects lower-case password');
  console.log('✓ PASS | Enforces case-sensitive password verification');

  try {
    await staticAuth.login('UNKNOWN999', 'Admin@123');
  } catch (err: any) {
    assert(err.message === 'Invalid User ID or password.', 'Rejects unknown user ID');
    failedCount++;
  }
  assert(failedCount === 3, 'Rejects non-existent user');
  console.log('✓ PASS | Rejects non-existent user ID');

  try {
    await staticAuth.login('', '');
  } catch (err: any) {
    assert(err.message === 'Invalid User ID or password.', 'Rejects blank credentials');
    failedCount++;
  }
  assert(failedCount === 4, 'Rejects blank credentials');
  console.log('✓ PASS | Rejects blank credentials');

  // Test 4: Session Validation & Logout
  console.log('\n--- 4. Session State Management & Logout ---');

  await staticAuth.login('ADMIN001', 'Admin@123');
  const me = await staticAuth.getMe();
  assert(me.user.userId === 'ADMIN001', 'getMe retrieves current authenticated user');
  console.log('✓ PASS | getMe returns active session user profile');

  await staticAuth.logout();
  let sessionCleared = false;
  try {
    await staticAuth.getMe();
  } catch {
    sessionCleared = true;
  }
  assert(sessionCleared, 'Session token removed after logout');
  console.log('✓ PASS | logout terminates session and clears stored token');

  console.log('\n================================================================');
  console.log('✓ ALL STATIC DEMO AUTHENTICATION TESTS PASSED (100%)');
  console.log('================================================================');
}

runStaticAuthTests().catch(err => {
  console.error('Static Auth Test Failed:', err);
  process.exit(1);
});
