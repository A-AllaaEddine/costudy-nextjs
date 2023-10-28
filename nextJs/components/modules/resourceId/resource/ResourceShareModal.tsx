import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import {
  IoCopy,
  IoLogoFacebook,
  IoLogoLinkedin,
  IoLogoReddit,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoShareSocialSharp,
} from 'react-icons/io5';
import Toast from '@/components/commun/static/Toast';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'next-share';
import { useRouter } from 'next/router';

const ResourceShareModal = ({
  id,
  title,
  url,
}: {
  id: string;
  title: string;
  url: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const router = useRouter();

  const { mutateAsync: saveReport, isLoading } = trpc.reports.add.useMutation({
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (!selectedTag.length) {
      Toast('warning', 'Plaese select a tag.');
      return;
    }
    if (!reason.length) {
      Toast('warning', 'Plaese write a reason.');
      return;
    }
    try {
      await saveReport({
        resourceId: id,
        tag: selectedTag,
        reason,
      });
      Toast('success', 'Report has been submitted successfully.');
      setSelectedTag('');
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
    } catch (error: any) {
      console.log(error.message);
      if (error.message === 'already reported') {
        Toast('error', 'You have already reported this resource.');
        return false;
      }
      Toast('error', 'There was an error submitting the report.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-auto h-6 sm:h-8 text-black text-lg
                font-semibold bg-transparent  pr-2 pl-2 rounded-full  
                 hover:bg-slate-200 hover:text-black"
        >
          <IoShareSocialSharp className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-5/6 rounded-md">
        <DialogHeader>
          <DialogTitle className="w-full text-start  text-xl">
            Share on
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div
          className=" w-full h-full pt-10 pb-10 flex flex-wrap 
            md:flex-row justify-center items-center gap-8"
        >
          <FacebookShareButton
            className="  flex flex-col justify-center items-center gap-2"
            url={url}
            title={title}
          >
            <IoLogoFacebook
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full p-3
                  hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
            <p className="text-xs font-semibold text-slate-400">Facebook</p>
          </FacebookShareButton>
          <WhatsappShareButton
            className=" flex flex-col justify-center items-center gap-2"
            url={url}
            title={title}
          >
            <IoLogoWhatsapp
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full p-3
                  hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
            <p className="text-xs font-semibold text-slate-400">Whatsapp</p>
          </WhatsappShareButton>
          <TwitterShareButton
            className="  flex flex-col justify-center items-center gap-2"
            url={url}
            title={title}
          >
            <IoLogoTwitter
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full p-3
                  hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
            <p className="text-xs font-semibold text-slate-400">Twitter</p>
          </TwitterShareButton>
          <RedditShareButton
            className=" flex flex-col justify-center items-center gap-2"
            url={url}
            title={title}
          >
            <IoLogoReddit
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full p-3
                  hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
            <p className="text-xs font-semibold text-slate-400">Reddit</p>
          </RedditShareButton>{' '}
          <LinkedinShareButton
            className="  flex flex-col justify-center items-center gap-2"
            url={url}
            title={title}
          >
            <IoLogoLinkedin
              className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-200 rounded-full p-3
                  hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
            <p className="text-xs font-semibold text-slate-400">LinkedIn</p>
          </LinkedinShareButton>
        </div>
        <p className="w-full font-semibold text-center text-slate-400 text-sm">
          Or share with link
        </p>
        <div className="w-full h-12 flex flex-row justify-center items-center gap-3">
          <Input readOnly={true} value={url} className="w-full truncate p-2" />
          <CopyToClipboard
            text={url}
            onCopy={() =>
              Toast('success', 'Link has been copied successfully.')
            }
          >
            <IoCopy
              className="w-10 h-10 p-2 rounded-full bg-slate-200
            hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-50"
            />
          </CopyToClipboard>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceShareModal;
