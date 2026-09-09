import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/client';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth';
import { loginSchema, registerSchema } from '../validators/schemas';

const router = Router();
const roleMap = { Patient: 'Patient', 'Family Caregiver': 'Family_Caregiver', 'Healthcare Proxy': 'Healthcare_Proxy' } as const;

function issueToken(user: { id: string; role: string }): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ sub: user.id, role: user.role }, secret, { expiresIn: '15m' });
}

router.post('/register', async (req, res, next) => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await prisma.user.create({
      data: { ...input, dob: input.dob ? new Date(input.dob) : undefined, passwordHash: await bcrypt.hash(input.password, 12), role: roleMap[input.role ?? 'Patient'] },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ user, accessToken: issueToken(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: input.email }, select: { id: true, name: true, email: true, role: true, passwordHash: true } });
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) { res.status(401).json({ error: 'Invalid email or password.' }); return; }
    const { passwordHash, ...safeUser } = user;
    res.json({ user: safeUser, accessToken: issueToken(user) });
  } catch (error) { next(error); }
});

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.auth!.userId }, select: { id: true, name: true, email: true, phone: true, dob: true, role: true, settings: true } });
    if (!user) { res.status(404).json({ error: 'User not found.' }); return; }
    res.json({ user });
  } catch (error) { next(error); }
});

export { router as authRouter };
