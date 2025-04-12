import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/navigation"; 
import "swiper/css/pagination"; 

export default function ProductDisplay({ product }) {
    return (
        <div>
            <Swiper
                modules={[Navigation, Pagination]}
                navigation 
                pagination={{ clickable: true }} 
                loop 
                className="w-full h-64 rounded-md shadow-md"
            >
                {product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={image}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-64 object-cover rounded-md"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
