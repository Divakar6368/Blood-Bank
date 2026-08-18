import Navbar from "../components/Navbar";
import { NavLink } from "react-router";
import { Login } from '../components/Login'
import { useState } from "react";
import { SignUp } from "../components/SignUp";

export default function StartPage() {
    const [signpageactive,SetSignPageActive]=useState(false)
    return (
        <div>
            <header>
                <Navbar></Navbar>
            </header>

            <main className="flex gap-55 p-15">
                <div className="min-h-screen md:w-1/2 border">
                    Left Side
                </div>
                <div className=" min-h-screen md:w-1/3 border">
                    {signpageactive? <SignUp/>:<Login />}
                    <div className="text-center mt-6">
                        <span className="text-sm">
                            Don't have an account?{' '}
                            <div className="link link-primary">
                               <button onClick={()=>SetSignPageActive(!signpageactive)}> Sign Up</button>
                            </div>
                        </span>
                    </div>
                </div>
            </main>

        </div>

    )
}