import { trpc } from '@/app/_trpc/client';
import { serverClient } from '@/app/_trpc/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import { ImUsers } from 'react-icons/im';
import ErrorCard from './ErrorCard';

const ResourcesCountCard = () => {
  return (
    <ErrorCard>
      <Suspense fallback={<LoadingSekeleton />}>
        <Content />
      </Suspense>
    </ErrorCard>
  );
};

export default ResourcesCountCard;

const Content = async () => {
  const resourcesCount = await serverClient.admin.resources.count();

  return (
    <Card className="w-1/2 h-32 p-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold font-sans">
          Total Resources
        </CardTitle>
        <ImUsers />
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">
          {resourcesCount?.currentResourcesTotal}
        </div>

        <p className="text-xs text-muted-foreground">
          {resourcesCount?.growth! > 0 ? `+` : '-'} {resourcesCount?.growth}%
          from last month
        </p>
      </CardContent>
    </Card>
  );
};

const LoadingSekeleton = () => {
  return (
    <Card className="w-1/2 h-32 p-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold font-sans">
          Total Resources
        </CardTitle>
        <ImUsers />
      </CardHeader>
      <CardContent>
        <Skeleton className="w-12 h-5" />
        <Skeleton className="w-32 mt-1 h-4" />
      </CardContent>
    </Card>
  );
};
