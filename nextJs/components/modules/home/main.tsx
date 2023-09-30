import Image from 'next/image';
import ResourcesList from './resources-list';
import HomePageImg from '../../../public/home-bg.svg';
import { Resource } from '@/types/types';
import { useRouter } from 'next/router';

const Main = ({
  resources,
  error,
}: {
  resources: Resource[];
  error: string;
}) => {
  if (error) console.log(error);

  const router = useRouter();

  return (
    <div
      className=" w-full h-full flex flex-col justify-start items-center
                 pr-2 pl-2 md:pr-6 md:pl-6"
    >
      <div className="relative w-full h-[250px] md:h-screen flex flex-row justify-center items-center gap-3">
        <div className="w-1/2 h-5/6 flex flex-col justify-start items-start p-2 md:p-10">
          <p className="w-full h-auto text-xl lg:text-5xl xl:text-7xl text-black font-bold">
            <span className="text-[#B8146E] leading-snug">Studying</span> with
            friends was never this easy.
          </p>
          <button
            className="w-auto h-auto bg-gradient-to-r from-[#8449BF]  to-[#B8146E]
               xl:pr-6 xl:pl-6 xl:pt-4 xl:pb-4
               lg:pr-5 lg:pl-5 lg:pt-3 lg:pb-3
               p-2
              rounded-full text-white text-sm  md:text-xl whitespace-nowrap font-bold mt-4 md:mt-12
               hover:from-[#f157ac]  hover:to-[#8449BF]
               hover:cursor-pointer"
            disabled={true}
          >
            Coming Soon...
          </button>
        </div>
        <div className="relative w-1/2 h-full flex flex-col justify-end items-center">
          <Image
            src={HomePageImg}
            alt="study together"
            className="w-full h-5/6 "
          />
        </div>
        {/* <div className="absolute bottom-64 w-full h-14 bg-[#8449BF] bg-opacity-10 " /> */}
      </div>
      <div className="w-full h-full flex flex-col justify-start items-center mt-12 mb-10">
        <p className="w-3/4 md:w-/4 h-auto text-xl md:text-5xl text-center font-bold leading-snug">
          Get to explore our free study{' '}
          <span className="text-[#8449BF]">Resources.</span>
        </p>
        <div
          className="w-full h-72  
          pl-2 pr-2
          md:pl-8
          md:pr-8 
          mt-12
          mb-12"
        >
          <p
            className="text-md font-semibold w-full text-end h-8
          hover:cursor-pointer"
            onClick={() => router.push('/resources')}
          >
            More...
          </p>
          <ResourcesList resources={resources} />
        </div>
      </div>
    </div>
  );
};

export default Main;
