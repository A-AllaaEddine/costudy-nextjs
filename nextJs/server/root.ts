import { router } from './trpc';
import { resourcesRouter } from './routers/resources';
import { userRouter } from './routers/user';
import { reviewsRouter } from './routers/review';
import { bookmarksRouter } from './routers/bookmarks';
import { viewsRouter } from './routers/views';

export const appRouter = router({
  user: userRouter,
  resources: resourcesRouter,
  reviews: reviewsRouter,
  bookmarks: bookmarksRouter,
  views: viewsRouter,
});

// Export type router type signature,
// NOT the router itself.

export type AppRouter = typeof appRouter;
