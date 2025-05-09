import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="bg-white w-full shadow-sm flex justify-between p-3 items-center sticky top-0 z-50">
      <h1 className="text-[24px] text-[#03111F] font-semibold">Dashboard</h1>
      <div className="flex gap-6 justify-center items-center">
        <div className="flex flex-col"><h1 className="text-[#272727] text-[16px] font-semibold">John Doe</h1>
        <h1 className="text-[#272727] text-[12px] text-center">IT Officer</h1></div>
        <div className="rounded-full relative"><Image className="z-30" src={"/user.webp"} alt="" width={35} height={20}/></div>
      </div>
    </div>
  );
};

export default Navbar;
