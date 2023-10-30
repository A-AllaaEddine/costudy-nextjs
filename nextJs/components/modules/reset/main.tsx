import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/app/_trpc/client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SyntheticEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { verifyToken } from '@/utils/jwtUtils';
import ResetForm from './ResetForm';
import Link from 'next/link';

const Main = async ({ token }: { token: string }) => {
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
  let payload: { id: string; email?: string; exp?: number } = {
    id: '',
  };

  try {
    payload = await verifyToken(token);
  } catch (err: any) {
    console.log(err);

    switch (err.stack) {
      case err.stack.includes('jwt must be provided'):
        return <ErrorComponent error="The token must be provided." />;
      case err.stack.includes('jwt expired'):
        return <ErrorComponent error="The token is expired." />;
      default:
        return <ErrorComponent error="The token is invalid." />;
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <ResetForm payload={payload} />
    </div>
  );
};

export default Main;

const ErrorComponent = ({ error }: { error: string }) => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <p className="text-xl text-center">{error}</p>
      <Link
        href={'/'}
        className="w-auto px-2 h-12 text-white text-lg
            font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
            hover:bg-[#8449BF] rounded-lg hover:text-white  mt-3 flex justify-center items-center gap-2"
      >
        Go Home
      </Link>
    </div>
  );
};
