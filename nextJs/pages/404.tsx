import { Button } from '@/components/ui/button';
import notFound from '@/public/404.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Custom404 = () => {
  const router = useRouter();

  return (
    <div
      className="w-full h-full flex flex-col md:flex-row justify-center items-center
    pr-5 pl-5"
    >
      <div className="md:w-1/2 w-full h-full flex justify-center items-center">
        <Image
          src={notFound}
          alt="not found"
          width={100}
          height={100}
          quality={100}
          className="md:w-3/5 w-4/5 md:h-3/5 h-4/5"
        />
      </div>
      <div
        className="md:w-1/2 w-full h-full flex flex-col justify-center items-center md:items-start
      gap-1 md:gap-5"
      >
        <p className="md:text-6xl text-2xl font-bold ">
          Oops! <span className="text-[#8449BF]">Nothing</span> here...
        </p>
        <p className="font-semibold text-sm text-center md:text-left md:text-xl text-slate-500">
          Uh oh, we can't seem to find the page you are looking for.
        </p>
        <p className="font-semibold text-sm text-center md:text-left md:text-xl text-slate-500">
          Try going back to the home page or CONTACT US for more informations.
        </p>
        <Button
          className="w-auto h-10 md:h-12 text-white text-md md:text-lg mt-3 lg:mt-0
            font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
            hover:bg-[#8449BF] hover:text-white"
          onClick={() => router.push('/')}
        >
          Go Home
        </Button>
      </div>
    </div>
  );
};

export default Custom404;
