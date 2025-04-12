import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Styles cơ bản của Swiper
import "swiper/css/navigation"; // Styles cho nút navigation
import "swiper/css/pagination"; // Styles cho pagination

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
