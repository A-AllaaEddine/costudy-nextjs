'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Behavior from './tabs/Behavior';
import Geographical from './tabs/Geographical';
import Technology from './tabs/Technology';

const Main = () => {
  const [tab, setTab] = useState<string>('summary');
  const router = useRouter();

  const geographicalOptions = [
    { value: 'city', label: 'City' },
    { value: 'language', label: 'Language' },
  ];

  const technologyOptions = [
    { value: 'os', label: 'Operating System' },
    { value: 'browser', label: 'Browser' },
    { value: 'screen resolution', label: 'Screen Resolution' },
    { value: 'device', label: 'Device' },
  ];

  const onSelectGeographical = (selectedGeo: string) => {
    router.push(`/admin/analytics?tab=${selectedGeo}`);
  };

  return (
    <div
      className="w-full min-h-screen h-full flex flex-col justify-start items-center
            gap-3 pt-24 pb-8 px-2 md:px-20"
    >
      <p
        className="w-5/6 text-start font-bold font-sans
        text-2xl"
      >
        Analytics
      </p>
      <div
        className="w-5/6 h-auto flex flex-col justify-start items-center gap-2
         rounded-md border-[1px] border-slate-300 p-4"
      >
        <div
          className="w-full h-auto flex justify-start items-center
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
                className="w-auto sm:w-auto max-w-[600px] h-8 item
                grid-cols-2  rounded-lg 
                overflow-x-auto focus:overflow-x-scroll overflow-y-hidden  scrollbar-hide"
              >
                <TabsTrigger
                  className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                  value="behavior"
                  onClick={() => {
                    router.push('/admin/analytics?tab=behavior');
                  }}
                >
                  Behavior
                </TabsTrigger>
                <TabsTrigger
                  className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                  value="acquisition"
                  onClick={() => {
                    router.push('/admin/analytics?tab=acquisition');
                  }}
                >
                  Acquisition
                </TabsTrigger>{' '}
                {/* <TabsTrigger
                  className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                  value="geographical"
                  onClick={() => {
                    router.push(
                      {
                        pathname: '/admin/analytics',
                        query: { tab: 'geographical' },
                      },
                      undefined,
                      {
                        shallow: true,
                      }
                    );
                  }}
                >
                  Geographical
                </TabsTrigger> */}
                <TabsTrigger
                  className="w-auto h-6 sm:text-md font-bold text-sm rounded-lg"
                  value="technology"
                  onClick={() => {
                    router.push('/admin/analytics?tab=technology');
                  }}
                >
                  Technology
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="behavior" className="w-full">
              <Behavior />
            </TabsContent>
            <TabsContent value="technology" className="w-full">
              <Technology />
            </TabsContent>
            {/* <TabsContent value="geographical" className="w-full">
              <Geographical />
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Main;
