import React from 'react'
import { motion } from "framer-motion";
import { ArrowRight, Droplet, ShieldAlert } from 'lucide-react';
import { Link, NavLink } from 'react-router';
const HeroSection = () => {
  
  return (
     <section id='#home' className="relative pt-12 pb-20 md:pt-20 md:pb-32 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
              <Droplet className="w-4 h-4 fill-current text-red-600" />
              <span>Every drop counts. Save a life today.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Connecting <span className="text-red-600">Donors</span> with Those in Urgent Need.
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Join CodeX LifeFlow network. Register as a donor or request urgent blood supply in real time with our intelligent matching platform.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <NavLink to="/login" >
              <button
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow-lg shadow-red-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
              >
                Become a Donor
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </NavLink>
               <NavLink to="/login" >
              <button
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-full border border-gray-200 shadow-sm transition-all"
              >
                Find Blood Urgently
              </button>
              </NavLink>
            </div>

            {/* Trust Badges / Stats */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-gray-200 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">10k+</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Active Donors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">250+</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Hospitals Linked</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-red-600">15k+</p>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Lives Saved</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative flex justify-center items-center"
          >
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-red-200/50 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full relative">
            <img src="../../../public/hospital.svg" alt="Hospital Illustrasion" />
            </div>
          </motion.div>
        </div>
      </section>
  )
}

export default HeroSection
