import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Report } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { SyntheticEvent, useState } from 'react';
import { AiFillBug, AiFillWarning } from 'react-icons/ai';
import { IoMdMore } from 'react-icons/io';
import DeleteReportModal from '../modals/report/DeleteReportModal';
import ReportStatusModal from '../modals/report/ReportStatusModal';

const Reports = () => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  const filterResult = (e: SyntheticEvent) => {
    e.preventDefault();
    setKeyword(filter);
  };

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchReports,
  } = trpc.admin.reports.get.useInfiniteQuery(
    {
      keyword: keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const reports: Report[] = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
        gap-3"
    >
      <div></div>
      {isFetching ? (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16">
            <Spinner className="text-[#8449BF] h-12 w-12" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-start items-center gap-5">
          <form
            onSubmit={filterResult}
            className="w-full h-12 flex justify-end items-center gap-3"
          >
            <Button
              className="w-auto h-8 bg-white border-slate-500 text-slate-500 border-[1px] rounded-md 
                  hover:bg-[#8449BF] hover:border-[#8449BF] hover:text-white"
              type="submit"
            >
              Filter
            </Button>
            <Input
              type="text"
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
              Reason
            </div>
            <div
              className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
            >
              <p
                className={`w-auto h-auto text-md font-bold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
              >
                Tag
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
                Status
              </p>
            </div>
            <div className="w-28 h-full flex justify-center items-center gap-2">
              <p className="text-md font-bold">Actions</p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center gap-4">
            {reports?.map((report: Report) => {
              return (
                <div
                  key={report?.id}
                  className="w-full h-14 flex justify-between items-center
                    bg-slate-100 bg-opacity-80  border-slate-500 rounded-xl pr-2 pl-2 gap-3
                    hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-20"
                >
                  <div className="w-10 h-10 flex justify-center items-center">
                    <div className=" min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full bg-slate-200 flex justify-center items-center">
                      {report.tag === 'bug' ? (
                        <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
                          <AiFillBug className="w-4/5 h-4/5" />
                        </div>
                      ) : (
                        <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
                          <AiFillWarning className="w-4/5 h-4/5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full min-w-[7rem] flex justify-start items-center text-start text-md font-semibold truncate">
                    {report?.reason}
                  </div>
                  <div
                    className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
                  >
                    <p
                      className={`w-auto h-auto text-md font-semibold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
                    >
                      {report?.tag}
                    </p>
                  </div>
                  <div
                    className={`w-28 min-w-[7rem]  h-full flex justify-center items-center
                   `}
                  >
                    <p
                      className={`w-auto h-8 text-md font-semibold pr-2 pl-2 pt-1 pb-1 rounded-md
                    ${bgReport[report?.status]}`}
                    >
                      {report?.status}
                    </p>
                  </div>
                  <div className="w-28 h-full flex justify-center items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IoMdMore className="h-6 w-6" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="hover:cursor-pointer font-semibold"
                          onClick={() => {
                            setIsStatusModalOpen(true);
                            setReportId(report.id!);
                          }}
                        >
                          Change status
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-md hover:cursor-pointer 
                        text-[#ff5e52] font-semibold sm:text-md text-sm hover:bg-[#ff5e52]
                        hover:text-white"
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setReportId(report.id!);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
          <ReportStatusModal
            isOpen={isStatusModalOpen}
            setIsOpen={setIsStatusModalOpen}
            reportId={reportId}
            refetchReports={refetchReports}
          />
          <DeleteReportModal
            isOpen={isDeleteModalOpen}
            setIsOpen={setIsDeleteModalOpen}
            reportId={reportId}
            refetchReports={refetchReports}
          />
        </div>
      )}
    </div>
  );
};

export default Reports;

const bgReport = {
  New: 'bg-yellow-300',
  Assigned: 'bg-purple-300',
  'In Progress': 'bg-purple-300',
  Resolved: 'bg-green-300',
  Closed: 'bg-purple-300',
  Reopened: 'bg-purple-300',
  Deferred: 'bg-purple-300',
  Duplicate: 'bg-orange-300',
};
