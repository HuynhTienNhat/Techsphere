import { models } from './../../assets/data/Models';
import { banners } from './../../assets/data/Banners';
import {smallBanners} from './../../assets/data/SmallBanners';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomeHero() {
    const liElements = models.map(model => (
        <li key={model.id} className="w-full group">
            <a 
                href="#" 
                className="flex justify-between items-center w-full h-13 p-3 rounded-md transition duration-200 hover:bg-gray-200"
            >
                <div className="flex items-center gap-3">
                    <img src={model.logo} alt={model.name} className="w-6 h-6 mx-2" />
                    <span className="text-gray-700 font-medium group-hover:text-violet-600">{model.name}</span>
                </div>
            </a>
        </li>
    ))

    const slideElements = banners.map((banner) => (
        <SwiperSlide key={banner.id}>
            <img 
                src={banner.src} 
                alt={`Banner ${banner.id}`} 
                className="w-full h-auto rounded-lg object-cover image-container"
                loading="lazy"
            />
        </SwiperSlide>
    ));
    
    const smallBannerElements = smallBanners.map(banner => (
        <li key={banner.id} className= 'w-full h-31 image-container'>
            <img src={banner.src} alt={`Small banner with id ${banner.id}`} />
        </li>
    ))

    // document.querySelector(".home-slider").addEventListener("dblclick", (event) =>{
    //     event.preventDefault();
    //     event.stopPropagation();
    // })
    
    return (
        <div className="home-hero px-30 mt-10 flex justify-between items-stretch">
            <div className="home-category bg-white shadow-lg rounded-xl w-55 overflow-y-auto h-66">
                <ul className="divide-y divide-gray-100">
                    {liElements}
                </ul>
            </div>
            <div className="home-slider w-full max-w-200 mx-auto mb-10 flex-1 h-full image-container">
                <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={0}
                    slidesPerView={1}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation={true}
                    loop={true}
                >
                    {slideElements}
                </Swiper>
            </div>

            <div className='flex-col flex-1 h-full jusity-between  max-w-50'>
                <ul className='flex-col flex space-y-2 h-full '>
                    {smallBannerElements}
                </ul>
            </div>
        </div>      
    )
}