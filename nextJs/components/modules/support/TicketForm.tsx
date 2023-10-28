'use client';

import { trpc } from '@/app/_trpc/client';
import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChangeEvent, SyntheticEvent, useState } from 'react';
import toast from 'react-hot-toast';

type FormFields = {
  email: string;
  subject: string;
  message: string;
};
const defaultFormFields = {
  email: '',
  subject: '',
  message: '',
};

const TicketForm = () => {
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const [selectedTag, setSelectedTag] = useState<string>('');

  const tags = ['Bug', 'Issue', 'Authentication', 'Others'];

  const {
    mutateAsync: opneTicket,
    isLoading,
    isError,
    error,
  } = trpc.tickets.add.useMutation();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormFields((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!formFields?.email.length) {
      toast.error('Please enter a valid email!');
      return;
    }
    if (!formFields?.subject.length) {
      toast.error('Please write your subject!');
      return;
    }
    if (!formFields?.message.length) {
      toast.error('Please write your message!');
      return;
    }
    if (!selectedTag) {
      toast.error('Please select a tag!');
      return;
    }

    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await opneTicket({
            ...formFields,
            tag: selectedTag,
          });

          if (isError) {
            throw error;
          }
          resolve(true);
        } catch (error: any) {
          reject(error.message);
        }
      }),
      {
        loading: 'Submitting...',
        success: () => {
          return 'Submitted.';
        },
        error: (err) => {
          if (err.message === 'ticket exist') {
            return 'You have already opened a ticket.';
          }
          return 'There was an error processing your request!';
        },
      }
    );
  };

  return (
    <form
      className="w-[90%] md:w-[450px] h-auto flex flex-col justify-start items-center gap-4
        rounded-md border-[1px] border-slate-200 p-4 bg-slate-50"
      onSubmit={handleSubmit}
    >
      <Label className="text-md font-semibold w-full">Email</Label>
      <Input
        type="text"
        name="email"
        placeholder="Email"
        value={formFields?.email}
        onChange={handleChange}
      />
      <Label className="text-md font-semibold w-full">Subject</Label>
      <Input
        type="text"
        name="subject"
        placeholder="Subject"
        value={formFields?.subject}
        onChange={handleChange}
      />
      <div className="w-full flex flex-wrap justify-start gap-3 mt-4">
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
      <Label className="text-md font-semibold w-full resize-none">
        Message
      </Label>
      <Textarea
        name="message"
        value={formFields?.message}
        onChange={handleChange}
        className="resize-none"
      />
      <Button
        className="w-auto h-10 text-white text-lg
              font-semibold bg-black border-2 border-[#1D1D1F] hover:border-[#8449BF]
              hover:bg-[#8449BF] hover:text-white flex justify-center items-center gap-2"
        type="submit"
      >
        {isLoading ? (
          <>
            <Spinner className="text-white h-6 w-6" />
            <p className="font-semibold">Saving...</p>
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </form>
  );
};

export default TicketForm;
