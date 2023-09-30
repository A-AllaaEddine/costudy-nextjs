import { useRouter } from 'next/router';

import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../public/Logo.svg';
import { useEffect, useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { signOut, useSession } from 'next-auth/react';
import UserPopover from './UserPopover';
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoLinkedin,
  IoMdMenu,
} from 'react-icons/io';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [hideNavbar, setHideNavbar] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

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

  // const resources = [
  //   { value: 'math', label: 'math', url: '/math', imgUrl: '/math.png' },
  //   {
  //     value: 'science',
  //     label: 'science',
  //     url: '/science',
  //     imgUrl: '/science.png',
  //   },
  //   {
  //     value: 'history',
  //     label: 'history',
  //     url: '/history',
  //     imgUrl: '/history.png',
  //   },
  //   { value: 'art', label: 'art', url: '/art', imgUrl: '/art.png' },
  //   { value: 'music', label: 'music', url: '/music', imgUrl: '/music.png' },
  //   {
  //     value: 'language',
  //     label: 'language',
  //     url: '/language',
  //     imgUrl: '/language.png',
  //   },
  //   { value: 'sports', label: 'sports', url: '/sports', imgUrl: '/sports.png' },
  //   {
  //     value: 'technology',
  //     label: 'technology',
  //     url: '/technology',
  //     imgUrl: '/technology.png',
  //   },
  //   {
  //     value: 'geography',
  //     label: 'geography',
  //     url: '/geography',
  //     imgUrl: '/geography.png',
  //   },
  //   { value: 'food', label: 'food', url: '/food', imgUrl: '/food.png' },
  //   { value: 'health', label: 'health', url: '/health', imgUrl: '/health.png' },
  //   {
  //     value: 'literature',
  //     label: 'literature',
  //     url: '/literature',
  //     imgUrl: '/literature.png',
  //   },
  //   { value: 'nature', label: 'nature', url: '/nature', imgUrl: '/nature.png' },
  //   {
  //     value: 'politics',
  //     label: 'politics',
  //     url: '/politics',
  //     imgUrl: '/politics.png',
  //   },
  //   {
  //     value: 'philosophy',
  //     label: 'philosophy',
  //     url: '/philosophy',
  //     imgUrl: '/philosophy.png',
  //   },
  //   {
  //     value: 'economics',
  //     label: 'economics',
  //     url: '/economics',
  //     imgUrl: '/economics.png',
  //   },
  //   {
  //     value: 'fashion',
  //     label: 'fashion',
  //     url: '/fashion',
  //     imgUrl: '/fashion.png',
  //   },
  //   { value: 'travel', label: 'travel', url: '/travel', imgUrl: '/travel.png' },
  //   {
  //     value: 'mythology',
  //     label: 'mythology',
  //     url: '/mythology',
  //     imgUrl: '/mythology.png',
  //   },
  //   {
  //     value: 'architecture',
  //     label: 'architecture',
  //     url: '/architecture',
  //     imgUrl: '/architecture.png',
  //   },
  //   { value: 'film', label: 'film', url: '/film', imgUrl: '/film.png' },
  // ];

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
        bg-[#8449BF] text-white text-xs sm:text-md font-semibold"
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
                className="w-full h-8 text-md font-semibold
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
                className="w-full h-8  text-md font-semibold
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/about');
                }}
              >
                About
              </p>
              <p
                className="w-full h-8  text-md font-semibold
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/about');
                }}
              >
                Terms and Conditions
              </p>
              <p
                className="w-full h-8  text-md font-semibold
              flex justify-start items-center"
                onClick={() => {
                  setIsMenuOpen(false);
                  router.push('/about');
                }}
              >
                Cookie Policy
              </p>
              <p
                className="w-full h-8  text-md font-semibold
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
        } transition-all z-10 h-auto w-full hidden  lg:visible lg:flex lg:flex-col justify-center items-center font-sans
          `}
      >
        <div
          className="w-full h-8 flex justify-center items-center
        bg-[#8449BF] text-white text-md font-semibold"
        >
          Study Sessions are coming soon... In the meantime, explore our library
          of PDFs and Videos for different majors.
        </div>
        <div
          className=" w-full h-14 flex flex-row justify-center items-center pr-6 pl-6
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
            {/* <NavigationMenu className="h-8 ml-6 rounded-3xl  bg-[#8449BF] bg-opacity-10 ">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className=" h-8 text-md rounded-3xl bg-white-bg  hover:bg-transparent hover:text-[#8449BF]
                  "
              >
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className="bg-white-bg min-w-[650px] h-[340px] flex flex-wrap gap-2 p-4
                    overflow-y-scroll overflow-x-hidden z-10 "
              >
                {resources.map((resource, idx) => {
                  return (
                    <div
                      key={idx}
                      className="w-48 h-14 bg-white-bg hover:bg-slate-200 rounded-md
                            flex flex-col justify-center items-center"
                    >
                      <NavigationMenuLink
                        className={`
                                  w-full h-full font-semibold  flex flex-row justify-start items-center gap-5
                                  p-3 bg-white-bg hover:bg-slate-200 rounded-md`}
                        href={resource.url}
                      >
                        <Image
                          src={resource.imgUrl}
                          alt={resource.value}
                          width={100}
                          height={100}
                          unoptimized
                          className="w-8 h-8"
                          priority={true}
                        />
                        <div
                          className="overflow-hidden w-4/6 h-6 flex flex-row 
                  justify-center items-end"
                        >
                          <p
                            className={`${
                              resource.value.length > 11
                                ? 'text-md  whitespace-nowrap animate-scrolling'
                                : 'text-md'
                            } h-full w-full `}
                          >
                            {resource.value}
                          </p>
                        </div>
                      </NavigationMenuLink>

                      <Separator className="w-5/6" />
                    </div>
                  );
                })}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu> */}
            <Link
              href={'/resources'}
              className=" h-8 font-semibold hover:cursor-pointer
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
                className="font-semibold hover:cursor-pointer
                 text-black pr-2 pl-2 rounded-full h-full
                flex flex-row justify-center items-center hover:text-[#8449BF]"
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
                className="font-semibold hover:cursor-pointer
             text-black pr-2 pl-2 rounded-full h-full
            flex flex-row justify-center items-center hover:text-[#8449BF]"
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
                    query:
                      router.asPath === '/'
                        ? {}
                        : { destination: router.asPath },
                  }}
                  className="w-auto h-full pr-2 pl-2 text-black
                  flex justify-center items-center font-semibold hover:text-[#8449BF]"
                >
                  Login
                </Link>
                <Link
                  href={'/register'}
                  className="w-auto h-full pr-2 pl-2 text-black
                  flex justify-center items-center border-2 border-[#B8146E] rounded-full font-semibold
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
