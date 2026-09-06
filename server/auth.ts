import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
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

// Enterprise role alias mapping (SUPER_ADMIN -> ADMIN, PROJECT_MANAGER -> AGENCY, VIEWER -> PUBLIC)
export const ROLE_ALIASES: Record<string, UserRole> = {
  SUPER_ADMIN: 'ADMIN',
  ADMIN: 'ADMIN',
  ADMINISTRATOR: 'ADMIN',
  MP: 'MP',
  MEMBER: 'MP',
  AGENCY: 'AGENCY',
  PROJECT_MANAGER: 'AGENCY',
  IMPLEMENTING_AGENCY: 'AGENCY',
  VIEWER: 'PUBLIC',
  CITIZEN: 'PUBLIC',
  PUBLIC: 'PUBLIC'
};

export function normalizeRole(roleStr?: string): UserRole {
  if (!roleStr) return 'PUBLIC';
  const upper = roleStr.toUpperCase().replace(/\s+/g, '_');
  return ROLE_ALIASES[upper] || 'PUBLIC';
}

// Secure JWT configuration: Strong secret from environment, or cryptographically generated 256-bit entropy
const JWT_SECRET: string = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const TOKEN_EXPIRY = '8h';

// In-memory token revocation blocklist for logout & invalidation
const revokedTokens = new Set<string>();

export function generateToken(user: User): string {
  const safeRole = normalizeRole(user.role);
  const payload = {
    userId: user.userId,
    role: safeRole,
    name: user.name,
    district: user.district,
    constituency: user.constituency,
    agencyId: user.agencyId,
    jti: crypto.randomUUID()
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): User | null {
  if (!token || revokedTokens.has(token)) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.userId) {
      return null;
    }

    const foundUser = users.find(u => u.userId.toUpperCase() === decoded.userId.toUpperCase());
    if (foundUser) {
      return sanitizeUser(foundUser);
    }

    // Safely reconstruct sanitized user from cryptographically verified claims
    return {
      id: `user_${decoded.userId.toLowerCase()}`,
      userId: decoded.userId,
      name: decoded.name || decoded.userId,
      role: normalizeRole(decoded.role),
      designation: decoded.role === 'ADMIN' ? 'District Authority' : decoded.role === 'MP' ? 'Member of Parliament' : 'Implementing Officer',
      district: decoded.district,
      constituency: decoded.constituency,
      agencyId: decoded.agencyId
    };
  } catch (err) {
    // Token signature invalid, expired, or malformed
    return null;
  }
}

export function revokeToken(token: string) {
  if (token) {
    revokedTokens.add(token);
    // Auto-clean blocklist after 24h to prevent memory accumulation
    setTimeout(() => revokedTokens.delete(token), 24 * 60 * 60 * 1000);
  }
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
    req.user = undefined;
    return next();
  }

  req.user = user;
  next();
}

// Require authenticated user (any authorized non-public role)
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role === 'PUBLIC') {
    return res.status(401).json({ error: 'Authentication required to access this resource.' });
  }
  next();
}

// Role-based authorization middleware with alias support (SUPER_ADMIN, ADMIN, PROJECT_MANAGER, VIEWER)
export function requireRole(allowedRoles: (UserRole | string)[]) {
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication credentials required.' });
    }

    const userRole = normalizeRole(req.user.role);
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' lacks sufficient privileges. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

// Strip sensitive fields (passwords, tokens, PAN)
export function sanitizeUser(u: typeof users[0]): User {
  const { passwordHash, ...safeUser } = u;
  return safeUser;
}
