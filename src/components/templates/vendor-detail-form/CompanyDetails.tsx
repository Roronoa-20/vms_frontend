import React from "react";
import { Input } from "../../atoms/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";

const CompanyDetailForm = () => {
  return (
    <div className="flex flex-col bg-white rounded-lg p-4">
      <h1 className="border-b-2 pb-2">Company Detail</h1>
      <div className="grid grid-cols-3 gap-6 p-5 overflow-y-scroll max-h-[75vh]">
        <div>
          <div className="grid grid-cols-4 gap-1">
            <div className="flex flex-col col-span-1">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Vendor Title
              </h1>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="apple">Apple</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="blueberry">Blueberry</SelectItem>
                    <SelectItem value="grapes">Grapes</SelectItem>
                    <SelectItem value="pineapple">Pineapple</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-3">
              <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                Company Name
              </h1>
              <Input className="col-span-2" placeholder="Enter Company Name" />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Type Of Business (Please select any one)
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Size of Company
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Website
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Reg No.
          </h1>
          <Input placeholder="Enter Reg No." />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input placeholder="Enter Mobile Number" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            WhatsApp Number (If applicable)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Established Year
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email Primary
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Office Email (Secondary)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Corporate Identification No.(CIN No.)
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Mobile Number
          </h1>
          <Input type="date" placeholder="Enter Mobile Number" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Company(Please select anyone)
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Nature of Business (Please Select anyone)
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Vendor Type
          </h1>
          <Input placeholder="" />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Meril Associated Companies
          </h1>
          <Input placeholder="" />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailForm;
