import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/app/_trpc/client';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Spinner from '@/components/commun/static/spinner';
import toast from 'react-hot-toast';

const TicketStatusModal = ({
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
  const [selectedStatus, setSelectedStatus] = useState<string>('Status');
  const [parentReport, setParentReport] = useState<string>('');
  const {
    mutateAsync: updateTicketStatus,
    isLoading,
    isError,
    error,
  } = trpc.admin.tickets.update.useMutation({
    onSuccess: () => {
      refetchTickets();
    },
  });

  const changesStatus = async () => {
    if (selectedStatus === 'Status') {
      toast.error('Please select a status.');
      return;
    }
    if (selectedStatus === 'Duplicate' && !parentReport?.length) {
      toast.error('Please select a parent report.');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateTicketStatus({
            id: ticketId,
            status: selectedStatus,
          });
          if (isError) {
            throw error;
          }
          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Saving...',
        success: () => {
          setIsOpen(false);
          return 'Status changed.';
        },
        error: () => {
          console.log(error);
          return 'There was an error saving the status.';
        },
      }
    );
  };

  useEffect(() => {
    return () => {
      setParentReport('');
      setSelectedStatus('Status');
    };
  }, []);

  const statusOptions = [
    { value: 'Status', label: 'Status' },
    { value: 'Open', label: 'Open' },
    { value: 'Forwarded', label: 'Forwarded' },
    { value: 'Duplicate', label: 'Duplicate' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Resolved', label: 'Resolved' },
  ];

  const onStatusSelect = (status: string) => {
    if (status === 'Status') {
      setSelectedStatus('Status');
      return;
    }
    setSelectedStatus(status);
  };

  const onParentReportSelect = (parent: string) => {
    if (parent === 'Report') {
      setParentReport('Report');
      return;
    }
    setParentReport(parent);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md">Change Status</DialogTitle>
          <DialogDescription className="text-sm sm:text-md">
            Change the user's account status.
          </DialogDescription>
        </DialogHeader>
        <CustomSelect
          onChange={onStatusSelect}
          options={statusOptions}
          className="bg-white rounded-md h-10"
          contenClassName="h-auto"
          value={parentReport || statusOptions[0].label}
        />
        <DialogFooter className="gap-2">
          <Button
            className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px]"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="w-auto h-10 flex justify-center items-center gap-2
            bg-black text-white sm:text-md text-sm hover:bg-[#8449BF] hover:text-white"
            onClick={changesStatus}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner className="text-white h-6 w-6" />
                <p className="font-semibold">Deleting...</p>
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketStatusModal;
