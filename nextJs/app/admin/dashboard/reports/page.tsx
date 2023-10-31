import Main from '@/components/modules/admin/dashboard/reports/main';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports | CoStudy',
  description: 'Track your website status.',
};

const Reports = () => {
  return <Main />;
};

export default Reports;
