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
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import Spinner from '../Spinner/spinner.component';

const RatingModal = ({
  t,
  onSubmit,
  isLoading,
  isOpen = false,
  setIsOpen,
  website = false,
}: {
  t?: any;
  onSubmit: ({
    rating,
    review,
    isRecommended,
  }: {
    rating: number;
    review: string;
    isRecommended?: boolean;
  }) => Promise<void> | void;
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  website?: boolean;
}) => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');
  const [isRecommended, setIsRecommended] = useState<boolean>(true);

  const { data: session } = useSession();
  const router = useRouter();

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
      {session?.user?.id ? (
        <DialogContent className="w-4/5">
          <DialogHeader>
            <DialogTitle className="text-xl">Leave a review</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Rating
            transition
            allowFraction
            showTooltip
            SVGstyle={{ display: 'inline' }}
            tooltipArray={tooltipArray}
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
              type="submit"
              className="w-auto  text-white text-lg
                font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                 hover:bg-[#8449BF] hover:text-black"
              onClick={() =>
                onSubmit({
                  rating,
                  review,
                  isRecommended: isRecommended ? isRecommended : false,
                })
              }
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : (
        <DialogContent className="w-4/5">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">
              You need to be logged in to submit a review.
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {isLoading ? (
              <div
                className="w-auto  text-white text-lg
                font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
               hover:bg-[#8449BF] hover:text-black"
              >
                <Spinner height="2rem" width="2rem" bgColor="#1D1D1F" />
              </div>
            ) : (
              <Button
                type="submit"
                className="w-auto  text-white text-lg
                    font-semibold bg-[#8449BF] pr-4 pl-4 rounded-md  
                     hover:bg-[#8449BF] hover:text-black"
                onClick={() =>
                  router.push({
                    pathname: '/login',
                    query: {
                      destination: encodeURIComponent(router.asPath),
                    },
                  })
                }
              >
                Log in
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default RatingModal;

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
