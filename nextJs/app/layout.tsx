import SessionProvider from '@/components/providers/SessionProvider';
import TrpcProvider from '@/components/providers/TrpcProvider';
import { Analytics } from '@vercel/analytics/react';
import { getServerSession } from 'next-auth';
import { Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/commun/layout/header';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/commun/layout/footer';
import NextTopLoader from 'nextjs-toploader';
import EventsHandler from '@/components/commun/events/EventsHandler';

export const poppins = Poppins({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body>
        <Analytics />
        <TrpcProvider>
          <SessionProvider session={session}>
            {/* <EventTrigger /> */}
            <EventsHandler />
            <Header />
            <NextTopLoader showSpinner={false} color={'#e6a0ff'} height={5} />
            <Toaster containerClassName="text-sm sm:text-lg" />
            <main className="flex flex-col min-h-screen font-sans lg:max-w-[1600px] m-auto w-full pb-20 p-0 flex-grow  bg-white pt-24">
              {children}
            </main>
            <Footer />
          </SessionProvider>
        </TrpcProvider>
      </body>
    </html>
  );
}
