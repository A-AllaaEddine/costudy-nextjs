import { Resource } from '@/types/types';
import FilePage from './filePage';
import VideoPage from './videoPage';

const Main = ({ resource }: { resource: Resource }) => {
  return (
    <div
      className=" w-full h-full flex flex-col justify-start items-center 
      pl-3 pr-3 md:pl-8 md:pr-8 "
    >
      {resource?.type === 'video' && <VideoPage resource={resource} />}
      {resource?.type !== 'video' && <FilePage resource={resource} />}
    </div>
  );
};

export default Main;
