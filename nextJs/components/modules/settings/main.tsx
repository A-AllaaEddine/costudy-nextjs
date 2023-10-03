import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Account from './account';
import DangerZone from './danger';
import Security from './security';
import Spinner from '@/components/commun/static/spinner';
import { Separator } from '@/components/ui/separator';

const Main = () => {
  const [tab, setTab] = useState<string>('account');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>('account');

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
      pl-3 pr-3 md:pl-16 md:pr-16"
    >
      {isLoading || isPageLoading ? (
        <div className="min-h-full w-full flex flex-col justify-center items-center">
          <Spinner className="text-[#8449BF]" />
        </div>
      ) : (
        <>
          {/* <Tabs
            value={tab}
            onValueChange={setTab}
            defaultValue={tab}
            className="w-[90%] sm:w-4/5 md:w-3/5 flex lg:hidden flex-col items-center"
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
          </Tabs> */}
          <div
            className=" w-full lg:w-4/5 max-w-[1000px]  h-full flex flex-col justify-start items-start gap-3
          p-2"
          >
            <p className="text-xl lg:text-2xl h-auto font-bold w-full lg:w-4/5 text-start">
              Settings
            </p>
            <p className="text-sm lg:text-md h-auto  w-full lg:w-4/5 text-start">
              Manage your account settings and set e-mail preferences.
            </p>
            <Separator className="w-full lg:w-4/5" />
            <div className="w-full lg:w-4/5 h-full flex flex-col lg:flex-row justify-start items-start lg:gap-5 gap-2 lg:mt-2">
              <div className="lg:w-56 w-full h-auto lg:h-full flex flex-row lg:flex-col justify-start items-start gap-1 lg:gap-0">
                <div
                  className={`${
                    selectedTab === 'account' && 'bg-slate-100'
                  } w-auto lg:w-full hover:bg-slate-100 rounded-md p-2`}
                  onClick={() => setSelectedTab('account')}
                >
                  <p className="text-sm lg:text-md font-bold hover:cursor-pointer ">
                    Account
                  </p>
                </div>
                <div
                  className={`${
                    selectedTab === 'security' && 'bg-slate-100'
                  } w-auto lg:w-full hover:bg-slate-100 rounded-md p-2`}
                  onClick={() => setSelectedTab('security')}
                >
                  <p className="text-sm lg:text-md font-bold hover:cursor-pointer ">
                    Security
                  </p>
                </div>
                <div
                  className={`${
                    selectedTab === 'dangerZone' && 'bg-slate-100'
                  } w-auto lg:w-full hover:bg-slate-100 rounded-md p-2`}
                  onClick={() => setSelectedTab('dangerZone')}
                >
                  <p className="text-sm lg:text-md text-[#ff5e52] font-bold hover:cursor-pointer ">
                    Danger Zone
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-start items-start p-2">
                {selectedTab === 'account' && (
                  <Account userData={userData} refetch={refetch} />
                )}
                {selectedTab === 'security' && <Security />}
                {selectedTab === 'dangerZone' && <DangerZone />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
