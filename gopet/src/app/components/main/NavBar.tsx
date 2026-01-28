import Link from "next/link";
import styles from "./NavBar.module.css";
import Image from "next/image";
const NavBar: React.FC = () => {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 text-center justify-center">
      <Link href="/hotel" className="w-1/6 min-w-[100px]">
        <div className={styles.nav_box}>
          <Image src="/picture_images/navmenu/hotel.png" alt="숙박 아이콘" width={110} height={20} className="border-10"/>
          <h2 className={styles.nav_font}>숙 박</h2>
        </div>
      </Link>
      <Link href="/food" className="w-1/6 min-w-[100px]">
        <div className={styles.nav_box}>
          <Image src="/picture_images/navmenu/food.png" alt="음식 아이콘" width={110} height={20} className="border-10
          "/>
          <h2 className={styles.nav_font}>지 도</h2>
        </div>
      </Link>
      <Link href="/adoption" className="w-1/6 min-w-[100px]">
        <div className={styles.nav_box}>
          <Image src="/picture_images/navmenu/adopt.png" alt="체험 아이콘" width={110} height={20} className="border-10
          "/>
          <h2 className={styles.nav_font}>반려동물입양</h2>
        </div>
      </Link>
      <Link href="/shelter" className="w-1/6 min-w-[100px]">
        <div className={styles.nav_box}>
          <Image src="/picture_images/navmenu/shelter.png" alt="봉사/보호소 아이콘" width={110} height={20} className="border-10
          "/>
          <h2 className={styles.nav_font}>봉사 / 보호소</h2>
        </div>
      </Link>
      <Link href="/petnews" className="w-1/6 min-w-[100px]">
        <div className={styles.nav_box}>
          <Image src="/picture_images/navmenu/petnews.png" alt="뉴스 아이콘" width={110} height={20} className="border-10
          "/>
          <h2 className={styles.nav_font}>뉴 스</h2>
        </div>
      </Link>
    </nav>
  );
};

export default NavBar;
