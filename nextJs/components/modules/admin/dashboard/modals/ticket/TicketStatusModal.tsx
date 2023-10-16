import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { trpc } from '@/utils/trpc';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';

const TicketStatusModal = ({
  reportId,
  refetchReports,
  isOpen,
  setIsOpen,
}: {
  reportId: string;
  refetchReports?: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('Status');
  const [parentReport, setParentReport] = useState<string>('');
  const {
    mutateAsync: updateReportStatus,
    isLoading,
    isError,
    error,
  } = trpc.admin.tickets.update.useMutation({
    onSuccess: () => {
      refetchReports();
    },
  });

  const changesStatus = async () => {
    if (selectedStatus === 'Status') {
      Toast('error', 'Please select a status.');
      return;
    }
    if (selectedStatus === 'Duplicate' && !parentReport?.length) {
      Toast('error', 'Please select a parent report.');
      return;
    }
    try {
      await updateReportStatus({
        id: reportId,
        status: selectedStatus,
      });
      if (isError) {
        throw error;
      }

      Toast('success', 'User account status has been updated successfully.');
    } catch (error: any) {
      console.log(error);
      Toast('error', 'There was an error updating the user account status.');
    }
    setIsOpen(false);
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
