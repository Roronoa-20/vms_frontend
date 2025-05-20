'use client'
import React from "react";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";

const MachineryDetail = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Details of Machinery & Other Equipment
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Equipment Qty.
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Capacity
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Remarks
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1 flex items-end">
          <Button className="bg-blue-400 hover:bg-blue-300">Add</Button>
        </div>
      </div>
    </div>
  );
};

export default MachineryDetail;
