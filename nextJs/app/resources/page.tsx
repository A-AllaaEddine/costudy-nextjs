import Main from '@/components/modules/resources/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Browse our library of resources.',
};

const Resources = () => {
  return (
    <>
      <Main />
    </>
  );
};
export default Resources;
