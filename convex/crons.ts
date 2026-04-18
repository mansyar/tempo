import { cronJobs } from 'convex/server';
import { api } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'mark-offline-players',
  { minutes: 1 }, // Run every minute
  api.players.markOffline,
  {}
);

export default crons;
