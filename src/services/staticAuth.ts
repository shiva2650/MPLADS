import { User, UserRole } from '../types/index.js';
import { authStorage, LoginResponse } from './authService.js';
import { clientMockDb } from './clientMockDb.js';

export interface StaticDemoAccount {
  userId: string;
  name: string;
  role: UserRole;
  designation: string;
  constituency?: string;
  district?: string;
  agencyId?: string;
  agencyName?: string;
  email: string;
  phone?: string;
  demoPassword: string; // Isolated strictly to client-side static demonstration builds
}

/**
 * =========================================================================================
 * AUTHORIZED DEMONSTRATION ACCOUNTS
 * Strictly designated for client-side static presentation & testing on GitHub Pages.
 * Real production deployments utilize the cryptographic PBKDF2 backend service.
 * =========================================================================================
 */
export const STATIC_DEMO_ACCOUNTS: StaticDemoAccount[] = [
  {
    userId: 'ADMIN001',
    name: 'Dr. Ananya Sharma, IAS',
    role: 'ADMIN',
    designation: 'District Magistrate & District Authority',
    district: 'Hyderabad',
    email: 'dm.hyderabad@telangana.gov.in',
    phone: '+91 94400 54321',
    demoPassword: 'Admin@123'
  },
  {
    userId: 'MP001',
    name: 'Shri Rajesh Kumar',
    role: 'MP',
    designation: 'Member of Parliament (Lok Sabha)',
    constituency: 'Hyderabad North',
    district: 'Hyderabad',
    email: 'rajesh.kumar.mp@sansad.nic.in',
    phone: '+91 98490 12345',
    demoPassword: 'MP@123'
  },
  {
    userId: 'AGENCY001',
    name: 'Telangana State Urban Development Authority (TSUDA)',
    role: 'AGENCY',
    designation: 'Executive Engineer (Civil Division-I)',
    agencyId: 'AGENCY001',
    agencyName: 'TSUDA - Hyderabad Zone',
    district: 'Hyderabad',
    email: 'ee1.tsuda@telangana.gov.in',
    phone: '+91 040 2345 6789',
    demoPassword: 'Agency@123'
  },
  {
    userId: 'SUPER001',
    name: 'MoSPI Central Vigilance Directorate',
    role: 'ADMIN',
    designation: 'Central Vigilance Director General',
    district: 'New Delhi',
    email: 'vigilance.dg@mospi.gov.in',
    phone: '+91 011 2338 1234',
    demoPassword: 'Admin@123'
  },
  {
    userId: 'MP002',
    name: 'Smt. Kavitha Rao',
    role: 'MP',
    designation: 'Member of Parliament (Lok Sabha)',
    constituency: 'Secunderabad',
    district: 'Hyderabad',
    email: 'kavitha.rao.mp@sansad.nic.in',
    phone: '+91 98490 67890',
    demoPassword: 'MP@123'
  },
  {
    userId: 'AGENCY002',
    name: 'Panchayat Raj Engineering Department (PRED)',
    role: 'AGENCY',
    designation: 'Superintending Engineer',
    agencyId: 'AGENCY002',
    agencyName: 'PRED Secunderabad',
    district: 'Hyderabad',
    email: 'se.pred@telangana.gov.in',
    phone: '+91 040 2345 9900',
    demoPassword: 'Agency@123'
  },
  {
    userId: 'PM001',
    name: 'Er. S. Venkat Reddy',
    role: 'AGENCY',
    designation: 'Project Manager & Executive Engineer',
    agencyId: 'AGENCY001',
    agencyName: 'TSUDA - Hyderabad Zone',
    district: 'Hyderabad',
    email: 'pm.tsuda@telangana.gov.in',
    phone: '+91 94400 11223',
    demoPassword: 'Agency@123'
  },
  {
    userId: 'VIEWER001',
    name: 'Citizen Transparency Auditor',
    role: 'PUBLIC',
    designation: 'Public Open Data Auditor',
    district: 'Hyderabad',
    email: 'transparency.auditor@citizen.org.in',
    phone: '+91 98480 99887',
    demoPassword: 'Viewer@123'
  }
];

export const staticAuth = {
  /**
   * Deterministic client-side demonstration login
   * Validates against isolated demo credentials and establishes a safe client session.
   */
  login: async (userId: string, password: string): Promise<LoginResponse> => {
    const rawId = (userId || '').trim().toUpperCase();
    const cleanPassword = (password || '').trim();

    if (!rawId || !cleanPassword) {
      throw new Error('Invalid User ID or password.');
    }

    const account = STATIC_DEMO_ACCOUNTS.find(acc => acc.userId.toUpperCase() === rawId);
    if (!account) {
      throw new Error('Invalid User ID or password.');
    }

    if (account.demoPassword !== cleanPassword) {
      throw new Error('Invalid User ID or password.');
    }

    const safeUser: User = {
      id: `user_${account.userId.toLowerCase()}`,
      userId: account.userId,
      name: account.name,
      role: account.role,
      designation: account.designation,
      constituency: account.constituency,
      district: account.district,
      email: account.email,
      phone: account.phone,
      agencyId: account.agencyId,
      agencyName: account.agencyName
    };

    const token = `mplads_static_demo_session_${account.userId.toLowerCase()}_${Date.now()}`;

    authStorage.setToken(token);
    authStorage.setUser(safeUser);

    clientMockDb.addAuditLog({
      userId: safeUser.userId,
      userName: safeUser.name,
      userRole: safeUser.role,
      action: 'USER_LOGIN',
      targetEntity: 'Auth',
      targetId: safeUser.userId,
      ipAddressMasked: '10.14.02.***'
    });

    return {
      token,
      user: safeUser,
      message: `Welcome, ${safeUser.name}`
    };
  },

  /**
   * Retrieve currently authenticated static demo session
   */
  getMe: async (): Promise<{ user: User }> => {
    const token = authStorage.getToken();
    const user = authStorage.getUser();

    if (!token || !user || !user.role) {
      authStorage.removeToken();
      throw new Error('No active authentication token found');
    }

    return { user };
  },

  /**
   * Terminate static demo session
   */
  logout: async (): Promise<void> => {
    const user = authStorage.getUser();
    if (user) {
      clientMockDb.addAuditLog({
        userId: user.userId,
        userName: user.name,
        userRole: user.role,
        action: 'USER_LOGOUT',
        targetEntity: 'Auth',
        targetId: user.userId,
        ipAddressMasked: '10.14.02.***'
      });
    }
    authStorage.removeToken();
  }
};
