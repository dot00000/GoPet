"use client";

import "swiper/css";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import { TiHeart } from "react-icons/ti";
import volunteerlist from "../../volunteerwork.json";
import Header from "../components/main/Header";
import { useToggleNav } from "../components/hooks/useToggleNav";

interface VolunData {
  name: string;
  title: string;
  state: string;
  begindate: string;
  enddate: string;
}

const VolunteerList = () => {
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const [volunData, setVolunData] = useState<VolunData[]>([]);
  useEffect(() => {
    const volunData = volunteerlist.map((data: any) => ({
      name: data.RECRUT_INST_NM,
      title: data.SERVIC_TITLE,
      state: data.RECRUT_STATE_NM,
      begindate: data.SERVIC_BEGIN_DE,
      enddate: data.SERVIC_END_DE,
    }));
    setVolunData(volunData);
  }, []);

  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <h1 className="flex justify-center text-3xl mt-10 p-10">💗 봉사활동 List</h1>
          {volunData.map((p, index) => (
            <div key={index} className="flex justify-center">
              <div  className="rounded-3xl border mb-5" style={{ width: "50%", height: "220px"}}>
                <div className="ml-5 mr-5 text-xl">
                  <h2 className="flex justify-center text-black text-2xl p-4">{p.name}</h2>
                  <div className="flex">
                    <span className="text-2xl">
                      <TiHeart />
                    </span>
                    <span>{p.state}</span>
                  </div>
                  <div className="flex">
                      <span>장 소 : {p.title}</span>
                    </div>
                    <div className="flex">
                      <span>
                        봉사시작일자 :
                      </span>
                      <span>{p.begindate}</span>
                    </div>
                    <div className="flex">
                      <span>
                        종료일자 : 
                      </span>
                      <span>{p.enddate}</span>
                    </div>
                </div>
              </div>
            </div>
          ))}
    </>
  );
};


export default VolunteerList;
