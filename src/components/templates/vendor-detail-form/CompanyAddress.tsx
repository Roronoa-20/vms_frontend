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

const CompanyAddress = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Company Address
      </h1>
      <h1 className="pl-2 ">Billing Address</h1>
      <div className="grid grid-cols-4 gap-6 p-5">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            District
          </h1>
          <Input placeholder="" />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              City
            </h1>
            <Input placeholder="" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input placeholder="" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input placeholder="" />
          </div>
        </div>
      </div>
      <div className="flex justify-start gap-6 items-center">
        <h1 className="pl-2 ">Shipping Address</h1>
        <div className="flex items-center gap-1">
          <Input type="checkbox" className="w-4" />
          <h1 className="font-normal">Same as above</h1>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6 p-5">
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 1
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Address 2
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Pincode/Zipcode
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-2">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            District
          </h1>
          <Input placeholder="" />
        </div>
        <div className="grid grid-cols-3 col-span-4 gap-4">
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              City
            </h1>
            <Input placeholder="" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input placeholder="" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Country
            </h1>
            <Input placeholder="" />
          </div>
        </div>
      </div>
      <div className="pl-4 flex gap-4 items-center">
        <Input type="checkbox" className="w-4" />
        <h1>Do you have multiple locations?</h1>
      </div>
      <div className="flex flex-col gap-2 justify-center pl-4 pt-2">
        <h1 className="font-medium">Main Office Address Proof</h1>
        <h1 className="text-[12px] font-normal text-[#626973]">
          Upload Address Proof (Light Bill, Telephone Bill, etc.)
        </h1>
        <Input type="file" className="w-fit" />
      </div>
    </div>
  );
};

export default CompanyAddress;
