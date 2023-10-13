import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Resources from './tabs/resources/Resources';
import OverView from './tabs/Overview';
import Spinner from '@/components/commun/static/spinner';
import Users from './tabs/Users';
import Reports from './tabs/reports/Reports';

const Main = () => {
  const [tab, setTab] = useState<string>('overview');
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const router = useRouter();
  useEffect(() => {
    if (router.isReady && router.query.tab) {
      setTab((router.query.tab as string) || 'overview');
      setTimeout(() => {}, 1000);
      setIsPageLoading(false);
    }
  }, [router]);

  return (
    <div
      className=" w-full min-h-screen flex flex-col justify-start items-center gap-4  pt-8 pb-8 
        pl-3 pr-3 md:pl-28 md:pr-28  "
    >
      {isPageLoading ? (
        <div className="w-4/6 h-full min-h-[600px] flex flex-col justify-center items-center gap-2">
          <Spinner className="text-[#8449BF] h-12 w-12" />
        </div>
      ) : (
        <>
          <p
            className="w-5/6 text-start font-bold font-sans
          text-2xl"
          >
            Dashboard
          </p>
          <div
            className="w-5/6 h-auto max-h-[750px] flex flex-col justify-start items-center gap-2
          rounded-md border-[1px] border-slate-300 p-4"
          >
            <div
              className="w-full h-auto flex justify-start items-start
          "
            >
              <Tabs
                value={tab}
                onValueChange={setTab}
                defaultValue={tab}
                className="w-full h-full  flex flex-col items-start "
              >
                <div className=" flex justify-center items-center">
                  <TabsList
                    className="w-auto sm:w-auto max-w-[400px] h-8 item
              grid-cols-2  rounded-lg 
              overflow-x-auto focus:overflow-x-scroll overflow-y-hidden scrollbar-hide "
                  >
                    <TabsTrigger
                      className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                      value="overview"
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/admin/dashboard',
                            query: { tab: 'overview' },
                          },
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                      }}
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                      value="users"
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/admin/dashboard',
                            query: { tab: 'users' },
                          },
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                      }}
                    >
                      Users
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                      value="resources"
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/admin/dashboard',
                            query: { tab: 'resources' },
                          },
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                      }}
                    >
                      Resources
                    </TabsTrigger>
                    <TabsTrigger
                      className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                      value="reports"
                      onClick={() => {
                        router.push(
                          {
                            pathname: '/admin/dashboard',
                            query: { tab: 'reports' },
                          },
                          undefined,
                          {
                            shallow: true,
                          }
                        );
                      }}
                    >
                      Reports
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="w-full ">
                  <OverView />
                </TabsContent>
                <TabsContent value="users" className="w-full">
                  <Users />
                </TabsContent>
                <TabsContent value="resources" className="w-full">
                  <Resources />
                </TabsContent>
                <TabsContent value="reports" className="w-full">
                  <Reports />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Main;
