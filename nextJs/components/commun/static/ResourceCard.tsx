import { Resource } from '@/types/types';
import { ForwardedRef, forwardRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';
import ResourceModal from '@/components/modules/resourceId/resource/ResourceModal';
import ToolTip from './ToolTip';

const ResourceCard = forwardRef(
  (
    { resource, userBookmarks }: { resource: Resource; userBookmarks?: any },
    ref: ForwardedRef<any>
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const badgeType: Record<any, any> = {
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

    const cardBody = (
      <Card
        className={`max-w-[22rem]  w-[18rem]  sm:w-[22rem] h-[18rem]
             bg-white border-[1px] rounded-xl drop-shadow-md shadow-md
             hover:cursor-pointer p-0`}
      >
        <CardHeader>
          <CardTitle
            className={`w-full h-12  overflow-hidden  text-md sm:text-2xl font-bold`}
          >
            <ToolTip
              children={<p className="truncate">{resource?.title}</p>}
              tooltip={resource?.title}
            />
          </CardTitle>
          <div className="h-6 flex gap-1">{badgeType[resource?.type]}</div>
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
