'use client';
import CustomSelect from '@/components/commun/static/Select';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import BookmarksInfinitScroll from './InfiniteScroll';

const majorOptions = [
  { value: 'All Majors', label: 'All Majors' },
  {
    value: 'Computer Science and Technology',
    label: 'Computer Science and Technology',
  },
  {
    value: 'Science and Technology',
    label: 'Science and Technology',
  },
];
const degreeOptions = [
  { value: 'All Degrees', label: 'All Degrees' },
  {
    value: 'Bachelor',
    label: 'Bachelor',
  },
  {
    value: 'Master',
    label: 'Master',
  },
  {
    value: 'Phd',
    label: 'Phd',
  },
];
const yearOptions = [
  { value: 'All Years', label: 'All Years' },
  {
    value: '1st',
    label: '1st',
  },
  {
    value: '2nd',
    label: '2nd',
  },
  {
    value: '3rd',
    label: '3rd',
  },
  {
    value: '4th',
    label: '4th',
  },
];

type HookData = {
  keyword: string;
  major: string;
  degree: string;
  year: string;
};
const Main = () => {
  const [hookData, setHookData] = useState<HookData>({
    keyword: '',
    major: '',
    degree: '',
    year: '',
  });

  const onSelectMajor = (selectedMajor: string) => {
    if (selectedMajor === 'All Majors') {
      setHookData((prev) => {
        return { ...prev, major: '', page: 1 };
      });
    } else {
      setHookData((prev) => {
        return { ...prev, major: selectedMajor, page: 1 };
      });
    }
  };
  const onSelectDegree = (selectedDegree: string) => {
    if (selectedDegree === 'All Degrees') {
      setHookData((prev) => {
        return { ...prev, degree: '', page: 1 };
      });
    } else {
      setHookData((prev) => {
        return { ...prev, degree: selectedDegree, page: 1 };
      });
    }
  };
  const onSelectYear = (selecetdYear: string) => {
    if (selecetdYear === 'All Years') {
      setHookData((prev) => {
        return { ...prev, year: '', page: 1 };
      });
    } else {
      setHookData((prev) => {
        return { ...prev, year: selecetdYear, page: 1 };
      });
    }
  };

  return (
    <div
      className=" w-full h-full flex flex-col justify-start items-center
    pl-3 pr-3 md:pl-8 md:pr-8 "
    >
      <div
        className="w-full h-auto sm:h-14 flex flex-row justify-between items-center
           bg-opacity-70"
      >
        <div className="w-auto h-full flex flex-wrap justify-start items-center gap-2 ">
          <CustomSelect
            options={majorOptions}
            onChange={onSelectMajor}
            contenClassName="h-auto max-h-[14rem]"
          />
          <CustomSelect
            options={degreeOptions}
            onChange={onSelectDegree}
            contenClassName="h-auto max-h-[14rem]"
          />
          <CustomSelect
            options={yearOptions}
            onChange={onSelectYear}
            contenClassName="h-auto max-h-[14rem]"
          />
        </div>
      </div>
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => {
          return (
            <div className="w-full flex justify-center items-center h-72 pl-2 pr-2 md:pl-8 md:pr-8  mt-12  mb-12">
              <p className="text-md  font-sans">Something went wrong...</p>
              <p
                className="text-md ml-2 mr-2 underline hover:text-[#8449BF]
                  hover:cursor-pointer font-bold"
                onClick={() => resetErrorBoundary()}
              >
                Retry
              </p>
            </div>
          );
        }}
      >
        <BookmarksInfinitScroll hookData={hookData} />
      </ErrorBoundary>
    </div>
  );
};
export default Main;
