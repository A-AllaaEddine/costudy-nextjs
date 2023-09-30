import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const UsersGrowthGraph = () => {
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const { data: growth, isLoading } = trpc.admin.users.growth.useQuery({
    year: selectedYear,
  });
  const yearOptions = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];
  const onSelectYear = (year: string) => {
    setSelectedYear(parseInt(year));
  };
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <div className="w-full h-auto flex justify-end items-center">
        <CustomSelect
          options={yearOptions}
          onChange={onSelectYear}
          className="bg-white rounded-md"
          contenClassName="h-auto"
        />
      </div>
      <ResponsiveContainer width="100%" height={350}>
        {isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner className="text-[#8449BF] w-10 h-10" />
          </div>
        ) : (
          <BarChart data={growth!}>
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
            <Bar dataKey="total" fill="#b571f8" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default UsersGrowthGraph;
