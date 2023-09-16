import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  IoMdSettings,
  IoMdLogOut,
  IoMdBookmark,
  IoIosAt,
  IoIosConstruct,
} from 'react-icons/io';
import { authenticationUser } from '@/types/types';
import Link from 'next/link';

const UserPopover = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const signOutUser = async () => {
    await signOut({
      callbackUrl: '/',
    });
    // router.push('/');
  };
  return (
    <div
      className="w-auto h-10  flex flex-row justify-end
     items-center  "
    >
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-10 h-10 md:w-12 md:h-12 flex
            flex-row justify-end items-center
            "
          >
            <Avatar className="w-3/5 h-3/5 rounded-3xl">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4  min-w-[13rem] md:min-w-[14rem]  pt-2 pl-2">
            <DropdownMenuItem className="font-bold text-md">
              <div className="w-full h-10 flex gap-2 items-center">
                <Avatar className="w-10 h-10 rounded-3xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center items-start gap-0">
                  <p
                    className={`${
                      session?.user?.username?.length > 17
                        ? `text-md  whitespace-nowrap animate-scrolling`
                        : 'text-md'
                    } h-5 text-md font-bold  p-0 m-0`}
                  >
                    {session?.user?.username}
                  </p>
                  <p
                    className={`${
                      session?.user?.username?.length > 17
                        ? `text-md  whitespace-nowrap animate-scrolling`
                        : 'text-md'
                    } h-5 text-sm font-normal p-0 m-0`}
                  >
                    @{session?.user?.username}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {session?.user?.type !== 'admin' && (
              <DropdownMenuItem
                className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
        hover:cursor-pointer"
                onClick={() => router.push('/bookmarks')}
              >
                <IoMdBookmark className="w-6 h-6 rounded-3xl" />
                <p>Bookmarks</p>
              </DropdownMenuItem>
            )}
            {session?.user?.type === 'admin' && (
              <DropdownMenuItem
                className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
              hover:cursor-pointer"
                onClick={() => router.push('/admin')}
              >
                <IoIosConstruct className="w-6 h-6 rounded-3xl" />
                <p>Admin Panel</p>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
        hover:cursor-pointer"
              onClick={() => router.push('/account/info')}
            >
              <IoMdSettings className="w-6 h-6 rounded-3xl" />
              <p>Settings</p>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              className="h-10 font-semibold text-md  hover:bg-slate-200
        hover:cursor-pointer"
              onClick={() => router.push('/account/security')}
            >
              Security
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOutUser()}
              className="h-10 flex gap-2 font-semibold text-md  text-red-600 hover:bg-red-200
              hover:cursor-pointer"
            >
              <IoMdLogOut className="w-6 h-6 rounded-3xl" />
              <p>Sign out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        // <IoMdLogIn
        //   className="text-black-txt w-4/6 h-4/6
        //     lg:hover:cursor-pointer
        //     xl:hover:cursor-pointer

        //     "
        //   onClick={() => router.push('/login')}
        // />
        <Link
          className="font-semibold rounded-3xl pr-2 pl-2 hover:bg-slate-200
        hover:cursor-pointer"
          href={{
            pathname: '/login',
            query: {
              destination: router.asPath,
            },
          }}
          // onClick={() =>
          //   router.push({
          //     pathname: '/login',
          //     query: {
          //       destination: router.asPath,
          //     },
          //   })
          // }
        >
          Log in
        </Link>
      )}
    </div>
  );
};

export default UserPopover;
