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
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type FormFields = {
  name: string;
  username: string;
  email: string;
};

const EditModal = ({
  t,
  userId,
  isOpen,
  setIsOpen,
  refetchUsers,
}: {
  t?: any;
  userId: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  refetchUsers: any;
}) => {
  const [formFields, setFormFields] = useState<FormFields>({
    name: '',
    username: '',
    email: '',
  });

  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isFetchingUserError,
    error: userFetchingError,
    refetch: refetchUserInfo,
  } = trpc.admin.user.get.useQuery({
    id: userId,
  });

  const {
    mutateAsync: updateUserInfo,
    isError: isUpdatingUserInfoError,
    error: updatingUserInfoError,
    isLoading,
  } = trpc.admin.user.update.useMutation({
    onError: (error) => {
      console.log(error);
    },
    onSuccess: () => {
      refetchUsers();
    },
  });

  useEffect(() => {
    if (user) {
      setFormFields(user as FormFields);
    }
  }, [user]);

  const handleSubmit = async () => {
    try {
      //   await
      await updateUserInfo({ ...formFields, id: userId });
      if (isUpdatingUserInfoError) {
        throw updatingUserInfoError;
      }

      Toast('success', 'User informations has been updated successfully.');

      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      Toast('error', 'There was an error updating the user informations.');
    }
  };

  const handleChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="md:w-4/5 w-[90%] rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isFetchingUserError ? (
          <div className="w-full h-full min-h-[13rem] flex justify-center items-center">
            <Spinner className="text-[#8449BF] h-8 w-8" />
          </div>
        ) : (
          <form
            className="w-full   h-auto flex flex-col justify-start items-start gap-2"
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
          </form>
        )}
        <DialogFooter>
          <Button
            className="w-auto h-10 flex justify-center items-center
            bg-white text-black sm:text-md text-sm hover:bg-white border-[1px]"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="w-auto h-10 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
            type="submit"
            onClick={handleSubmit}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
