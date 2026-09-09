/**
 * backend/prisma/seed.ts
 * Seeds the GenericMed database with realistic demo data.
 * Run with: npm run db:seed
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg(process.env.DATABASE_URL ?? '');
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log('🌱 Seeding GenericMed database…');

  // ── 1. Create demo user ────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Demo@123456', 12);

  const user = await prisma.user.upsert({
    where: { email: 'eleanor.vance@example.com' },
    update: {},
    create: {
      name: 'Eleanor Vance',
      email: 'eleanor.vance@example.com',
      passwordHash,
      phone: '(512) 555-0112',
      dob: new Date('1984-03-14'),
      role: 'Family_Caregiver',
      settings: {
        autoRefill: true,
        bulkSupplyDefault: true,
        genericSubstitution: true,
        childCaps: true,
        smsDoseReminders: true,
        caregiverEscalation: true,
        deliverySms: true,
        emailStatements: true,
        twoFactorAuth: false,
      },
    },
  });
  console.log(`✅ User: ${user.name} (${user.email})`);

  // ── 2. Create dependents ───────────────────────────────────────────────────
  const self = await prisma.dependent.upsert({
    where: { id: 'dep-self' },
    update: {},
    create: {
      id: 'dep-self',
      userId: user.id,
      name: 'Eleanor Vance',
      relationship: 'Self',
      dob: new Date('1984-03-14'),
      hipaaAuthorized: true,
      notes: 'Penicillin allergy noted. Prefers evening delivery.',
    },
  });

  const arthur = await prisma.dependent.upsert({
    where: { id: 'dep-arthur' },
    update: {},
    create: {
      id: 'dep-arthur',
      userId: user.id,
      name: 'Arthur Vance',
      relationship: 'Father',
      dob: new Date('1948-11-22'),
      hipaaAuthorized: true,
      notes: 'Hypertension & Type 2 Diabetes. Morning medication routine.',
    },
  });

  console.log(`✅ Dependents: ${self.name}, ${arthur.name}`);

  // ── 3. Create medications ──────────────────────────────────────────────────
  const med1 = await prisma.medication.upsert({
    where: { id: 'med-atorvastatin' },
    update: {},
    create: {
      id: 'med-atorvastatin',
      dependentId: self.id,
      name: 'Atorvastatin 20mg',
      genericName: 'Atorvastatin Calcium',
      strength: '20mg',
      dosageInstructions: 'Take 1 tablet daily at bedtime',
      frequency: 'Once daily',
      pillsRemaining: 45,
      totalPills: 90,
      daysSupplyLeft: 45,
      refillsRemaining: 3,
      isLowSupply: false,
    },
  });

  const med2 = await prisma.medication.upsert({
    where: { id: 'med-lisinopril' },
    update: {},
    create: {
      id: 'med-lisinopril',
      dependentId: self.id,
      name: 'Lisinopril 10mg',
      genericName: 'Lisinopril',
      strength: '10mg',
      dosageInstructions: 'Take 1 tablet every morning',
      frequency: 'Once daily',
      pillsRemaining: 7,
      totalPills: 30,
      daysSupplyLeft: 7,
      refillsRemaining: 2,
      isLowSupply: true,
    },
  });

  const med3 = await prisma.medication.upsert({
    where: { id: 'med-metformin' },
    update: {},
    create: {
      id: 'med-metformin',
      dependentId: arthur.id,
      name: 'Metformin 500mg',
      genericName: 'Metformin HCL',
      strength: '500mg',
      dosageInstructions: 'Take 1 tablet twice daily with meals',
      frequency: 'Twice daily',
      pillsRemaining: 30,
      totalPills: 60,
      daysSupplyLeft: 15,
      refillsRemaining: 5,
      isLowSupply: false,
    },
  });

  console.log(`✅ Medications: ${med1.name}, ${med2.name}, ${med3.name}`);

  // ── 4. Create today's doses ────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dose.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'dose-1',
        medicationId: med1.id,
        scheduledDate: today,
        timeSlot: 'Bedtime',
        time: '10:00 PM',
        status: 'pending',
      },
      {
        id: 'dose-2',
        medicationId: med2.id,
        scheduledDate: today,
        timeSlot: 'Morning',
        time: '8:00 AM',
        status: 'taken',
        takenAt: new Date(),
      },
      {
        id: 'dose-3',
        medicationId: med3.id,
        scheduledDate: today,
        timeSlot: 'Morning',
        time: '8:00 AM',
        status: 'taken',
        takenAt: new Date(),
      },
      {
        id: 'dose-4',
        medicationId: med3.id,
        scheduledDate: today,
        timeSlot: 'Evening',
        time: '8:00 PM',
        status: 'pending',
      },
    ],
  });
  console.log("✅ Today's doses seeded");

  // ── 5. Seed 30 days of historical dose data for adherence analytics ────────
  const historical: Array<{
    medicationId: string;
    scheduledDate: Date;
    timeSlot: string;
    time: string;
    status: 'taken' | 'skipped' | 'pending';
    takenAt: Date | undefined;
  }> = [];

  for (let i = 1; i <= 29; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const taken = Math.random() > 0.1; // 90% adherence

    historical.push({
      medicationId: med1.id,
      scheduledDate: date,
      timeSlot: 'Bedtime',
      time: '10:00 PM',
      status: taken ? 'taken' : 'skipped',
      takenAt: taken ? new Date(date.getTime() + 22 * 3600000) : undefined,
    });

    historical.push({
      medicationId: med2.id,
      scheduledDate: date,
      timeSlot: 'Morning',
      time: '8:00 AM',
      status: taken ? 'taken' : 'skipped',
      takenAt: taken ? new Date(date.getTime() + 8 * 3600000) : undefined,
    });
  }

  await prisma.dose.createMany({ skipDuplicates: true, data: historical });
  console.log('✅ 30-day adherence history seeded');

  // ── 6. Seed a sample consultation ─────────────────────────────────────────
  await prisma.consultation.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'consult-1',
        userId: user.id,
        question: 'Can I take Atorvastatin and Lisinopril together?',
        answer: 'Yes, Atorvastatin (a statin) and Lisinopril (an ACE inhibitor) are commonly prescribed together and are generally safe to combine. No significant drug-drug interaction exists between them. Continue taking as prescribed and report any unusual muscle pain or kidney-related symptoms to your physician.',
        medicationContext: ['Atorvastatin 20mg', 'Lisinopril 10mg'],
      },
    ],
  });
  console.log('✅ Sample consultation seeded');

  console.log('\n🎉 Seed complete!');
  console.log('📧 Demo login: eleanor.vance@example.com');
  console.log('🔑 Demo password: Demo@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
