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
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react';

import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { signOut } from 'next-auth/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormFields = {
  newPassowrd: string;
  confirmPassowrd: string;
};
const defaultFormFields: FormFields = {
  newPassowrd: '',
  confirmPassowrd: '',
};
const ResetPasswordModal = ({
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
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const {
    mutateAsync: updateUserPassword,
    isLoading,
    isError,
    error,
  } = trpc.admin.user.update.useMutation({
    onSuccess: () => {
      refetchUsers();
    },
  });

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const changePassword = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (formFields.newPassowrd.length < 8) {
      Toast('error', 'Password must be at least  8 chacacters !');
      return;
    }

    if (formFields.confirmPassowrd !== formFields.newPassowrd) {
      Toast('error', 'Password is not matching !');
      return;
    }

    try {
      await updateUserPassword({
        id: userId!,
        newPassword: formFields.newPassowrd,
      });
      if (isError) {
        throw error;
      }

      Toast('success', 'your account has been deleted successfully.');
      await signOut({
        callbackUrl: '/',
      });
    } catch (error: any) {
      console.log(error);
      Toast(
        'error',
        'There was an error deleting your account. Please try again later.'
      );
    }
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md">
            Change the user's password
          </DialogTitle>
        </DialogHeader>
        <form className="w-full   h-auto flex flex-col justify-start items-start gap-2">
          <Label className="w-full text-xs md:text-sm">New Password</Label>
          <Input
            placeholder="New Password"
            value={formFields?.newPassowrd}
            type="password"
            required
            onChange={handleChange}
            name="newPassowrd"
            className="w-full h-12 text-black-txt text-xs md:text-sm font-semibold"
          />
          <Label className="w-full text-xs md:text-sm">Confirm Password</Label>
          <Input
            placeholder="Confirm Password"
            value={formFields?.confirmPassowrd}
            type="password"
            required
            onChange={handleChange}
            name="confirmPassowrd"
            className="w-full h-12 text-black-txt text-xs md:text-sm font-semibold"
          />
        </form>
        <DialogFooter className="gap-2">
          <Button
            className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px] font-bold"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="w-auto h-10 flex justify-center items-center gap-2
            bg-black text-white sm:text-md text-sm hover:bg-[#8449BF] hover:text-white font-bold"
            onClick={changePassword}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner className="text-white h-6 w-6" />
                <p className="font-semibold">Updating...</p>
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

export default ResetPasswordModal;
