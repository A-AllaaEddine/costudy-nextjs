'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ResourceCard from '../../commun/static/ResourceCard';

import CardSeleton from '@/components/commun/static/ResourceCardSkeleton';

import { trpc } from '@/app/_trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import Link from 'next/link';

const ResourcesList = () => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => {
        return (
          <div className="w-full flex justify-center items-center h-72 pl-2 pr-2 md:pl-8 md:pr-8  mt-12  mb-12">
            <p className="text-md  font-sans">Something went wrong...</p>
            <p
              className="text-md ml-2 mr-2 underline hover:text-[#8449BF]
                  hover:cursor-pointer font-bold"
              onClick={() => resetErrorBoundary()}
            >
              Retry
            </p>
          </div>
        );
      }}
    >
      <Content />
    </ErrorBoundary>
  );
};

export default ResourcesList;

const Content = () => {
  const {
    data: resources,
    isLoading,
    isError,
    error,
  } = trpc.resources.home.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  if (isError) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full h-72 pl-2 pr-2 md:pl-8 md:pr-8  mt-12  mb-12">
      {!isLoading && resources?.length ? (
        <div className="w-full flex justify-end items-center">
          <Link
            className="text-md font-semibold  text-end h-8
        hover:cursor-pointer hover:text-[#8449BF]"
            href={'/resources'}
          >
            More...
          </Link>
        </div>
      ) : null}

      {isLoading ? (
        <div
          className="w-full h-auto flex justify-start items-center gap-7 overflow-y-hidden overflow-x-scroll
        p-4 scrollbar-hide"
        >
          {Array.from({ length: 6 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton key={idx} />;
          })}
        </div>
      ) : !resources?.length ? (
        <div className="w-full h-56 flex justify-center items-center text-md md:text-2xl font-semibold">
          No resources found
        </div>
      ) : (
        <div className="w-full h-auto space-y-3">
          <Swiper
            modules={[
              // Navigation,
              Pagination,
            ]}
            loop={true}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              430: {
                slidesPerView: 2,
                spaceBetween: 320,
              },
              640: { slidesPerView: 2, spaceBetween: 80 },
              768: { slidesPerView: 3, spaceBetween: 350 },
              1024: { slidesPerView: 3, spaceBetween: 150 },
              1280: { slidesPerView: 4, spaceBetween: 80 },
            }}
            pagination={true}
          >
            {resources?.map((resource: any, idx: number) => {
              return (
                <SwiperSlide key={idx} style={{ paddingBottom: '50px' }}>
                  <ResourceCard resource={resource} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};
