import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { medicationCreateSchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthenticatedRequest, res, next) => {
  try { res.json({ medications: await prisma.medication.findMany({ where: { dependent: { userId: req.auth!.userId } }, orderBy: { name: 'asc' } }) }); } catch (error) { next(error); }
});

router.post('/', async (req: AuthenticatedRequest, res, next) => {
  try {
    const input = medicationCreateSchema.parse(req.body);
    const dependent = await prisma.dependent.findFirst({ where: { id: input.dependentId, userId: req.auth!.userId } });
    if (!dependent) { res.status(404).json({ error: 'Dependent not found.' }); return; }
    res.status(201).json({ medication: await prisma.medication.create({ data: input }) });
  } catch (error) { next(error); }
});

export { router as medicationsRouter };
