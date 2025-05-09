import Image from "next/image";
import React from "react";

const cardData = [
  {
    name: "Total Vendors",
    count: 42,
    icon: "/dashboard-assests/cards_icon/total_count.svg",
    text_color: "text-yellow-800",
    bg_color: "bg-yellow-100",
    hover: "hover:border-yellow-400",
  },
  {
    name: "Pending Vendors",
    count: 30,
    icon: "/dashboard-assests/cards_icon/hour_glass.svg",
    text_color: "text-rose-800",
    bg_color: "bg-rose-100",
    hover: "hover:border-rose-400",
  },
  {
    name: "Onboarded Vendors",
    count: 11,
    icon: "/dashboard-assests/cards_icon/tick.svg",
    text_color: "text-emerald-800",
    bg_color: "bg-emerald-100",
    hover: "hover:border-emerald-400",
  },
  {
    name: "Dispatch Details",
    count: 6,
    icon: "/dashboard-assests/cards_icon/truck.svg",
    text_color: "text-blue-800",
    bg_color: "bg-blue-100",
    hover: "hover:border-blue-400",
  },
  {
    name: "Purchase & Ongoing Orders",
    count: 17,
    icon: "/dashboard-assests/cards_icon/package.svg",
    text_color: "text-violet-800",
    bg_color: "bg-violet-100",
    hover: "hover:border-violet-400",
  },
  {
    name: "Payment Request",
    count: 2,
    icon: "/dashboard-assests/cards_icon/hand.svg",
    text_color: "text-orange-800",
    bg_color: "bg-orange-100",
    hover: "hover:border-orange-400",
  },
  {
    name: "Current Month Vendors",
    count: 3,
    icon: "/dashboard-assests/cards_icon/calender.svg",
    text_color: "text-black-800",
    bg_color: "bg-gray-100",
    hover: "hover:border-gray-400",
  },
];

const DashboardCards = () => {
  return (
    <div className="grid sm:grid-cols-3 md:grid-cols-4 gap-6 pb-10">
      {cardData?.map((item, index) => (
        <div
          key={index}
          className={`group rounded-2xl ${item?.bg_color} flex flex-col p-3 ${item?.text_color} h-28 justify-between border-2 ${item?.hover} hover:scale-[1.06] transition duration-300 transform cursor-pointer shadow-md`}
        >
          <div className={`flex w-full justify-between`}>
            <h1 className="text-[13px]">{item?.name}</h1>
            <Image
              src={`${item?.icon}`}
              alt=""
              width={25}
              height={30}
            />
          </div>
          <div className="text-[20px] font-bold">{item?.count}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
