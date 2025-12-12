'use client';
import Header from "./components/main/Header";
import { useToggleNav } from "./components/hooks/useToggleNav";
import AdoptEmblaCarousel from "./components/AdoptEmblaCarousel";
import HotelShelter from "./components/HotelShelter";
import VolunteerList from "./volunteerlist/page";

const OPTIONS = { loop: true}
const SLIDE_COUNT = 8
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const Home = () => {
    const { isNavOpen, toggleNav} = useToggleNav(true);
    return (
        <>
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav}/>
            <HotelShelter/>
            <AdoptEmblaCarousel slides={SLIDES} options={OPTIONS}/>
        </>
    )
}

export default Home;