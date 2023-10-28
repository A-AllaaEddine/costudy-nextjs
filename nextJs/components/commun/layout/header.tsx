'use client';

import { usePathname, useRouter } from 'next/navigation';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Logo from '../../../public/Logo.svg';

import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoMdMenu,
} from 'react-icons/io';
import UserPopover from './UserPopover';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setHideNavbar(true);
      } else {
        setHideNavbar(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`fixed ${
          hideNavbar ? 'top-[-12rem]' : 'top-0'
        } transition-all z-10 h-auto w-full lg:hidden  flex-col justify-center items-center font-sans
      `}
      >
        <div
          className="w-full h-8 p-1 flex justify-center items-center
        bg-[#8449BF] text-white text-xs sm:text-md font-normal"
        >
          <p className="whitespace-nowrap animate-scrolling">
            Study Sessions are coming soon... In the meantime, explore our
            library of PDFs and Videos for different majors.
          </p>
        </div>
        <div
          className=" w-full h-14 flex flex-row justify-between items-center pr-2 pl-2
          border-b-2 border-[#e9e9e9] bg-white"
        >
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger className="w-10 h-10  flex flex-row justify-start items-center lg:hidden ">
              <IoMdMenu className="w-4/5 h-4/5 " />
            </SheetTrigger>
            <SheetContent
              menu
              side={'left'}
              className="flex flex-col justify-start items-center gap-3"
            >
              <p
                className="w-full h-8 text-md font-normal
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/resources');
                }}
              >
                Resources
              </p>
              <Separator />
              <p
                className="w-full h-8  text-md font-normal
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/about');
                }}
              >
                About
              </p>
              <p
                className="w-full h-8  text-md font-normal
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/terms-and-conditions');
                }}
              >
                Terms and Conditions
              </p>
              <p
                className="w-full h-8  text-md font-normal
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/cookie-policy');
                }}
              >
                Cookie Policy
              </p>
              <p
                className="w-full h-8  text-md font-normal
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/support');
                }}
              >
                Support
              </p>
              <Separator />
              <div className="flex flex-row justify-start gap-4 w-full h-auto ">
                <Link href="/instagram">
                  <IoLogoInstagram className="w-7 h-7" />
                </Link>
                <Link href="/facebook">
                  <IoLogoFacebook className="w-7 h-7" />
                </Link>
                <Link href="/linkedin">
                  <IoLogoLinkedin className="w-7 h-7" />
                </Link>
              </div>
              <div className="w-full h-10 mb-3 flex flex-row justify-start items-center">
                <p className="text-black-txt text-sm  font-normal">
                  © 2023 CoStudy.
                </p>
              </div>
            </SheetContent>
          </Sheet>

          <div className="w-auto h-10 flex flex-row justify-center items-center">
            <Image
              src={Logo}
              alt="logo"
              width={100}
              height={100}
              className="w-4/5 h-4/5 hover:cursor-pointer"
              onClick={() => router.push('/')}
            />
          </div>
          <div className="w-auto h-full flex flex-row justify-between items-center gap-2">
            <UserPopover />
          </div>
        </div>
      </div>

      {/* Desktop Header */}

      <div
        className={`fixed ${
          hideNavbar ? 'top-[-12rem]' : 'top-0'
        } transition-all z-10 h-auto w-full hidden  lg:visible lg:flex lg:flex-col justify-center items-center 
          `}
      >
        <div
          className="w-full h-8 flex justify-center items-center
        bg-[#8449BF] text-white text-md font-normal"
        >
          Study Sessions are coming soon... In the meantime, explore our library
          of PDFs and Videos for different majors.
        </div>
        <div
          className="max-w-[1600px] m-0 p-0 w-full h-14 flex flex-row justify-center items-center pr-6 pl-6
          border-b-2 border-[#e9e9e9] bg-white"
        >
          <div className="w-auto h-10 flex flex-row justify-center items-center pr-2 pl-2">
            <Image
              src={Logo}
              alt="logo"
              width={100}
              height={100}
              className="w-full h-full hover:cursor-pointer"
              onClick={() => {
                router.push('/');
              }}
            />
          </div>
          <div className="w-full h-full flex flex-row justify-center items-center gap-3">
            <Link
              href={'/resources'}
              className=" h-8 font-[500] hover:cursor-pointer
             text-black pr-4 pl-4 rounded-full 
            flex flex-row justify-center items-center hover:text-[#8449BF]
            bg-[#8449BF] bg-opacity-10"
            >
              Resources
            </Link>
            <div
              className="w-auto h-8 flex flex-row justify-center items-center
              gap-3  rounded-full pr-4 pl-4 bg-[#8449BF] bg-opacity-10"
            >
              <Link
                href={'/about'}
                className=" hover:cursor-pointer
                 text-black pr-2 pl-2 rounded-full h-full
                flex flex-row justify-center items-center hover:text-[#8449BF] font-[500]"
              >
                About
              </Link>
              {/* <Link
                href={'/community'}
                className="font-semibold hover:cursor-pointer
             text-black pr-2 pl-2 rounded-full h-full
            flex flex-row justify-center items-center hover:text-[#8449BF]"
              >
                Community
              </Link> */}
              <Link
                href={'/support'}
                className=" hover:cursor-pointer
             text-black pr-2 pl-2 rounded-full h-full
            flex flex-row justify-center items-center hover:text-[#8449BF]  font-[500]"
              >
                Support
              </Link>
            </div>
            {/* <Link
              href={'/how-it-works'}
              className=" h-8 font-semibold hover:cursor-pointer
             text-black pr-4 pl-4 rounded-full 
            flex flex-row justify-center items-center hover:text-[#8449BF]
            bg-[#8449BF] bg-opacity-10"
            >
              How it works
            </Link> */}
          </div>
          <div className="w-auto h-full flex flex-row justify-between items-center gap-2">
            {!session?.user ? (
              <div className="w-auto h-8 flex flex-row justify-between items-center gap-2">
                <Link
                  href={{
                    pathname: '/login',
                    query: pathname === '/' ? {} : { destination: pathname },
                  }}
                  className="w-auto h-full pr-2 pl-2 text-black
                  flex justify-center items-center font-normal hover:text-[#8449BF]"
                >
                  Login
                </Link>
                <Link
                  href={'/register'}
                  className="w-auto h-full pr-2 pl-2 text-black
                  flex justify-center items-center border-2 border-[#B8146E] rounded-full font-normal
                  hover:text-[#8449BF] hover:border-[#8449BF]"
                >
                  Register
                </Link>
              </div>
            ) : (
              <UserPopover />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
