import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Resource } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';
import { IoBookmark, IoBookmarkOutline, IoEye } from 'react-icons/io5';
import Toast from './Toast';
import { Button } from '@/components/ui/button';

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

  const { data: viewCount, isFetching: isFetchingViewCount } =
    trpc.views.count.get.useQuery(
      {
        id: resource?.id,
      },
      {
        onError: (error: any) => {
          console.log(error);
          // Toast('error', 'There was an error getting user bookmarks.');
        },
      }
    );
  const {
    data: bookmarkCount,
    isFetching: isFetchingBookmarkCount,
    refetch: refetchBookmarkCount,
  } = trpc.bookmarks.count.get.useQuery(
    {
      id: resource?.id,
    },
    {
      onError: (error: any) => {
        console.log(error);
        // Toast('error', 'There was an error getting user bookmarks.');
      },
    }
  );

  const { mutateAsync: add, isLoading: isAddingToBookmarks } =
    trpc.bookmarks.add.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
      },
      onError: (error: any) => {
        console.log(error);
        Toast(
          'error',
          'There was an error adding the resource to your bookmarks.'
        );
      },
    });
  const { mutateAsync: remove, isLoading: isRemovingFromBookmarks } =
    trpc.bookmarks.remove.useMutation({
      onSuccess: () => {
        refetchBookmarkCount();
      },
      onError: (error: any) => {
        console.log(error);
        Toast(
          'error',
          'There was an error removing the resource from your bookmarks.'
        );
      },
    });

  useEffect(() => {
    if (userBookmarks && Array.isArray(userBookmarks)) {
      const found = userBookmarks?.find((bkmrk) => bkmrk === resource?.id);
      setIsBookmarked(found ? true : false);
    }
  }, [userBookmarks]);

  const badgeType = {
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
      Toast('warning', 'You must be logged in to add to your favorites.');
      return;
    }
    try {
      await add({
        id: resource?.id,
        class: resource?.class,
        degree: resource?.degree,
        major: resource?.major,
        year: resource?.year,
      });
      setIsBookmarked(true);
      Toast('success', 'Resource has been added successfully.');
    } catch (error: any) {
      console.log(error);
    }
  };
  const removeFromBookmarks = async () => {
    try {
      await remove({ id: resource?.id });
      setIsBookmarked(false);
      Toast('success', 'Resource has been removed successfully.');
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[93%] sm:w-4/5">
        <DialogHeader>
          <Image
            src={resource?.thumbnailUrl}
            alt="resource"
            width={100}
            height={100}
            quality={100}
            unoptimized
            className="w-auto h-56 rounded-xl mt-6 aspect-auto"
          />
          <DialogTitle
            className={` w-full h-12  overflow-hidden  text-2xl font-bold`}
          >
            <p
              className={`${
                resource?.title?.length > 23 &&
                'whitespace-nowrap animate-scrolling'
              }`}
            >
              {resource?.title}
            </p>
          </DialogTitle>
          <div className="h-6 flex justify-between items-center">
            <div className="w-auto h-6 flex gap-1">
              {badgeType[resource?.type]}
              <Badge variant="secondary" className="flex gap-1">
                {isFetchingViewCount ? 0 : viewCount}
                <IoEye />
              </Badge>
              <Badge variant="secondary" className="flex gap-1">
                {isFetchingBookmarkCount ? 0 : bookmarkCount}
                <IoBookmark />
              </Badge>
            </div>
            <div className="w-auto h-6 flex gap-1">
              {isBoomarked ? (
                <IoBookmark
                  className="h-8 w-8 hover:cursor-pointer hover:bg-slate-100 rounded-full p-1"
                  onClick={removeFromBookmarks}
                />
              ) : (
                <IoBookmarkOutline
                  className="h-8 w-8 hover:cursor-pointer hover:bg-slate-100 rounded-full p-1"
                  onClick={addToBookmarks}
                />
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col justify-start items-start gap-5">
          <p className="text-sm font-normal h-24 truncate whitespace-break-spaces">
            Whether you're a tech enthusiast, a computer science student, or
            just curious about the inner workings of your gadgets, this video is
            a must-watch! 🤓 Don't miss out on unraveling the mysteries of
            Processor Architecture. Hit that like button and subscribe to stay
            updated on our tech explorations! 🚀🔥
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
          <p className="w-full h-8 flex justify-end text-sm gap-1">
            By <span className="font-semibold"> {resource?.by}</span>
          </p>
          <Button
            className="w-auto h10  text-white text-lg
                font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                 hover:bg-[#8449BF] hover:text-black"
            onClick={() =>
              router.push(`/${resource?.type?.toLowerCase()}/${resource?.id}}`)
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
