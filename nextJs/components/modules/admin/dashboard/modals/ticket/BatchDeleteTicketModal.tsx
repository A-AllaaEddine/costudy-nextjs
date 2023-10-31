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
import { Dispatch, SetStateAction } from 'react';

import Spinner from '@/components/commun/static/spinner';
import toast from 'react-hot-toast';

const BatchDeleteTicketModal = ({
  ticketsIds,
  refetchTickets,
  isOpen,
  setIsOpen,
}: {
  ticketsIds: string[];
  refetchTickets: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    mutateAsync: deleteTicket,
    isLoading,
    isError,
    error,
  } = trpc.admin.tickets.batch.delete.useMutation({
    onSuccess: () => {
      refetchTickets();
    },
  });

  const deleteReportFunc = async () => {
    // delete account logic
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await deleteTicket({ ticketsIds: ticketsIds });
          if (isError) {
            throw error;
          }

          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Deleting...',
        success: () => {
          setIsOpen(false);
          return 'Deleted.';
        },
        error: () => {
          return 'There was an error deleting the ticket.';
        },
      }
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md">
            Are you sure absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-md">
            This action cannot be undone. This will permanently delete the
            ticket and remove its data from the servers.
          </DialogDescription>
        </DialogHeader>
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
            bg-[#ff4336] text-black sm:text-md text-sm hover:bg-[#ff4336] hover:text-white"
            onClick={deleteReportFunc}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner className="text-white h-6 w-6" />
                <p className="font-semibold">Deleting...</p>
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchDeleteTicketModal;
