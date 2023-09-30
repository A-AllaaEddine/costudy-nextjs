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
import { Dispatch, SetStateAction, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import Spinner from '../static/spinner';
import { trpc } from '@/utils/trpc';
import Toast from '../static/Toast';
import { useSession } from 'next-auth/react';

const WebsiteRatingModal = ({ t }: { t?: any }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  const {
    mutateAsync: saveReview,
    isError,
    error,
    isLoading,
  } = trpc.reviews.website.add.useMutation({
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast('warning', 'Please select a rating!');
      return;
    }
    if (!review.length) {
      Toast('warning', 'Please leave your review!');
      return;
    }

    try {
      await saveReview({
        rating,
        review,
      });
      Toast('success', 'Your review has been submitted successfully.');
      setReview('');
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      if (error.message === 'Review exists already.') {
        Toast('error', 'You have already submitted a review.');
        return;
      }
      Toast(
        'error',
        'There was an error submitting your review. Please try again later.'
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-auto h-12 text-white text-lg
                font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                 hover:bg-[#8449BF] hover:text-black"
        >
          Review Us!
        </Button>
      </DialogTrigger>
      <DialogContent className="w-4/5 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Leave a review</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Rating
          transition
          allowFraction
          SVGstyle={{ display: 'inline' }}
          fillColorArray={fillColorArray}
          SVGclassName="w-10 h-10 flex flex-row justify-center items-center"
          onClick={setRating}
        />
        <Textarea
          placeholder="Write your reviews"
          onChange={(e) => setReview(e.target.value)}
        />
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

export default WebsiteRatingModal;

const tooltipArray = [
  'Terrible',
  'Terrible+',
  'Bad',
  'Bad+',
  'Average',
  'Average+',
  'Great',
  'Great+',
  'Awesome',
  'Awesome+',
];
const fillColorArray = [
  '#f17a45',
  '#f17a45',
  '#f19745',
  '#f19745',
  '#f1a545',
  '#f1a545',
  '#f1b345',
  '#f1b345',
  '#f1d045',
  '#f1d045',
];
