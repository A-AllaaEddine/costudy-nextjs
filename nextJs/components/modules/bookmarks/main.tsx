import CustomSelect from '@/components/commun/static/Select';
import { Resource } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import ResourceCard from '../../commun/static/ResourceCard';

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

  const router = useRouter();
  const { data: session } = useSession();

  const { keyword, major, degree, year } = hookData;

  const { data: userBookmarks, isLoading: isFetchingBookmarks } =
    trpc.bookmarks.get.useQuery();

  const {
    data: bookmarks,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchBookmarks,
  } = trpc.bookmarks.getInfinite.useInfiniteQuery(
    { keyword, major, degree, year },

    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
  const data = bookmarks?.pages.reduce((acc: any, page) => {
    return [...acc, ...page?.data.map((res) => res.resource)];
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

  const content = data?.map((bookmark: Resource, i: number) => {
    if (data?.length >= 9) {
      return (
        <ResourceCard
          key={i}
          resource={bookmark}
          ref={data?.length === i + 1 ? lastDocRef : null}
          userBookmarks={userBookmarks}
        />
      );
    } else {
      return (
        <ResourceCard
          key={i}
          resource={bookmark}
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
    pl-3 pr-3 md:pl-8 md:pr-8 "
    >
      <div
        className="w-full h-auto sm:h-14 flex flex-row justify-between items-center
           bg-opacity-70"
      >
        <div className="w-auto h-full flex flex-wrap justify-start items-center gap-2 ">
          <CustomSelect options={majorOptions} onChange={onSelectMajor} />
          <CustomSelect options={degreeOptions} onChange={onSelectDegree} />
          <CustomSelect options={yearOptions} onChange={onSelectYear} />
        </div>
      </div>
      <div
        className="w-full h-full flex flex-wrap justify-center sm:justify-start item gap-4   mt-6
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
