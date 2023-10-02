import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction, useEffect } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { Resource } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';

const DownloadsModal = ({
  t,
  isOpen = false,
  setIsOpen,
  resource,
}: {
  t?: any;
  resource: Resource;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedRange, setSelectedRange] = useState<string>('today');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  const {
    data: growth,
    isLoading,
    refetch,
  } = trpc.admin.events.downloads.growth.useQuery(
    {
      id: resource?.id!,
      range: selectedRange,
    },
    {
      enabled: isEnabled,
    }
  );

  useEffect(() => {
    if (isOpen) {
      refetch();
      setIsEnabled(true);
    }
  }, [isOpen]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[93%]  min-w-[500px]">
        <DialogHeader>
          <DialogTitle
            className={` w-full h-12  overflow-hidden  text-2xl font-bold`}
          >
            Views
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-400">
            Inspect all the views of this resource.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full flex flex-col justify-center items-center gap-5">
          <div className="w-full h-auto flex justify-end items-center">
            <CustomSelect
              options={rangeOptions}
              onChange={onSelectRange}
              className="bg-white rounded-md"
              contenClassName="h-auto"
            />
          </div>
          {isLoading ? (
            <Skeleton className="h-[350px] w-full rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
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
            </ResponsiveContainer>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-col justify-center item gap-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadsModal;
