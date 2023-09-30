import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { SyntheticEvent, useState } from 'react';
import { columns } from '../table/UsersColumns';
import { UsersTable } from '../table/UsersTable';

const Users = () => {
  const [filter, setFilter] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  const filterResult = (e: SyntheticEvent) => {
    e.preventDefault();
    setKeyword(filter);
  };

  const {
    data,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchUsers,
  } = trpc.admin.users.get.useInfiniteQuery(
    {
      keyword: keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const users = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
        gap-3"
    >
      {isFetching ? (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16">
            <Spinner className="text-[#FAFAFA] h-20 w-20" />
          </div>
        </div>
      ) : (
        <UsersTable
          columns={columns}
          data={users}
          refetchUsers={refetchUsers}
        />
      )}
    </div>
  );
};

export default Users;
