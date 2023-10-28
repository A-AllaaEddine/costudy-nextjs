'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { usePathname, useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

const LogInAlertModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[90%] md:w-4/5 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-normal">
            You need to be logged in to continue.
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="submit"
            className="w-auto  text-white text-lg
                    font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                     hover:bg-[#8449BF] hover:text-black"
            onClick={() =>
              router.push(
                `/login${pathname !== '/' ? '?destination=' + pathname : null}`
              )
            }
          >
            Log in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogInAlertModal;
