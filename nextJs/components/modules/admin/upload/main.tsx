import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import FileUpload from './fileUpload';
import VideoUpload from './videoUpload';
import Spinner from '@/components/commun/static/spinner';

const FileTypes = [
  { value: 'File', label: 'File' },
  { value: 'Video', label: 'Video' },
];

const Main = () => {
  const [tab, setTab] = useState<string>('file');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      if (router.query.tab) {
        setTab((router.query.tab as string) || 'file');
      }
      setIsLoading(false);
    }
  }, [router]);

  return (
    <div
      className=" w-full min-h-screen flex flex-col justify-start items-center gap-4  pt-8 pb-8 
      pl-3 pr-3 md:pl-16 md:pr-16  "
    >
      {isLoading ? (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16">
            <Spinner className="text-[#FAFAFA] h-20 w-20" />
          </div>
        </div>
      ) : (
        <Tabs
          value={tab}
          onValueChange={setTab}
          defaultValue={tab}
          className="w-[90%] h-full  flex flex-col items-center  sm:w-4/5 md:w-2/5"
        >
          <div className=" flex justify-center items-center">
            <TabsList
              className="w-auto sm:w-auto max-w-[400px] h-auto item
                grid-cols-2  rounded-lg 
                overflow-x-auto focus:overflow-x-scroll  "
            >
              <TabsTrigger
                className="w-auto sm:text-lg text-sm rounded-lg"
                value="file"
                onClick={() => {
                  router.push(
                    { pathname: '/admin/upload', query: { tab: 'file' } },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                File
              </TabsTrigger>
              <TabsTrigger
                className="w-auto  sm:text-lg text-sm rounded-lg"
                value="video"
                onClick={() => {
                  router.push(
                    { pathname: '/admin/upload', query: { tab: 'video' } },
                    undefined,
                    {
                      shallow: true,
                    }
                  );
                }}
              >
                Video
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="file" className="w-4/5 max-w-[400px]">
            <FileUpload />
          </TabsContent>
          <TabsContent value="video" className="w-4/5 max-w-[400px]">
            <VideoUpload />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Main;
