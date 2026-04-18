import { cronJobs } from 'convex/server';
import { api, internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'mark-offline-players',
  { minutes: 1 }, // Run every minute
  api.players.markOffline,
  {}
);

crons.interval(
  'cleanup-stale-rooms',
  { hours: 1 },
  internal.cleanup.staleRooms,
  {}
);

export default crons;
