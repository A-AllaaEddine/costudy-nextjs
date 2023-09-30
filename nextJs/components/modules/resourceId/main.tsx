import { Resource } from '@/types/types';
import FilePage from './filePage';
import VideoPage from './videoPage';
import { useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';

const Main = ({ resource }: { resource: Resource }) => {
  const { mutateAsync: addEvent } = trpc.events.views.add.useMutation();

  const { data: session } = useSession();

  // add user view event
  useEffect(() => {
    const addViewEvent = async () => {
      try {
        await addEvent({
          resourceId: resource?.id!,
          userId: session?.user?.id!,
        });
      } catch (error: any) {
        // console.log(error);
      }
    };
    if (session?.user) {
      addViewEvent();
    }
  }, [session]);

  return (
    <div
      className=" w-full h-full flex flex-col justify-start items-center 
      pl-3 pr-3 md:pl-8 md:pr-8 "
    >
      {resource?.type === 'video' && <VideoPage resource={resource} />}
      {resource?.type !== 'video' && <FilePage resource={resource} />}
    </div>
  );
};

export default Main;
