'use client';

import { trpc } from '@/app/_trpc/client';
import { generateSalt } from '@/utils/bcryptUtils';
import { useParams, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const EventsHandler = () => {
  let generateIdPromise: any = '';

  const params = useParams();

  const {
    mutateAsync: addViewEvent,
    isError,
    error,
  } = trpc.events.views.resource.useMutation();

  const viewEvent = async ({ title }: { title: string }) => {
    const generateId = async () => {
      if (!generateIdPromise) {
        generateIdPromise = new Promise(async (resolve) => {
          const salt = await generateSalt();
          const dataToHash = `${new Date().toISOString()}${salt}`;
          resolve(dataToHash);
        });
      }
      return generateIdPromise;
    };

    try {
      let userId = sessionStorage.getItem('userId');
      if (userId) return;
      if (!userId) {
        userId = await generateId();
        sessionStorage.setItem('userId', userId!);
      }
      await addViewEvent({ title });
      if (isError) {
        throw error;
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.type && params.title) {
      viewEvent({
        title: (params.title as string)
          .replaceAll(/\-/g, ' ')
          .replaceAll(/\_/g, '|'),
      });
    }
  }, [params]);

  return <></>;
};

export default EventsHandler;

export const addDownload = ({ id, refetch }: { id: string; refetch?: any }) => {
  const {
    mutateAsync: addDownloadEvent,
    isLoading: isLoadingDownloadEvent,
    isError: isErrorDownloadEvent,
    error: errorDownloadEvent,
  } = trpc.events.downloads.add.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const addEvent = async () => {
    try {
      await addDownloadEvent({
        id,
      });

      if (isErrorDownloadEvent) {
        throw errorDownloadEvent;
      }

      // console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return {
    isLoadingDownloadEvent: isLoadingDownloadEvent,
    addDownloadEvent: addEvent,
  };
};
