import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CardSeleton = () => {
  return (
    <Card
      className={`max-w-[22rem]  min-w-[18rem]  sm:w-[22rem] h-[18rem]
             bg-white border-[1px] rounded-xl drop-shadow-md shadow-md
             hover:cursor-pointer p-0`}
    >
      <CardHeader>
        <Skeleton
          className={`w-full h-10  overflow-hidden rounded-2xl  text-md sm:text-2xl font-bold`}
        />
      </CardHeader>
      <CardContent className=" h-auto">
        <Skeleton className="h-5 mt-2 w-2/3 rounded-2xl" />
        <Skeleton className="h-5 mt-2 w-2/3 rounded-2xl" />
        <Skeleton className="h-5 mt-2 w-2/3 rounded-2xl" />
        <Skeleton className="h-5 mt-2 w-2/3 rounded-2xl" />
      </CardContent>
      <CardFooter className="w-full h-6 flex justify-end items-center">
        <Skeleton className="h-5 w-2/4 mt-2  rounded-2xl" />
      </CardFooter>
    </Card>
  );
};

export default CardSeleton;
