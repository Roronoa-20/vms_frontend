"use client";
import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import API_END_POINTS from "@/src/services/apiEndPoints";
import { AxiosResponse } from "axios";
import requestWrapper from "@/src/services/apiCall";

const NavbarMenu = () => {
  const router = useRouter();

  const handleLogOut = async () => {
    const url = API_END_POINTS?.logout;
    const reponse: AxiosResponse = await requestWrapper({
      url: url,
      method: "POST",
    });
    if (reponse?.status == 200) {
      Cookies.remove("designation");
      Cookies.remove("full_name");
      Cookies.remove("sid");
      Cookies.remove("system_user");
      Cookies.remove("user_id");
      Cookies.remove("user_image");
      router.push("/");
    }
  };
  return (
    <div className="absolute z-40 -left-20 -bottom-20 bg-white text-black border border-black rounded-lg ease-in-out transition-all flex flex-col p-4 gap-5">
      {/* <div className="flex w-full text-[15px] items-center gap-3 cursor-pointer border-b-2 border-blue-400 hover:bg-slate-100">
        <svg
          width="19"
          height="19"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 2.5C8.1075 2.5 2.5 8.1075 2.5 15V20.1787C2.5 21.4587 3.62125 22.5 5 22.5H6.25C6.58152 22.5 6.89946 22.3683 7.13388 22.1339C7.3683 21.8995 7.5 21.5815 7.5 21.25V14.8213C7.5 14.4897 7.3683 14.1718 7.13388 13.9374C6.89946 13.7029 6.58152 13.5713 6.25 13.5713H5.115C5.81 8.73375 9.9725 5 15 5C20.0275 5 24.19 8.73375 24.885 13.5713H23.75C23.4185 13.5713 23.1005 13.7029 22.8661 13.9374C22.6317 14.1718 22.5 14.4897 22.5 14.8213V22.5C22.5 23.8787 21.3787 25 20 25H17.5V23.75H12.5V27.5H20C22.7575 27.5 25 25.2575 25 22.5C26.3787 22.5 27.5 21.4587 27.5 20.1787V15C27.5 8.1075 21.8925 2.5 15 2.5Z"
            fill="#2568EF"
          ></path>
        </svg>
        <h1 className="text-[#2568EF] text-nowrap">help & Support</h1>
      </div> */}
      <div
        onClick={() => {
          handleLogOut();
        }}
        className="flex w-full text-[15px] items-center gap-3 cursor-pointer border-b-2 border-blue-400 hover:bg-slate-100"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 6.25H13.75C14.4375 6.25 15 5.6875 15 5C15 4.3125 14.4375 3.75 13.75 3.75H6.25C4.875 3.75 3.75 4.875 3.75 6.25V23.75C3.75 25.125 4.875 26.25 6.25 26.25H13.75C14.4375 26.25 15 25.6875 15 25C15 24.3125 14.4375 23.75 13.75 23.75H6.25V6.25Z"
            fill="#2568EF"
          ></path>
          <path
            d="M25.8125 14.5625L22.325 11.075C22.2381 10.9857 22.1265 10.9243 22.0045 10.8988C21.8825 10.8733 21.7556 10.8848 21.6402 10.9318C21.5247 10.9787 21.4259 11.0591 21.3564 11.1626C21.2869 11.266 21.2499 11.3879 21.25 11.5125V13.75H12.5C11.8125 13.75 11.25 14.3125 11.25 15C11.25 15.6875 11.8125 16.25 12.5 16.25H21.25V18.4875C21.25 19.05 21.925 19.325 22.3125 18.925L25.8 15.4375C26.05 15.2 26.05 14.8 25.8125 14.5625Z"
            fill="#2568EF"
          ></path>
        </svg>
        <h1 className="text-[#2568EF]">Logout</h1>
      </div>
    </div>
  );
};

export default NavbarMenu;
