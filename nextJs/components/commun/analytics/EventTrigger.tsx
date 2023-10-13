import { generateSalt } from '@/utils/bcryptUtils';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const EventTrigger = () => {
  const router = useRouter();

  let generateIdPromise: any = '';

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
  const {
    mutateAsync: addPageEvent,
    isError,
    error,
  } = trpc.events.page.add.useMutation();

  const pageEvent = async ({ page }: { page: string }) => {
    if (page.includes('admin')) return;

    let landingPage = false,
      referrer = '';
    if (document.referrer.length) {
      const url = new URL(document?.referrer!);
      if (
        url.host.includes(
          process.env.NEXT_PUBLIC_BASEURL?.replace('http://', '')!
        )
      ) {
        landingPage = true;
        referrer = document.referrer;
      }
    }

    let exist = await sessionStorage.getItem(`page_${page}`);

    if (exist) return;

    try {
      let userId = sessionStorage.getItem('userId');
      if (!userId) {
        userId = await generateId();
        sessionStorage.setItem('userId', userId!);
      }
      let OSName = 'unknown',
        device = 'unknown';
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

      if (window.screen.width > 1024) {
        device = 'desk';
      } else {
        device = 'mobile';
      }

      let pageData = {
        userId: userId!,
        page: page,
        referrer: referrer,
        landingPage,
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
        device,
      };
      await addPageEvent(pageData);
      if (isError) {
        throw error;
      }

      await sessionStorage.setItem(`page_${page}`, JSON.stringify(pageData));
    } catch (error: any) {
      console.log(error);
    }
  };

  // const craftsmanViewEvent = async ({ username }: { username: string }) => {
  //   try {
  //     let userId = sessionStorage.getItem('userId');

  //     if (!userId) {
  //       userId = await generateId();

  //       sessionStorage.setItem('userId', userId!);
  //     }

  //     let data: {
  //       username: string;
  //       userId: string;
  //       referrer: string;
  //     } = {
  //       userId: userId!,
  //       username,
  //       referrer: document.referrer,
  //     };

  //     let craftsmanView;
  //     craftsmanView = JSON.parse(
  //       sessionStorage.getItem(`craftsman_view_${username}`)!
  //     );
  //     if (!craftsmanView) {
  //       await addCraftsmanView(data);
  //       sessionStorage.setItem(
  //         `craftsman_view_${username}`,
  //         JSON.stringify(data)
  //       );
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    if (router.isReady) {
      pageEvent({ page: router.asPath });
    }
  }, [router]);

  return <></>;
};

export default EventTrigger;

export const addDownload = async ({
  userId,
  refetch,
}: {
  userId: string;
  refetch?: any;
}) => {
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

  try {
    await addDownloadEvent({
      id: userId,
    });

    if (isErrorDownloadEvent) {
      throw errorDownloadEvent;
    }

    return { isLoading: isLoadingDownloadEvent };
    // console.log(data);
  } catch (error: any) {
    console.log(error);
  }
};
