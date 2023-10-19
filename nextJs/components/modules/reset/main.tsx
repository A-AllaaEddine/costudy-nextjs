import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/utils/trpc';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Main = ({
  payload,
  error,
}: {
  payload?: {
    id: string;
    email?: string;
    exp: number;
  };
  error?: string;
}) => {
  const [formFields, setFormFields] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);

  const router = useRouter();

  const {
    mutateAsync: resetPassword,
    isLoading,
    isError,
    error: resetError,
  } = trpc.user.reset.password.useMutation();

  useEffect(() => {
    if (error) {
      setIsCheckingToken(false);
      if (error === 'invalid signature') {
        toast.error('The token is invalid or expired.');
        return;
      } else if (error === 'jwt expired') {
        toast.error('The token has expired.');
        return;
      } else {
        toast.error('There was an error verifying the token.');
        return;
      }
    } else {
      setIsCheckingToken(false);
    }
  }, [error, payload]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (formFields.newPassword.length < 8) {
      toast.error('Password must be at least  8 chacacters!');
      return;
    }
    if (formFields.confirmPassword !== formFields.newPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await resetPassword({
            id: payload?.id!,
            password: formFields.newPassword,
          });
          if (isError) {
            throw resetError;
          }

          const resp = await signIn('credentials', {
            email: payload?.email,
            password: formFields.newPassword,
            redirect: false,
          });
          if (resp?.error) {
            throw new Error(resp?.error);
          }
          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Reseting...',
        success: () => {
          return 'Password updated.';
        },
        error: (err) => {
          switch (err) {
            case 'No User':
              return 'No user with this email';

            case 'Wrong Password':

            case 'suspended':
              return 'Your account has been suspended';

            case 'banned':
              return 'Your account is banned';

            default:
              return 'There was an error siging you in!';
          }
        },
      }
    );
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {error ? (
        <p>{error}</p>
      ) : (
        <form
          className="w-4/5 md:w-[25rem] h-auto p-8 flex flex-col justify-center items-center gap-4
      "
          onSubmit={handleSubmit}
        >
          <Input
            className="w-full h-12 text-black-txt text-sm font-semibold"
            name="email"
            type="password"
            placeholder="New Password"
            value={formFields.newPassword}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                newPassword: e.target.value,
              });
            }}
          />
          <Input
            className="w-full h-12 text-black-txt text-sm font-semibold"
            name="password"
            type="password"
            placeholder="Confirm Password"
            value={formFields.confirmPassword}
            onChange={(e) => {
              setFormFields({
                ...formFields,
                confirmPassword: e.target.value,
              });
            }}
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
      )}
    </div>
  );
};

export default Main;
