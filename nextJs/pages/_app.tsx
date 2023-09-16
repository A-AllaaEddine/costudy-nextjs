import Layout from '../components/commun/layout/layout';
import { UserProvider } from '@/contexts/user-context';
import '@/styles/globals.css';
import { AppProps, AppType } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      <UserProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
