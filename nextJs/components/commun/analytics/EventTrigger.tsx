import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EventTrigger = () => {
  const router = useRouter();

  const {
    mutateAsync: addDevice,
    isLoading,
    isError,
    error,
  } = trpc.events.views.device.add.useMutation();
  const {
    mutateAsync: addResourceView,
    // isLoading,
    // isError,
    // error,
  } = trpc.events.views.resource.add.useMutation();

  const deviceEvent = async () => {
    try {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'generateUniqueId()';
        localStorage.setItem('userId', userId);
      }
      let data: any = { userId };

      let OSName = 'unknown';
      let navApp = navigator.userAgent.toLowerCase();
      switch (true) {
        case navApp.indexOf('win') != -1:
          OSName = 'windows';
          break;
        case navApp.indexOf('mac') != -1:
          OSName = 'apple';
          break;
        case navApp.indexOf('linux') != -1:
          OSName = 'linux';
          break;
        case navApp.indexOf('x11') != -1:
          OSName = 'unix';
          break;
      }

      let browser;
      if (navApp.includes('opera') || navApp.includes('opr')) {
        browser = 'opera';
      } else if (navApp.includes('edg')) {
        browser = 'edge';
      } else if (navApp.includes('chrome')) {
        browser = 'chrome';
      } else if (navApp.includes('safari')) {
        browser = 'safari';
      } else if (navApp.includes('firefox')) {
        browser = 'firefox';
      } else {
        browser = 'unknown';
      }
      let lat = 0,
        long = 0;
      navigator.geolocation.getCurrentPosition((pos) => {
        lat = pos.coords.latitude;
        long = pos.coords.longitude;
      });

      let device;
      device = JSON.parse(sessionStorage.getItem('device')!);
      if (!device) {
        device = {
          userId: 'fg',
          userAgent: navigator.userAgent,
          platform: OSName,
          language: navigator.language,
          location: {
            lat: lat,
            long: long,
          },
          screenSize: {
            width: window.screen.width,
            height: window.screen.height,
          },
          browser: browser,
        };
        sessionStorage.setItem('device', JSON.stringify(device));
        await addDevice(device);
        if (isError) {
          throw error;
        }
      }
      // console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const resourceViewEvent = async ({ resourceId }: { resourceId: string }) => {
    try {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = 'gqggdgd5Aq525sgg';
        localStorage.setItem('userId', userId);
      }
      let data: any = { userId };
      data = {
        ...data,
        resourceId,
        event: 'resource_view',
        page: router.asPath,
      };

      data.referrer = document.referrer;

      let resourceView;
      resourceView = JSON.parse(
        sessionStorage.getItem(`resourceView_${resourceId}`)!
      );
      if (!resourceView) {
        sessionStorage.setItem(
          `resourceView_${resourceId}`,
          JSON.stringify(data)
        );
        addResourceView(data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    deviceEvent();
  }, []);

  useEffect(() => {
    if (router.isReady && router.pathname.includes('/[type]/[resourceId]')) {
      resourceViewEvent({ resourceId: router.query.resourceId! as string });
    }
    addDownload({
      username: 'fl',
      resourceId: 'f',
    });
  }, [router]);

  return <></>;
};

export default EventTrigger;

export const addDownload = async ({
  resourceId,
  username,
}: {
  resourceId: string;
  username: string;
}) => {
  try {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'generateUniqueId()';
      localStorage.setItem('userId', userId);
    }
    let data: any = { userId, username, resourceId };

    // console.log(data);
  } catch (error: any) {
    console.log(error);
  }
};
