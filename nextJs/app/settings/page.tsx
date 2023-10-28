import Account from '@/components/modules/settings/account';
import DangerZone from '@/components/modules/settings/dangerZone';
import NavBar from '@/components/modules/settings/navbar';
import Security from '@/components/modules/settings/security';
import { Separator } from '@/components/ui/separator';
import { isLoggedIn } from '@/utils/serserSideUtils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings | CoStudy',
  description: 'Track your website status.',
};

const Settings = async ({
  searchParams,
}: {
  searchParams: { tab: string };
}) => {
  await isLoggedIn({});
  console.log(searchParams);
  return (
    <div
      className="w-4/5  min-h-screen flex flex-col  justify-start items-center gap-4  py-8 
        px-3 md:px-28  "
    >
      <p className="text-xl lg:text-2xl h-auto font-bold w-full lg:w-4/5 text-start">
        Settings
      </p>
      <p className="text-sm lg:text-md h-auto  w-full lg:w-4/5 text-start">
        Manage your account settings and set e-mail preferences.
      </p>
      <Separator className="w-4/5" />
      <div className="w-4/5 h-full flex justify-start items-start gap-5">
        <NavBar />
        {searchParams.tab === 'account' && <Account />}
        {searchParams.tab === 'security' && <Security />}
        {searchParams.tab === 'danger-zone' && <DangerZone />}
      </div>
    </div>
  );
};

export default Settings;
