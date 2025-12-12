"use client";
import React, { useEffect, useState } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import abandonarni from "../../abandonanimal.json";
import "./css/embla.css"


type PropType = {
  slides: number[]
  options?: EmblaOptionsType
}

interface SlideData {
    state: string;
    kg: any;
    age: string;
    img: any;
    shelter: string;
    address: string;
    enddate: number;
}

const AdoptEmblaCarousel: React.FC<PropType> = (props) => {
  const [adoptData, setAdoptData] = useState<SlideData[]>([]);
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    AutoScroll({ playOnInit: false, stopOnMouseEnter: false, stopOnInteraction: false })
  ])
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const adoptData = (abandonarni as any[]).filter((data) => data.STATE_NM === "보호중")
    .slice(0, 10)
    .map((data: any) => ({
        state: data.STATE_NM, // 보호중
        enddate: data.PBLANC_END_DE,
        age: data.AGE_INFO,
        kg: data.BDWGH_INFO,
        img: data.IMAGE_COURS,
        sex: data.SEX_NM,
        shelter: data.SLTR_NM,
        address: data.REFINE_LOTNO_ADDR,
    }));
    setAdoptData(adoptData);

    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return
    
    autoScroll.play()

    setIsPlaying(autoScroll.isPlaying())
    emblaApi
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('reInit', () => setIsPlaying(autoScroll.isPlaying()))
  }, [emblaApi])

  return (
      <>
      <h1 className="text-3xl p-8">💗 보호소 입양</h1>
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {adoptData.map((data: any, index: any) => (
                <div className="embla__slide" key={index}>
                  <div className="embla__slide__number">
                    <div className='flex flex-col items-start rounded-2xl' 
                    style={{ backgroundColor: "#f3f4f6", width: "280px", height: "300px", padding: "10px",}}>
                        <div className='self-center rounded-2xl ml-2' 
                        style={{ backgroundImage: `url(${data.img})`, backgroundSize: "cover", backgroundPosition: "center", width: "260px", height: "200px", borderRadius: "5px", marginRight: "5px"}}/>
                        <div className="flex flex-col items-start text-black text-base mt-3 space-y-1 mb-2">
                            <span>{data.state}</span>
                            <span>{data.age} | {data.kg}</span>
                            <span>{data.shelter}</span>
                            <span>공고종료일 : {data.enddate}</span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
  )
}

export default AdoptEmblaCarousel
