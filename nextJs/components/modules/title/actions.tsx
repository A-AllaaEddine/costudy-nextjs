'use client';

import LogInAlertModal from '@/components/commun/modals/LogInAlertModal';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { GoCodeReview } from 'react-icons/go';
import { IoBookmark, IoBookmarkOutline, IoFlagSharp } from 'react-icons/io5';
import ResourceRatingModal from './resource/ResourceRatingModal';
import ResourceReportModal from './resource/ResourceReportModal';
import ResourceShareModal from './resource/ResourceShareModal';
import { trpc } from '@/app/_trpc/client';

const Actions = ({
  resource,
  refetchBookmarkCount,
  refetchReviewsData,
}: {
  resource: Resource;
  refetchBookmarkCount?: any;
  refetchReviewsData?: any;
}) => {
  const [showLogInAlert, setShowLogInAlert] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      setIsEnabled(true);
    }
  }, [session]);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const {
    data: userBookmarks,
    isLoading: isFetchingBookmarks,
    refetch: refechUserBookmarks,
  } = trpc.bookmarks.get.useQuery(undefined, {
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: add, isLoading: isAddingToBookmarks } =
    trpc.bookmarks.add.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
        refechUserBookmarks();
        refetchReviewsData();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
  const { mutateAsync: remove, isLoading: isRemovingFromBookmarks } =
    trpc.bookmarks.remove.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
        refechUserBookmarks();
        refetchReviewsData();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });

  const addToBookmarks = async () => {
    if (!session?.user) {
      setShowLogInAlert(true);
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await add({
            id: resource?.id!,
            class: resource?.class,
            degree: resource?.degree,
            major: resource?.major,
            year: resource?.year,
          });

          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Adding...',
        success: () => {
          return 'Added to bookmarks.';
        },
        error: (err) => {
          if (err.message === 'Bookmark exists already.') {
            return 'You have already Bookmarked this resource.';
          }
          return 'There was an error adding the resource to your bookmarks.';
        },
      }
    );
  };

  const removeFromBookmarks = async () => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await remove({ id: resource?.id! });

          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Removing...',
        success: () => {
          return 'Removed from bookmarks.';
        },
        error: () => {
          return 'There was an error removing the resource from your bookmarks.';
        },
      }
    );
  };

  return (
    <div className="w-auto h-6 md:h-10 flex flex-row items-center p-2 gap-1 ">
      {session?.user ? (
        <ResourceRatingModal id={resource?.id!} />
      ) : (
        <Button
          className="w-auto h-6 md:h-8 text-black text-lg
           font-semibold bg-transparent  pr-2 pl-2 rounded-full  
            hover:bg-slate-200 hover:text-black"
        >
          <GoCodeReview
            className="w-6 h-6"
            onClick={() => setShowLogInAlert(true)}
          />
        </Button>
      )}

      {session?.user?.type !== 'admin' && (
        <div
          className="w-auto h-6 md:h-8 flex flex-row justify-center items-center gap-2 pr-2 pl-2
            hover:cursor-pointer hover:bg-slate-200 rounded-full"
        >
          {userBookmarks &&
          Array.isArray(userBookmarks) &&
          userBookmarks?.find((bkmrk: any) => bkmrk === resource?.id) ? (
            <IoBookmark className="w-6 h-6" onClick={removeFromBookmarks} />
          ) : (
            <IoBookmarkOutline className="w-6 h-6" onClick={addToBookmarks} />
          )}
        </div>
      )}

      <ResourceShareModal
        id={resource?.id!}
        title={resource?.title}
        url={url}
      />

      {session?.user ? (
        <ResourceReportModal resourceId={resource?.id!} />
      ) : (
        <Button
          className="w-auto h-6 md:h-8 text-black text-lg
                font-semibold bg-transparent  pr-2 pl-2 rounded-full  
                 hover:bg-slate-200 hover:text-black"
        >
          <IoFlagSharp
            className="w-6 h-6"
            onClick={() => setShowLogInAlert(true)}
          />
        </Button>
      )}
      <LogInAlertModal isOpen={showLogInAlert} setIsOpen={setShowLogInAlert} />
    </div>
  );
};

export default Actions;
