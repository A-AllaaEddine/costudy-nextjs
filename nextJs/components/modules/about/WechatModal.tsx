'use client';

import AllaaEddine from '@/public/AllaaEddine2.jpg';
import AllaaEddineWechat from '@/public/AllaaEddineWechat.jpg';
import Paulo from '@/public/Paulo.png';
import PauloWechat from '@/public/PauloWechat.png';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IoLogoInstagram, IoLogoLinkedin } from 'react-icons/io';
import { IoLogoWechat } from 'react-icons/io5';

const WechatModal = () => {
  const [isWechatOpen, setIsWechatOpen] = useState<boolean>(false);
  const [wechat, setWechat] = useState<any>(null);

  return (
    <>
      <div
        className="relative w-full h-auto flex flex-row justify-center sm:justify-start items-center
            md:p-24 gap-10 mb-10"
      >
        <div className="flex flex-col justify-start items-center">
          <Image
            src={AllaaEddine}
            alt="Allaa Eddine"
            width={100}
            height={100}
            quality={100}
            className="h-32 w-32 rounded-full border-4 "
          />
          <div className="flex flex-col justify-center items-center">
            <p className="text-xl font-semibold ">Allaa Eddine</p>
            <div className="flex flex-row flex-wrap gap-4 h-auto mt-3 p-2">
              <Link
                target="_blank"
                href="https://www.instagram.com/a.allaaeddine/"
              >
                <IoLogoInstagram className="w-5 h-5" />
              </Link>
              <p
                onClick={() => {
                  setWechat(AllaaEddineWechat);
                  setIsWechatOpen(true);
                }}
                className="hover:cursor-pointer"
              >
                <IoLogoWechat className="w-5 h-5" />
              </p>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/allaa-eddine-riad-amiar/"
              >
                <IoLogoLinkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start items-center">
          <Image
            src={Paulo}
            alt="Allaa Eddine"
            width={100}
            height={100}
            quality={100}
            className="h-32 w-32 rounded-full border-4 "
          />
          <div className="flex flex-col justify-center items-center">
            <p className="text-xl font-semibold ">Paulo</p>
            <div className="flex flex-row flex-wrap gap-4 h-auto mt-3 p-2">
              {/* <Link href="/instagram">
                  <IoLogoInstagram className="w-5 h-5" />
                </Link> */}
              <p
                onClick={() => {
                  setWechat(PauloWechat);
                  setIsWechatOpen(true);
                }}
                className="hover:cursor-pointer"
              >
                <IoLogoWechat className="w-5 h-5" />
              </p>
              {/* <Link href="/linkedin">
                  <IoLogoLinkedin className="w-5 h-5" />
                </Link> */}
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isWechatOpen} onOpenChange={setIsWechatOpen}>
        <DialogContent className="flex flex-col justify-center items-center">
          <Image
            src={wechat}
            alt="wechat"
            width={100}
            height={100}
            quality={100}
            unoptimized
            className="w-4/5 h-4/5"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WechatModal;
