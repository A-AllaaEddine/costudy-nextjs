import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import Spinner from '../static/spinner';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

const DeleteModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    mutateAsync: deleteUser,
    isLoading,
    isError,
    error,
  } = trpc.user.delete.useMutation();

  const deleteAccount = async () => {
    // delete account logic
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await deleteUser();
          if (isError) {
            throw error;
          }
          await signOut({
            callbackUrl: '/',
          });
          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Deleting...',
        success: () => {
          setIsOpen(false);
          return 'Account deleted.';
        },
        error: () => {
          return 'There was an error deleting your account.';
        },
      }
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-3/5 sm:w-4/5 max-w-[300px] h-10 flex justify-center items-center
            bg-[#ff5e52] text-black sm:text-md text-sm hover:bg-[#ff5e52] hover:text-white"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md">
            Are you sure absolutely sure?
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-md">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
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
            onClick={deleteAccount}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner className="text-[#1D1d1F] h-6 w-6" />
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

export default DeleteModal;
