"use client"
import Image from "next/image";
import React from "react";
import { useAuth } from "../../context/AuthContext";
const Navbar = () => {
  const { role, name } = useAuth();
  const logoLetter = name?.charAt(0).toUpperCase();
  return (
    <div className="bg-white w-full shadow-sm flex justify-between p-3 items-center sticky top-0 z-50">
      <h1 className="text-[24px] text-[#03111F] font-semibold">Dashboard</h1>
      {/* <div className="flex gap-6 justify-center items-center">
        <div className="flex flex-col">
          <h1 className="text-[#272727] text-[16px] font-semibold">John Doe</h1>
          <h1 className="text-[#272727] text-[12px] text-center">IT Officer</h1>
        </div>
        <div className="rounded-full relative">
          <Image
            className="z-30"
            src={"/user.webp"}
            alt=""
            width={35}
            height={20}
          />
        </div>
      </div> */}
      <div className='flex items-center gap-4'>
        {/* Notification Icon & Modal */}
        <div className='flex flex-col'>
          <h1 className='text-xl font-semibold leading-[10px] text-right'>{name}</h1>
          {/* <h1 className='text-[#5f5f5f] text-right'>{role}</h1> */}
        </div>
        {/* <Image className='rounded-full w-12 h-12' src={"/boy.jpg"} alt={""} width={30} height={30} /> */}
        <div className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl">
          {logoLetter ? logoLetter : ''}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
