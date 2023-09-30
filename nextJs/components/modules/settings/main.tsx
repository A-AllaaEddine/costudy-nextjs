import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Account from './account';
import DangerZone from './danger';
import Security from './security';
import Spinner from '@/components/commun/static/spinner';

const Main = () => {
  const [tab, setTab] = useState<string>('account');
  const [isPageLoading, setIsPageLoading] = useState(true);

  const router = useRouter();

  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = trpc.user.get.useQuery();

  useEffect(() => {
    if (router.isReady && router.query.tab) {
      setTab((router.query.tab as string) || 'account');
    }
    setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);
  }, [router]);

  return (
    <div
      className=" w-full h-screen flex flex-col justify-start items-center gap-4  pt-8
      pl-3 pr-3 md:pl-16 md:pr-16 "
    >
      {isLoading || isPageLoading ? (
        <div className="min-h-full w-full flex flex-col justify-center items-center">
          <Spinner className="text-[#8449BF]" />
        </div>
      ) : (
        <Tabs
          value={tab}
          onValueChange={setTab}
          defaultValue={tab}
          className="w-[90%] sm:w-4/5 md:w-3/5 flex flex-col items-center"
        >
          <div className="flex justify-center items-center">
            <TabsList
              className="w-auto sm:w-auto h-auto grid-cols-3 rounded-lg 
            overflow-x-auto focus:overflow-x-scroll  "
            >
              <TabsTrigger
                className="w-auto sm:text-lg text-xs rounded-lg"
                value="account"
                onClick={() => {
                  router.push(
                    { pathname: '/settings', query: { tab: 'account' } },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                Account
              </TabsTrigger>
              <TabsTrigger
                className="w-auto  sm:text-lg text-x rounded-lg"
                value="security"
                onClick={() => {
                  router.push(
                    { pathname: '/settings', query: { tab: 'security' } },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="dangerZone"
                className="w-auto  sm:text-lg text-xs text-[#ff5e52] data-[state=active]:bg-[#ff5e52] data-[state=active]:text-white rounded-lg
              "
                onClick={() => {
                  router.push(
                    { pathname: '/settings', query: { tab: 'dangerZone' } },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                Danger Zone
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="account" className="w-4/5 max-w-[400px]">
            <Account userData={userData} refetch={refetch} />
          </TabsContent>
          <TabsContent value="security" className="w-4/5 max-w-[400px]">
            <Security />
          </TabsContent>
          <TabsContent value="dangerZone" className="w-4/5 max-w-[400px]">
            <DangerZone />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Main;
