import Main from '@/components/modules/admin/dashboard/users/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users | CoStudy',
  description: 'Track your website status.',
};

const Users = () => {
  return <Main />;
};

export default Users;
