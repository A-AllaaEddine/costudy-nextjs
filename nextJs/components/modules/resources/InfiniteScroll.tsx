'use client';

'use client';

import { trpc } from '@/app/_trpc/client';
import ResourceCard from '@/components/commun/static/ResourceCard';
import CardSeleton from '@/components/commun/static/ResourceCardSkeleton';
import { Resource } from '@/types/types';
import { useSession } from 'next-auth/react';

import { useCallback, useEffect, useRef, useState } from 'react';

const ResourcesInfinitScroll = ({
  hookData,
}: {
  hookData: {
    keyword: string;
    class: string;
    major: string;
    degree: string;
    year: string;
  };
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const { data: session } = useSession();

  const { data: userBookmarks, isLoading: isFetchingBookmarks } =
    trpc.bookmarks.get.useQuery(undefined, {
      enabled: isEnabled,
    });

  useEffect(() => {
    if (session?.user) {
      setIsEnabled(true);
    }
  }, [session]);

  const {
    data: resources,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  } = trpc.resources.page.get.useInfiniteQuery(
    {
      keyword: hookData.keyword,
      class: hookData.class,
      major: hookData.major,
      degree: hookData.degree,
      year: hookData.year,
    },

    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  );

  if (isError) {
    throw new Error(error.message);
  }

  const data = resources?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
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

  const content = data?.map((resource: Resource, i: number) => {
    if (data.length >= 9) {
      return (
        <ResourceCard
          key={resource.id}
          resource={resource}
          ref={data.length === i + 1 ? lastDocRef : null}
          userBookmarks={userBookmarks}
        />
      );
    } else {
      return (
        <ResourceCard
          key={resource.id}
          resource={resource}
          userBookmarks={userBookmarks}
        />
      );
    }
  });
  return (
    <div
      className="w-full h-full flex flex-wrap justify-center sm:justify-start item gap-4 mt-6
         pb-12"
    >
      {isLoading ? (
        <>
          {Array.from({ length: 8 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton key={idx} />;
          })}
        </>
      ) : (
        content
      )}
      {isFetchingNextPage && (
        <>
          {Array.from({ length: 2 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton key={idx} />;
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

export default ResourcesInfinitScroll;
