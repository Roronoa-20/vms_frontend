"use client"
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import NavbarMenu from "./NavbarMenu";
import { useRouter,usePathname } from "next/navigation";
const Navbar = () => {
  const { role, name } = useAuth();
   const { designation } = useAuth();
   const [isDialog,setIsDialog] = useState<boolean>(false);
  const logoLetter = name?.charAt(0).toUpperCase();
  const pathname = usePathname();
  console.log(pathname)
  return (
    <div className="bg-white w-full shadow-sm flex justify-between p-3 items-center sticky top-0 z-50">
      <h1 className="text-[24px] text-[#03111F] font-semibold">
        {pathname == '/vendor-registration'?"Vendor Registration":
         pathname == "/dashboard"?"Dashboard":
         pathname == "/pr-request"?"Purchase Request":
         pathname == "/pr-inquiry"?"Purchase Inquiry":""}
      </h1>
      <div className='flex items-center gap-4'>
        {/* Notification Icon & Modal */}
        <div className='flex flex-col gap-1 justify-center items-center'>
          <h1 className='text-md font-semibold leading-[10px] text-right'>{name}</h1>
          <h1 className='text-[#5f5f5f] text-md text-right'>{designation}</h1>
        </div>
        {/* <Image className='rounded-full w-12 h-12' src={"/boy.jpg"} alt={""} width={30} height={30} /> */}
        <div onClick={()=>{setIsDialog((prev)=> !prev)}} className="relative cursor-pointer w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white text-xl">
          {logoLetter ? logoLetter : ''}
          {
            isDialog && 
            <NavbarMenu/>
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
