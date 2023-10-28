import { useState } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import GeoGraph from '../graphs/GeoGraph';
import { trpc } from '@/app/_trpc/client';

const Geographical = () => {
  const [selectedGeo, setSelectedGeo] = useState<string>('continent');
  const [selectedRange, setSelectedRange] = useState<string>('today');

  const geoOptions = [
    { value: 'continent', label: 'Continent' },
    { value: 'country', label: 'Country' },
    { value: 'city', label: 'City' },
    { value: 'language', label: 'Language' },
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

  const onSelectGeo = (geo: string) => {
    setSelectedGeo(geo);
  };

  const onSelectRange = (range: string) => {
    setSelectedRange(range);
  };

  // const { data } = trpc.admin.events.page.geo.single.useInfiniteQuery(
  //   {
  //     geo: selectedGeo,
  //     range: selectedRange,
  //   },
  //   {
  //     getNextPageParam: (lastPage) => lastPage.nextPage,
  //   }
  // );
  // console.log(data);

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
      gap-3 mt-5"
    >
      <div className="w-full h-10 flex justify-end items-center gap-3">
        <CustomSelect
          options={geoOptions}
          onChange={onSelectGeo}
          contenClassName="h-auto"
          className="rounded-md bg-white"
        />
        <CustomSelect
          options={rangeOptions}
          onChange={onSelectRange}
          contenClassName="h-auto"
          value={selectedRange}
          className="rounded-md bg-white"
        />
      </div>
      <div className="w-full h-full flex justify-center items-center">
        <GeoGraph geo={selectedGeo} range={selectedRange} />
      </div>
      <div className="w-full h-full flex flex-row justify-center items-start gap-3">
        {/* <PagesList behavior={selectedBehavior} range={selectedRange} /> */}
      </div>
    </div>
  );
};
export default Geographical;
