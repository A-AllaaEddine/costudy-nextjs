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
import { Dispatch, SetStateAction } from 'react';

import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Resource } from '@/types/types';

const DeleteResourceModal = ({
  resource,
  refetchResources,
  isOpen,
  setIsOpen,
}: {
  resource: Resource;
  refetchResources?: any;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    mutateAsync: deleteResource,
    isLoading,
    isError,
    error,
  } = trpc.admin.resource.delete.useMutation({
    onSuccess: () => {
      refetchResources();
    },
  });

  const deleteResourceFunc = async () => {
    // delete account logic
    try {
      await deleteResource({ id: resource.id! });
      if (isError) {
        throw error;
      }

      Toast('success', 'The resource has been deleted successfully.');
    } catch (error: any) {
      console.log(error);
      Toast('error', 'There was an error deleting the resource.');
    }
    setIsOpen(false);
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
            resource and remove its data from the servers.
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
            onClick={deleteResourceFunc}
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

export default DeleteResourceModal;
