'use client';
import LocalHotel from "./components/main/LocalHotel";
import Header from "./components/main/Header";
import { useToggleNav } from "./components/hooks/useToggleNav";
import VolunteerList from "./components/main/VolunteerList";
import AdoptEmblaCarousel from "./components/AdoptEmblaCarousel";

const OPTIONS = { loop: true}
const SLIDE_COUNT = 8
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

const Home = () => {
    const { isNavOpen, toggleNav} = useToggleNav(true);
    return (
        <>
            <Header isNavOpen={isNavOpen} toggleNav={toggleNav}/>
            <LocalHotel />
            <VolunteerList />
            <AdoptEmblaCarousel slides={SLIDES} options={OPTIONS}/>
            
        </>
    )
}

export default Home;