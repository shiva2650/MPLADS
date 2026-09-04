import { Request, Response, NextFunction } from 'express';
import { users } from './db.js';
import { User, UserRole } from '../src/types/index.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Token store (in-memory token session map for demo)
const tokenStore = new Map<string, { user: User; expiresAt: number }>();

export function generateToken(user: User): string {
  const token = `mplads_token_${user.role.toLowerCase()}_${user.userId}_${Date.now()}`;
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  tokenStore.set(token, { user, expiresAt });
  return token;
}

export function verifyToken(token: string): User | null {
  const session = tokenStore.get(token);
  if (session && Date.now() <= session.expiresAt) {
    return session.user;
  }
  // Recovery: if server restarted, reconstruct session from deterministic token format
  if (token && token.startsWith('mplads_token_')) {
    const parts = token.split('_');
    if (parts.length >= 4) {
      const uId = parts[3];
      const foundUser = users.find(u => u.userId.toUpperCase() === uId.toUpperCase());
      if (foundUser) {
        const safeUser = sanitizeUser(foundUser);
        tokenStore.set(token, { user: safeUser, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });
        return safeUser;
      }
    }
  }
  return null;
}

export function revokeToken(token: string) {
  tokenStore.delete(token);
}

// Authentication middleware
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    // Treat as public access
    req.user = undefined;
    return next();
  }

  const user = verifyToken(token);
  if (!user) {
    // Token is expired or invalid. Do NOT reject globally - set user to undefined.
    // Protected routes use requireAuth/requireRole which will respond with 401.
    req.user = undefined;
    return next();
  }

  req.user = user;
  next();
}

// Require authenticated user (any role)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required to access this resource.' });
  }
  next();
}

// Role-based authorization middleware
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Your role '${req.user.role}' is not authorized. Requires: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

// Strip sensitive fields
export function sanitizeUser(u: typeof users[0]): User {
  const { passwordHash, ...safeUser } = u;
  return safeUser;
}
