import mongoose, { Schema, Types } from 'mongoose';
import type { Model } from 'mongoose';

export interface UserAttrs {
  name: string;
  email: string;
  team?: string;
  points: number;
}

export interface TeamAttrs {
  name: string;
  mascot?: string;
  members: Types.ObjectId[];
  points: number;
}

export interface ActivityAttrs {
  user: Types.ObjectId;
  type: string;
  durationMinutes: number;
  points: number;
  loggedAt?: Date;
}

export interface LeaderboardEntryAttrs {
  user: Types.ObjectId;
  points: number;
  rank: number;
}

export interface WorkoutAttrs {
  title: string;
  level: string;
  durationMinutes: number;
  activities: string[];
}

const userSchema = new Schema<UserAttrs>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    team: { type: String, trim: true },
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const teamSchema = new Schema<TeamAttrs>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    mascot: { type: String, trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    points: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

const activitySchema = new Schema<ActivityAttrs>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    points: { type: Number, required: true, min: 0 },
    loggedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const leaderboardSchema = new Schema<LeaderboardEntryAttrs>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
  },
  { timestamps: true },
);

const workoutSchema = new Schema<WorkoutAttrs>(
  {
    title: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    activities: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

export const User = (mongoose.models.User as Model<UserAttrs> | undefined) ?? mongoose.model<UserAttrs>('User', userSchema);
export const Team = (mongoose.models.Team as Model<TeamAttrs> | undefined) ?? mongoose.model<TeamAttrs>('Team', teamSchema);
export const Activity = (mongoose.models.Activity as Model<ActivityAttrs> | undefined)
  ?? mongoose.model<ActivityAttrs>('Activity', activitySchema);
export const LeaderboardEntry = (mongoose.models.LeaderboardEntry as Model<LeaderboardEntryAttrs> | undefined)
  ?? mongoose.model<LeaderboardEntryAttrs>('LeaderboardEntry', leaderboardSchema);
export const Workout = (mongoose.models.Workout as Model<WorkoutAttrs> | undefined)
  ?? mongoose.model<WorkoutAttrs>('Workout', workoutSchema);