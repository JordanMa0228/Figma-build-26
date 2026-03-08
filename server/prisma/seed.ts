import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      timezone: 'America/Chicago',
    },
  });

  console.log('✅ Created user:', user.email);

  // Mock session data
  const mockSessions = [
    {
      date: '2026-03-06',
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
      strTimeseries: Array.from({ length: 23 }, (_, i) => ({
        t: i,
        str: parseFloat((1.02 - i * 0.022 + Math.random() * 0.05).toFixed(3)),
      })),
      quality: { eye: 98, eeg: 91, hr: 100 },
      summary: { flowTotal: 11, longestStreak: 11, peakStr: 0.48, dataQuality: 96 },
    },
    {
      date: '2026-03-05',
      durationMin: 45,
      avgStr: 1.22,
      flowRatio: 0.12,
      taskLabel: 'Class',
      flowIntervals: [
        { startMin: 0, endMin: 5, state: 'Neutral', avgSTR: 1.05 },
        { startMin: 5, endMin: 12, state: 'Focused', avgSTR: 0.95 },
        { startMin: 12, endMin: 17, state: 'Flow', avgSTR: 0.78 },
        { startMin: 17, endMin: 45, state: 'Distracted', avgSTR: 1.35 },
      ],
      strTimeseries: Array.from({ length: 45 }, (_, i) => ({
        t: i,
        str: parseFloat((0.95 + i * 0.01 + Math.random() * 0.08).toFixed(3)),
      })),
      quality: { eye: 95, eeg: 88, hr: 100 },
      summary: { flowTotal: 5, longestStreak: 5, peakStr: 0.78, dataQuality: 94 },
    },
    {
      date: '2026-03-05',
      durationMin: 30,
      avgStr: 0.65,
      flowRatio: 0.72,
      taskLabel: 'Poker',
      flowIntervals: [
        { startMin: 0, endMin: 3, state: 'Neutral', avgSTR: 0.98 },
        { startMin: 3, endMin: 28, state: 'Flow', avgSTR: 0.58 },
        { startMin: 28, endMin: 30, state: 'Focused', avgSTR: 0.75 },
      ],
      strTimeseries: Array.from({ length: 30 }, (_, i) => ({
        t: i,
        str: parseFloat((0.95 - i * 0.015 + Math.random() * 0.04).toFixed(3)),
      })),
      quality: { eye: 99, eeg: 93, hr: 100 },
      summary: { flowTotal: 21, longestStreak: 25, peakStr: 0.42, dataQuality: 97 },
    },
    {
      date: '2026-03-04',
      durationMin: 20,
      avgStr: 0.81,
      flowRatio: 0.45,
      taskLabel: 'Music',
      flowIntervals: [
        { startMin: 0, endMin: 4, state: 'Neutral', avgSTR: 1.0 },
        { startMin: 4, endMin: 13, state: 'Flow', avgSTR: 0.68 },
        { startMin: 13, endMin: 17, state: 'Focused', avgSTR: 0.85 },
        { startMin: 17, endMin: 20, state: 'Neutral', avgSTR: 1.02 },
      ],
      strTimeseries: Array.from({ length: 20 }, (_, i) => ({
        t: i,
        str: parseFloat((1.0 - i * 0.01 + Math.random() * 0.06).toFixed(3)),
      })),
      quality: { eye: 97, eeg: 90, hr: 99 },
      summary: { flowTotal: 9, longestStreak: 9, peakStr: 0.61, dataQuality: 95 },
    },
    {
      date: '2026-03-04',
      durationMin: 15,
      avgStr: 1.18,
      flowRatio: 0.08,
      taskLabel: 'Email',
      flowIntervals: [
        { startMin: 0, endMin: 15, state: 'Distracted', avgSTR: 1.18 },
      ],
      strTimeseries: Array.from({ length: 15 }, (_, i) => ({
        t: i,
        str: parseFloat((1.1 + i * 0.008 + Math.random() * 0.05).toFixed(3)),
      })),
      quality: { eye: 96, eeg: 85, hr: 100 },
      summary: { flowTotal: 1, longestStreak: 1, peakStr: 1.38, dataQuality: 94 },
    },
  ];

  for (const sessionData of mockSessions) {
    const { flowIntervals, strTimeseries, quality, summary, ...sessionFields } = sessionData;
    
    const session = await prisma.session.create({
      data: {
        ...sessionFields,
        userId: user.id,
        report: {
          create: {
            flowIntervals: JSON.stringify(flowIntervals),
            strTimeseries: JSON.stringify(strTimeseries),
            quality: JSON.stringify(quality),
            summary: JSON.stringify(summary),
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
