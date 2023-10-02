import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { SyntheticEvent, useState } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import { ErrorBoundary } from 'react-error-boundary';
import ResourcesInfinitScroll from './InfiniteScroll';

const Resources = () => {
  const [sort, setSort] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  const filterResult = (e: SyntheticEvent) => {
    e.preventDefault();
    setKeyword(filter);
  };

  const sortOptions = [
    { value: 'All', label: 'All' },
    { value: 'downloads', label: 'Downloads' },
    { value: 'iews', label: 'Views' },
  ];

  const onSelectSort = (sort: string) => {
    if (sort === 'All') {
      setSort('');
    } else {
      setSort(sort);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
        gap-3"
    >
      <div className="w-full h-full flex flex-col justify-start items-center gap-5">
        <form
          onSubmit={filterResult}
          className="w-full h-12 flex justify-end items-center gap-3"
        >
          <CustomSelect
            options={sortOptions}
            onChange={onSelectSort}
            value={sort}
            className="rounded-lg bg-white"
            contenClassName="h-auto  max-h-[14rem]"
          />
          <Button
            className="w-auto h-8 bg-white border-slate-500 text-slate-500 border-[1px] rounded-md 
                  hover:bg-[#8449BF] hover:border-[#8449BF] hover:text-white"
            type="submit"
          >
            Filter
          </Button>
          <Input
            type="search"
            name="keyword"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-2/5 h-8"
          />
        </form>
        <div
          className="w-full h-14 flex justify-between items-center
                      border-slate-500 rounded-xl pr-2 pl-2 gap-3
                    "
        >
          <div className="w-10 h-10 flex justify-center items-center">
            <div className=" min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5  flex justify-center items-center"></div>
          </div>
          <div className="w-full min-w-[7rem] flex justify-start items-center text-start text-md font-bold truncate">
            Title
          </div>
          <div
            className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
          >
            <p
              className={`w-auto h-auto text-md font-bold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
            >
              Views
            </p>
          </div>
          <div
            className={`w-28 min-w-[7rem]  h-full flex justify-center items-center
                   `}
          >
            <p
              className={`w-auto h-8 text-md font-bold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
            >
              Downloads
            </p>
          </div>
          <div className="w-28 h-full flex justify-center items-center gap-2">
            <p className="text-md font-bold">Actions</p>
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
          <ResourcesInfinitScroll keyword={keyword} sort={sort} />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default Resources;
