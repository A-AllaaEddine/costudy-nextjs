import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { AiFillFilePdf } from 'react-icons/ai';
import { ImUsers } from 'react-icons/im';
import UsersGrowthGraph from '../graphs/UsersGrowthGraph';
import { Skeleton } from '@/components/ui/skeleton';

const OverView = () => {
  const {
    data: usersCount,
    isLoading: isFetchingUserCount,
    isError,
    error,
  } = trpc.admin.users.count.useQuery();

  const {
    data: resourcesCount,
    isLoading: isFetchingResourcesCount,
    isError: IsErrorFetchingResourcesCount,
    error: errorFetchingResourcesCount,
  } = trpc.admin.resources.count.useQuery();

  const {
    data: lastest,
    isLoading: isFetchingLatestUsers,
    isError: isErrorFetchingLatestUsers,
    error: errorFetchingLatestUsers,
  } = trpc.admin.users.getLast.useQuery();

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
    gap-3"
    >
      <div className="w-full h-auto flex justify-start items-start gap-3">
        <Card className="w-full h-auto p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold font-sans">
              Total Users
            </CardTitle>
            <ImUsers />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {isFetchingUserCount ? (
                <Skeleton className="w-12 h-5" />
              ) : (
                usersCount?.currentUsersTotal
              )}
            </div>
            {isFetchingUserCount ? (
              <Skeleton className="w-32 mt-1 h-4" />
            ) : (
              <p className="text-xs text-muted-foreground">
                {usersCount?.growth! > 0 ? `+` : '-'} {usersCount?.growth}% from
                last month
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="w-full h-auto p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold font-sans">
              Total Resources
            </CardTitle>
            <AiFillFilePdf />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {isFetchingResourcesCount ? (
                <Skeleton className="w-12 h-5" />
              ) : (
                resourcesCount?.currentResourcesTotal
              )}
            </div>
            {isFetchingResourcesCount ? (
              <Skeleton className="w-32 mt-1 h-4" />
            ) : (
              <p className="text-xs text-muted-foreground">
                {resourcesCount?.growth! > 0 ? `+` : '-'}{' '}
                {resourcesCount?.growth}% from last month
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="w-full h-[500px] flex justify-center items-center gap-5">
        <div
          className="w-4/6 h-full border-[1px] border-slate-300 rounded-xl p-6
                flex flex-col justify-center items-start gap-5"
        >
          <p className="text-xl text-slate-500 font-bold">Users</p>
          <UsersGrowthGraph />
        </div>
        <Card className="w-2/6 h-[500px] ">
          <CardHeader className="flex flex-col items-start justify-center space-y-0 pb-2">
            <div className="w-full h-auto flex justify-between items-start">
              <CardTitle className="text-md font-bold">Recent Users</CardTitle>
              <ImUsers />
            </div>
            {isFetchingLatestUsers ? (
              <Skeleton className="w-48 mt-1 h-4" />
            ) : (
              <CardDescription className="text-sm">
                {lastest?.monthUsers} users joined this month.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent
            className="flex flex-col justify-start items-center gap-1
            overflow-y-hidden"
          >
            {isFetchingLatestUsers
              ? Array.from({ length: 8 }, (_, i) => i).map((__, idx) => {
                  return (
                    <div
                      key={idx}
                      className="w-full h-12 flex justify-start items-center gap-2"
                    >
                      <div className="w-14 flex justify-center items-center ">
                        <Skeleton className="w-10 h-10 rounded-full" />
                      </div>
                      <div className="w-full">
                        <Skeleton className="w-32 mt-1 h-4" />
                        <Skeleton className="w-48 mt-1 h-4" />
                      </div>
                    </div>
                  );
                })
              : lastest?.lastestUsers?.map((user: User) => {
                  return (
                    <div
                      key={user?.id}
                      className="w-full h-12 flex justify-start items-center gap-2
                      overflow-hidden"
                    >
                      <div
                        className="w-14 min-w-[3rem] flex justify-center items-center
                      overflow-hidden "
                      >
                        <Avatar className="w-4/5 h-4/5 rounded-3xl">
                          <AvatarImage src={'https://github.com/shadcn.png'} />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="w-full">
                        <p className="text-md text-black truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverView;
