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
import { useState } from 'react';
import { Rating } from 'react-simple-star-rating';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { trpc } from '@/utils/trpc';
import { GoCodeReview } from 'react-icons/go';
import Toast from '@/components/commun/static/Toast';
import Spinner from '@/components/commun/static/spinner';

const ResourceRatingModal = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(true);

  const { mutateAsync: saveReview, isLoading } =
    trpc.reviews.resource.add.useMutation({
      onError: (error) => {
        console.log(error);
      },
    });

  const handleSubmit = async () => {
    if (rating === 0) {
      Toast('error', 'Please select a rating!');
      return;
    }
    if (!review.length) {
      Toast('error', 'Please leave your review!');
      return;
    }

    try {
      await saveReview({
        id: id,
        rating,
        review,
        isRecommended,
      });
      Toast('success', 'Your review has been submitted successfully.');
      setReview('');
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      if (error.message === 'Review exists already.') {
        Toast('error', 'You have already reviewed this resource.');
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
          className="w-auto h-6 md:h-8 text-black text-lg
          font-semibold bg-transparent  pr-2 pl-2 rounded-full  
           hover:bg-slate-200 hover:text-black"
        >
          <GoCodeReview className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] md:w-4/5 rounded-md">
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
          className="w-auto"
        />
        <Textarea
          placeholder="Write your reviews"
          onChange={(e) => setReview(e.target.value)}
        />
        <Label htmlFor="recommendation" className="hover:cursor-pointer">
          Do you recommend this resource for your friends?
        </Label>

        <RadioGroup defaultValue="true">
          <div
            className="flex items-center space-x-2"
            onClick={() => setIsRecommended(true)}
          >
            <RadioGroupItem value="true" id="r1" />
            <Label htmlFor="r1">Yes</Label>
          </div>
          <div
            className="flex items-center space-x-2"
            onClick={() => setIsRecommended(false)}
          >
            <RadioGroupItem value="false" id="r2" />
            <Label htmlFor="r2">No</Label>
          </div>
        </RadioGroup>
        <DialogFooter className="mt-4">
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

export default ResourceRatingModal;

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
