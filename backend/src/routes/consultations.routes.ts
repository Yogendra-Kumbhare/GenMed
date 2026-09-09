import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { consultationCreateSchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);

// ── GET /api/consultations ────────────────────────────────────────────────────
router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const consultations = await prisma.consultation.findMany({
      where: { userId: req.auth!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        question: true,
        answer: true,
        medicationContext: true,
        createdAt: true,
      },
    });
    res.json({ consultations });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/consultations ──────────────────────────────────────────────────
router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const input = consultationCreateSchema.parse(req.body);
    const consultation = await prisma.consultation.create({
      data: {
        userId: req.auth!.userId,
        question: input.question,
        answer: input.answer,
        medicationContext: input.medicationContext ?? [],
      },
      select: {
        id: true,
        question: true,
        answer: true,
        medicationContext: true,
        createdAt: true,
      },
    });
    res.status(201).json({ consultation });
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/consultations/:id ────────────────────────────────────────────
router.delete('/:id', async (req: AuthenticatedRequest, res, next) => {
  try {
    const existing = await prisma.consultation.findFirst({
      where: { id: req.params.id, userId: req.auth!.userId },
    });
    if (!existing) {
      res.status(404).json({ error: 'Consultation not found.' });
      return;
    }
    await prisma.consultation.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as consultationsRouter };
