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

const ContactDetail = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Contact Detail
      </h1>
      <h1 className="pl-5">Contact Person 1</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            First Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Last Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Designation
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Contact Number
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Department Name
          </h1>
          <Input placeholder="" />
        </div>
      </div>
      <h1 className="pl-5">Contact Person 2</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            First Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Last Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Designation
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Contact Number
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Department Name
          </h1>
          <Input placeholder="" />
        </div>
      </div>
      <h1 className="pl-5">Contact Person 3</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            First Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Last Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Designation
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Contact Number
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Department Name
          </h1>
          <Input placeholder="" />
        </div>
      </div>
      <h1 className="pl-5">Contact Person 4</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            First Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Last Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Designation
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Contact Number
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Department Name
          </h1>
          <Input placeholder="" />
        </div>
      </div>
      <h1 className="pl-5">Contact Person 5</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            First Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Last Name
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Designation
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Email</h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Contact Number
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Department Name
          </h1>
          <Input placeholder="" />
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
