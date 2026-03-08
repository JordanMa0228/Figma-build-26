import { Router, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthRequest, authenticateToken } from '../middleware/auth';
import { prisma } from '../lib/prisma';

const router = Router();

const sessionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

// GET /api/sessions — get all sessions for the current user
router.get('/', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { report: true },
    });
    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/summary — dashboard stats for the current user
router.get('/summary', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const now = new Date();

    // Start of current week (Monday)
    const dayOfWeek = now.getDay(); // 0=Sun
    // Days since Monday: Sun(0)→6, Mon(1)→0, Tue(2)→1, ..., Sat(6)→5
    const daysFromMon = (dayOfWeek + 6) % 7;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - daysFromMon);
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];

    // Today's date string (YYYY-MM-DD)
    const todayStr = now.toISOString().split('T')[0];

    const allSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { report: true },
    });

    const weeklySessions = allSessions.filter(s => s.date >= startOfWeekStr);
    const todaySessions = allSessions.filter(s => s.date === todayStr);

    const totalSessions = allSessions.length;
    const weeklyFlowTimeMin = weeklySessions.reduce(
      (sum, s) => sum + Math.round(s.durationMin * s.flowRatio),
      0
    );
    const avgSTRThisWeek =
      weeklySessions.length > 0
        ? weeklySessions.reduce((sum, s) => sum + s.avgStr, 0) / weeklySessions.length
        : 0;
    const lastSessionDate = allSessions[0]?.date || null;

    const todayFlowTimeMin = todaySessions.reduce(
      (sum, s) => sum + Math.round(s.durationMin * s.flowRatio),
      0
    );
    const todayAvgSTR =
      todaySessions.length > 0
        ? todaySessions.reduce((sum, s) => sum + s.avgStr, 0) / todaySessions.length
        : 0;

    let todayLongestStreakMin = 0;
    for (const s of todaySessions) {
      if (s.report?.summary) {
        try {
          const summary = JSON.parse(s.report.summary);
          const streak = summary.longestStreakMin ?? summary.longestStreak ?? 0;
          if (streak > todayLongestStreakMin) todayLongestStreakMin = streak;
        } catch {
          // ignore parse errors
        }
      }
    }

    res.json({
      totalSessions,
      weeklyFlowTimeMin,
      avgSTRThisWeek: parseFloat(avgSTRThisWeek.toFixed(2)),
      lastSessionDate,
      todayFlowTimeMin,
      todayAvgSTR: parseFloat(todayAvgSTR.toFixed(2)),
      todayLongestStreakMin,
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/analytics — analytics data for the current user
// IMPORTANT: must come before /:id to avoid route shadowing
router.get('/analytics', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const allSessions = await prisma.session.findMany({
      where: { userId },
      include: { report: true },
    });

    const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ORDERED_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    // Compute weeklyFlowData: last 7 days grouped by weekday
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const recentSessions = allSessions.filter(s => s.date >= sevenDaysAgoStr);
    const flowByDay: Record<string, number> = {};
    ORDERED_DAYS.forEach(d => { flowByDay[d] = 0; });
    for (const s of recentSessions) {
      const dateObj = new Date(s.date + 'T12:00:00Z');
      const dayName = DAY_NAMES[dateObj.getUTCDay()];
      flowByDay[dayName] = (flowByDay[dayName] || 0) + Math.round(s.durationMin * s.flowRatio);
    }
    const weeklyFlowData = ORDERED_DAYS.map(day => ({ day, flowMin: flowByDay[day] }));

    // Compute avgSTRByTask: group all sessions by taskLabel, average avgStr
    const strByTask: Record<string, { total: number; count: number }> = {};
    for (const s of allSessions) {
      const task = s.taskLabel || 'Other';
      if (!strByTask[task]) strByTask[task] = { total: 0, count: 0 };
      strByTask[task].total += s.avgStr;
      strByTask[task].count += 1;
    }
    const avgSTRByTask = Object.entries(strByTask).map(([task, { total, count }]) => ({
      task,
      avgSTR: parseFloat((total / count).toFixed(3)),
    }));

    // Compute focusTimeOfDay: group by startTime from report.summary
    const PERIOD_ORDER = ['Morning', 'Afternoon', 'Evening', 'Night'];
    const flowByPeriod: Record<string, { total: number; count: number }> = {
      Morning: { total: 0, count: 0 },
      Afternoon: { total: 0, count: 0 },
      Evening: { total: 0, count: 0 },
      Night: { total: 0, count: 0 },
    };
    for (const s of allSessions) {
      if (s.report?.summary) {
        try {
          const summary = JSON.parse(s.report.summary);
          if (summary.startTime) {
            const hour = parseInt(summary.startTime.split(':')[0], 10);
            let period: string;
            if (hour >= 6 && hour < 12) period = 'Morning';
            else if (hour >= 12 && hour < 18) period = 'Afternoon';
            else if (hour >= 18 && hour < 22) period = 'Evening';
            else period = 'Night';
            const flowMin = Math.round(s.durationMin * s.flowRatio);
            flowByPeriod[period].total += flowMin;
            flowByPeriod[period].count += 1;
          }
        } catch {
          // ignore parse errors
        }
      }
    }
    const focusTimeOfDay = PERIOD_ORDER.map(period => ({
      period,
      avgFlow: flowByPeriod[period].count > 0
        ? Math.round(flowByPeriod[period].total / flowByPeriod[period].count)
        : 0,
    }));

    // Compute analyticsOverview
    const totalSessions = allSessions.length;
    const avgFlowRatio = totalSessions > 0
      ? parseFloat((allSessions.reduce((sum, s) => sum + s.flowRatio, 0) / totalSessions).toFixed(3))
      : 0;
    const avgSTR = totalSessions > 0
      ? parseFloat((allSessions.reduce((sum, s) => sum + s.avgStr, 0) / totalSessions).toFixed(3))
      : 0;

    // bestTaskType: taskLabel with highest average flowRatio
    const flowByTask: Record<string, { total: number; count: number }> = {};
    for (const s of allSessions) {
      const task = s.taskLabel || 'Other';
      if (!flowByTask[task]) flowByTask[task] = { total: 0, count: 0 };
      flowByTask[task].total += s.flowRatio;
      flowByTask[task].count += 1;
    }
    let bestTaskType = '';
    let bestFlowRatio = -1;
    for (const [task, { total, count }] of Object.entries(flowByTask)) {
      const avg = total / count;
      if (avg > bestFlowRatio) {
        bestFlowRatio = avg;
        bestTaskType = task;
      }
    }

    res.json({
      weeklyFlowData,
      avgSTRByTask,
      focusTimeOfDay,
      analyticsOverview: { totalSessions, avgFlowRatio, avgSTR, bestTaskType },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sessions/:id — get a single session by id
router.get('/:id', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: { id, userId },
      include: { report: true },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    res.json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/sessions — create a new session with report
router.post('/', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const {
      taskLabel,
      date,
      startTime,
      endTime,
      durationMin,
      avgStr,
      flowRatio,
      peakStr,
      longestFlowStreakMin,
      flowIntervals,
      strTimeseries,
      quality,
    } = req.body;

    const session = await prisma.session.create({
      data: {
        userId,
        taskLabel,
        date,
        durationMin,
        avgStr,
        flowRatio,
        report: {
          create: {
            flowIntervals: JSON.stringify(flowIntervals),
            strTimeseries: JSON.stringify(strTimeseries),
            quality: JSON.stringify(quality),
            summary: JSON.stringify({
              peakStr,
              longestStreakMin: longestFlowStreakMin,
              startTime,
              endTime,
            }),
          },
        },
      },
      include: { report: true },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/sessions/:id — delete a session (must belong to current user)
router.delete('/:id', sessionsLimiter, authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const session = await prisma.session.findFirst({
      where: { id, userId },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    await prisma.session.delete({ where: { id } });
    res.json({ message: 'Session deleted' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
