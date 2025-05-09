import React from "react";
import Logo from "@/src/components/atoms/vms-logo";
import { sidebarMenu } from "@/src/constants/sidebarMenu";
import Image from "next/image";
const Sidebar = () => {
  return (
    <div className="h-screen w-[100px] bg-[#0C2741] flex flex-col items-center gap-4 overflow-y-scroll no-scrollbar">
      <div className="w-3 h-2 pt-5 z-10 relative">
        <Logo />
      </div>
      <div className="z-20 relative mt-10 flex flex-col items-center gap-4">
        {sidebarMenu?.map((item, index) => (
          <button
            key={index}
            className="px-2 py-2 rounded-lg hover:bg-[#2C567E] text-sm flex flex-col justify-center items-center gap-1 text-white"
          >
            <Image src={item?.logo} alt="" width={25} height={20} />
            <h1>{item?.name}</h1>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
