import '@/styles/globals.css';
import { trpc } from '@/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import { AppProps, AppType } from 'next/app';
import Layout from '../components/commun/layout/layout';
import { Poppins } from 'next/font/google';

export const poppins = Poppins({
  weight: '300',
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});
const App: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <main className={poppins.variable}>
      <SessionProvider session={session} refetchOnWindowFocus={true}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </main>
  );
};

export default trpc.withTRPC(App);
