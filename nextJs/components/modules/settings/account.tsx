import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

type FormFields = {
  name: string;
  username: string;
  email: string;
};
const Account = ({ userData, refetch }: { userData: any; refetch: any }) => {
  const [formFields, setFormFields] = useState<FormFields>({
    name: userData?.name || '',
    username: userData?.username || '',
    email: userData?.email || '',
  });

  const { update } = useSession();
  const {
    mutateAsync: updateUserInfo,
    isLoading,
    isError,
    error,
  } = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      update({
        name: formFields.name,
        username: formFields.username,
        email: formFields.email,
      });
      Toast('success', 'Your informations have been saved successfully!');
    },
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await updateUserInfo(formFields);
      if (isError) {
        throw error;
      }
    } catch (error: any) {
      console.log(error);
      Toast(
        'error',
        'There was an error saving your informations! Please try again!'
      );
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="w-4/5 h-auto flex flex-col justify-start items-start gap-4 mt-8">
      <Label className="w-full sm:w-4/5 max-w-[400px] text-sm sm:text-md">
        Change your account details.
      </Label>
      <form
        className="w-full sm:w-4/5 max-w-[400px] h-auto flex flex-col justify-start items-start gap-2"
        onSubmit={handleSubmit}
      >
        <Label className="w-full text-xs md:text-sm">Name</Label>
        <Input
          placeholder="Name"
          value={formFields?.name}
          type="text"
          required
          onChange={handleChange}
          name="name"
          className="w-full h-12 text-black-txt text-xs md:text-sm font-semibold"
        />

        <Label className="w-full text-xs md:text-sm">Username</Label>
        <Input
          placeholder="Username"
          value={formFields?.username}
          type="text"
          required
          onChange={handleChange}
          name="username"
          className="w-full h-12 text-black-txt ttext-xs md:text-sm font-semibold"
        />
        <Label className="w-full text-xs md:text-sm">Email</Label>
        <Input
          placeholder="Email"
          value={formFields?.email}
          type="email"
          required
          onChange={handleChange}
          name="email"
          className="w-full h-12 text-black-txt text-xs md:text-sm font-semibold"
        />
        <Button
          className="w-full h-12 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
          type="submit"
        >
          {isLoading ? (
            <>
              {' '}
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
