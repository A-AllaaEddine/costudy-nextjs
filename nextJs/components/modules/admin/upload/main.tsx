'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import FileUpload from './fileUpload';
import VideoUpload from './videoUpload';

const FileTypes = [
  { value: 'File', label: 'File' },
  { value: 'Video', label: 'Video' },
];

const Main = () => {
  const router = useRouter();

  return (
    <div
      className=" w-full min-h-screen flex flex-col justify-start items-center gap-4  pt-8 pb-8 
      pl-3 pr-3 md:pl-16 md:pr-16  "
    >
      <Tabs
        defaultValue={'file'}
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
            >
              File
            </TabsTrigger>
            <TabsTrigger
              className="w-auto  sm:text-lg text-sm rounded-lg"
              value="video"
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
    </div>
  );
};

export default Main;
