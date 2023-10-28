'use client';

import { trpc } from '@/app/_trpc/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Resource } from '@/types/types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';
import { IoMdCloudDownload } from 'react-icons/io';
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5';

const ResourceModal = ({
  t,
  resource,
  isOpen = false,
  setIsOpen,
  userBookmarks,
}: {
  t?: any;
  resource: Resource;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userBookmarks: string[];
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isBoomarked, setIsBookmarked] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const {
    data: downloadCount,
    isFetching: isFetchingDownloadCount,
    isError: isErrorDownloadCount,
    refetch: refetchDownloadCount,
  } = trpc.events.downloads.count.get.useQuery(
    {
      id: resource?.id!,
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      enabled: isEnabled,
    }
  );
  const {
    data: bookmarkCount,
    isFetching: isFetchingBookmarkCount,
    isError: isErrorFetchingBookmarkCount,
    refetch: refetchBookmarkCount,
  } = trpc.bookmarks.count.get.useQuery(
    {
      id: resource?.id!,
    },
    {
      onError: (error: any) => {
        console.log(error);
      },
      enabled: isEnabled,
    }
  );

  useEffect(() => {
    if (isOpen) {
      setIsEnabled(true);
      refetchBookmarkCount();
      refetchDownloadCount();
    }
  }, [isOpen]);

  const { mutateAsync: add, isLoading: isAddingToBookmarks } =
    trpc.bookmarks.add.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });
  const { mutateAsync: remove, isLoading: isRemovingFromBookmarks } =
    trpc.bookmarks.remove.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
      },
      onError: (error: any) => {
        console.log(error);
      },
    });

  useEffect(() => {
    if (userBookmarks && Array.isArray(userBookmarks)) {
      const found = userBookmarks?.find((bkmrk) => bkmrk === resource?.id);
      setIsBookmarked(found ? true : false);
    }
  }, [userBookmarks]);

  const badgeType: Record<any, any> = {
    pdf: (
      <Badge variant="secondary" className="flex gap-1">
        PDF <AiFillFilePdf />
      </Badge>
    ),
    ppt: (
      <Badge variant="secondary" className="flex gap-1">
        PPT <AiFillFilePpt />
      </Badge>
    ),
    docx: (
      <Badge variant="secondary" className="flex gap-1">
        DOCX <AiFillFileWord />
      </Badge>
    ),
    video: (
      <Badge variant="secondary" className="flex gap-1">
        VIDEO <AiFillVideoCamera />
      </Badge>
    ),
  };

  const addToBookmarks = async () => {
    if (!session?.user) {
      toast.error('You must be logged in to add to your favorites.');
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
          setIsBookmarked(true);
          return 'Added to bookmarks';
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
          setIsBookmarked(false);
          return 'Removed from bookmarks';
        },
        error: () => {
          return 'There was an error removing the resource from your bookmarks.';
        },
      }
    );
  };

  const formatNumber = (number: number) => {
    if (number >= 1000 && number <= 999999) {
      return (number / 1000).toFixed(1) + 'K';
    } else if (number > 999999 && number <= 999999999) {
      return (number / 1000000).toFixed(2) + 'M';
    } else {
      return number?.toString();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[93%] sm:w-4/5 ">
        <DialogHeader className="h-auto">
          <Image
            src={resource?.thumbnail?.url || '/resource-img.png'}
            alt="resource"
            width={100}
            height={100}
            quality={100}
            unoptimized
            className="w-auto min-h-[200px]  rounded-xl mt-6 aspect-auto border-[1px] bg-slate-200 border-slate-200"
          />
          <DialogTitle
            className={`w-[250px] md:w-[400px] truncate whitespace-nowrap  h-12 text-start  overflow-hidden  text-lg  md:text-2xl font-bold 
                  `}
          >
            {resource?.title}
          </DialogTitle>
          <div className="h-6 flex justify-between items-center">
            <div className="w-auto h-6 flex gap-1">
              {badgeType[resource?.type]}
              {isFetchingDownloadCount ? (
                <Skeleton className="w-10 rounded-full" />
              ) : (
                <Badge variant="secondary" className="flex gap-1">
                  {formatNumber(downloadCount!)}
                  {isErrorDownloadCount && 0}
                  <IoMdCloudDownload />
                </Badge>
              )}
              {isFetchingBookmarkCount ? (
                <Skeleton className="w-10 rounded-full" />
              ) : (
                <Badge variant="secondary" className="flex gap-1">
                  {formatNumber(bookmarkCount!)}
                  {isErrorFetchingBookmarkCount && 0}
                  <IoBookmark />
                </Badge>
              )}
            </div>
            <div className="w-auto h-6 flex gap-1">
              {session?.user?.type !== 'admin' &&
                (isBoomarked ? (
                  <IoBookmark
                    className="h-8 w-8 hover:cursor-pointer hover:bg-slate-100 rounded-full p-1"
                    onClick={removeFromBookmarks}
                  />
                ) : (
                  <IoBookmarkOutline
                    className="h-8 w-8 hover:cursor-pointer hover:bg-slate-100 rounded-full p-1"
                    onClick={addToBookmarks}
                  />
                ))}
            </div>
          </div>
        </DialogHeader>
        <div className="w-full h-full  flex flex-col justify-start items-start gap-5 overflow-hidden">
          <p className="w-full max-h-[6rem] h-auto text-sm font-normal truncate whitespace-normal">
            {resource?.description}
          </p>
          <div>
            <p
              className={`${
                resource?.class?.length > 30
                  ? `  whitespace-nowrap animate-scrolling`
                  : ''
              } text-sm`}
            >
              Class <span className="font-semibold">{resource?.class}</span>
            </p>
            <p
              className={`${
                resource?.major?.length > 31
                  ? `text-md  whitespace-nowrap animate-scrolling`
                  : 'text-md'
              } text-sm`}
            >
              Major <span className="font-semibold">{resource?.major}</span>
            </p>
            <p className="text-sm">
              Degree <span className="font-semibold">{resource?.degree}</span>
            </p>
            <p className="text-sm">
              Year <span className="font-semibold">{resource?.year}</span>
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-col justify-center item gap-2">
          <p className="w-full h-10 flex justify-end text-sm gap-1">
            By <span className="font-semibold"> {resource?.by}</span>
          </p>
          <Button
            className="w-auto h-10  text-white text-lg
                font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                 hover:bg-[#8449BF] hover:text-black"
            onClick={() =>
              router.push(
                `/${resource?.type?.toLowerCase()}/${resource?.title
                  .replaceAll(/\s/g, '-')
                  .replaceAll(/\|/g, '_')}`
              )
            }
          >
            More details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
