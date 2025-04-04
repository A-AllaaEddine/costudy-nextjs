import { trpc } from '@/app/_trpc/client';
import ResourceCard from '@/components/commun/static/ResourceCard';
import CardSeleton from '@/components/commun/static/ResourceCardSkeleton';
import { Resource } from '@/types/types';

import { useCallback, useRef } from 'react';

const BookmarksInfinitScroll = ({
  hookData,
}: {
  hookData: {
    keyword: string;
    major: string;
    degree: string;
    year: string;
  };
}) => {
  const { data: userBookmarks, isLoading: isFetchingBookmarks } =
    trpc.bookmarks.get.useQuery();

  const {
    data: bookmarks,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchBookmarks,
  } = trpc.bookmarks.getInfinite.useInfiniteQuery(
    {
      keyword: hookData.keyword,
      major: hookData.major,
      degree: hookData.degree,
      year: hookData.year,
    },

    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
  const data = bookmarks?.pages.reduce((acc: any, page) => {
    return [...acc, ...page?.data.map((res) => res.resource)];
  }, []);

  const intObserver = useRef<IntersectionObserver | null>();
  const lastDocRef = useCallback(
    (doc: Element | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((doc) => {
        if (doc[0].isIntersecting && hasNextPage) {
          // console.log('We are near the last post!');

          fetchNextPage();
        }
      });
      if (doc) intObserver.current.observe(doc);
    },
    [isLoading, isFetchingNextPage, hasNextPage]
  );

  const content = data?.map((bookmark: Resource, i: number) => {
    if (data?.length >= 9) {
      return (
        <ResourceCard
          key={i}
          resource={bookmark}
          ref={data?.length === i + 1 ? lastDocRef : null}
          userBookmarks={userBookmarks}
        />
      );
    } else {
      return (
        <ResourceCard
          key={i}
          resource={bookmark}
          userBookmarks={userBookmarks}
        />
      );
    }
  });

  if (isError) {
    throw new Error(error.message);
  }

  return (
    <div
      className="w-full h-full flex flex-wrap justify-center sm:justify-start item gap-4 mt-6
         pb-12"
    >
      {content}
      {isLoading && (
        <>
          {Array.from({ length: 2 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton key={idx} />;
          })}
        </>
      )}
      {isFetchingNextPage && (
        <>
          {Array.from({ length: 2 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton />;
          })}
        </>
      )}
      {!isLoading && !isFetchingNextPage && !content?.length && (
        <div className="h-full w-full flex  flex-col justify-start pt-64 items-center">
          <p className="font-bold text-slate-400 md:text-2xl lg:text-4xl">
            No resource has been found
          </p>
        </div>
      )}
    </div>
  );
};

export default BookmarksInfinitScroll;
