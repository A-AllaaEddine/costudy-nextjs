import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { IoMdBookmark, IoMdLogOut, IoMdSettings } from 'react-icons/io';
import { IoAnalyticsSharp, IoCloudUpload } from 'react-icons/io5';
import { MdSpaceDashboard } from 'react-icons/md';

const UserPopover = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const signOutUser = async () => {
    await signOut({
      callbackUrl: '/',
    });
  };

  return (
    <div
      className="w-auto h-10  flex flex-row justify-end
     items-center font-sans "
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
          <DropdownMenuContent className="mr-32  min-w-[13rem] md:min-w-[14rem]  pt-2 pl-2">
            <DropdownMenuItem className="font-bold text-md rounded-md">
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
                    } h-5 text-md font-bold  p-0 m-0 font-sans`}
                  >
                    {session?.user?.name}
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
            {session?.user?.type && (
              <DropdownMenuItem
                className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
                hover:cursor-pointer rounded-md"
                onClick={() => router.push('/bookmarks')}
              >
                <IoMdBookmark className="w-6 h-6 rounded-3xl" />
                <p>Bookmarks</p>
              </DropdownMenuItem>
            )}
            {session?.user?.type === 'admin' && (
              <>
                <DropdownMenuItem
                  className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
                hover:cursor-pointer rounded-md"
                  onClick={() =>
                    router.push({
                      pathname: '/admin/dashboard',
                      query: {
                        tab: 'overview',
                      },
                    })
                  }
                >
                  <MdSpaceDashboard className="w-6 h-6 rounded-3xl" />
                  <p>Dashboard</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="h-10 flex gap-2 font-normal text-md  hover:bg-slate-200
                    hover:cursor-pointer rounded-md"
                  onClick={() =>
                    router.push({
                      pathname: '/admin/analytics',
                      query: {
                        tab: 'behavior',
                      },
                    })
                  }
                >
                  <IoAnalyticsSharp className="w-6 h-6 rounded-3xl" />
                  <p>Analytics</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
                hover:cursor-pointer rounded-md"
                  onClick={() => router.push('/admin/upload')}
                >
                  <IoCloudUpload className="w-6 h-6 rounded-3xl" />
                  <p>Uplaods</p>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              className="h-10 flex gap-2 font-semibold text-md  hover:bg-slate-200
              hover:cursor-pointer rounded-md"
              onClick={() => router.push('/settings?tab=account')}
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
              className="h-10 flex gap-2 font-semibold text-md  text-red-600 hover:text-red-600 hover:bg-red-200
              hover:cursor-pointer rounded-md"
            >
              <IoMdLogOut className="w-6 h-6 rounded-3xl" />
              <p>Sign out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link
          className="font-semibold rounded-3xl pr-2 pl-2 hover:bg-slate-200
        hover:cursor-pointer"
          href={{
            pathname: '/login',
            query: {
              destination: router.asPath,
            },
          }}
        >
          Log in
        </Link>
      )}
    </div>
  );
};

export default UserPopover;
