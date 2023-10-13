import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Bar,
  BarChart,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const PagesGraph = ({
  behavior,
  range,
}: {
  behavior: string;
  range: string;
}) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => {
          return (
            <div className="w-full h-[350px] flex justify-center items-center">
              <p className="text-sm  font-sans">Something went wrong...</p>
              <p
                className="text-sm ml-2 mr-2 underline hover:text-[#8449BF]
                  hover:cursor-pointer font-bold"
                onClick={() => resetErrorBoundary()}
              >
                Retry
              </p>
            </div>
          );
        }}
      >
        <Content range={range} behavior={behavior} />
      </ErrorBoundary>
    </div>
  );
};

export default PagesGraph;

const Content = ({ range, behavior }: { range: string; behavior: string }) => {
  const {
    data: growth,
    isLoading,
    isError,
    error,
  } = trpc.admin.events.page.views.growth.useQuery({
    range: range,
    behavior: behavior,
  });

  if (isError) {
    throw error;
  }
  return (
    <ResponsiveContainer width="100%" height={450}>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner className="text-[#FAFAFA] h-20 w-20" />
        </div>
      ) : (
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
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};
