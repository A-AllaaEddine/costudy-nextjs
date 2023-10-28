'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signIn } from 'next-auth/react';
import { ChangeEvent, SyntheticEvent, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { trpc } from '@/app/_trpc/client';

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
  const [showPassInput, setShowPassInput] = useState<boolean>(false);
  const [showConfirmPassInput, setShowConfirmPassInput] =
    useState<boolean>(false);

  const { name, username, email, password, confirmPassword } = formFields;

  const router = useRouter();
  const { mutateAsync, isLoading, isError, error } =
    trpc.user.create.useMutation();

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
      toast.error('Please type your email!');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least  8 chacacters !');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password is not matching !');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await mutateAsync({ name, username, email, password });
          if (isError) {
            throw error;
          }

          const resp = await signIn('credentials', {
            email,
            password,
            redirect: false,
          });
          if (!resp?.ok) {
            throw resp?.error;
          }
          resolve(resp);
        } catch (error: any) {
          reject(error.message);
        }
      }),
      {
        loading: 'Regsitering...',
        success: (data) => {
          router.push('/');
          return 'Registered';
        },

        error: (err) => {
          console.log(err);

          return 'There was an error registering your account.';
        },
      }
    );
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
            Sign up
          </Button>
        </div>
        <p className="whitespace-break-spaces  text-xs text-center font-normal">
          By creating an account, you agree to our
          <Link href={'/terms'} className="w-auto  pl-1 pr-1 font-bold ">
            Terms of Service
          </Link>
          and
          <Link href={'/privacy'} className="w-auto  pl-1 pr-1 font-bold">
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
