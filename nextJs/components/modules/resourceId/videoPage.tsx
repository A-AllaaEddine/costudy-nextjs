import ToolTip from '@/components/commun/static/ToolTip';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Suspense } from 'react';
import { IoMdCloudDownload } from 'react-icons/io';
import { IoBookmark, IoStar, IoThumbsUpSharp } from 'react-icons/io5';
import Actions from './actions';
import { Resource } from '@/types/types';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const VideoPage = ({ resource }: { resource: Resource }) => {
  const {
    data: reviewData,
    isFetching: isFetchingReviews,
    isError: isErrorFetchingReviews,
    refetch: refetchReviewsCount,
  } = trpc.reviews.count.get.useQuery({
    id: resource?.id!,
  });

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
        // Toast('error', 'There was an error getting user bookmarks.');
      },
    }
  );

  return (
    <div
      className="md:w-5/6 lg:w-4/5 h-full flex flex-col justify-start items-center 
        pl-3 pr-3 md:pl-8 md:pr-8 lg:pl-12 lg:pr-12 mb-8"
    >
      <Suspense
        fallback={
          <div className="w-full h-auto aspect-video">
            <Image
              src={resource?.thumbnail.url || '/resource-img.png'}
              alt="Thumbnail"
              width={100}
              height={100}
              quality={100}
            />
          </div>
        }
      >
        <ReactPlayer
          width={'100%'}
          height={'auto'}
          controls={true}
          style={{
            aspectRatio: '16/9',
          }}
          url={resource?.video?.url}
        />
      </Suspense>
      <div className="w-full h-8 flex flex-row gap-2 mt-4">
        {/* <ToolTip tooltip="Downloads">
          <Badge
            variant="secondary"
            className="flex gap-1 w-auto h-6 md:h-8
        text-sm sm:text-md"
          >
            20
            <IoMdCloudDownload className="w-3 h-3 sm:w-4 sm:h-4" />
          </Badge>
        </ToolTip> */}
        <ToolTip tooltip="Rating">
          <Badge
            variant="secondary"
            className="flex gap-1 w-auto h-6 md:h-8
              text-sm sm:text-md"
          >
            {isFetchingReviews ? 0 : reviewData?.rating}
            {isErrorFetchingReviews && 0}
            <IoStar className="w-3 h-3 sm:w-4 sm:h-4" />
          </Badge>
        </ToolTip>
        <ToolTip tooltip="Recommendation">
          <Badge
            variant="secondary"
            className="flex gap-1 w-auto h-6 md:h-8
          text-sm sm:text-md"
          >
            {isFetchingReviews ? 0 : reviewData?.recommendation}
            {isErrorFetchingReviews && 0}%
            <IoThumbsUpSharp className="w-3 h-3 sm:w-4 sm:h-4" />
          </Badge>
        </ToolTip>
        <ToolTip tooltip="Bookamrks">
          <Badge
            variant="secondary"
            className="flex gap-1 w-auto h-6 md:h-8
         text-sm sm:text-md"
          >
            {isFetchingBookmarkCount ? 0 : bookmarkCount}
            {isErrorFetchingBookmarkCount && 0}
            <IoBookmark className="w-3 h-3 sm:w-4 sm:h-4" />
          </Badge>
        </ToolTip>
      </div>
      <div
        className="w-full h-full flex flex-col md:flex-row justify-between items-start 
        md:items-center mt-2"
      >
        <div className="w-full overflow-hidden">
          <p
            className={`truncate font-bold text-lg md:text-2xl lg:text-4xl h-12`}
          >
            {resource?.title}
          </p>
        </div>
        <Actions
          resource={resource}
          refetchBookmarkCount={refetchBookmarkCount}
        />
      </div>

      <div
        className="flex flex-col justify-start items-start gap-4
      bg-slate-50 rounded-xl p-3 mt-4"
      >
        <p
          className="h-auto text-md md:text-lg lg:text-xl font-normal  whitespace-break-spaces
        "
        >
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
    </div>
  );
};

export default VideoPage;
