import type { HydratedDocument, Types } from 'mongoose';

import { connectDatabase, disconnectDatabase } from '../config/database';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';
import type { UserAttrs } from '../models';

const seed = async (): Promise<void> => {
  console.log('Seed the octofit_db database with test data');

  await connectDatabase();

  await Promise.all([
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Team.deleteMany({}),
    User.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    { name: 'Avery Johnson', email: 'avery.johnson@mergington.edu', team: 'Blue Barracudas', points: 420 },
    { name: 'Maya Chen', email: 'maya.chen@mergington.edu', team: 'Red Rockets', points: 385 },
    { name: 'Jordan Rivera', email: 'jordan.rivera@mergington.edu', team: 'Green Gliders', points: 340 },
    { name: 'Sam Patel', email: 'sam.patel@mergington.edu', team: 'Blue Barracudas', points: 295 },
    { name: 'Taylor Brooks', email: 'taylor.brooks@mergington.edu', team: 'Red Rockets', points: 260 },
  ]);

  const userByEmail = new Map(users.map((user) => [user.email, user]));
  const getUserId = (email: string): Types.ObjectId => {
    const user = userByEmail.get(email) as HydratedDocument<UserAttrs> | undefined;

    if (!user) {
      throw new Error(`Missing seeded user ${email}`);
    }

    return user._id as Types.ObjectId;
  };

  await Team.insertMany([
    {
      name: 'Blue Barracudas',
      mascot: 'Barracuda',
      members: [getUserId('avery.johnson@mergington.edu'), getUserId('sam.patel@mergington.edu')],
      points: 715,
    },
    {
      name: 'Red Rockets',
      mascot: 'Rocket',
      members: [getUserId('maya.chen@mergington.edu'), getUserId('taylor.brooks@mergington.edu')],
      points: 645,
    },
    {
      name: 'Green Gliders',
      mascot: 'Glider',
      members: [getUserId('jordan.rivera@mergington.edu')],
      points: 340,
    },
  ]);

  await Activity.insertMany([
    {
      user: getUserId('avery.johnson@mergington.edu'),
      type: 'Trail run',
      durationMinutes: 35,
      points: 90,
      loggedAt: new Date('2026-06-01T15:30:00.000Z'),
    },
    {
      user: getUserId('maya.chen@mergington.edu'),
      type: 'Cycling',
      durationMinutes: 45,
      points: 85,
      loggedAt: new Date('2026-06-02T16:00:00.000Z'),
    },
    {
      user: getUserId('jordan.rivera@mergington.edu'),
      type: 'Strength circuit',
      durationMinutes: 30,
      points: 75,
      loggedAt: new Date('2026-06-03T14:45:00.000Z'),
    },
    {
      user: getUserId('sam.patel@mergington.edu'),
      type: 'Basketball drills',
      durationMinutes: 40,
      points: 80,
      loggedAt: new Date('2026-06-04T17:15:00.000Z'),
    },
    {
      user: getUserId('taylor.brooks@mergington.edu'),
      type: 'Yoga flow',
      durationMinutes: 25,
      points: 55,
      loggedAt: new Date('2026-06-05T13:20:00.000Z'),
    },
  ]);

  const leaderboardUsers = [...users].sort((firstUser, secondUser) => secondUser.points - firstUser.points);

  await LeaderboardEntry.insertMany(leaderboardUsers.map((user, index) => ({
    user: user._id as Types.ObjectId,
    points: user.points,
    rank: index + 1,
  })));

  await Workout.insertMany([
    {
      title: 'Starter Cardio Mix',
      level: 'Beginner',
      durationMinutes: 20,
      activities: ['5 minute warmup walk', '10 minute jog intervals', '5 minute cooldown stretch'],
    },
    {
      title: 'Core Strength Builder',
      level: 'Intermediate',
      durationMinutes: 30,
      activities: ['Plank holds', 'Bodyweight squats', 'Pushups', 'Mountain climbers'],
    },
    {
      title: 'Team Challenge Circuit',
      level: 'Advanced',
      durationMinutes: 45,
      activities: ['Relay sprints', 'Medicine ball passes', 'Agility ladder', 'Cooldown mobility'],
    },
  ]);

  console.log(`Seeded ${users.length} users, 3 teams, 5 activities, ${leaderboardUsers.length} leaderboard entries, and 3 workouts.`);
};

seed()
  .catch((error: unknown) => {
    console.error('Failed to seed octofit_db', error);
    process.exitCode = 1;
  })
  .finally(() => {
    void disconnectDatabase();
  });