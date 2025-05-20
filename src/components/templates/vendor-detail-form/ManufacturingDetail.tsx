'use client'
import React from "react";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { Input } from "../../atoms/input";
import { SelectContent } from "../../atoms/select";
import { Button } from "../../atoms/button";

const ManufacturingDetail = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Manufacturing Detail
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Total Godown Area (Sq. ft.)
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Storage Capacity, (Sq. ft.)
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Spare Capacity(Sq. ft.)
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type of Premises
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Working Hours
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Weekly Holidays
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            No. of Manpower/Strength
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Annual Revenue
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1 flex justify-start items-end gap-4">
          <h1 className="text-[16px] font-medium text-[#626973] pb-2">
            Cold Storage
          </h1>
          <Input
            type="checkbox"
            placeholder=""
            className="w-4 py-0 items-end"
          />
        </div>
      </div>
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Products Details
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Product Manufactured
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            HSN/SAC Code
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Annual Capacity
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload manufactured product image
          </h1>
          <Input placeholder="" type="file" />
        </div>
        <div className="col-span-1 flex flex-col justify-end w-16">
          <Button className="bg-blue-400 hover:bg-blue-300">Add</Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-5 pb-6">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Upload your Material Brochure (PDF)
          </h1>
          <Input placeholder="" type="file" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pl-5">
        <div className="col-span-1">
          <h1 className="text-[16px] font-normal text-[#626973] pb-3">
            Organization Structure Document
          </h1>
          <Input placeholder="" type="file" />
        </div>
      </div>
    </div>
  );
};

export default ManufacturingDetail;
