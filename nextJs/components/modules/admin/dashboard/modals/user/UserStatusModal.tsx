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
import { Dispatch, SetStateAction, useState } from 'react';

import CustomSelect from '@/components/commun/static/Select';
import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';

const StatusModal = ({
  userId,
  refetchUsers,
  isOpen,
  setIsOpen,
}: {
  userId: string;
  refetchUsers?: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('active');
  const {
    mutateAsync: updateUserInfo,
    isLoading,
    isError,
    error,
  } = trpc.admin.user.update.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });

  const changesStatu = async () => {
    try {
      await updateUserInfo({ id: userId, accountStatus: selectedStatus });
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

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'banned', label: 'Banned' },
  ];

  const onStatusSelect = (status: string) => {
    setSelectedStatus(status);
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
            onClick={changesStatu}
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

export default StatusModal;
