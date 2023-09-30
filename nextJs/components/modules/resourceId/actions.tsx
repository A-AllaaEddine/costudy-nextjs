import LogInAlertModal from '@/components/commun/modals/LogInAlertModal';
import Toast from '@/components/commun/static/Toast';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoCodeReview } from 'react-icons/go';
import { IoBookmark, IoBookmarkOutline, IoFlagSharp } from 'react-icons/io5';
import ResourceRatingModal from './resource/ResourceRatingModal';
import ResourceShareModal from './resource/ResourceShareModal';
import ResourceReportModal from './resource/ResourceReportModal';

const Actions = ({
  resource,
  refetchBookmarkCount,
}: {
  resource: Resource;
  refetchBookmarkCount?: any;
}) => {
  const [showLogInAlert, setShowLogInAlert] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const { data: session } = useSession();

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const {
    data: userBookmarks,
    isLoading: isFetchingBookmarks,
    refetch: refechUserBookmarks,
  } = trpc.bookmarks.get.useQuery();

  const { mutateAsync: add, isLoading: isAddingToBookmarks } =
    trpc.bookmarks.add.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
        refechUserBookmarks();
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
      },
      onError: (error: any) => {
        console.log(error);
      },
    });

  const addToBookmarks = async () => {
    if (!session?.user) {
      setShowLogInAlert(true);
      // Toast('warning', 'You must be logged in to add to your favorites.');
      return;
    }
    try {
      await add({
        id: resource?.id!,
        class: resource?.class,
        degree: resource?.degree,
        major: resource?.major,
        year: resource?.year,
      });
      // setIsBookmarked(true);
      Toast('success', 'Resource has been added successfully.');
    } catch (error: any) {
      console.log(error);
      if (error.message === 'Bookmark exists already.') {
        Toast('error', 'You have already Bookmarked this resource.');
        return;
      }
      Toast(
        'error',
        'There was an error adding the resource to your bookmarks.'
      );
    }
  };

  const removeFromBookmarks = async () => {
    try {
      await remove({ id: resource?.id! });
      Toast('success', 'Resource has been removed successfully.');
    } catch (error: any) {
      console.log(error);
      Toast(
        'error',
        'There was an error adding the resource to your bookmarks.'
      );
    }
  };

  return (
    <div className="w-auto h-6 md:h-10 flex flex-row items-center p-2 gap-1 ">
      {session?.user?.id ? (
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

      {session?.user?.id ? (
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
