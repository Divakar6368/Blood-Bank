
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

import { HeartHandshake, ShieldAlert, Users, Award, X, ArrowRight, Droplet } from "lucide-react";
import HeroSection from "@/components/Hero";
import Middleintro from "@/components/Middleintro";

export default function StartPage() {

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800 overflow-x-hidden">
            <Navbar />
            <HeroSection />
            <Middleintro />
        </div>
    );
}