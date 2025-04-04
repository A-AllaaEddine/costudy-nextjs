import Image from 'next/image';

import Img1 from '../../public/about-img-1.svg';
import Img2 from '../../public/about-img-2.svg';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import Meta from '@/components/commun/static/Meta';

import WebsiteRatingModal from '@/components/modules/about/WebsiteRatingModal';
import WechatModal from '@/components/modules/about/WechatModal';
import { Metadata } from 'next';

const perks = [
  { value: 'Create your Study Space', label: 'Create your Study Space' },
  { value: 'Safe and Secure', label: 'Safe and Secure' },
  { value: 'Progress Tracking', label: 'Progress Tracking' },
  { value: 'Interactive Whiteboard', label: 'Interactive Whiteboard' },
  { value: 'Study Resources', label: 'Study Resources' },
  { value: 'Scheduled Study Sessions', label: 'Scheduled Study Sessions' },
  { value: 'Cross Platform', label: 'Cross Platform' },
];

const bgColor: Record<string, string> = {
  '1': 'bg-[#8449BF] text-white',
  '2': 'bg-[#FF6584]',
  '3': 'bg-[#8449BF] bg-opacity-20',
  '4': 'bg-[#FF6584] bg-opacity-40',
  '5': 'bg-[#8449BF] bg-opacity-40',
};

export const metadata: Metadata = {
  title: 'About',
  description: 'Track your website status.',
};

const About = () => {
  return (
    <>
      <Meta title="Co Study" description="Generated by create next app" />
      <div
        className="w-full h-10 md:h-14 flex flex-row justify-center items-center
        bg-[#8449BF] bg-opacity-10 mt-6"
      >
        <p className="text-xl md:text-3xl font-semibold">Welcome to CoStudy</p>
      </div>
      <div
        className="w-full h-full flex flex-col justify-center items-center
         pr-5 pl-5 md:pr-6 md:pl-6 overflow-x-hidden gap-10"
      >
        <div
          className="relative w-full h-auto flex flex-col md:flex-row justify-start items-center
          mt-6 md:mt-0 md:p-6 gap-2 lg:p-16"
        >
          <p
            className="w-4/5 md:w-1/2 h-auto leading-snug text-md md:text-xl
          lg:text-3xl xl:text-4xl font-semibold  p-2 lg:p-10 bg-[#8449BF] bg-opacity-10"
          >
            Your virtual haven for{' '}
            <span className="text-[#8449BF]">Productive</span> studying and
            collaborative learning!
          </p>
          <Image
            src={Img1}
            alt="about"
            width={100}
            height={100}
            quality={100}
            className=" w-4/5 md:w-1/2 h-auto md:h-full "
          />
        </div>
        <div className=" w-full h-auto md:pr-4 md:pl-4 flex">
          <span className="text-2xl md:text-4xl font-bold rotate-[25deg] mr-2 ml-2 text-black">
            +
          </span>
          <p className="text-xl md:text-3xl font-bold text-[#FF6584]">
            What We Offer
          </p>
        </div>
        <div
          className="relative w-full h-auto] flex flex-col md:flex-row justify-start items-center
        md:p-4 lg:p-16 gap-2"
        >
          <Image
            src={Img2}
            alt="about"
            width={100}
            height={100}
            quality={100}
            className=" w-1/2 h-full border-[1px] rounded-lg "
          />
          <p
            className="w-4/5 h-auto leading-snug text-2xl md:text-2xl
          lg:text-3xl xl:text-4xl font-semibold  bg-[#FF6584] bg-opacity-10 p-4"
          >
            Our platform is designed to empower students, professionals, and
            lifelong learners to come together and create their own dynamic
            study sessions, fostering an environment of shared knowledge and
            achievement.
          </p>
        </div>
        <div className=" w-full h-auto md:pr-4 md:pl-4 flex">
          <span className="text-2xl md:text-4xl font-bold rotate-[-25deg] mr-2 ml-2  text-black">
            +
          </span>
          <p className="text-xl md:text-3xl font-bold text-[#8449BF]">Perks</p>
        </div>
        <div
          className="relative w-full h-auto md:mb-12 flex flex-col justify-start items-center
          md:mt-12 md:pr-16 md:pl-16"
        >
          <div className="w-full h-14 overflow-x-hidden">
            <div
              className="w-full h-14 flex flex-row items-center gap-2 animate-perks
          "
            >
              {[...perks, ...perks, ...perks, ...perks, ...perks, ...perks].map(
                (perk, index) => {
                  return (
                    <p
                      key={index}
                      className={`w-auto h-10 whitespace-nowrap p-2
                    flex justify-center items-center rounded-md font-semibold ${
                      bgColor[Math.floor(Math.random() * 5) + 1]
                    }`}
                    >
                      {perk.value}
                    </p>
                  );
                }
              )}
            </div>
          </div>
          <div className="w-full h-14 overflow-x-hidden">
            <div
              className="w-full h-14 flex  flex-row-reverse items-center gap-2 animate-reverse-perks
          "
            >
              {[...perks, ...perks, ...perks, ...perks, ...perks, ...perks].map(
                (perk, index) => {
                  return (
                    <p
                      key={index}
                      className={`w-auto h-10 whitespace-nowrap p-2
                    flex justify-center items-center rounded-md font-semibold ${
                      bgColor[Math.floor(Math.random() * 5) + 1]
                    }`}
                    >
                      {perk.value}
                    </p>
                  );
                }
              )}
            </div>
          </div>
          <div className="w-full h-14 overflow-x-hidden">
            <div
              className="w-full h-14 flex flex-row items-center gap-2 animate-perks
          "
            >
              {[...perks, ...perks, ...perks, ...perks, ...perks, ...perks].map(
                (perk, index) => {
                  return (
                    <p
                      key={index}
                      className={`w-auto h-10 whitespace-nowrap p-2
                    flex justify-center items-center rounded-md font-semibold ${
                      bgColor[Math.floor(Math.random() * 5) + 1]
                    }`}
                    >
                      {perk.value}
                    </p>
                  );
                }
              )}
            </div>
          </div>
        </div>
        <div className=" w-full h-auto md:pr-16 md:pl-16 flex justify-center mt-12">
          <p className="text-xl md:text-3xl font-bold">
            <span className="text-[#FF6584]">F</span>requently
            <span className="text-[#FF6584]">A</span>sked
            <span className="text-[#FF6584]">Q</span>uestions
          </p>
        </div>
        <div
          className="relative w-full h-auto flex flex-col justify-start items-center
        md:p-24"
        >
          <Accordion type="single" collapsible className="w-full lg:w-2/3">
            <AccordionItem value="item-1">
              <AccordionTrigger className="w-full font-bold text-sm md:text-md text-start">
                What is Co-Study?
              </AccordionTrigger>
              <AccordionContent className="font-semibold text-sm md:text-md text-start">
                Co-Study is an online platform that enables users to create
                virtual study rooms for collaborative learning. It offers
                features like video chats, interactive whiteboards, and
                customizable study environments to enhance the study experience.
              </AccordionContent>
            </AccordionItem>{' '}
            <AccordionItem value="item-2">
              <AccordionTrigger className="w-full font-bold text-sm md:text-md text-start">
                Are there any tools to help me stay focused?
              </AccordionTrigger>
              <AccordionContent className="font-normal text-sm md:text-md text-start">
                Yes, Co-Study offers focus-enhancing tools like timers, ambient
                background sounds, and tasks to help you maintain concentration
                and boost productivity.
              </AccordionContent>
            </AccordionItem>{' '}
            <AccordionItem value="item-3">
              <AccordionTrigger className="w-full font-bold text-sm md:text-md text-start">
                How can I connect with other learners on Co-Study?
              </AccordionTrigger>
              <AccordionContent className="font-normal text-sm md:text-md text-start">
                You can connect with other learners by simply creating a study
                session and inviting whoever you wish to join you through the
                generated link, participating in study challenges, and engaging
                in community forums.
              </AccordionContent>
            </AccordionItem>{' '}
            <AccordionItem value="item-4">
              <AccordionTrigger className="w-full font-bold text-sm md:text-md text-start">
                Can I integrate my study materials from other platforms?
              </AccordionTrigger>
              <AccordionContent className="font-normal text-sm md:text-md text-start">
                CoStudy is continuously working to enhance user experience.
                While direct integration with other platforms might not be
                available, you can easily share resources and notes within your
                study rooms.
              </AccordionContent>
            </AccordionItem>{' '}
            <AccordionItem value="item-5">
              <AccordionTrigger className="w-full font-bold text-sm md:text-md text-start">
                What if I want to study alone?
              </AccordionTrigger>
              <AccordionContent className="font-normal text-sm md:text-md text-start">
                While Co-Study promotes collaborative learning, you can create a
                private study room for yourself if you prefer to study alone.
                This still provides access to features like customizable
                environments and progress tracking.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className=" w-full h-auto md:pr-16 md:pl-16 flex justify-center">
          <p className="text-xl md:text-3xl font-bold text-center">
            Join the <span className="text-[#8449BF]">CoStudy</span> Community
          </p>
        </div>
        <div
          className="relative w-full h-auto flex flex-col gap-20 justify-start items-center
        md:p-24"
        >
          <p
            className="w-full text-center font-semibold text-md md:text-xl bg-[#8449BF]
          bg-opacity-10 p-4"
          >
            Join Co-Study's vibrant community whether you're a student,
            professional, or curious learner. Together, let's turn studying into
            an engaging journey towards excellence. Create your study session
            today and embark on your path to{' '}
            <span className="text-[#8449BF]">academic success</span> with
            Co-Study!
          </p>
          <div className="w-full h-auto flex flex-col items-center gap-5 mb-10">
            <p
              className="w-full text-center font-semibold text-md md:text-xl
              bg-opacity-5 md:p-4"
            >
              Share your thoughts and help us shine. Leave a review and rate
              your
              <span className="text-[#8449BF]"> CoStudy </span> experience
            </p>
            <WebsiteRatingModal />
          </div>
        </div>
        <div className=" w-full h-auto md:pr-16 md:pl-16 flex">
          <span className="text-2xl md:text-4xl font-bold rotate-[-25deg] mr-2 ml-2  text-black">
            +
          </span>
          <p className="text-xl md:text-3xl font-bold text-[#FF6584]">Team</p>
        </div>
        <WechatModal />
      </div>
    </>
  );
};

export default About;
