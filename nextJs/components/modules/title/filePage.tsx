'use client';

import { trpc } from '@/app/_trpc/client';
import { addDownload } from '@/components/commun/analytics/EventTrigger';
import ToolTip from '@/components/commun/static/ToolTip';
import Spinner from '@/components/commun/static/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Resource } from '@/types/types';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { IoMdCloudDownload } from 'react-icons/io';
import { IoBookmark, IoStar, IoThumbsUpSharp } from 'react-icons/io5';
import Actions from './actions';
import { Skeleton } from '@/components/ui/skeleton';

const PdfViewer = dynamic(() => import('@/components/modules/title/sample'), {
  ssr: false,
});

const FilePage = ({ resource }: { resource: Resource }) => {
  const router = useRouter();

  const {
    data: reviewData,
    isFetching: isFetchingReviews,
    isError: isErrorFetchingReviews,
    refetch: refetchReviewsData,
  } = trpc.reviews.count.get.useQuery(
    {
      id: resource?.id!,
    },
    {
      refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
    }
  );

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
      refetchOnWindowFocus: false,
    }
  );

  const { isLoadingDownloadEvent, addDownloadEvent } = addDownload({
    userId: resource?.id!,
    refetch: refetchDownloadCount,
  });

  const downloadFile = async () => {
    try {
      await addDownloadEvent();
      router.push(resource?.file?.url!);
    } catch (error: any) {
      console.log(error);
      toast.error('There was an error while getting the file from the server.');
    }
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
    <div
      className="w-full  lg:w-4/5 h-full flex flex-col justify-start md:justify-center
       items-center md:items-start pt-8
          pl-3 pr-3 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 mb-8 gap-2 md:gap-5 "
    >
      <div className="w-full  h-full  sm:h-1/2 bg-gray-100 rounded-xl">
        <div
          className="w-full h-full max-h-[500px] border border-slate-200
        rounded-lg lg:aspect-square relative"
        >
          <PdfViewer url={resource?.file?.url!} />
          <p
            className="w-auto h-7 px-2  font-semibold bg-[#FF6584] rounded-lg
            text-white absolute bottom-5 left-5"
          >
            {resource?.type.toUpperCase()}
          </p>
        </div>
      </div>
      <div className="w-full h-full flex flex-col justify-start items-start gap-2 md:gap-4">
        <div
          className="w-full h-12 flex-1 flex flex-col md:flex-row justify-between items-start 
            md:items-center  bg-gray-100 rounded-xl p-3"
        >
          <div className="w-full overflow-hidden">
            <p
              className={`truncate font-bold text-lg md:text-2xl lg:text-3xl h-12`}
            >
              {resource?.title}
            </p>
          </div>
        </div>
        <div
          className="flex-1 w-full h-full flex flex-col justify-start items-start gap-4
         rounded-xl p-3 mt-4 bg-gray-100 overflow-hidden"
        >
          <p className="h-auto w-full text-sm md:text-md lg:text-lg font-normal  whitespace-break-spaces truncate">
            {resource?.description}
          </p>
          <div className="w-full">
            <p
              className={`${
                resource?.class?.length > 30
                  ? `  whitespace-nowrap animate-scrolling`
                  : ''
              } text-md md:text-lg`}
            >
              Class <span className="font-semibold">{resource?.class}</span>
            </p>
            <p
              className={`${
                resource?.major?.length > 31
                  ? `  whitespace-nowrap animate-scrolling`
                  : ''
              } text-md md:text-lg`}
            >
              Major <span className="font-semibold">{resource?.major}</span>
            </p>
            <p className="text-md md:text-lg">
              Degree <span className="font-semibold">{resource?.degree}</span>
            </p>
            <p className="text-md md:text-lg">
              Year <span className="font-semibold">{resource?.year}</span>
            </p>
          </div>
          <p className="w-full h-8 flex justify-end text-md md:text-lg gap-1">
            By <span className="font-semibold z"> {resource?.by}</span>
          </p>
        </div>
        <div className="w-full h-8 flex flex-row gap-2 mt-4">
          <ToolTip
            tooltip="Downloads"
            children={
              <>
                {isFetchingDownloadCount ? (
                  <Skeleton className="w-12 h-6 md:h-8 rounded-full" />
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex gap-1 w-auto h-6 md:h-8
                text-sm sm:text-md"
                  >
                    {formatNumber(downloadCount!)}
                    {isErrorDownloadCount && 0}
                    <IoMdCloudDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Badge>
                )}
              </>
            }
          />
          <ToolTip
            tooltip="Rating"
            children={
              <>
                {isFetchingReviews ? (
                  <Skeleton className="w-12 h-6 md:h-8 rounded-full" />
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex gap-1 w-auto h-6 md:h-8
                  text-sm sm:text-md"
                  >
                    {reviewData?.rating}
                    {isErrorFetchingReviews && 0}
                    <IoStar className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Badge>
                )}
              </>
            }
          />
          <ToolTip
            tooltip="Recommendation"
            children={
              <>
                {isFetchingReviews ? (
                  <Skeleton className="w-12 h-6 md:h-8 rounded-full" />
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex gap-1 w-auto h-6 md:h-8
                  text-sm sm:text-md"
                  >
                    {reviewData?.recommendation}
                    {isErrorFetchingReviews && 0}%
                    <IoThumbsUpSharp className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Badge>
                )}
              </>
            }
          />
          <ToolTip
            tooltip="Bookamrks"
            children={
              <>
                {isFetchingBookmarkCount ? (
                  <Skeleton className="w-12 h-6 md:h-8 rounded-full" />
                ) : (
                  <Badge
                    variant="secondary"
                    className="flex gap-1 w-auto h-6 md:h-8
                  text-sm sm:text-md"
                  >
                    {formatNumber(bookmarkCount!)}
                    {isErrorFetchingBookmarkCount && 0}
                    <IoBookmark className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Badge>
                )}
              </>
            }
          />
        </div>
        <div className="w-full h-12 flex flex-row justify-between items-center">
          <Button
            className="w-auto h-10  text-white text-lg
            font-semibold bg-[#FF6584] pr-4 pl-4 rounded-full  
             hover:bg-[#FF6584] hover:text-black flex justify-center items-center gap-2"
            type="submit"
            onClick={downloadFile}
          >
            {isLoadingDownloadEvent ? (
              <>
                <Spinner className="text-white h-5 w-5" />
                <p className="font-semibold text-sm">Downloading...</p>
              </>
            ) : (
              'Download'
            )}
          </Button>
          <Actions
            resource={resource}
            refetchBookmarkCount={refetchBookmarkCount}
            refetchReviewsData={refetchReviewsData}
          />
        </div>
      </div>
    </div>
  );
};

export default FilePage;
