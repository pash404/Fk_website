import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fk-web-secret-key-change-in-production';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export async function getAuthUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status !== 'active') return null;
    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export function requireRole(...roles) {
  return async (request) => {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded) return null;
    if (roles.length > 0 && !roles.includes(decoded.role)) return null;
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status !== 'active') return null;
    return sanitizeUser(user);
  };
}
