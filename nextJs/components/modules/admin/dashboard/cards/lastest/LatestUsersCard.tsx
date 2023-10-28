import { serverClient } from '@/app/_trpc/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/types/types';
import { Suspense } from 'react';
import { ImUsers } from 'react-icons/im';
import ErrorCard from './ErrorCard';

const LatestUsersCard = () => {
  return (
    <ErrorCard>
      <Suspense fallback={<LoadingSekeleton />}>
        <Content />
      </Suspense>
    </ErrorCard>
  );
};

export default LatestUsersCard;

const Content = async () => {
  const lastest = await serverClient.admin.users.getLast();

  await new Promise((resolve) => {
    setTimeout(resolve, 3000);
  });
  return (
    <Card className="w-2/6 h-[500px] ">
      <CardHeader className="flex flex-col items-start justify-center space-y-0 pb-2">
        <div className="w-full h-auto flex justify-between items-start">
          <CardTitle className="text-md font-bold">Recent Users</CardTitle>
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
                <p className="text-md text-black truncate">{user.name}</p>
                <p className="text-sm text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const LoadingSekeleton = () => {
  return (
    <Card className="w-1/2 h-auto p-1">
      <CardHeader className="flex flex-col items-start justify-center space-y-0 pb-2">
        <div className="w-full h-auto flex justify-between items-start">
          <CardTitle className="text-md font-bold">Recent Users</CardTitle>
          <ImUsers />
        </div>

        <CardDescription className="text-sm">
          <Skeleton className="w-32 mt-1 h-4" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Array.from({ length: 8 }, (_, i) => i).map((__, idx) => {
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
        })}
      </CardContent>
    </Card>
  );
};
