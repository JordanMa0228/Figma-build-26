import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@flowsense.app' },
    update: {},
    create: {
      email: 'demo@flowsense.app',
      name: 'Demo User',
      password: hashedPassword,
      timezone: 'UTC',
    },
  });

  console.log('✅ Created user:', user.email);

  // All 10 sessions from mockData
  const mockSessions = [
    {
      date: '2026-03-06',
      startTime: '21:00',
      endTime: '21:23',
      durationMin: 23,
      avgStr: 0.62,
      flowRatio: 0.68,
      taskLabel: 'Coding',
      flowIntervals: [
        { startMin: 0, endMin: 2, state: 'Neutral', avgSTR: 0.95 },
        { startMin: 2, endMin: 8, state: 'Focused', avgSTR: 0.75 },
        { startMin: 8, endMin: 19, state: 'Flow', avgSTR: 0.51 },
        { startMin: 19, endMin: 21, state: 'Focused', avgSTR: 0.72 },
        { startMin: 21, endMin: 23, state: 'Neutral', avgSTR: 0.98 },
      ],
      strTimeseries: [
        { t: 0, str: 1.02 }, { t: 1, str: 0.95 }, { t: 2, str: 0.88 },
        { t: 3, str: 0.80 }, { t: 4, str: 0.75 }, { t: 5, str: 0.72 },
        { t: 6, str: 0.70 }, { t: 7, str: 0.68 }, { t: 8, str: 0.60 },
        { t: 9, str: 0.55 }, { t: 10, str: 0.51 }, { t: 11, str: 0.49 },
        { t: 12, str: 0.48 }, { t: 13, str: 0.50 }, { t: 14, str: 0.52 },
        { t: 15, str: 0.53 }, { t: 16, str: 0.55 }, { t: 17, str: 0.58 },
        { t: 18, str: 0.62 }, { t: 19, str: 0.70 }, { t: 20, str: 0.75 },
        { t: 21, str: 0.90 }, { t: 22, str: 0.98 }, { t: 23, str: 1.02 },
      ],
      quality: { eye: 98, eeg: 91, hr: 100 },
      peakStr: 0.48,
      longestStreakMin: 11,
    },
    {
      date: '2026-03-05',
      startTime: '19:30',
      endTime: '20:15',
      durationMin: 45,
      avgStr: 0.65,
      flowRatio: 0.72,
      taskLabel: 'Poker',
      flowIntervals: [
        { startMin: 0, endMin: 3, state: 'Neutral', avgSTR: 0.92 },
        { startMin: 3, endMin: 10, state: 'Focused', avgSTR: 0.72 },
        { startMin: 10, endMin: 28, state: 'Flow', avgSTR: 0.50 },
        { startMin: 28, endMin: 32, state: 'Focused', avgSTR: 0.68 },
        { startMin: 32, endMin: 40, state: 'Flow', avgSTR: 0.52 },
        { startMin: 40, endMin: 45, state: 'Neutral', avgSTR: 0.90 },
      ],
      strTimeseries: [
        { t: 0, str: 1.00 }, { t: 3, str: 0.90 }, { t: 6, str: 0.78 },
        { t: 9, str: 0.68 }, { t: 12, str: 0.58 }, { t: 15, str: 0.50 },
        { t: 18, str: 0.48 }, { t: 21, str: 0.47 }, { t: 24, str: 0.49 },
        { t: 27, str: 0.52 }, { t: 30, str: 0.65 }, { t: 33, str: 0.55 },
        { t: 36, str: 0.50 }, { t: 39, str: 0.52 }, { t: 42, str: 0.82 },
        { t: 45, str: 0.95 },
      ],
      quality: { eye: 95, eeg: 88, hr: 99 },
      peakStr: 0.45,
      longestStreakMin: 18,
    },
    {
      date: '2026-03-05',
      startTime: '10:00',
      endTime: '11:30',
      durationMin: 90,
      avgStr: 1.22,
      flowRatio: 0.15,
      taskLabel: 'Class',
      flowIntervals: [
        { startMin: 0, endMin: 10, state: 'Neutral', avgSTR: 1.10 },
        { startMin: 10, endMin: 20, state: 'Focused', avgSTR: 0.95 },
        { startMin: 20, endMin: 27, state: 'Flow', avgSTR: 0.85 },
        { startMin: 27, endMin: 50, state: 'Distracted', avgSTR: 1.35 },
        { startMin: 50, endMin: 65, state: 'Neutral', avgSTR: 1.20 },
        { startMin: 65, endMin: 75, state: 'Distracted', avgSTR: 1.45 },
        { startMin: 75, endMin: 90, state: 'Neutral', avgSTR: 1.15 },
      ],
      strTimeseries: [
        { t: 0, str: 1.05 }, { t: 10, str: 1.00 }, { t: 20, str: 0.90 },
        { t: 30, str: 1.20 }, { t: 40, str: 1.35 }, { t: 50, str: 1.25 },
        { t: 60, str: 1.18 }, { t: 70, str: 1.45 }, { t: 80, str: 1.30 },
        { t: 90, str: 1.15 },
      ],
      quality: { eye: 92, eeg: 85, hr: 97 },
      peakStr: 1.48,
      longestStreakMin: 7,
    },
    {
      date: '2026-03-04',
      startTime: '22:00',
      endTime: '22:35',
      durationMin: 35,
      avgStr: 0.82,
      flowRatio: 0.48,
      taskLabel: 'Music',
      flowIntervals: [
        { startMin: 0, endMin: 4, state: 'Neutral', avgSTR: 0.98 },
        { startMin: 4, endMin: 10, state: 'Focused', avgSTR: 0.85 },
        { startMin: 10, endMin: 22, state: 'Flow', avgSTR: 0.65 },
        { startMin: 22, endMin: 28, state: 'Focused', avgSTR: 0.80 },
        { startMin: 28, endMin: 32, state: 'Distracted', avgSTR: 1.05 },
        { startMin: 32, endMin: 35, state: 'Neutral', avgSTR: 0.92 },
      ],
      strTimeseries: [
        { t: 0, str: 1.00 }, { t: 5, str: 0.90 }, { t: 10, str: 0.72 },
        { t: 15, str: 0.65 }, { t: 20, str: 0.63 }, { t: 25, str: 0.78 },
        { t: 30, str: 1.02 }, { t: 35, str: 0.90 },
      ],
      quality: { eye: 88, eeg: 93, hr: 100 },
      peakStr: 0.62,
      longestStreakMin: 12,
    },
    {
      date: '2026-03-04',
      startTime: '09:00',
      endTime: '09:40',
      durationMin: 40,
      avgStr: 1.18,
      flowRatio: 0.10,
      taskLabel: 'Email',
      flowIntervals: [
        { startMin: 0, endMin: 8, state: 'Neutral', avgSTR: 1.10 },
        { startMin: 8, endMin: 14, state: 'Focused', avgSTR: 0.98 },
        { startMin: 14, endMin: 18, state: 'Flow', avgSTR: 0.88 },
        { startMin: 18, endMin: 30, state: 'Distracted', avgSTR: 1.30 },
        { startMin: 30, endMin: 40, state: 'Neutral', avgSTR: 1.20 },
      ],
      strTimeseries: [
        { t: 0, str: 1.05 }, { t: 8, str: 1.00 }, { t: 16, str: 0.90 },
        { t: 24, str: 1.28 }, { t: 32, str: 1.40 }, { t: 40, str: 1.22 },
      ],
      quality: { eye: 90, eeg: 80, hr: 95 },
      peakStr: 1.42,
      longestStreakMin: 4,
    },
    {
      date: '2026-03-03',
      startTime: '20:00',
      endTime: '21:00',
      durationMin: 60,
      avgStr: 0.60,
      flowRatio: 0.75,
      taskLabel: 'Coding',
      flowIntervals: [
        { startMin: 0, endMin: 3, state: 'Neutral', avgSTR: 0.98 },
        { startMin: 3, endMin: 10, state: 'Focused', avgSTR: 0.75 },
        { startMin: 10, endMin: 35, state: 'Flow', avgSTR: 0.48 },
        { startMin: 35, endMin: 42, state: 'Focused', avgSTR: 0.70 },
        { startMin: 42, endMin: 55, state: 'Flow', avgSTR: 0.50 },
        { startMin: 55, endMin: 60, state: 'Neutral', avgSTR: 0.95 },
      ],
      strTimeseries: [
        { t: 0, str: 1.00 }, { t: 5, str: 0.88 }, { t: 10, str: 0.70 },
        { t: 15, str: 0.55 }, { t: 20, str: 0.50 }, { t: 25, str: 0.46 },
        { t: 30, str: 0.45 }, { t: 35, str: 0.68 }, { t: 40, str: 0.72 },
        { t: 45, str: 0.55 }, { t: 50, str: 0.50 }, { t: 55, str: 0.90 },
        { t: 60, str: 0.98 },
      ],
      quality: { eye: 99, eeg: 94, hr: 100 },
      peakStr: 0.44,
      longestStreakMin: 25,
    },
    {
      date: '2026-03-03',
      startTime: '14:00',
      endTime: '15:00',
      durationMin: 60,
      avgStr: 1.25,
      flowRatio: 0.12,
      taskLabel: 'Class',
      flowIntervals: [
        { startMin: 0, endMin: 10, state: 'Neutral', avgSTR: 1.15 },
        { startMin: 10, endMin: 20, state: 'Distracted', avgSTR: 1.40 },
        { startMin: 20, endMin: 30, state: 'Neutral', avgSTR: 1.22 },
        { startMin: 30, endMin: 37, state: 'Focused', avgSTR: 0.95 },
        { startMin: 37, endMin: 42, state: 'Flow', avgSTR: 0.82 },
        { startMin: 42, endMin: 60, state: 'Distracted', avgSTR: 1.48 },
      ],
      strTimeseries: [
        { t: 0, str: 1.10 }, { t: 10, str: 1.38 }, { t: 20, str: 1.22 },
        { t: 30, str: 0.98 }, { t: 40, str: 0.85 }, { t: 50, str: 1.45 },
        { t: 60, str: 1.50 },
      ],
      quality: { eye: 88, eeg: 82, hr: 96 },
      peakStr: 1.50,
      longestStreakMin: 5,
    },
    {
      date: '2026-03-02',
      startTime: '21:00',
      endTime: '22:30',
      durationMin: 90,
      avgStr: 0.63,
      flowRatio: 0.78,
      taskLabel: 'Poker',
      flowIntervals: [
        { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 0.95 },
        { startMin: 5, endMin: 15, state: 'Focused', avgSTR: 0.75 },
        { startMin: 15, endMin: 45, state: 'Flow', avgSTR: 0.45 },
        { startMin: 45, endMin: 52, state: 'Focused', avgSTR: 0.70 },
        { startMin: 52, endMin: 80, state: 'Flow', avgSTR: 0.48 },
        { startMin: 80, endMin: 90, state: 'Neutral', avgSTR: 0.92 },
      ],
      strTimeseries: [
        { t: 0, str: 1.00 }, { t: 10, str: 0.80 }, { t: 20, str: 0.55 },
        { t: 30, str: 0.46 }, { t: 40, str: 0.44 }, { t: 50, str: 0.68 },
        { t: 60, str: 0.52 }, { t: 70, str: 0.45 }, { t: 80, str: 0.90 },
        { t: 90, str: 0.95 },
      ],
      quality: { eye: 96, eeg: 90, hr: 100 },
      peakStr: 0.42,
      longestStreakMin: 30,
    },
    {
      date: '2026-03-01',
      startTime: '23:00',
      endTime: '23:45',
      durationMin: 45,
      avgStr: 0.80,
      flowRatio: 0.50,
      taskLabel: 'Music',
      flowIntervals: [
        { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 0.98 },
        { startMin: 5, endMin: 12, state: 'Focused', avgSTR: 0.82 },
        { startMin: 12, endMin: 27, state: 'Flow', avgSTR: 0.62 },
        { startMin: 27, endMin: 35, state: 'Focused', avgSTR: 0.80 },
        { startMin: 35, endMin: 45, state: 'Neutral', avgSTR: 0.95 },
      ],
      strTimeseries: [
        { t: 0, str: 1.00 }, { t: 5, str: 0.88 }, { t: 10, str: 0.75 },
        { t: 15, str: 0.63 }, { t: 20, str: 0.61 }, { t: 25, str: 0.65 },
        { t: 30, str: 0.80 }, { t: 35, str: 0.88 }, { t: 40, str: 0.92 },
        { t: 45, str: 0.95 },
      ],
      quality: { eye: 85, eeg: 91, hr: 100 },
      peakStr: 0.60,
      longestStreakMin: 15,
    },
    {
      date: '2026-03-01',
      startTime: '08:00',
      endTime: '08:30',
      durationMin: 30,
      avgStr: 1.15,
      flowRatio: 0.08,
      taskLabel: 'Email',
      flowIntervals: [
        { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 1.08 },
        { startMin: 5, endMin: 10, state: 'Focused', avgSTR: 0.98 },
        { startMin: 10, endMin: 13, state: 'Flow', avgSTR: 0.88 },
        { startMin: 13, endMin: 25, state: 'Distracted', avgSTR: 1.32 },
        { startMin: 25, endMin: 30, state: 'Neutral', avgSTR: 1.18 },
      ],
      strTimeseries: [
        { t: 0, str: 1.05 }, { t: 5, str: 1.00 }, { t: 10, str: 0.90 },
        { t: 15, str: 1.25 }, { t: 20, str: 1.35 }, { t: 25, str: 1.20 },
        { t: 30, str: 1.15 },
      ],
      quality: { eye: 91, eeg: 78, hr: 94 },
      peakStr: 1.38,
      longestStreakMin: 3,
    },
  ];

  for (const sessionData of mockSessions) {
    const {
      flowIntervals,
      strTimeseries,
      quality,
      peakStr,
      longestStreakMin,
      startTime,
      endTime,
      ...sessionFields
    } = sessionData;

    const session = await prisma.session.create({
      data: {
        ...sessionFields,
        userId: user.id,
        report: {
          create: {
            flowIntervals: JSON.stringify(flowIntervals),
            strTimeseries: JSON.stringify(strTimeseries),
            quality: JSON.stringify(quality),
            summary: JSON.stringify({ peakStr, longestStreakMin, startTime, endTime }),
          },
        },
      },
    });
    console.log(`✅ Created session: ${session.taskLabel} on ${session.date}`);
  }

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
