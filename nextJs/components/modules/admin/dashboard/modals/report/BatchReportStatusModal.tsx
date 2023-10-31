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

const BatchReportStatusModal = ({
  reportsIds,
  refetchReports,
  isOpen,
  setIsOpen,
}: {
  reportsIds: string[];
  refetchReports?: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [reports, setReports] = useState<any>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Status');
  const [parentReport, setParentReport] = useState<string>('');
  const {
    mutateAsync: updateReportStatus,
    isLoading,
    isError,
    error,
  } = trpc.admin.reports.batch.update.useMutation({
    onSuccess: () => {
      refetchReports();
    },
  });

  const { data } = trpc.admin.reports.getParents.useQuery(undefined, {
    enabled: isEnabled,
  });

  useEffect(() => {
    if (data) {
      setReports(data);
    }
  }, [data]);

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
          await updateReportStatus({
            reportsIds: reportsIds,
            status: selectedStatus,
            // parent: parentReport,
          });
          if (isError) {
            throw error;
          }
          resolve(true);
        } catch (error: any) {
          reject(error.message);
        }
      }),
      {
        loading: 'Saving...',
        success: () => {
          setIsOpen(false);
          return 'Saved.';
        },
        error: () => {
          return 'There was an error saving the data.';
        },
      }
    );
  };

  useEffect(() => {
    return () => {
      setParentReport('');
      setSelectedStatus('Status');
      setIsEnabled(false);
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
    if (status === 'Duplicate') {
      setIsEnabled(true);
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

export default BatchReportStatusModal;
