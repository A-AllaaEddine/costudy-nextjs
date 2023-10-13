import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';

const LogInAlertModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
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
                    font-semibold bg-[#FF8A20] pr-4 pl-4 rounded-md  
                     hover:bg-[#FF8A20] hover:text-black"
            onClick={() =>
              router.push({
                pathname: '/login',
                query: {
                  destination: encodeURIComponent(router.asPath),
                },
              })
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
