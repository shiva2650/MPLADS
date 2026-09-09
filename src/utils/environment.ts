/**
 * Environment & Runtime Execution Mode Detection
 * Determines whether the application operates in Static Demonstration Mode (e.g. GitHub Pages)
 * or connected to an Express/Node.js backend service.
 */

export function isStaticMode(): boolean {
  // 1. Explicit Vite build/runtime environment flag
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    if (
      import.meta.env.VITE_STATIC_MODE === 'true' ||
      import.meta.env.VITE_STATIC_MODE === true ||
      import.meta.env.VITE_APP_MODE === 'static'
    ) {
      return true;
    }
  }

  // 2. Client-side hostname / origin heuristics
  if (typeof window !== 'undefined' && window.location) {
    const hostname = (window.location.hostname || '').toLowerCase();
    if (
      hostname.endsWith('github.io') ||
      hostname.includes('githubpreview.dev') ||
      window.location.protocol === 'file:' ||
      (window as any).__FORCE_STATIC_MODE__ === true
    ) {
      return true;
    }
  }

  return false;
}
