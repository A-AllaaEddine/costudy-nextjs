import Spinner from '@/components/commun/static/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

const TechsGraph = ({ range, type }: { range: string; type: string }) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => {
        return (
          <div
            className="w-full p-1
            flex justify-center items-center"
          >
            <p className="text-sm  font-sans">Something went wrong...</p>
            <p
              className="text-sm ml-2 mr-2 underline hover:text-[#b571f8]
                  hover:cursor-pointer font-bold"
              onClick={() => resetErrorBoundary()}
            >
              Retry
            </p>
          </div>
        );
      }}
    >
      <Content range={range} type={type} />
    </ErrorBoundary>
  );
};

export default TechsGraph;

const Content = ({ range, type }: { range: string; type: string }) => {
  const {
    data: growth,
    isFetching,
    isError,
    error,
  } = getTrpcHandler(type, range);

  if (isError) {
    throw error;
  }

  return (
    <>
      {isFetching ? (
        <Skeleton className="h-[450px] w-full rounded-lg" />
      ) : (
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            width={100}
            height={100}
            data={growth!}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={true}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={true}
              axisLine={true}
            />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#b571f8"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="red"
              // activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

const getTrpcHandler = (type: string, range: string) => {
  switch (type) {
    case 'operating system':
      return trpc.admin.events.page.tech.os.growth.useQuery({
        range: range,
      });
    case 'browser':
      return trpc.admin.events.page.tech.browser.growth.useQuery({
        range: range,
      });
    // return trpc.admin.events.page.tech.browser.growth
    case 'screen resolution':
      return trpc.admin.events.page.tech.screenSize.growth.useQuery({
        range: range,
      });
    // return trpc.admin.events.page.tech.screen.growth
    case 'device':
      return trpc.admin.events.page.tech.device.growth.useQuery({
        range: range,
      });
    default:
      return trpc.admin.events.page.tech.os.growth.useQuery({
        range: range,
      });
  }
};
