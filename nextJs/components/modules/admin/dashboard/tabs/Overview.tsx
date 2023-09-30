import { AiFillFilePdf } from 'react-icons/ai';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImUsers } from 'react-icons/im';
import UsersGrowthGraph from '../graphs/UsersGrowthGraph';
import { trpc } from '@/utils/trpc';
import { User } from '@/types/types';

const OverView = () => {
  const {
    data: usersCount,
    isLoading,
    isError,
    error,
  } = trpc.admin.users.count.useQuery();

  const {
    data: resourcesCount,
    isLoading: isLoadingResourcesCount,
    isError: IsErrorFetchingResourcesCount,
    error: errorFetchingResourcesCount,
  } = trpc.admin.resources.count.useQuery();

  const {
    data: lastest,
    isLoading: isLoasingLatestUsers,
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <ImUsers />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersCount?.currentUsersTotal}
            </div>
            <p className="text-xs text-muted-foreground">
              {usersCount?.growth! > 0 ? `+` : '-'} {usersCount?.growth}% from
              last month
            </p>
          </CardContent>
        </Card>
        <Card className="w-full h-auto p-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Resources
            </CardTitle>
            <AiFillFilePdf />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resourcesCount?.currentResourcesTotal}
            </div>
            <p className="text-xs text-muted-foreground">
              {resourcesCount?.growth! > 0 ? `+` : '-'} {resourcesCount?.growth}
              % from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="w-full h-[500px] flex justify-center items-center gap-5">
        <div
          className="w-4/6 h-full border-[1px] border-slate-300 rounded-xl p-3
                flex flex-col justify-center items-start gap-5"
        >
          <p className="text-xl text-slate-500 font-bold">Users</p>
          <UsersGrowthGraph />
        </div>
        <Card className="w-2/6 h-[500px] ">
          <CardHeader className="flex flex-col items-start justify-center space-y-0 pb-2">
            <div className="w-full h-auto flex justify-between items-start">
              <CardTitle className="text-md font-medium">
                Recent Users
              </CardTitle>
              <ImUsers />
            </div>
            <CardDescription className="text-sm">
              {lastest?.monthUsers} users joined this month.
            </CardDescription>
          </CardHeader>
          <CardContent
            className="flex flex-col justify-start items-center gap-1
            overflow-y-hidden"
          >
            {lastest?.lastestUsers?.map((user: User) => {
              return (
                <div className="w-full h-12" key={user?.id}>
                  <div className="w-full h-12 flex justify-start items-center gap-2">
                    <div className="w-14 flex justify-center items-center ">
                      <Avatar className="w-4/5 h-4/5 rounded-3xl">
                        <AvatarImage src={'https://github.com/shadcn.png'} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="w-full">
                      <p className="text-md text-black truncate">{user.name}</p>
                      <p className="text-sm text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
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
