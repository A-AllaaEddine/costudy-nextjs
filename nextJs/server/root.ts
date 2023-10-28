import { router } from './trpc';
import { resourcesRouter } from './routers/resources';
import { userRouter } from './routers/user';
import { reviewsRouter } from './routers/review';
import { bookmarksRouter } from './routers/bookmarks';
import { resourceRouter } from './routers/resource';
import { reportsRouter } from './routers/reports';
import { adminRouter } from './routers/admin';
import { eventsRouter } from './routers/events';
import { ticketsRouter } from './routers/tickets';

export const appRouter = router({
  user: userRouter,
  resources: resourcesRouter,
  resource: resourceRouter,
  reviews: reviewsRouter,
  bookmarks: bookmarksRouter,
  reports: reportsRouter,
  admin: adminRouter,
  events: eventsRouter,
  tickets: ticketsRouter,
});

// Export type router type signature,
// NOT the router itself.

export type AppRouter = typeof appRouter;
