import { ReactNode } from 'react';
import NextTopLoader from 'nextjs-toploader';
import Header from './header';
import Footer from './footer';
import { Toaster } from 'react-hot-toast';

type User = {
  token: string;
  type: string;
  _id: string;
  name: string;
  username: string;
  expiration: number;
  profilePicture: string;
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NextTopLoader showSpinner={false} color={'#e6a0ff'} />
      <Toaster containerClassName="text-sm sm:text-lg" />
      <main className="flex-grow  bg-white pt-24">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
