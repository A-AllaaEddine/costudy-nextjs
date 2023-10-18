import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useRouter } from 'next/router';

const defaultFomFields = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

type FormField = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const Main = () => {
  const [formFields, setFormFields] = useState<FormField>(defaultFomFields);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassInput, setShowPassInput] = useState<boolean>(false);
  const [showConfirmPassInput, setShowConfirmPassInput] =
    useState<boolean>(false);

  const { name, username, email, password, confirmPassword } = formFields;

  const router = useRouter();
  const { mutateAsync, isError, error } = trpc.user.create.useMutation();

  const handleChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'email') {
      if (value.length > 0) {
        setShowPassInput(true);
      } else {
        setShowPassInput(false);
        setShowConfirmPassInput(false);
      }
    }
    if (name === 'password') {
      if (value.length > 0) {
        setShowConfirmPassInput(true);
      } else {
        setShowConfirmPassInput(false);
      }
    }

    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (email.length === 0) {
      Toast('error', 'Please type your email!');
      return;
    }

    if (password.length < 8) {
      Toast('error', 'Password must be at least  8 chacacters !');
      return;
    }

    if (password !== confirmPassword) {
      Toast('error', 'Password is not matching !');
      return;
    }

    try {
      setIsLoading(true);

      await mutateAsync({ name, username, email, password });

      if (isError) {
        switch (error.message) {
          case 'Email already exist':
            Toast('error', 'There is already an account with this email!');
            break;
          case 'Username taken':
            Toast('error', 'Username is already taken!');
            break;
          default:
            Toast(
              'error',
              'There was an error registering your account! Please try again!'
            );
        }

        setIsLoading(false);
        return;
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      Toast('success', 'Account created successfully');
      setIsLoading(false);
      router.push('/');
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p className="w-auto h-auto p-2 text-xl text-center md:text-5xl font-bold">
        Welcome to the family
      </p>
      <form
        className="w-4/5 md:w-[30rem] h-auto p-8 flex flex-col justify-center items-center gap-4
          "
        onSubmit={handleSubmit}
      >
        <Input
          className="w-full h-12 text-black-txt text-sm font-semibold"
          name="name"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
        />{' '}
        <Input
          className="w-full h-12 text-black-txt text-sm font-semibold"
          name="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={handleChange}
        />{' '}
        <Input
          className="w-full h-12 text-black-txt text-sm font-semibold"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
        />
        {showPassInput && (
          <Input
            className="w-full h-12 text-black-txt text-sm font-semibold"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />
        )}
        {showConfirmPassInput && (
          <Input
            className="w-full h-12 text-black-txt text-sm font-semibold"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
          />
        )}
        <div className="w-full h-12 flex flex-col justify-center items-center">
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
                <p className="font-semibold">Signing up...</p>
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </div>
        <p className="whitespace-break-spaces  text-xs text-center font-normal">
          By creating an account, you agree to our
          <Link
            href={'/terms'}
            className="w-auto  pl-1 pr-1 font-bold "
          >
            Terms of Service
          </Link>
          and
          <Link
            href={'/privacy'}
            className="w-auto  pl-1 pr-1 font-bold"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <Separator className="mt-2 mb-2" />
        <p
          className="text-sm md:text-md text-center font-normal flex flex-row justify-between items-center
        gap-2"
        >
          Already a member?
          <Link
            href={'/login'}
            className="text-black-txt no-underline font-bold"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Main;
