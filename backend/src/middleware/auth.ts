import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export type UserRoleValue = 'Patient' | 'Family_Caregiver' | 'Healthcare_Proxy';

export interface AuthenticatedRequest extends Request {
  auth?: { userId: string; role: UserRoleValue };
}

function secret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error('JWT_SECRET is not configured');
  return value;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const token = req.header('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) { res.status(401).json({ error: 'Authentication is required.' }); return; }
  try {
    const payload = jwt.verify(token, secret()) as { sub: string; role: UserRoleValue };
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    res.status(401).json({ error: 'Your session is invalid or has expired.' });
  }
}
