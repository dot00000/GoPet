
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./FestivalList.module.css";

import { Pagination, Navigation, Autoplay } from "swiper/modules";

export default function FestivalList() {
  return (
    <div className="flex items-center justify-center">
      <Swiper
        initialSlide={0}
        slidesPerView={1}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        navigation={true}
        pagination={true}
        style={{ width: "500px", height: "300px"}}
        modules={[ Autoplay, Navigation, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide style={{ position: "relative"}}>
          <Image
            src="/images/festival/petshow.jpg"
            alt="펫쇼"
            fill
            priority
          />
        </SwiperSlide>

        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
  );
}
