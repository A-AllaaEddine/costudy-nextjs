import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyToken } from '@/utils/jwtUtils';
import { trpc } from '@/utils/trpc';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SyntheticEvent, useEffect, useState } from 'react';

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
        Toast('error', 'The token is invalid or expired.');
        return;
      } else if (error === 'jwt expired') {
        Toast('error', 'The token has expired.');
        return;
      } else {
        Toast('error', 'There was an error verifying the token.');
        return;
      }
    } else {
      setIsCheckingToken(false);
    }
  }, [error, payload]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (formFields.newPassword.length < 8) {
      Toast('error', 'Password must be at least  8 chacacters!');
      return;
    }
    if (formFields.confirmPassword !== formFields.newPassword) {
      Toast('error', 'Passwords do not match!');
      return;
    }

    try {
      await resetPassword({
        id: payload?.id!,
        password: formFields.newPassword,
      });

      if (isError) {
        throw resetError;
      }
      Toast('success', 'Your password has been reset.');
      console.log({ email: payload?.email, password: formFields.newPassword });
      const resp = await signIn('credentials', {
        email: payload?.email,
        password: formFields.newPassword,
        redirect: false,
      });
      if (!resp?.ok) {
        switch (resp?.error) {
          case 'No User':
            Toast('error', 'No user with this email');
            break;
          case 'Wrong Password':
            Toast('error', 'Wrong Password !');
            break;
          case 'suspended':
            Toast('error', 'Your account has been suspended');
            break;
          case 'banned':
            Toast('error', 'Your account is banned');
            break;
          default:
            Toast('error', 'There was an error siging you in!');
            throw resp?.error;
        }
      }
      router.push('/');
    } catch (error: any) {
      console.log(error);
      Toast('error', 'There was an error saving the new password.');
    }
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
