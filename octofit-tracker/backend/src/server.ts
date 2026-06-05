import express from 'express';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

import { connectDatabase, mongoUri } from './config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';

const app = express();

const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const asyncHandler = (handler: AsyncRouteHandler): RequestHandler => {
  return (req, res, next) => {
    void handler(req, res, next).catch(next);
  };
};

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', baseUrl });
});

app.get('/api/users/', asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ name: 1 });
  res.json(users);
}));

app.post('/api/users/', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
}));

app.get('/api/teams/', asyncHandler(async (_req, res) => {
  const teams = await Team.find().populate('members', 'name email points').sort({ name: 1 });
  res.json(teams);
}));

app.post('/api/teams/', asyncHandler(async (req, res) => {
  const team = await Team.create(req.body);
  res.status(201).json(team);
}));

app.get('/api/activities/', asyncHandler(async (_req, res) => {
  const activities = await Activity.find().populate('user', 'name email team').sort({ loggedAt: -1 });
  res.json(activities);
}));

app.post('/api/activities/', asyncHandler(async (req, res) => {
  const activity = await Activity.create(req.body);
  await User.findByIdAndUpdate(activity.user, { $inc: { points: activity.points } }, { new: true });
  res.status(201).json(activity);
}));

app.get('/api/leaderboard/', asyncHandler(async (_req, res) => {
  const users = await User.find().sort({ points: -1, name: 1 }).limit(25);
  const entries = users.map((user, index) => ({
    rank: index + 1,
    user,
    points: user.get('points'),
  }));

  await LeaderboardEntry.deleteMany({});
  await LeaderboardEntry.insertMany(entries.map((entry) => ({
    rank: entry.rank,
    user: entry.user._id,
    points: entry.points,
  })));

  res.json(entries);
}));

app.get('/api/workouts/', asyncHandler(async (_req, res) => {
  const workouts = await Workout.find().sort({ level: 1, title: 1 });
  res.json(workouts);
}));

app.post('/api/workouts/', asyncHandler(async (req, res) => {
  const workout = await Workout.create(req.body);
  res.status(201).json(workout);
}));

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
});

const start = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log(`Connected to MongoDB at ${mongoUri}`);

    app.listen(port, () => {
      console.log(`Backend API running on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start backend service', error);
    process.exit(1);
  }
};

void start();
