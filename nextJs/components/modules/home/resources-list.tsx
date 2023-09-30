import { Resource } from '@/types/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ResourceCard from '../../commun/static/ResourceCard';

const ResourcesList = ({ resources }: { resources: Resource[] }) => {
  return (
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
        // navigation={{
        //   prevEl: prevRef.current,
        //   nextEl: nextRef.current,
        // }}

        pagination={true}
      >
        {(resources as Resource[])?.map((resource, idx) => {
          return (
            <SwiperSlide key={idx} style={{ paddingBottom: '50px' }}>
              <ResourceCard resource={resource} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ResourcesList;
