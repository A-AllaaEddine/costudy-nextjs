'use client';

import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UsersTable } from '../tables/UsersTable';
import { columns } from '../tables/UsersColumns';

const Main = () => {
  const [keyword, setKeyword] = useState<string>('');

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    hasPreviousPage,
    isError,
    error,
    refetch: refetchUsers,
  } = trpc.admin.users.get.useInfiniteQuery(
    {
      keyword: keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
      keepPreviousData: false,
    }
  );

  console.log('data: ', data);
  console.log('hasNextPage: ', hasNextPage);
  console.log('hasPreviousPage: ', hasPreviousPage);
  // const users = data?.pages.reduce((acc: any, page) => {
  //   return [...acc, ...page.data];
  // }, []);

  const users = data?.pages[data.pages.length - 1].data;

  return (
    <Card
      className=" w-full h-full flex flex-col justify-start items-start gap-4  pt-8 pb-8 
            pl-3 pr-3 "
    >
      <CardHeader className="h-8 flex justify-center items-center">
        <CardTitle className="flex justify-center w-full text-lg font-bold">
          Users
        </CardTitle>
      </CardHeader>
      <CardContent className="w-full flex flex-col justify-start items-center gap-4">
        {isLoading ? (
          <Skeleton className="w-full h-[500px]" />
        ) : (
          <UsersTable
            columns={columns}
            data={users!}
            refetchUsers={refetchUsers}
            isFetching={isFetching}
            fetchNextPage={fetchNextPage}
            fetchPreviousPage={fetchPreviousPage}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Main;
