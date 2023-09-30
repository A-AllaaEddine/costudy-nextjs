import Spinner from '@/components/commun/static/spinner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Resource } from '@/types/types';
import { trpc } from '@/utils/trpc';
import { SyntheticEvent, useState } from 'react';
import {
  AiFillFilePdf,
  AiFillFilePpt,
  AiFillFileWord,
  AiFillVideoCamera,
} from 'react-icons/ai';
import { IoMdMore } from 'react-icons/io';
import DeleteResourceModal from '../modals/resource/DeleteResourceModal';
import DownloadsModal from '../modals/resource/DownloadsModal';
import ViewsModal from '../modals/resource/ViewsModal';

import Link from 'next/link';
import EditFileModal from '../modals/resource/EditFileModal';
import EditThumbnail from '../modals/resource/EditThumbnail';
import EditInfoModal from '../modals/resource/EditInfoModal';

const badgeType: Record<any, any> = {
  pdf: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFilePdf className="w-4/5 h-4/5" />
    </div>
  ),
  ppt: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFilePpt className="w-4/5 h-4/5" />
    </div>
  ),
  docx: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillFileWord className="w-4/5 h-4/5" />
    </div>
  ),
  video: (
    <div className="flex gap-1 text-xs w-4/5 h-4/5 justify-center items-center">
      <AiFillVideoCamera className="w-4/5 h-4/5" />
    </div>
  ),
};

const Resources = () => {
  const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
  const [isThumbModalOpen, setIsThumbModalOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isViewsModalOpen, setIsViewsModalOpen] = useState<boolean>(false);
  const [isDownloadsModalOpen, setIsDownloadsModalOpen] =
    useState<boolean>(false);
  const [selectedResource, setSelectResource] = useState<Resource | undefined>(
    undefined
  );
  const [filter, setFilter] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');

  const filterResult = (e: SyntheticEvent) => {
    e.preventDefault();
    setKeyword(filter);
  };

  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    refetch: refetchResources,
  } = trpc.admin.resources.get.useInfiniteQuery(
    {
      keyword: keyword,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  const resources: Resource[] = data?.pages.reduce((acc: any, page) => {
    return [...acc, ...page.data];
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col justify-start items-center
        gap-3"
    >
      {isFetching ? (
        <div className="min-h-screen w-full flex flex-col justify-center items-center">
          <div className="w-12 h-12 lg:w-16 lg:h-16">
            <Spinner className="text-[#8449BF] h-12 w-12" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col justify-start items-center gap-5">
          <form
            onSubmit={filterResult}
            className="w-full h-12 flex justify-end items-center gap-3"
          >
            <Button
              className="w-auto h-8 bg-white border-slate-500 text-slate-500 border-[1px] rounded-md 
                  hover:bg-[#8449BF] hover:border-[#8449BF] hover:text-white"
              type="submit"
            >
              Filter
            </Button>
            <Input
              type="text"
              name="keyword"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-2/5 h-8"
            />
          </form>
          <div
            className="w-full h-14 flex justify-between items-center
                      border-slate-500 rounded-xl pr-2 pl-2 gap-3
                    "
          >
            <div className="w-10 h-10 flex justify-center items-center">
              <div className=" min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5  flex justify-center items-center"></div>
            </div>
            <div className="w-full min-w-[7rem] flex justify-start items-center text-start text-md font-bold truncate">
              Title
            </div>
            <div
              className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
            >
              <p
                className={`w-auto h-auto text-md font-bold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
              >
                Views
              </p>
            </div>
            <div
              className={`w-28 min-w-[7rem]  h-full flex justify-center items-center
                   `}
            >
              <p
                className={`w-auto h-8 text-md font-bold pr-2 pl-2 pt-1 pb-1 rounded-md
                    `}
              >
                Downloads
              </p>
            </div>
            <div className="w-28 h-full flex justify-center items-center gap-2">
              <p className="text-md font-bold">Actions</p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center gap-4">
            {resources?.map((resourse: Resource) => {
              return (
                <div
                  key={resourse.id}
                  className="w-full h-14 flex justify-between items-center
                    bg-slate-100 bg-opacity-80  border-slate-500 rounded-xl pr-2 pl-2 gap-3
                    hover:cursor-pointer hover:bg-[#8449BF] hover:bg-opacity-20"
                >
                  <div className="w-10 h-10 flex justify-center items-center">
                    <div className=" min-w-[2.5rem] min-h-[2.5rem] w-4/5 h-4/5 rounded-full bg-slate-200 flex justify-center items-center">
                      {badgeType[resourse?.type!]}
                    </div>
                  </div>
                  <div className="w-full flex justify-start items-center text-start text-md font-semibold">
                    {resourse?.title}
                  </div>
                  <div className="w-auto h-full flex justify-center items-center gap-2">
                    <div
                      className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                   `}
                    >
                      <Button
                        className="w-auto h-8 bg-white border-slate-500 text-slate-500 border-[1px] rounded-md 
                  hover:bg-[#8449BF] hover:border-[#8449BF] hover:text-white"
                        onClick={() => {
                          setSelectResource(resourse!);
                          setIsViewsModalOpen(true);
                        }}
                      >
                        Views
                      </Button>
                    </div>
                    <div
                      className={`w-28 min-w-[7rem] h-full flex justify-center items-center
                        `}
                    >
                      <Button
                        className="w-auto h-8 bg-white border-slate-500 text-slate-500 border-[1px] rounded-md 
                  hover:bg-[#8449BF] hover:border-[#8449BF] hover:text-white"
                        onClick={() => {
                          setSelectResource(resourse!);
                          setIsDownloadsModalOpen(true);
                        }}
                      >
                        Downloads
                      </Button>
                    </div>
                  </div>
                  <div className="w-28 h-full flex justify-center items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <IoMdMore className="h-6 w-6" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link
                          href={`/resources/${resourse?.id!}`}
                          target="_blank"
                        >
                          <DropdownMenuItem className="hover:cursor-pointer font-semibold">
                            Open Page
                          </DropdownMenuItem>
                        </Link>
                        {resourse?.type === 'pdf' && (
                          <DropdownMenuItem
                            className="hover:cursor-pointer font-semibold"
                            onClick={() => {
                              setIsFileModalOpen(true);
                              setSelectResource(resourse!);
                            }}
                          >
                            Edit File
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="hover:cursor-pointer font-semibold"
                          onClick={() => {
                            setIsThumbModalOpen(true);
                            setSelectResource(resourse!);
                          }}
                        >
                          Edit Thumbnail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:cursor-pointer font-semibold"
                          onClick={() => {
                            setIsInfoModalOpen(true);
                            setSelectResource(resourse!);
                          }}
                        >
                          Edit Infos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-md hover:cursor-pointer 
                        text-[#ff5e52] font-semibold sm:text-md text-sm hover:bg-[#ff5e52]
                        hover:text-white"
                          onClick={() => {
                            setIsDeleteModalOpen(true);
                            setSelectResource(resourse!);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <ViewsModal
        isOpen={isViewsModalOpen}
        setIsOpen={setIsViewsModalOpen}
        resource={selectedResource!}
      />
      <DownloadsModal
        isOpen={isDownloadsModalOpen}
        setIsOpen={setIsDownloadsModalOpen}
        resource={selectedResource!}
      />
      <DeleteResourceModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditFileModal
        isOpen={isFileModalOpen}
        setIsOpen={setIsFileModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditThumbnail
        isOpen={isThumbModalOpen}
        setIsOpen={setIsThumbModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
      <EditInfoModal
        isOpen={isInfoModalOpen}
        setIsOpen={setIsInfoModalOpen}
        resource={selectedResource!}
        refetchResources={refetchResources}
      />
    </div>
  );
};

export default Resources;
