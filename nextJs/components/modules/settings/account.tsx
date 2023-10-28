'use client';

import { trpc } from '@/app/_trpc/client';
import { useSession } from 'next-auth/react';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Spinner from '@/components/commun/static/spinner';

type FormFields = {
  name: string;
  username: string;
  email: string;
};
const Account = () => {
  const { data: session } = useSession();

  const [formFields, setFormFields] = useState<FormFields>({
    name: session?.user?.name || '',
    username: session?.user?.username || '',
    email: session?.user?.email || '',
  });

  const { update } = useSession();
  const {
    mutateAsync: updateUserInfo,
    isLoading,
    isError,
    error,
  } = trpc.user.update.useMutation();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await updateUserInfo(formFields);
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
          update({
            name: formFields.name,
            username: formFields.username,
            email: formFields.email,
          });
          return 'Saved.';
        },
        error: () => {
          return 'There was an error saving the data.';
        },
      }
    );
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-4">
      <Label className="hidden lg:block text-md h-auto font-bold w-4/5 text-start">
        Account
      </Label>
      <Label className="hidden lg:block text-sm h-auto w-4/5 text-start">
        Update your account settings.
      </Label>

      <form
        className="w-full sm:w-4/5 max-w-[300px] h-auto flex flex-col justify-start items-start gap-2"
        onSubmit={handleSubmit}
      >
        <Separator className="hidden lg:block w-full" />
        <Label className="w-full text-xs md:text-sm font-semibold">Name</Label>
        <Input
          placeholder="Name"
          value={formFields?.name}
          type="text"
          required
          onChange={handleChange}
          name="name"
          className="w-full h-12 text-black-txt text-xs md:text-sm font-sans"
        />

        <Label className="w-full text-xs md:text-sm font-semibold">
          Username
        </Label>
        <Input
          placeholder="Username"
          value={formFields?.username}
          type="text"
          required
          onChange={handleChange}
          name="username"
          className="w-full h-12 text-black-txt ttext-xs md:text-sm font-sans"
        />
        <Label className="w-full text-xs md:text-sm font-semibold">Email</Label>
        <Input
          placeholder="Email"
          value={formFields?.email}
          type="email"
          required
          onChange={handleChange}
          name="email"
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
      </form>
    </div>
  );
};

export default Account;
