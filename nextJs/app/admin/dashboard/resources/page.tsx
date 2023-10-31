import Main from '@/components/modules/admin/dashboard/resources/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | CoStudy',
  description: 'Track your website status.',
};

const Resources = () => {
  return <Main />;
};

export default Resources;
