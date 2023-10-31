'use client';

import { trpc } from '@/app/_trpc/client';
import { columns } from '@/components/modules/admin/dashboard/tables/ResourcesColumns';
import { ResourcesTable } from '@/components/modules/admin/dashboard/tables/ResourcesTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';

const Main = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
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
      keyword: keyword,
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
        <div className="w-full flex items-center py-4 gap-2">
          <Input
            placeholder="Filter users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
          <Button
            className="hover:bg-[#8449BF]"
            onClick={() => setKeyword(filter)}
          >
            Filter
          </Button>
        </div>
        {isLoading ? (
          <Skeleton className="w-full h-[500px]" />
        ) : (
          <ResourcesTable
            columns={columns}
            data={resources}
            refetchResources={refetchResources}
            isFetching={isFetching}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Main;
