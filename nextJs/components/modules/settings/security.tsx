'use client';

import { trpc } from '@/app/_trpc/client';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';

type FormFields = {
  currentPassword: string;
  newPassword: string;
  ConfirmPassword: string;
};
const defaultFormFields = {
  currentPassword: '',
  newPassword: '',
  ConfirmPassword: '',
};

const Security = () => {
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

  const router = useRouter();
  const {
    mutateAsync: updatePassword,
    isError,
    error,
    isLoading,
  } = trpc.user.update.useMutation();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === 'currentPassword') {
      if (value.length > 0) {
        setShowNewPassword(true);
      } else {
        setShowNewPassword(false);
      }
    }

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (formFields.currentPassword.length < 8) {
      toast.error('Current password must be at least 8 characters long!');
      return;
    }
    if (formFields.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long!');
      return;
    }
    if (formFields.newPassword === formFields.currentPassword) {
      toast.error('New password cannot be the same as current password!');
      return;
    }
    if (formFields.newPassword !== formFields.ConfirmPassword) {
      toast.error('Password is not matching!');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updatePassword({
            currentPassword: formFields.currentPassword,
            newPassword: formFields.newPassword,
          });

          if (isError) {
            throw error;
          }
          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Saving...',
        success: () => {
          resetFormFields();
          router.refresh();
          return 'Password updated';
        },
        error: (err) => {
          console.log(error);
          if (err.message === 'Wrong Password') {
            return 'Wrong Password !';
          }
          return 'There was an error while updating your password';
        },
      }
    );
  };

  return (
    <div className="w-4/5 h-autp flex flex-col justify-start items-start gap-4">
      <Label className="hidden lg:block text-md h-auto font-bold w-4/5 text-start">
        Security
      </Label>
      <Label className="hidden lg:block text-sm h-auto w-4/5 text-start">
        Update your account security. Set your new password.
      </Label>
      <form
        className="w-full sm:w-4/5 max-w-[300px] h-auto flex flex-col justify-start items-start gap-2"
        onSubmit={handleSubmit}
      >
        <Separator className="hidden lg:block w-full" />
        <Label className="w-full text-xs md:text-sm font-semibold">
          Current Password
        </Label>
        <Input
          placeholder="Current Password"
          value={formFields?.currentPassword}
          type="password"
          required
          onChange={handleChange}
          name="currentPassword"
          className="w-full h-12 text-black-txt text-xs md:text-sm font-sans"
        />
        {showNewPassword && (
          <>
            <Label className="w-full text-xs md:text-sm font-semibold">
              New Password
            </Label>
            <Input
              placeholder="New Password"
              value={formFields?.newPassword}
              type="password"
              required
              onChange={handleChange}
              name="newPassword"
              className="w-full h-12 text-black-txt ttext-xs md:text-sm font-sans"
            />
            <Label className="w-full ttext-xs md:text-sm font-semibold">
              Confirm Password
            </Label>
            <Input
              placeholder="Confirm Password"
              value={formFields?.ConfirmPassword}
              type="password"
              required
              onChange={handleChange}
              name="ConfirmPassword"
              className="w-full h-12 text-black-txt text-xs md:text-sm font-sans"
            />

            <Button
              className="w-full h-12 text-white text-lg
                font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
                hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
              type="submit"
            >
              {isLoading ? (
                <>
                  <Spinner className="text-white h-6 w-6" />
                  <p className="font-semibold">Saving...</p>
                </>
              ) : (
                'Save'
              )}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default Security;
