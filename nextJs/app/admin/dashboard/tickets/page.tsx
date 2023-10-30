'use client';

import { trpc } from '@/app/_trpc/client';
import { columns } from '@/components/modules/admin/dashboard/tables/TicketsColumns';
import { TicketsTable } from '@/components/modules/admin/dashboard/tables/TicketsTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useState } from 'react';

const Tickets = () => {
  const [keyword, setKeyword] = useState<string>('');

  const {
    data,
    fetchNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchTickets,
  } = trpc.admin.tickets.getMany.useInfiniteQuery(
    {
      keyword: keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    }
  );

  const tickets = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <Card
      className=" w-full h-full flex flex-col justify-start items-start gap-4  pt-8 pb-8 
          pl-3 pr-3 "
    >
      <CardHeader className="h-8 flex justify-center items-center">
        <CardTitle className="flex justify-center w-full text-lg font-bold">
          Tickets
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col justify-start items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-[500px]" />
        ) : (
          <TicketsTable
            columns={columns}
            data={tickets}
            refetchTickets={refetchTickets}
            isFetching={isFetching}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Tickets;
