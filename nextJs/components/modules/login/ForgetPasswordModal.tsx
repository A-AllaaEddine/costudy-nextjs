import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Dispatch, SetStateAction, SyntheticEvent, useState } from 'react';

const ForgetPasswordModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState<string>('');
  //   const isLoading = false;

  const {
    mutateAsync: sendEmail,
    isLoading,
    isError,
    error,
  } = trpc.user.reset.email.useMutation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email.length) {
      Toast('error', 'Please enter your email address.');
      return;
    }

    try {
      await sendEmail({ email });

      if (isError) {
        throw error;
      }

      Toast('success', 'An email has been sent to reset your password.');
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      if (error.message === 'no user') {
        Toast('error', 'No user with this email!');
        return;
      }
      Toast('error', 'There was an error sending reset email.');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            We will send a reset link to your email.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-start items-center
          gap-2"
        >
          <Label className="w-full text-start text-md font-semibold">
            Email
          </Label>
          <div className="w-full flex justify-start items-center">
            <Input
              placeholder="Email"
              value={email}
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-4/5  h-12 text-black-txt text-xs md:text-sm font-semibold"
            />
          </div>

          <DialogFooter className="mt-5 w-full flex justify-end items-center">
            <Button
              className="w-auto h-10 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
              //   type="submit"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Sending...</p>
                </>
              ) : (
                'Send'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ForgetPasswordModal;
