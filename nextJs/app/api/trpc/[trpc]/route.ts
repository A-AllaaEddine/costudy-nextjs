import { appRouter } from '../../../../server/root';

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
// export API handler
// @see https://trpc.io/docs/server/adapters

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({}),
  });

export { handler as GET, handler as POST };
