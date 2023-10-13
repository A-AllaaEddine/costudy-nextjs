import CustomSelect from '@/components/commun/static/Select';
import PagesList from '../lists/PagesList';
import PagesGraph from '../graphs/PagesGraph';
import { useState } from 'react';

const Behavior = () => {
  const [selectedBehavior, setSelectedBehavior] = useState<string>('page');
  const [selectedRange, setSelectedRange] = useState<string>('today');

  const behaviorOptions = [
    { value: 'page', label: 'Page' },
    { value: 'landing page', label: 'Landing Page' },
  ];

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

  const onSelectBehavior = (behavior: string) => {
    setSelectedBehavior(behavior);
  };

  const onSelectRange = (range: string) => {
    setSelectedRange(range);
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
      gap-3 mt-5"
    >
      <div className="w-full h-10 flex justify-end items-center gap-3">
        <CustomSelect
          options={behaviorOptions}
          onChange={onSelectBehavior}
          contenClassName="h-auto"
          className="bg-white rounded-md"
        />
        <CustomSelect
          options={rangeOptions}
          onChange={onSelectRange}
          contenClassName="h-auto"
          value={selectedRange}
          className="bg-white rounded-md"
        />
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <PagesGraph behavior={selectedBehavior} range={selectedRange} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-start gap-3">
        <PagesList behavior={selectedBehavior} range={selectedRange} />
      </div>
    </div>
  );
};

export default Behavior;
