import { SignJWT, jwtVerify } from 'jose';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.ADMIN_PASSWORD || 'akonzi-admin-2026'
);

export const COOKIE_NAME = 'akonzi_admin_token';

const usersPath = path.join(process.cwd(), 'data', 'users.json');

// ===== User Management =====

export function getUsers() {
  try {
    if (fs.existsSync(usersPath)) {
      return JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
    }
  } catch {}
  return [];
}

export function getUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserByCredentials(email, password) {
  const user = getUserByEmail(email);
  if (!user || !user.active) return null;
  if (user.password !== password) return null;
  return user;
}

// Role permissions — what each role can do
export const ROLE_PERMISSIONS = {
  admin: ['orders', 'products', 'posts', 'settings', 'users'],
  manager: ['orders', 'products', 'posts'],
  staff: ['orders'],
};

export function hasPermission(role, resource) {
  return (ROLE_PERMISSIONS[role] || []).includes(resource);
}

// ===== Token =====

export async function createToken(user) {
  return await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// Legacy — kept so existing env var still works as fallback
export function checkPassword(password) {
  return password === (process.env.ADMIN_PASSWORD || 'akonzi-admin-2026');
}
