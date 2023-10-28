import { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import Header from './header';
import Footer from './footer';
import { Toaster } from 'react-hot-toast';
import EventTrigger from '../analytics/EventTrigger';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`flex flex-col min-h-screen font-sans`}>
      <EventTrigger />
      <Header />
      <NextTopLoader showSpinner={false} color={'#e6a0ff'} height={5} />
      <Toaster containerClassName="text-sm sm:text-lg" />
      <main className="flex-grow  bg-white pt-24">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
