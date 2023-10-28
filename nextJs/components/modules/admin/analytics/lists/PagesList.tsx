import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/app/_trpc/client';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { ErrorBoundary } from 'react-error-boundary';
import { MdOutlineOpenInNew } from 'react-icons/md';

const PagesList = ({
  range,
  behavior,
}: {
  range: string;
  behavior: string;
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => {
        return (
          <div
            className="w-full p-1
            flex justify-center items-center"
          >
            <p className="text-sm  font-sans">Something went wrong...</p>
            <p
              className="text-sm ml-2 mr-2 underline hover:text-[#FF8A20]
                  hover:cursor-pointer font-bold"
              onClick={() => resetErrorBoundary()}
            >
              Retry
            </p>
          </div>
        );
      }}
    >
      <Content range={range} behavior={behavior} />
    </ErrorBoundary>
  );
};

export default PagesList;

const Content = ({ range, behavior }: { range: string; behavior: string }) => {
  const { data, isFetching, isError, error } =
    trpc.admin.events.page.views.single.useInfiniteQuery(
      {
        range: range,
        behavior: behavior,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );
  const pages = {
    pagesViews: data?.pages.map((page) => page.pagesViews)[0],
    totalViews: data?.pages[0].totalViews,
  };

  if (isError) {
    throw error;
  }
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-4">
      {isFetching ? (
        Array.from({ length: 4 }, (_, i) => i).map((__, idx) => {
          return (
            <div
              className="w-full h-auto flex  justify-center items-start p-2
            bg-slate-00 border-slate-100 bg-opacity-80  00 rounded-xl  hover:cursor-pointer hover:bg-slate-400 hover:bg-opacity-20"
            >
              <div className="w-full h-8  flex justify-between items-center">
                <Skeleton className="min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full" />
                <div className="w-auto h-6 flex justify-center items-center gap-3">
                  <Skeleton className="min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full" />
                  <Skeleton className="min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full" />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <>
          <div className="w-full h-auto flex  justify-center items-start p-2">
            <div className="w-full h-8  flex justify-between items-center">
              <p className="text-black text-md">Total</p>
              <div className="w-auto h-6 flex justify-center items-center gap-3">
                <p className="  text-black text-md">{pages?.totalViews!}</p>
                <p className="w-16  text-end">100 %</p>
              </div>
            </div>
          </div>
          <Separator />
          {pages.pagesViews.length ? (
            pages?.pagesViews?.map((view: any) => {
              return (
                <div
                  key={view.page}
                  className="w-full h-auto flex flex-col justify-center items-start
                      rounded-md border border-slate-200 p-3"
                >
                  <div className="w-full h-8 flex justify-between items-center">
                    <div className="w-full h-full flex justify-start items-center gap-2">
                      <p className="text-black text-md">{view.page}</p>

                      <Link
                        href={`${process.env.NEXT_PUBLIC_BASEURL}${view.page}`}
                        target="_blank"
                      >
                        <MdOutlineOpenInNew className="w-5 h-5 text-black hover:cursor-pointer" />
                      </Link>
                    </div>
                    <div className="w-auto h-8 flex justify-center items-center gap-3">
                      <p className="  text-black text-md">{view.count!}</p>
                      <p className="w-16 00 text-end">
                        {((view?.count! / pages?.totalViews!) * 100).toFixed(1)}{' '}
                        %
                      </p>
                    </div>
                  </div>
                  <Progress
                    className="h-3 w-full"
                    value={parseInt(
                      ((view?.count! / pages?.totalViews!) * 100).toFixed(0)
                    )}
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full h-auto min-h-[10rem] flex  justify-center items-center p-2">
              <p className="text-md">No data</p>
            </div>
          )}
        </>
      )}
      {!isFetching && !data?.pages.length ? (
        <div className="h-32 w-full flex  flex-col justify-center  items-center">
          <p className="font-bold text-slate-400 md:text-xl">
            No user has been found
          </p>
        </div>
      ) : null}
    </div>
  );
};
