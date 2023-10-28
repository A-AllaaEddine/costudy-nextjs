import NavBar from '@/components/modules/admin/dashboard/navbar';
import { Separator } from '@/components/ui/separator';
import { isAdmin } from '@/utils/serserSideUtils';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dashboard | CoStudy',
  description: 'Track your website status.',
};

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  await isAdmin();
  return (
    <div
      className=" w-full min-h-screen flex flex-col  justify-start items-start gap-4  py-8 
      px-3 md:px-28  "
    >
      <p className="flex justify-start w-full text-xl font-bold">Dashboard</p>
      <Separator />
      <div className="w-full h-full flex justify-start items-start gap-3">
        <NavBar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
