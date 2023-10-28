import CustomSelect from '@/components/commun/static/Select';
import { useState } from 'react';
import TechsGraph from '../graphs/TechsGraph';
import TechsList from '../lists/TechsList';

const Technology = () => {
  const [selectedTech, setSelectedTech] = useState<string>('operating system');
  const [selectedRange, setSelectedRange] = useState<string>('today');

  const techOptions = [
    { value: 'operating system', label: 'Operating System' },
    { value: 'browser', label: 'Browser' },
    { value: 'screen resolution', label: 'Screen Resolution' },
    { value: 'device', label: 'Device' },
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

  const onSelectTech = (tech: string) => {
    setSelectedTech(tech);
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
          options={techOptions}
          onChange={onSelectTech}
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
        <TechsGraph range={selectedRange} type={selectedTech} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-start gap-3">
        <TechsList type={selectedTech} range={selectedRange} />
      </div>
    </div>
  );
};

export default Technology;
