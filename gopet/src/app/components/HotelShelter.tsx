import style from "./HotelShelter.module.css"
import Link from "next/link";

export default function HotelShelter() {
  return (
    <>
      <section>
        <div className="flex justify-center gap-15 mt-10">
          <Link href="/hotellist">
            <button
              className={`${style.button__layout} flex flex-row items-center gap-5`}
              style={{
                width: "500px",
                height: "250px",
              }}
            >
              <img
                src="/picture_images/localhotel/localhotelimg.png"
                className="h-full object-contain"
                alt=""
                style={{ width: "50%", height: "90%" }}
              />
              <p className="text-6xl">지역숙박</p>
            </button>
          </Link>
          <Link href="/volunteerlist">
            <button
              className={`${style.button__layout} flex flex-row items-center gap-5`}
              style={{
                width: "500px",
                height: "250px",
              }}
            >
              <img
                src="/picture_images/localhotel/adoptbutton.png"
                className="w-full h-full object-contain"
                alt=""
                style={{ width: "50%" }}
              />
              <p className="text-6xl">보호소</p>
            </button>
          </Link>
          
        </div>
      </section>
    </>
  );
}
