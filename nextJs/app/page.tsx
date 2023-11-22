import Meta from '@/components/commun/static/Meta';
import Main from '@/components/modules/home/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | CoStudy',
  description: 'Explore our website',
};

const Home = () => {
  return (
    <>
      <Main />
    </>
  );
};

export default Home;
