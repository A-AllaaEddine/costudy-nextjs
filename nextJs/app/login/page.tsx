import Meta from '@/components/commun/static/Meta';
import Main from '@/components/modules/login/main';
import { isLoggedIn } from '@/utils/serserSideUtils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log in | CoStudy',
  description: 'Welcome back to CoStudy',
};

const LogIn = async () => {
  await isLoggedIn({ login: true });

  return (
    <>
      <Meta title="Co Study" description="Generated by create next app" />
      <Main />
    </>
  );
};

export default LogIn;
