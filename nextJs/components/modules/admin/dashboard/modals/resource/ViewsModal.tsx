import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Resource } from '@/types/types';

const ViewsModal = ({
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
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const { data: growth, isLoading } = trpc.admin.events.views.growth.useQuery({
    id: resource?.id!,
  });
  const yearOptions = [
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
  ];
  const onSelectYear = (year: string) => {
    setSelectedYear(parseInt(year));
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
              options={yearOptions}
              onChange={onSelectYear}
              className="bg-white rounded-md"
              contenClassName="h-auto"
            />
          </div>
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner className="text-[#8449BF] w-10 h-10" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
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
            </ResponsiveContainer>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-col justify-center item gap-2"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewsModal;
