"use client";

import Script from "next/script";
import { Coordinates } from "../components/map/types/store";
import { NaverMap } from "../components/map/types/map";
import { INITIAL_CENTER } from "../components/map/MapComponent";
import { AiOutlineEnvironment } from "react-icons/ai";
import { GiPositionMarker } from "react-icons/gi";
import { useEffect, useRef, useState } from "react";
import { useToggleNav } from "../components/hooks/useToggleNav";
import Header from "../components/main/Header";
import Footer from "../components/main/Footer";
import KcisaApi from "../api/KcisaApi";
import { IoIosArrowForward } from "react-icons/io";

type Props = {
  mapId?: string;
  initialCenter?: Coordinates;
  initialZoom?: number;
  onLoad?: (map: NaverMap) => void;
  searchQuery?: string;
  address?: string;
  orders?: string;
};

type RegionDataType = {
  [sido: string]: string[];
};

interface HotelDataType {
  address: string;
  tel: string;
  url: string;
  si: string;
  gungu: string;
}

export default function Hotel({ mapId = "map", initialZoom = 10 }: Props) {
  const [cacheApi, setCacheApi] = useState<any[] | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const infoRaf = useRef<naver.maps.InfoWindow | null>(null);
  const markerRef = useRef<naver.maps.Marker[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hasSetIdleListener = useRef(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isNavOpen, toggleNav } = useToggleNav(false);
  const [modalData, setModalData] = useState<null | {
    type: "hotel";
    title: string;
    address?: string;
    region?: string;
    url?: string;
    charge?: string;
    description?: string;
    phone: string;
  }>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleOpen = () => setIsOpen((prev) => !prev);
  
  // 현재 위치 on/off
  const [currentOpen, setCurrentOpen] = useState(false);
  const [currentLocation, setCurrentLocation] =
  useState<naver.maps.Marker | null>(null);
  
  // 호텔 마커 On/off
  const [hotelMarkers, setHotelMarkers] = useState<naver.maps.Marker[]>([]);

  // 모달 지역 선택
  const [selectSido, setSelectSido] = useState("");
  const [selectSigungu, setSelectSigungu] = useState("");
  const regionData: RegionDataType = {
    서울특별시: [
      "강남구",
      "강동구",
      "강북구",
      "강서구",
      "관악구",
      "광진구",
      "구로구",
      "금천구",
      "노원구",
      "도봉구",
      "동대문구",
      "동작구",
      "마포구",
      "서대문구",
      "서초구",
      "성동구",
      "성북구",
      "송파구",
      "양천구",
      "영등포구",
      "용산구",
      "은평구",
      "종로구",
      "중구",
      "중랑구",
    ],
    경기도: [
      "가평군",
      "고양시",
      "과천시",
      "광명시",
      "광주시",
      "구리시",
      "군포시",
      "김포시",
      "남양주시",
      "동두천시",
      "부천시",
      "성남시",
      "수원시",
      "시흥시",
      "안산시",
      "안성시",
      "안양시",
      "양주시",
      "양평군",
      "여주시",
      "연천군",
      "오산시",
      "용인시",
      "의왕시",
      "의정부시",
      "이천시",
      "파주시",
      "평택시",
      "포천시",
      "하남시",
      "화성시",
    ],
    인천광역시: [
      "중구",
      "동구",
      "미추홀구",
      "연수구",
      "남동구",
      "부평구",
      "계양구",
      "서구",
      "강화군",
      "옹진군",
    ],
    강원도: [
      "춘천시",
      "원주시",
      "강릉시",
      "동해시",
      "태백시",
      "속초시",
      "삼척시",
      "홍천군",
      "횡성군",
      "영월군",
      "평창군",
      "정선군",
      "철원군",
      "화천군",
      "양구군",
      "인제군",
      "고성군",
      "양양군",
    ],
    충청남도: [
      "청주시",
      "충주시",
      "제천시",
      "보은군",
      "옥천군",
      "영동군",
      "진천군",
      "괴산군",
      "음성군",
      "단양군",
      "증평군",
    ],
    전라북도: [
      "전주시",
      "군산시",
      "익산시",
      "정읍시",
      "남원시",
      "김제시",
      "완주군",
      "진안군",
      "무주군",
      "장수군",
      "임실군",
      "순창군",
      "고창군",
      "부안군",
    ],
    전라남도: [
      "목포시",
      "여수시",
      "순천시",
      "나주시",
      "광양시",
      "담양군",
      "곡성군",
      "구례군",
      "고흥군",
      "보성군",
      "화순군",
      "장흥군",
      "강진군",
      "해남군",
      "영암군",
      "무안군",
      "함평군",
      "영광군",
      "장성군",
      "완도군",
      "진도군",
      "신안군",
    ],
    경상북도: [
      "포항시",
      "경주시",
      "김천시",
      "안동시",
      "구미시",
      "영주시",
      "영천시",
      "상주시",
      "문경시",
      "경산시",
      "군위군",
      "의성군",
      "청송군",
      "영양군",
      "영덕군",
      "청도군",
      "고령군",
      "성주군",
      "칠곡군",
      "예천군",
      "봉화군",
      "울진군",
      "울릉군",
    ],
    경상남도: [
      "창원시",
      "진주시",
      "통영시",
      "사천시",
      "김해시",
      "밀양시",
      "거제시",
      "양산시",
      "의령군",
      "함안군",
      "창녕군",
      "고성군",
      "남해군",
      "하동군",
      "산청군",
      "함양군",
      "거창군",
      "합천군",
    ],
    제주특별자치도: ["제주시", "서귀포시"],
  };

  // 선택된 위치 저장
  const [selectedLocation, setSelectedLocation] = useState<{
    sido: string;
    gungu: string;
  }>({ sido: "", gungu: "" });

  const [hotelData, setHotelData] = useState<HotelDataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await KcisaApi();
        const hotelData = results
          .filter((data: any) => data.category2 === "펜션")
          .map((data: any) => {
            return {
              title: data.title,
              si: data.si,
              gungu: data.gungu,
              address: data.address,
              tel: data.tel,
              url: data.url,
              address2: data.address2,
            };
          });
        setHotelData(hotelData);
      } catch (error) {
        console.log("API 호출 에러:", error);
      }
    };
    fetchData();
  }, []);

  type PlaceType = "hotel";
  const markerIcons: Record<PlaceType, string> = {
    hotel: "/picture_images/map/hotel_marker.png",
  };

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
                    style={{ width: "450px", height: "300px" }}
                  >
                    <p className="flex justify-center items-center text-xl font-bold m-2">
                      {modalData.title}
                    </p>
                    <hr className="border-t border-gray-300 my-4" />
                    <div className="flex">
                      <span className="text-2xl">
                        <AiOutlineEnvironment />
                      </span>
                      <span className="ml-2 mb-2">{modalData.address}</span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2">{modalData.description}</span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2">{modalData.charge}</span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2">
                        웹사이트 :{" "}
                        {modalData.url ? modalData.url : "정보가 없습니다."}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="ml-2 mb-2">Tel : {modalData.phone}</span>
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
      name: "지역별숙박",
      content: (
        <>
          <hr className="border-t border-gray-300 my-4" />
          <div className="flex justify-evenly mb-5">
            <button
              onClick={() => setIsModalOpen(true)}
              data-modal-target="crud-modal"
              data-modal-toggle="crud-modal"
              className="flex block text-white bg-blue-500 hover:bg-blue-600 px-2 py-2 focus:outline-none rounded-2xl"
              type="button"
            >
              <span className="flex text-xl mr-2">
                <GiPositionMarker className="mr-2 text-2xl" /> 지 역
              </span>
            </button>
            {selectedLocation.sido && selectedLocation.gungu && (
              <div className="flex px-2 py-2 bg-white rounded-2xl">
                <h2 className="flex justify-center items-center ml-10 mr-10 text-xl">
                  {selectedLocation.sido}
                </h2>
                <div className="w-px h-7 bg-gray-300" />
                <h2 className="flex justify-center items-center ml-10 mr-10 text-xl">
                  {selectedLocation.gungu}
                </h2>
              </div>
            )}
          </div>
          <div
            className="flex flex-col items-center mb-4 hide-scrollbar"
            style={{ height: "1000px", overflowY: "scroll" }}
          >
            {hotelData
              .filter(
                (data) =>
                  data.si === selectedLocation.sido &&
                  data.gungu === selectedLocation.gungu
              )
              .map((data: any, index: any) => (
                <div
                  key={index}
                  className="bg-white justify-center items-center rounded-2xl p-4 mt-10 mb-10"
                  style={{ width: "450px", height: "240px" }}
                >
                  <p className="flex justify-center items-center text-xl font-bold m-3">
                    {data.title}
                  </p>
                  <hr className="border-t border-gray-300 my-4" />
                  <div className="flex">
                    <span className="text-2xl">
                      <AiOutlineEnvironment />
                    </span>
                    <span className="ml-2 mb-2">{data.address}</span>
                  </div>
                  <div className="flex">
                    <span className="ml-2 mb-2">Tel : {data.tel}</span>
                  </div>
                  <div className="flex">
                    <span className="ml-2 mb-2">
                      웹사이트 : {data.url ? data.url : "정보가 없습니다."}
                    </span>
                  </div>
                </div>
              ))}
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

  // 마커 버튼
  const showMarkers = async (type: PlaceType, keyword: string) => {
      const map = mapRef.current;
      if (!map) return;
      
      if (!hasSetIdleListener.current) {
        window.naver.maps.Event.addListener(map, "idle", () => {
          showMarkers(type, keyword);
        });
        hasSetIdleListener.current = true;
      }
      
      // results 값으로 가져와야 하니까
      
      const results = cacheApi ?? (await KcisaApi(keyword));
      if (!cacheApi) {
        setCacheApi(results);
      }
      
      const bounds = map.getBounds() as naver.maps.LatLngBounds;
      const sw = bounds.getSW();
      const ne = bounds.getNE();
      
      const filtered = results.filter((item: any) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lng);
        return (
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= sw.lat() &&
          lat <= ne.lat() &&
          lng >= sw.lng() &&
          lng <= ne.lng()
        );
      });
      
      const newMarkers: naver.maps.Marker[] = [];
      
      // 마커생성
      filtered.forEach((item: any) => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.lat, item.lng),
          map,
          title: item.title,
          icon: {
            url: markerIcons[type],
            scaledSize: new window.naver.maps.Size(50, 50),
            anchor: new window.naver.maps.Point(25, 25),
          },
        });
        
        window.naver.maps.Event.addListener(marker, "click", async () => {
          const latlng = new window.naver.maps.LatLng(item.lat, item.lng);
          const { address, cityName } = await searchCoordinateToAddress(
            latlng,
            item.title
          );
          setModalData({
            type,
            title: item.title,
            address: address,
            region: cityName,
            phone: item.tel,
            url: item.url,
            charge: item.charge,
            description: item.description,
          });
        });
        
        newMarkers.push(marker);
        // 기존 마커를 새 마커가 렌더된 후 제거
      });
      if(type === "hotel"){
        return setHotelMarkers(newMarkers);
      }
  };
  
  // 호텔 위치 버튼
  const handleHotelLocationClick = () => showMarkers("hotel", "펜션");

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
            className={`flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black `}
            onClick={handleCurrentLocationClick}
            style={{ position: "absolute", top: 10, left: "50%", zIndex: 999 }}
          >
            현재위치
          </button>
          <button
            className={`flex justify-center items-center px-4 py-2 rounded-2xl transition bg-white/60 text-black`}
            onClick={handleHotelLocationClick}
            style={{ position: "absolute", top: 10, left: "40%", zIndex: 999 }}
          >
            숙박
          </button>
        </div>

        <Footer />

        {/* 지역 선택 모달 코드 */}

        {isModalOpen && (
          <form className="fixed inset-0 z-1000 flex justify-center items-center bg-black/90">
            {/* 시/도 선택 */}
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center border-b pb-2 mb-5">
                <label className="block mb-1 text-sm font-medium">지역</label>
              </div>
              <select
                value={selectSido}
                onChange={(e) => {
                  const newSido = e.target.value;
                  setSelectSido(newSido);
                  setSelectSigungu(""); // 시/도 바뀌면 시/군/구 초기화
                }}
                className="w-full border rounded px-3 py-2 mb-5"
              >
                <option value="">시/도 선택</option>
                {Object.keys(regionData).map((sido) => (
                  <option key={sido} value={sido}>
                    {sido}
                  </option>
                ))}
              </select>

              {/* 시/군/구 선택 */}
              <div className="mb-5">
                <label className="block mb-1 text-sm font-medium">
                  시/군/구
                </label>
                <select
                  value={selectSigungu}
                  onChange={(e) => setSelectSigungu(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={!selectSido} // 시/도 선택 전에는 비활성화
                >
                  <option value="">시/군/구 선택</option>
                  {selectSido &&
                    regionData[selectSido].map((sigungu) => (
                      <option key={sigungu} value={sigungu}>
                        {sigungu}
                      </option>
                    ))}
                </select>
              </div>

              {/* 확인 버튼 */}
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault(); // 폼 제출 방지
                  setSelectedLocation({
                    sido: selectSido,
                    gungu: selectSigungu,
                  });
                  setIsModalOpen(false);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={!selectSido || !selectSigungu}
              >
                확인
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
