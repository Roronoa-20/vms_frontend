"use client"
import React from "react";
import Logo from "@/src/components/atoms/vms-logo";
import { sidebarMenu } from "@/src/constants/sidebarMenu";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Sidebar = () => {
  const router = useRouter();
  return (
    <div className="w-[100px] bg-[#0C2741] flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar sticky left-0">
      <div className="w-3 h-2 pb-6 pt-5">
        <Logo />
      </div>
      {/* <div className="z-20 relative mt items-center gap-4"> */}
      {sidebarMenu?.map((item, index) => (
        <button
          key={index}
          className="px-2 py-2 rounded-lg hover:bg-[#2C567E] text-sm flex flex-col justify-center items-center gap-1 text-white"
          onClick={()=>{router.push(item?.href)}}
        >
          <Image src={item?.logo} alt="" width={25} height={20} />
          <h1>{item?.name}</h1>
        </button>
      ))}
      {/* </div> */}
    </div>
  );
};

export default Sidebar;
