import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { type AppRouter } from '../server/root';
import superjson from 'superjson';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.NODE_ENV === 'development') {
    return `${process.env.BASEURL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.BASEURL)
    // reference for vercel.com
    return `https://${process.env.BASEURL}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    if (typeof window !== 'undefined') {
      // Клиентские запросы
      return {
        transformer: superjson, // опционально: добавляем `superjson` для сериализации
        links: [
          httpBatchLink({
            url: '/api/trpc',
          }),
        ],
        queryClientConfig: {
          defaultOptions: {
            queries: {
              refetchOnMount: false,
              refetchOnWindowFocus: false,
            },
          },
        },
      };
    }
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        httpBatchLink({
          // Серверу требуется полный URL
          url: `${getBaseUrl()}/api/trpc`,
          /**
           * Устанавливаем кастомные заголовки для каждого запроса
           * @link https://trpc.io/docs/v10/header
           */
          headers() {
            if (!ctx?.req?.headers) {
              return {};
            }

            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              connection: _connection,
              ...headers
            } = ctx.req.headers;
            return {
              ...headers,
              // Опционально: информируем сервер о выполнении SSR-запроса
              'x-ssr': '1',
            };
            return {};
          },
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: false,
});
