"use client";

import Script from "next/script";
import { Coordinates } from "../components/map/types/store";
import { NaverMap } from "../components/map/types/map";
import { INITIAL_CENTER } from "../components/map/MapComponent";
import { AiOutlineEnvironment } from "react-icons/ai";
import { GiRotaryPhone } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../components/hooks/useToggleNav";
import Header from "../components/main/Header";
import Footer from "../components/main/Footer";
import { IoIosArrowForward } from "react-icons/io";

import volunteerlist from "../../volunteerwork.json";
import shelter from "../../shelter.json";

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
  searchQuery?: string;
  address?: string;
  orders?: string;
};

interface VolunData {
  name: string;
  title: string;
  state: string;
  begindate: string;
  enddate: string;
}

interface ShelterData {
  name: string;
  address: string;
  phone: string;
}

export default function Hotel({ mapId = "map", initialZoom = 10 }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const infoRaf = useRef<naver.maps.InfoWindow | null>(null);

  // 현재 위치 on/off
  const [currentOpen, setCurrentOpen] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<naver.maps.Marker | null>(null);

  // 보호소 마커 on/off
  const [isOpen, setIsOpen] = useState(false);
  const [shelterMarkers, setShelterMarkers] = useState<naver.maps.Marker[]>([]);

  const [modalData, setModalData] = useState<null | {
    type: "shelter";
    title: string;
    address?: string;
    region?: string;
    phone: string;
  }>(null);

  // 봉사 Json가져오기
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

  // 보호소 json가져오기
  const [shelterData, setShelterData] = useState<ShelterData[]>([]);
  useEffect(() => {
    const shelterData = shelter.map((data: any) => ({
      name: data.name,
      address: data.address,
      phone: data.phone,
    }));
    setShelterData(shelterData);
  }, []);

  // 사이드바 탭
  const tabs = [
    {
      id: 0,
      name: "홈",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-center items-center mb-4">
            <div className="flex justify-center items-center mb-4">
              {modalData && (
                <>
                  <div
                    className="bg-white justify-center items-center rounded-2xl p-4 mt-10"
                    style={{ width: "450px", height: "160px" }}
                  >
                    <p className="flex justify-center items-center text-xl font-bold m-2">
                      {modalData.title}
                    </p>
                    <hr className="border-t border-gray-300 my-4" />
                    <div className="flex">
                      <span className="text-2xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2">{modalData.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-2xl">
                        <GiRotaryPhone />
                      </span>
                      <span className="ml-2">{modalData.phone}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      ),
    },
    {
      id: 1,
      name: "전체리스트",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-center items-center mb-5">
            <div
              className="flex flex-col items-center mb-4 hide-scrollbar"
              style={{ height: "1000px", overflowY: "scroll" }}
            >
              {shelterData.map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-10 mb-10"
                  style={{ width: "450px", height: "240px" }}
                >
                  <p className="flex justify-center items-center text-xl font-bold m-3">
                    {data.name}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="ml-2 mb-2">Tel : {data.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ),
    },
  ];

  // 현재 위치 버튼
  const handleCurrentLocationClick = () => {
    if (!currentOpen) {
      if (!mapRef.current) return;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const currentLocation = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );

          const marker = new naver.maps.Marker({
            position: currentLocation,
            map: mapRef.current!,
            title: "현재 위치",
          });

          mapRef.current!.setCenter(currentLocation);

          setCurrentLocation(marker); // 마커 상태 저장
          setCurrentOpen(true); // 상태 ON
        });
      }
    } else {
      // 마커 제거
      if (currentLocation) {
        currentLocation.setMap(null);
        setCurrentLocation(null);
      }
      setCurrentOpen(false);
    }
  };

  // 보호소 마커 버튼
  const handleShelterLocationClick = () => {
    if (!isOpen) {
      const newMarkers = shelter.map((data) => {
        const marker = new window.naver.maps.Marker({
          position: new naver.maps.LatLng(Number(data.lat), Number(data.lng)),
          map: mapRef.current!,
          title: data.name,
          icon: {
            url: "/picture_images/map/shelter_marker.png",
            scaledSize: new naver.maps.Size(50, 50),
            anchor: new naver.maps.Point(25, 25),
          },
        });

        naver.maps.Event.addListener(marker, "click", () => {
          const latlng = new naver.maps.LatLng(
            Number(data.lat),
            Number(data.lng)
          );
          searchCoordinateToAddress(latlng, data.name);
          setModalData({
            type: "shelter",
            title: data.name,
            region: data.region,
            address: data.address,
            phone: data.phone,
          });
        });

        return marker;
      });

      setShelterMarkers(newMarkers);
      setIsOpen(true);
    } else {
      shelterMarkers.forEach((marker) => marker.setMap(null));
      setShelterMarkers([]);
      setIsOpen(false);
    }
  };

  // 지도 로딩 후 실행
  const initializeMap = () => {
    const center = new window.naver.maps.LatLng(...INITIAL_CENTER);
    const mapOptions = {
      center,
      zoom: initialZoom,
      scaleControl: false,
      logoControlOptions: {
        position: naver.maps.Position.RIGHT_TOP,
      },
      mapDataControl: false,
      zoomControl: false,
      mapTypeControl: false,
    };
    const map = new window.naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;
  };

  async function searchCoordinateToAddress(
    latlng: naver.maps.LatLng,
    title?: string
  ): Promise<{ address: string; cityName: string }> {
    return new Promise((resolve, reject) => {
      naver.maps.Service.reverseGeocode(
        {
          coords: latlng,
          orders: [
            naver.maps.Service.OrderType.ADDR,
            naver.maps.Service.OrderType.ROAD_ADDR,
          ].join(","),
        },
        function (status, response) {
          if (status === naver.maps.Service.Status.ERROR) {
            reject("주소 조회 실패");
            return;
          }
          const items = response?.v2?.results || [];
          if (items.length === 0) {
            resolve({ address: "주소 없음", cityName: "도시 정보 없음" });
            return;
          }
          const item = items[0];
          const cityName = item.region.area1.name;
          const address =
            item.region.area1.name +
            " " +
            item.region.area2.name +
            " " +
            item.region.area3.name +
            " " +
            item.region.area4.name +
            (item.land.number1 ? " " + item.land.number1 : "") +
            (item.land.number2 ? "-" + item.land.number2 : "") +
            (item.land.addition0?.value ? " " + item.land.addition0.value : "");
          const contentHtml = `
            <div style="position:relative;padding:10px;min-width:150px;min-height:80px;line-height:140%;font-size:12px;">
              <h1>${title || "정보없음"}</h1>
              <p>주소 : ${address}</p>
            </div>
          `;
          infoRaf.current?.setContent(contentHtml);
          infoRaf.current?.open(mapRef.current!, latlng);

          resolve({ address, cityName });
        }
      );
    });
  }

  // 스크립트 로드 후 실행
  const handleScriptLoad = () => {
    initializeMap();
  };

  return (
    <>
      <Header isNavOpen={isNavOpen} toggleNav={toggleNav} />
      <div className="flex h-screen w-full overflow-hidden">
        {/* 사이드바 */}
        <div
          className={`flex transition-all duration-500 mb-10 ease-in-out ${
            isOpen ? "w-[700px]" : "w-0"
          }`}
          style={{
            backgroundColor: "#f3f4f6",
            overflowY: "auto",
          }}
        >
          <div
            className="w3-sidebar w3-white w3-bar-block"
            style={{
              width: "500px",
              backgroundColor: "#f3f4f6",
              opacity: 0.95,
              padding: "1rem",
              position: "relative",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ul className="flex justify-start items-center">
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex space-x-2 w3-bar-item w3-button ml-5 py-2 px-3 text-xl bg-white rounded-2xl hover:bg-gray-200 
                        ${activeTab === tab.id ? "active bg-gray-300" : ""}`}
                >
                  {tab.name}
                </li>
              ))}
            </ul>
            {tabs
              .filter((tab) => activeTab === tab.id)
              .map((tab) => (
                <div key={tab.id}>{tab.content}</div>
              ))}
          </div>
        </div>

        {/* 사이드 바 옆 버튼*/}
        <button
          onClick={toggleOpen}
          className="absolute top-50 left-0 z-50 flex items-center justify-center
             bg-gray-900 text-white px-4 py-4 rounded hover:bg-gray-700
             transition-all duration-500 ease-in-out"
          style={{
            // 버튼 폭 고정
            transform: `translateY(-50%) ${
              isOpen ? "translateX(495px)" : "translateX(0)"
            }`,
          }}
        >
          <IoIosArrowForward
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          />
        </button>

        <div
          className="flex relative transition-all duration-500 ease-in-out"
          id={mapId}
          style={{
            width: "100%",
            height: "1000px",
            position: "relative",
            transition: "width 0.3s ease",
          }}
        >
          <Script
            src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}&submodules=geocoder`}
            strategy="afterInteractive"
            onLoad={handleScriptLoad}
          />

          {/* 지도 마크 버튼 */}
          <button
            className={`flex justify-center items-center px-4 py-2 rounded-2xl transition ${
              currentOpen ? "bg-blue-500 text-white" : "bg-white/60 text-black"
            }`}
            onClick={handleCurrentLocationClick}
            style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
          >
            {currentOpen ? "현재위치" : "현재위치"}
          </button>
          <button
            className={`flex justify-center items-center px-4 py-2 rounded-2xl transition
            ${isOpen ? "bg-blue-500 text-white" : "bg-white/60 text-black"}`}
            onClick={handleShelterLocationClick}
            style={{ position: "absolute", top: 10, left: "40%", zIndex: 999 }}
          >
            {isOpen ? "보호소" : "보호소"}
          </button>
        </div>

        <Footer />
      </div>
    </>
  );
}
