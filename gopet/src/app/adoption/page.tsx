"use client";

import { useQuery } from "@tanstack/react-query";
import { useToggleNav } from "../components/hooks/useToggleNav";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import abandonData from "../../abandonanimal.json";
import Header from "../components/main/Header";


const Adaoption = () => {
  const { isNavOpen, toggleNav } = useToggleNav(false);
  
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const pageLimit = 5;
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

  const {
    data: adoptData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["abandonani"], // 키값으로 데이터 캐싱
    queryFn: () => {
      return abandonData as any[];
    },
    staleTime: Infinity,
    select: (data) => {
      return data
        .filter((item) => {
          const protecting = item.STATE_NM === "보호중";
          const notExpired = String(item.PBLANC_END_DE) >= today;
          return protecting && notExpired;
        })

        .map((data) => ({
          number: data.PBLANC_IDNTFY_ID,
          state: data.STATE_NM, // 보호중
          begindate: data.PBLANC_BEGIN_DE,
          enddate: data.PBLANC_END_DE,
          age: data.AGE_INFO,
          kg: data.BDWGH_INFO,
          sex: data.SEX_NM,
          shelter: data.SLTR_NM,
          img: data.IMAGE_COURS,
          tel: data.SLTR_TELNO,
        }));
        
    },
  });
  if (isLoading) return <div>데이터를 불러오는 중...</div>;
  if (error) return <div>에러 발생: {(error as Error).message}</div>;

  
  // pagination 현재 데이터
  const totalItems = adoptData?.length || 0; // adoptData에 날짜가 enddate가 현재 날짜랑 맞는 것까지만 
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = adoptData?.slice(startIndex, startIndex + itemsPerPage);

  // 페이지 그룹
  const currentPageGroup = Math.floor((currentPage - 1) / pageLimit);
  const startPage = currentPageGroup * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <h1 className="flex justify-center text-3xl mb-10 mt-10">💗 반려동물 입양</h1>
      
      {/* 카드 리스트 섹션 */}
      <section className="flex justify-center items-start min-h-[700px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 w-full max-w-7xl px-10">
          {currentItems?.map((data: any, index: number) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start rounded-3xl mb-10 bg-[#f3f4f6] p-10 w-full h-auto md:h-[360px]"
            >
              {/* 텍스트 정보 */}
              <div className="flex flex-col items-start text-black text-base space-y-1 mr-5 w-full md:w-[360px]">
                <div className="flex text-xl mb-5">
                  <span className="mr-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-lg font-medium bg-green-100 text-green-800">{data.state}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-lg ${data.sex === "F" ? "bg-pink-100 text-pink-800" : "bg-blue-100 text-blue-800"}`}>
                    {data.sex === "F" ? "암컷" : "수컷"}
                  </span>
                </div>
                <div className="flex flex-col text-md space-y-2">
                  <span>공고번호 : {data.number}</span>
                  <span>나 이 : {data.age}</span>
                  <span>체 중 : {data.kg}</span>
                  <span>보호소명 : {data.shelter}</span>
                  <span>전화번호 : {data.tel}</span>
                  <span>기간 : {data.begindate}~{data.enddate}</span>
                </div>
              </div>

              {/* 이미지 */}
              <div className="flex items-center justify-center w-full md:w-1/2 mt-5 md:mt-0">
                <div
                  className="w-full aspect-square md:w-[280px] md:h-[280px]"
                  style={{
                    backgroundImage: `url(${data.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "20px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 페이지네이션 섹션 */}
      <section className="flex justify-center items-center space-x-2 my-5 pb-20">
        <button
          onClick={() => setCurrentPage(startPage - 1)}
          disabled={startPage === 1}
          className="p-2 bg-gray-200 rounded-lg disabled:opacity-30"
        >
          <IoIosArrowBack />
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => {
              setCurrentPage(number);
              window.scrollTo(0, 0); // 페이지 이동 시 상단으로
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              currentPage === number ? "bg-blue-800 text-white scale-110" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(endPage + 1)}
          disabled={endPage === totalPages}
          className="p-2 bg-gray-200 rounded-lg disabled:opacity-30"
        >
          <IoIosArrowForward />
        </button>
      </section>
    </>
  );
};

export default Adaoption;