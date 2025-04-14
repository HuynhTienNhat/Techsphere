import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductImages = ({ images, mainImageUrl }) => {
  const swiperRef = useRef(null);

  const displayImages = (images && images.length > 0)
    ? images.slice(0, 3).map(img =>
        typeof img === 'string' ? { imgUrl: img } : img
      )
    : [{ imgUrl: mainImageUrl || 'https://via.placeholder.com/400' }];

  return (
    <div className="flex-1 max-w-3xl mx-auto">
      {/* Swiper ảnh chính */}
      <Swiper
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        loop={true}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full h-[350px] mb-3 border border-gray-200 rounded-lg bg-white select-none outline-none"
      >
        {displayImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-[350px] flex items-center justify-center">
              <img
                src={image.imgUrl || 'https://via.placeholder.com/400'}
                alt={`Product ${index}`}
                className="h-full object-contain rounded-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400';
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      <div className="w-full flex gap-4 justify-center">
        {displayImages.map((image, index) => (
            <img
                key={index}
                src={image.imgUrl || 'https://via.placeholder.com/100'}
                alt={`Thumbnail ${index}`}
                className="w-16 h-16 object-contain border border-gray-300 rounded-md cursor-pointer"
                onClick={() => {
                    if (swiperRef.current) {
                    swiperRef.current.slideToLoop(index);
                    }
                }}
                onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100';
                }}
            />
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
