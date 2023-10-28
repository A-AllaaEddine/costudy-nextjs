'use client';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/app/_trpc/client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoFlagSharp } from 'react-icons/io5';

const tags = [
  'Spam',
  'Nudity',
  'Scam',
  'Illegal',
  'Violence',
  'Hate speech',
  'Bug',
  'Other',
];
const ResourceReportModal = ({ resourceId }: { resourceId: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const {
    mutateAsync: saveReport,
    isError,
    error,
    isLoading,
  } = trpc.reports.add.useMutation({
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (!selectedTag.length) {
      toast.error('Plaese select a tag.');
      return;
    }
    if (!reason.length) {
      toast.error('Plaese write a reason.');
      return;
    }
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await saveReport({
            resourceId: resourceId,
            tag: selectedTag,
            type: 'Resource',
            reason,
          });
          if (isError) {
            throw error;
          }
          resolve(true);
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: 'Submitting...',
        success: () => {
          setSelectedTag('');
          setTimeout(() => {
            setIsOpen(false);
          }, 1000);
          return 'Submitted.';
        },
        error: (err) => {
          if (err.message === 'already reported') {
            return 'You have already reported this resource.';
          }
          return 'There was an error submitting the report.';
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-auto h-6 sm:h-8 text-black text-lg
                font-semibold bg-transparent  pr-2 pl-2 rounded-full  
                 hover:bg-slate-200 hover:text-black"
        >
          <IoFlagSharp className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-5/6 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Report</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <p className="text-black font-semibold">
            Why are you reporting this resource?
          </p>
          <p className=" text-slate-400 text-sm">
            Your report is anonymous, and will help us detect issues across the
            platform
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {tags.map((tag, idx) => {
              return (
                <p
                  key={idx}
                  className={`flex flex-row justify-center items-center  w-auto h-8
                    text-sm font-semibold  pr-3 pl-3 
                    rounded-full hover:cursor-pointer
                    ${
                      selectedTag === tag
                        ? 'text-white bg-[#8449BF]'
                        : 'text-slate-500 bg-slate-100'
                    }`}
                  onClick={() =>
                    setSelectedTag((prev) => {
                      if (prev === tag) {
                        return '';
                      }
                      return tag;
                    })
                  }
                >
                  {tag}
                </p>
              );
            })}
          </div>
        </div>
        <div>
          <p className="text-black font-semibold">Reason</p>
          <p className=" text-slate-400 text-sm">
            Help us understand the problem
          </p>
          <Textarea
            className="mt-2 bg-slate-100 resize-none"
            placeholder="Describe the reason..."
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button
            className="w-auto h-10 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
            type="submit"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                {' '}
                <Spinner className="text-white h-6 w-6" />
                <p className="font-semibold">Saving...</p>
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceReportModal;
