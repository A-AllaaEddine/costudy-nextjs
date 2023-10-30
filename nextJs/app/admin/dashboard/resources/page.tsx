'use client';

import { trpc } from '@/app/_trpc/client';
import { columns } from '@/components/modules/admin/dashboard/tables/ResourcesColumns';
import { ResourcesTable } from '@/components/modules/admin/dashboard/tables/ResourcesTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Resource } from '@/types/types';
import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';

const badgeType: Record<any, any> = {
  pdf: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFilePdf className="w-4/5 h-4/5" />
    </div>
  ),
  ppt: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFilePpt className="w-4/5 h-4/5" />
    </div>
  ),
  docx: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFileWord className="w-4/5 h-4/5" />
    </div>
  ),
  video: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillVideoCamera className="w-4/5 h-4/5" />
    </div>
  ),
};

const Resources = () => {
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchResources,
  } = trpc.admin.resources.get.useInfiniteQuery(
    {
      keyword: '',
      sort: '',
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  );

  if (isError) {
    throw error;
  }

  const resources = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <Card
      className=" w-full h-full flex flex-col justify-start items-start gap-4  pt-8 pb-8 
          pl-3 pr-3 "
    >
      <CardHeader className="h-8 flex justify-center items-center">
        <CardTitle className="flex justify-center w-full text-lg font-bold">
          Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col justify-start items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-[500px]" />
        ) : (
          <ResourcesTable
            columns={columns}
            data={resources}
            refetchResources={refetchResources}
            isFetching={isFetching}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Resources;
