import { NextApiRequest, NextApiResponse } from 'next';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { createContext } from '@/server/context';
import { AppRouter, appRouter } from '@/server/root';
import superjson from 'superjson';

// connecting to internal procedur
export const helpers = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: await createContext({ req, res }),
    transformer: superjson,
  });
};

// connecting to external procedur
const proxyClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.BASEURL}/api/trpc`,
    }),
  ],
  transformer: superjson,
});

export const externalHelpers = createServerSideHelpers({
  client: proxyClient,
});
