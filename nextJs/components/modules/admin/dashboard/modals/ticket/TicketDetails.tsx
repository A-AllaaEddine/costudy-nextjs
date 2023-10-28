import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/app/_trpc/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { ErrorBoundary } from 'react-error-boundary';

const TicketDetailsModal = ({
  ticketId,
  refetchTickets,
  isOpen,
  setIsOpen,
}: {
  ticketId: string;
  refetchTickets?: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg">Ticket Details</DialogTitle>
          <DialogDescription className="text-sm sm:text-md">
            See the full ticket details.
          </DialogDescription>
        </DialogHeader>
        <ErrorBoundary
          FallbackComponent={({ error, resetErrorBoundary }) => {
            return (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-sm  font-sans">Something went wrong...</p>
                <p
                  className="text-sm ml-2 mr-2 underline hover:text-[#8449BF]
                  hover:cursor-pointer font-bold"
                  onClick={() => resetErrorBoundary()}
                >
                  Retry
                </p>
              </div>
            );
          }}
        >
          <Content ticketId={ticketId} />
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDetailsModal;

const Content = ({ ticketId }: { ticketId: string }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [details, setDetails] = useState<any>({});

  const { data, isLoading, isError, error } = trpc.admin.tickets.get.useQuery(
    {
      id: ticketId,
    },
    {
      enabled: isEnabled,
    }
  );

  if (isError) {
    throw error;
  }

  useEffect(() => {
    if (data) {
      setDetails(data);
    }
  }, [data]);

  useEffect(() => {
    setIsEnabled(true);
    return () => {
      setIsEnabled(false);
    };
  }, []);
  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-2">
      <Label className="text-md font-semibold">Email</Label>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : (
        <Input
          placeholder="Type"
          value={details?.email!}
          type="text"
          className="w-full  h-10 text-black-txt text-xs md:text-sm font-semibold"
        />
      )}
      <Label className="text-md font-semibold">Subject</Label>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : (
        <Input
          placeholder="Type"
          value={details?.subject!}
          type="text"
          className="w-full  h-10 text-black-txt text-xs md:text-sm font-semibold"
        />
      )}
      <Label className="text-md font-semibold">Message</Label>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : (
        <Textarea
          placeholder="Reason"
          value={details?.message!}
          rows={5}
          className="w-full resize-none  text-black-txt text-xs md:text-sm font-semibold"
          readOnly
        />
      )}
      <Label className="text-md font-semibold">Tag</Label>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : (
        <Input
          placeholder="Tag"
          value={details?.tag!}
          type="text"
          className="w-full  h-10 text-black-txt text-xs md:text-sm font-semibold"
        />
      )}
      <Label className="text-md font-semibold">Status</Label>
      {isLoading ? (
        <Skeleton className="w-full h-10 rounded-md" />
      ) : (
        <p
          className={` ${
            bgReport[details?.status as string]
          } text-md py-1 px-2 rounded-md`}
        >
          {details?.status}
        </p>
      )}
    </div>
  );
};

const bgReport: Record<string, string> = {
  Open: 'bg-green-300',
  Forwarded: 'bg-blue-300',
  Duplicate: 'bg-orange-300',
  Closed: 'bg-purple-300',
  Resolved: 'bg-green-300',
};
