import { useRouter } from 'next/router';
import { Resource } from '@/types/types';
import { ForwardedRef, forwardRef, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { IoEye, IoBookmark } from 'react-icons/io5';
import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';
import ResourceModal from './ResourceModal';

const ResourceCard = forwardRef(
  (
    { resource, userBookmarks }: { resource: Resource; userBookmarks?: any },
    ref: ForwardedRef<any>
  ) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const badgeType = {
      pdf: (
        <Badge variant="secondary" className="flex gap-1 text-xs">
          PDF <AiFillFilePdf />
        </Badge>
      ),
      ppt: (
        <Badge variant="secondary" className="flex gap-1 text-xs">
          PPT <AiFillFilePpt />
        </Badge>
      ),
      docx: (
        <Badge variant="secondary" className="flex gap-1 text-xs">
          DOCX <AiFillFileWord />
        </Badge>
      ),
      video: (
        <Badge variant="secondary" className="flex gap-1 text-xs">
          VIDEO <AiFillVideoCamera />
        </Badge>
      ),
    };
    const bgColor = {
      pdf: 'bg-[#FF0089] bg-opacity-10',
      ppt: 'bg-[#FF0089] bg-opacity-10',
      docx: 'bg-[#000000] bg-opacity-10',
      video: 'bg-[#8449BF] bg-opacity-10',
    };

    const cardBody = (
      <Card
        className={`max-w-[22rem] min-w-[22rem] w-full sm:w-[22rem] h-auto
             bg-white border-[1px] rounded-xl drop-shadow-md shadow-md
             hover:cursor-pointer`}
      >
        <CardHeader>
          <CardTitle
            className={` w-full h-12  overflow-hidden  text-md sm:text-2xl font-bold`}
          >
            <div
              className={`${
                resource?.title?.length > 23 &&
                'whitespace-nowrap animate-scrolling'
              }`}
            >
              {resource?.title}
            </div>
          </CardTitle>
          <div className="h-6 flex gap-1">
            {badgeType[resource?.type]}
            {/* <Badge variant="secondary" className="flex gap-1">
              382 <IoEye />
            </Badge>
            <Badge variant="secondary" className="flex gap-1">
              2.4k <IoBookmark />
            </Badge> */}
          </div>
        </CardHeader>
        <CardContent>
          <p
            className={`${
              resource?.class?.length > 30
                ? `  whitespace-nowrap animate-scrolling`
                : ''
            } text-sm`}
          >
            Class <span className="font-semibold">{resource?.class}</span>
          </p>
          <p
            className={`${
              resource?.major?.length > 31
                ? `text-md  whitespace-nowrap animate-scrolling`
                : 'text-md'
            } text-sm`}
          >
            Major <span className="font-semibold">{resource?.major}</span>
          </p>
          <p className="text-sm">
            Degree <span className="font-semibold">{resource?.degree}</span>
          </p>
          <p className="text-sm">
            Year <span className="font-semibold">{resource?.year}</span>
          </p>
        </CardContent>
        <CardFooter>
          <p className="w-full flex justify-end text-sm gap-1">
            By <span className="font-semibold"> {resource?.by}</span>
          </p>
        </CardFooter>
      </Card>
    );
    const content = ref ? (
      <div ref={ref} onClick={() => setIsOpen(true)}>
        {cardBody}
      </div>
    ) : (
      <div onClick={() => setIsOpen(true)}>{cardBody}</div>
    );
    return (
      <>
        <ResourceModal
          resource={resource}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userBookmarks={userBookmarks}
        />
        {content}
      </>
    );
  }
);

export default ResourceCard;
