import { Router } from 'express';
import { prisma } from '../db/client.js';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { adherenceQuerySchema, refillForecastQuerySchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);

// ── GET /api/analytics/adherence ─────────────────────────────────────────────
router.get('/adherence', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { dependentId, days } = adherenceQuerySchema.parse(req.query);

    const dependentWhere = dependentId
      ? { id: dependentId, userId: req.auth!.userId }
      : { userId: req.auth!.userId };

    const dependents = await prisma.dependent.findMany({
      where: dependentWhere,
      select: { id: true, name: true },
    });

    const dependentIds = dependents.map((d) => d.id);

    const now = new Date();
    const fromDate = new Date(now);
    fromDate.setDate(now.getDate() - (days - 1));
    fromDate.setHours(0, 0, 0, 0);

    const doses = await prisma.dose.findMany({
      where: {
        medication: { dependentId: { in: dependentIds } },
        scheduledDate: { gte: fromDate, lte: now },
      },
      select: {
        scheduledDate: true,
        status: true,
        medication: { select: { dependentId: true } },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    const dailyMap = new Map<
      string,
      { date: string; total: number; taken: number; skipped: number; pending: number }
    >();

    for (let i = 0; i < days; i++) {
      const d = new Date(fromDate);
      d.setDate(fromDate.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, { date: key, total: 0, taken: 0, skipped: 0, pending: 0 });
    }

    for (const dose of doses) {
      const key = dose.scheduledDate.toISOString().split('T')[0];
      const entry = dailyMap.get(key);
      if (!entry) continue;
      entry.total++;
      if (dose.status === 'taken') entry.taken++;
      else if (dose.status === 'skipped') entry.skipped++;
      else entry.pending++;
    }

    const daily = Array.from(dailyMap.values());

    const totalScheduled = daily.reduce((s, d) => s + d.total, 0);
    const totalTaken = daily.reduce((s, d) => s + d.taken, 0);
    const overallRate = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 0;

    let currentStreak = 0;
    const todayKey = now.toISOString().split('T')[0];
    const sortedDays = [...daily].reverse();
    for (const day of sortedDays) {
      if (day.date > todayKey) continue;
      if (day.total === 0) break;
      if (day.taken === day.total) {
        currentStreak++;
      } else {
        break;
      }
    }

    const dependentBreakdown = dependents.map((dep) => {
      const depDoses = doses.filter((d) => d.medication.dependentId === dep.id);
      const depTotal = depDoses.length;
      const depTaken = depDoses.filter((d) => d.status === 'taken').length;
      return {
        dependentId: dep.id,
        name: dep.name,
        total: depTotal,
        taken: depTaken,
        adherenceRate: depTotal > 0 ? Math.round((depTaken / depTotal) * 100) : 0,
      };
    });

    res.json({
      period: { from: fromDate.toISOString().split('T')[0], to: todayKey, days },
      overallAdherenceRate: overallRate,
      currentStreak,
      totalScheduled,
      totalTaken,
      daily,
      dependentBreakdown,
    });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/analytics/refill-forecast ──────────────────────────────────────
router.get('/refill-forecast', async (req: AuthenticatedRequest, res, next) => {
  try {
    const { dependentId } = refillForecastQuerySchema.parse(req.query);

    const dependentWhere = dependentId
      ? { id: dependentId, userId: req.auth!.userId }
      : { userId: req.auth!.userId };

    const dependents = await prisma.dependent.findMany({
      where: dependentWhere,
      select: { id: true },
    });

    const dependentIds = dependents.map((d) => d.id);

    const medications = await prisma.medication.findMany({
      where: { dependentId: { in: dependentIds } },
      select: {
        id: true,
        name: true,
        genericName: true,
        pillsRemaining: true,
        totalPills: true,
        daysSupplyLeft: true,
        refillsRemaining: true,
        isLowSupply: true,
        dependent: { select: { id: true, name: true } },
      },
    });

    const now = new Date();
    const LOW_SUPPLY_THRESHOLD_DAYS = 14;

    const forecasts = medications.map((med) => {
      const runOutDate = new Date(now);
      runOutDate.setDate(now.getDate() + med.daysSupplyLeft);

      const daysUntilRunOut = med.daysSupplyLeft;
      const needsRefillSoon = daysUntilRunOut <= LOW_SUPPLY_THRESHOLD_DAYS;

      const refillByDate = new Date(runOutDate);
      refillByDate.setDate(runOutDate.getDate() - 7);

      const supplyPct =
        med.totalPills > 0 ? Math.round((med.pillsRemaining / med.totalPills) * 100) : 0;

      return {
        medicationId: med.id,
        medicationName: med.name,
        genericName: med.genericName,
        dependentId: med.dependent.id,
        dependentName: med.dependent.name,
        pillsRemaining: med.pillsRemaining,
        totalPills: med.totalPills,
        supplyPercentage: supplyPct,
        daysSupplyLeft: daysUntilRunOut,
        runOutDate: runOutDate.toISOString().split('T')[0],
        refillByDate: refillByDate.toISOString().split('T')[0],
        refillsRemaining: med.refillsRemaining,
        needsRefillSoon,
        isLowSupply: med.isLowSupply,
        urgency:
          daysUntilRunOut <= 3
            ? 'critical'
            : daysUntilRunOut <= 7
            ? 'high'
            : daysUntilRunOut <= 14
            ? 'medium'
            : 'low',
      };
    });

    forecasts.sort((a, b) => a.daysSupplyLeft - b.daysSupplyLeft);

    res.json({
      forecasts,
      urgentCount: forecasts.filter((f) => f.needsRefillSoon).length,
      criticalCount: forecasts.filter((f) => f.urgency === 'critical').length,
    });
  } catch (error) {
    next(error);
  }
});

export { router as analyticsRouter };
