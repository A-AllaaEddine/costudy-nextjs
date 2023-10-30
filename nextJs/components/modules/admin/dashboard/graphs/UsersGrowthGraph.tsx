'use client';

import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';

const UsersGrowthGraph = () => {
  const [selectedRange, setSelectedRange] = useState<string>('today');

  const { data: growth, isLoading } = trpc.admin.users.growth.useQuery(
    {
      range: selectedRange,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const rangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last-week', label: 'Last Week' },
    { value: 'last-month', label: 'Last 30 days' },
    { value: 'current-month', label: 'Current Month' },
    { value: 'previous-month', label: 'Previous Month' },
    { value: 'current-year', label: 'Current Year' },
    { value: 'previous-year', label: 'Previous Year' },
  ];
  const onSelectRange = (range: string) => {
    setSelectedRange(range);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="w-full h-auto flex justify-end items-center">
        <CustomSelect
          options={rangeOptions}
          onChange={onSelectRange}
          className="bg-white rounded-md"
          contenClassName="h-auto font-normal"
        />
      </div>
      <ResponsiveContainer width="100%" height={350}>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Skeleton className="w-full h-full" />
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
    </div>
  );
};

export default UsersGrowthGraph;
