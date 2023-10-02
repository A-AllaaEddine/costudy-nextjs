import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ResourceCard from '../../commun/static/ResourceCard';

import CardSeleton from '@/components/commun/static/ResourceCardSkeleton';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

const ResourcesList = () => {
  const router = useRouter();

  const {
    data: resources,
    isLoading,
    isError,
    error,
  } = trpc.resources.home.get.useQuery();

  if (isError) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full h-72 pl-2 pr-2 md:pl-8 md:pr-8  mt-12  mb-12">
      {!isLoading && resources?.length ? (
        <p
          className="text-md font-semibold w-full text-end h-8
         hover:cursor-pointer hover:text-[#8449BF]"
          onClick={() => router.push('/resources')}
        >
          More...
        </p>
      ) : null}

      {isLoading ? (
        <div
          className="w-full h-auto flex justify-start items-center gap-7 overflow-y-hidden overflow-x-scroll
          p-4 scrollbar-hide"
        >
          {Array.from({ length: 6 }, (_, i) => i).map((__, idx) => {
            return <CardSeleton />;
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

export default ResourcesList;
