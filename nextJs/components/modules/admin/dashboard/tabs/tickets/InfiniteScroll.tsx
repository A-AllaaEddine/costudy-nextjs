import { trpc } from '@/utils/trpc';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Ticket } from '@/types/types';
import { IoMdMore } from 'react-icons/io';
import { IoTicket } from 'react-icons/io5';
import DeleteTicketModal from '../../modals/ticket/DeleteTicketModal';
import TicketDetailsModal from '../../modals/ticket/TicketDetails';
import TicketStatusModal from '../../modals/ticket/TicketStatusModal';

const TicketsInfiniteScroll = ({
  keyword,
  sort,
}: {
  keyword: string;
  sort: string;
}) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [reportId, setReportId] = useState<string>('');

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
  } = trpc.admin.tickets.getMany.useInfiniteQuery(
    {
      keyword: keyword,
      sort: sort,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );
  if (isError) {
    throw error;
  }

  const tickets: Ticket[] = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col justify-start items-center gap-4">
        {isFetching
          ? Array.from({ length: 4 }, (_, i) => i).map((__, idx) => {
              return (
                <div
                  key={idx}
                  className="w-full h-14 flex justify-between items-center
                      bg-slate-100 border-slate-100 bg-opacity-80  00 rounded-xl pr-2 pl-2 gap-3
                      hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-20"
                >
                  <div className="w-10 h-10 flex justify-center items-center">
                    <Skeleton className="min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full" />
                  </div>
                  <div className="w-full min-w-[7rem] ">
                    <Skeleton className="w-64 h-6 min-w-[7rem] " />
                  </div>
                  <Skeleton className="w-28 min-w-[7rem] h-6 flex justify-center items-center" />
                  <Skeleton className="w-28 min-w-[7rem]  h-6 flex justify-center items-center" />
                  <div className="w-28 h-full flex justify-center items-center gap-2" />{' '}
                </div>
              );
            })
          : tickets?.map((ticket: Ticket) => {
              return (
                <div
                  key={ticket?.id}
                  className="w-full h-14 flex justify-between items-center
                    bg-slate-100 bg-opacity-80  border-slate-500 rounded-xl pr-2 pl-2 gap-3
                    hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-20"
                >
                  <div className="w-10 h-10 flex justify-center items-center">
                    <div className=" min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full bg-slate-200 flex justify-center items-center">
                      <IoTicket className="w-3/5 h-3/5" />
                    </div>
                  </div>
                  <div className="w-full min-w-[7rem] flex justify-start items-center text-start text-md font-normal truncate">
                    {ticket?.subject}
                  </div>
                  <div
                    className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
                  >
                    <p
                      className={`w-auto h-auto text-md font-normal pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
                    >
                      {ticket?.tag}
                    </p>
                  </div>
                  <div
                    className={`w-28 min-w-[7rem]  h-full flex justify-center items-center
                   `}
                  >
                    <p
                      className={`w-auto h-8 text-md font-normal pr-2 pl-2 pt-1 pb-1 rounded-md
                    ${bgReport[ticket?.status]}`}
                    >
                      {ticket?.status}
                    </p>
                  </div>
                  <div className="w-28 h-full flex justify-center items-center gap-2">
                    <DropdownMenu modal={false}>
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
                            setIsDetailsModalOpen(true);
                            setReportId(ticket.id!);
                          }}
                        >
                          See Details
                        </DropdownMenuItem>{' '}
                        <DropdownMenuItem
                          className="hover:cursor-pointer font-semibold"
                          onClick={() => {
                            setIsStatusModalOpen(true);
                            setReportId(ticket.id!);
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
                            setReportId(ticket.id!);
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
        {!isFetching && !tickets?.length ? (
          <div className="h-32 w-full flex  flex-col justify-center  items-center">
            <p className="font-bold text-slate-400 md:text-xl">
              No ticket has been found
            </p>
          </div>
        ) : null}
      </div>
      <TicketStatusModal
        isOpen={isStatusModalOpen}
        setIsOpen={setIsStatusModalOpen}
        reportId={reportId}
        refetchReports={refetchReports}
      />
      <TicketDetailsModal
        isOpen={isDetailsModalOpen}
        setIsOpen={setIsDetailsModalOpen}
        reportId={reportId}
        refetchReports={refetchReports}
      />
      <DeleteTicketModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        reportId={reportId}
        refetchReports={refetchReports}
      />
    </>
  );
};
export default TicketsInfiniteScroll;

const bgReport = {
  Open: 'bg-green-300',
  Forwarded: 'bg-blue-300',
  Duplicate: 'bg-orange-300',
  Closed: 'bg-purple-300',
  Resolved: 'bg-green-300',
};
