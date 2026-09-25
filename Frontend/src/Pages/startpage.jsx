
import Navbar from "../components/Navbar";

import HeroSection from "@/components/Hero";
import Middleintro from "@/components/Middleintro";
import MedicalImageSlideshow from "../../Utils/slideshow";

export default function StartPage() {

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800 overflow-x-hidden">
            <Navbar />
            <div className="h-2"></div>
            <MedicalImageSlideshow/>
            <HeroSection />
            
            <Middleintro />
        </div>
    );
}