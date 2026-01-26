"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import "swiper/css";
import "swiper/css/pagination";
import abandonData from '../../abandonanimal.json';
import { useToggleNav } from "../components/hooks/useToggleNav";
import Header from "../components/main/Header";

interface SlideData {
  sigun: string;
  state: string; // 보호중
  begindate: number;
  number: string;
  enddate: number;
  color: string;
  age: string;
  kg: string;
  sex: string;
  spray: string;
  shelter: string;
  address: string;
  thnail: string; // 썸네일 이미지
  img: string;
  tel: string;
  info: string;
}

const Adaoption = () => {
  const { isNavOpen, toggleNav } = useToggleNav(false);

  // useQuery가 데이터를 직접 fetch하고 캐싱하게 한다.
  const { data: adoptData, isLoading, error } = useQuery({
    queryKey: ['abandonani'], // 키값으로 데이터 캐싱
    queryFn: () => {
      return abandonData as any[];
    },
    select: (data) => {
      return data
      .filter((data) => data.STATE_NM === "보호중")
      .map((data) => ({
        sigun: data.SIGUN_NM,
        number: data.PBLANC_IDNTFY_ID,
        state: data.STATE_NM, // 보호중
        begindate: data.PBLANC_BEGIN_DE,
        enddate: data.PBLANC_END_DE,
        color: data.COLOR_NM,
        age: data.AGE_INFO,
        kg: data.BDWGH_INFO,
        sex: data.SEX_NM,
        info: data.SFETR_INFO,
        spray: data.NTRZN_YN,
        shelter: data.SLTR_NM,
        addressgi: data.REFINE_ROADNM_ADDR,
        address: data.REFINE_LOTNO_ADDR,
        img: data.IMAGE_COURS,
        thnail: data.THNAIL_IMAGE_COURS,
        tel: data.SLTR_TELNO,
      }));
    }
  });
  if (isLoading) return <div>데이터를 불러오는 중...</div>
  if (error) return <div>에러 발생: {(error as Error).message}</div>
  
  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className="w-full relative overflow-visible mb-30">
        <h1 className="flex justify-center text-3xl p-10">💗 유기동물 입양</h1>
        <div className="flex flex-col justify-center items-center">
          {adoptData.slice(0, 20).map((data: any, index: number) => (
            <div
              key={index}
              className="flex items-start rounded-3xl mb-10 ml-10"
              style={{
                backgroundColor: "#f3f4f6",
                width: "70%",
                height: "400px",
                padding: "10px",
              }}
            >
              {/* 이미지 */}
              <div className="flex flex-col items-start m-10 space-y-1" style={{ width: "350px" }}>
                <div
                  style={{
                    backgroundImage: `url(${data.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    width: "300px",
                    height: "300px",
                    borderRadius: "10px",
                  }}
                />
              </div>

              <div className="w-px h-95 bg-gray-300" />
              {/* 텍스트 */}
              <div
                className="flex flex-col items-start text-black text-base m-10 space-y-1"
                style={{ width: "350px" }}
              >
                <p className="text-2xl mb-5">공고고유번호 : {data.number}</p>
                <p className="mb-2">상 태 : {data.state}</p>
                <p className="mb-2">나 이 : {data.age}</p>
                <p className="mb-2">성 별 : {data.sex}</p>
                <p className="mb-2">체 중 : {data.kg}</p>
                <p className="mb-2">색 상 : {data.color}</p>
                <p className="mb-2">특 징 : {data.info}</p>
              </div>
              <div className="w-px h-95 bg-gray-300" />
              <div
                className="flex flex-col items-start m-10 space-y-1"
                style={{ width: "350px" }}
              >
                <p className="mb-2">보호소명 : {data.shelter}</p>
                <p className="mb-2">보호소 전화번호 : {data.tel}</p>
                <p className="mb-2">주 소 : {data.address}</p>
                <p className="mb-2">공고시작일 : {data.begindate}</p>
                <p className="mb-2">공고종료일 : {data.enddate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Adaoption;
