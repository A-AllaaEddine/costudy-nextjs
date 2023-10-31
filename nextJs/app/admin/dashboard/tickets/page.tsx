import Main from '@/components/modules/admin/dashboard/tickets/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tickets | CoStudy',
  description: 'Track your website status.',
};

const Tickets = () => {
  return <Main />;
};

export default Tickets;
