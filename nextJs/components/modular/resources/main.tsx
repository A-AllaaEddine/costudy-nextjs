import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useResources from '@/hooks/useReources';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import ResourceCard from '../../commun/static/ResourceCard';
import { trpc } from '@/utils/trpc';
import { Resource } from '@/types/types';
import { useSession } from 'next-auth/react';
import Toast from '@/components/commun/static/Toast';

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

const Main = () => {
  const [hookData, setHookData] = useState({
    page: 1,
    keyword: '',
    major: '',
    degree: '',
    year: '',
  });

  const router = useRouter();
  const { data: session } = useSession();

  const { page, keyword, major, degree, year } = hookData;

  useEffect(() => {
    if (router.isReady) {
      setHookData((prev) => {
        return { ...prev, page: 1 };
      });
    }
  }, [router]);

  const { data: userBookmarks, isLoading: isFetchingBookmarks } =
    trpc.bookmarks.get.useQuery();

  const {
    data: resources,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
  } = trpc.resources.page.get.useInfiniteQuery(
    { page: page, keyword, major, degree, year },

    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const data = resources?.pages.reduce((acc: Resource[], page) => {
    return [...acc, ...page.data];
  }, []);

  const intObserver = useRef<IntersectionObserver | null>();
  const lastDocRef = useCallback(
    (doc: Element | null) => {
      if (isFetching || isFetchingNextPage) return;

      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((doc) => {
        if (doc[0].isIntersecting && hasNextPage) {
          // console.log('We are near the last post!');

          fetchNextPage();
        }
      });
      if (doc) intObserver.current.observe(doc);
    },
    [isFetching, isFetchingNextPage, hasNextPage]
  );

  const content = data?.map((resource: Resource, i: number) => {
    if (data.length >= 9) {
      return (
        <ResourceCard
          key={i}
          resource={resource}
          ref={data.length === i + 1 ? lastDocRef : null}
          userBookmarks={userBookmarks}
        />
      );
    } else {
      return (
        <ResourceCard
          key={i}
          resource={resource}
          userBookmarks={userBookmarks}
        />
      );
    }
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
    pl-3 pr-3 md:pl-8 md:pr-8"
    >
      <div
        className="w-full h-auto sm:h-14 flex flex-row justify-start items-center
         bg-opacity-70 "
      >
        <div className="w-auto h-full flex flex-wrap justify-start items-center gap-2 ">
          <Select onValueChange={onSelectMajor}>
            <SelectTrigger
              className="h-8 w-36 truncate pl-4 pr-4 text-black font-semibold  border-none bg-[#C8ADE4] bg-opacity-50 drop-shadow-none shadow-none
              rounded-full
  "
            >
              <SelectValue
                className="text-black"
                placeholder={majorOptions[0].label}
              />
            </SelectTrigger>
            <SelectContent className="h-56 ">
              {majorOptions.map((major, idx) => {
                return (
                  <SelectItem
                    key={idx}
                    className={`w-full h-10 text-sm font-semibold
                    hover:bg-[#C8ADE4]  hover:cursor-pointer `}
                    value={major.value}
                  >
                    {major.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>{' '}
          <Select onValueChange={onSelectDegree}>
            <SelectTrigger
              className="h-8 w-36 truncate pl-4 pr-4 text-black font-semibold  border-none bg-[#C8ADE4] bg-opacity-50 drop-shadow-none shadow-none
              rounded-full
  "
            >
              <SelectValue
                className="text-black"
                placeholder={majorOptions[0].label}
              />
            </SelectTrigger>
            <SelectContent className="h-56 ">
              {degreeOptions.map((major, idx) => {
                return (
                  <SelectItem
                    key={idx}
                    className={`w-full h-10 text-sm font-semibold
                    hover:bg-[#C8ADE4]  hover:cursor-pointer `}
                    value={major.value}
                  >
                    {major.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select onValueChange={onSelectYear}>
            <SelectTrigger
              className="h-8 w-36 truncate pl-4 pr-4 text-black font-semibold  border-none bg-[#C8ADE4] bg-opacity-50 drop-shadow-none shadow-none
              rounded-full
  "
            >
              <SelectValue
                className="text-black"
                placeholder={yearOptions[0].label}
              />
            </SelectTrigger>
            <SelectContent className="h-56 ">
              {yearOptions.map((year, idx) => {
                return (
                  <SelectItem
                    key={idx}
                    className={`w-full h-10 text-sm font-semibold
                    hover:bg-[#C8ADE4]  hover:cursor-pointer `}
                    value={year.value}
                  >
                    {year.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className="w-full h-full flex flex-wrap justify-center sm:justify-start item gap-4 mt-6
         pb-12"
      >
        {content}
        {isFetching && (
          <div
            style={{
              width: '100%',
              height: 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <Spinner bgColor="#fafafa" width="100px" height="100px" /> */}
            <p>Loading...</p>
          </div>
        )}{' '}
        {isFetchingNextPage && (
          <div
            style={{
              width: '100%',
              height: 500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* <Spinner bgColor="#fafafa" width="100px" height="100px" /> */}
            <p>Loading...</p>
          </div>
        )}
        {(!isFetching || !isFetchingNextPage) &&
          !content?.length &&
          !isError && (
            <div className="h-full w-full flex  flex-col justify-start pt-64 items-center">
              <p className="font-bold text-slate-400 md:text-2xl lg:text-4xl">
                No user has been found
              </p>
            </div>
          )}
        {isError && (
          <p className="font-bold text-slate-400 md:text-2xl lg:text-4xl">
            Error: {error.message}
          </p>
        )}
      </div>
    </div>
  );
};
export default Main;
