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
import { useState } from "react";
import { Button } from "../../atoms/button";

const DocumentDetails = () => {
  const [BusinessType, setBusinessType] = useState<string>("");
  const [isMSME, setIsMSME] = useState<string>("no");
  return (
    <div className="flex flex-col bg-white rounded-lg p-4 w-full">
      <h1 className="border-b-2 pb-2 text-lg">Document Details</h1>
      <div className="grid grid-cols-3 gap-6 p-5 max-h-[75vh] overflow-y-scroll">
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company PAN Number
          </h1>
          <Input placeholder="Enter Reg No." />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Company on PAN Card
          </h1>
          <Input placeholder="Enter Reg No." />
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload PAN Document
          </h1>
          <Input placeholder="" type="file" />
        </div>
        <div className="col-span-3 grid grid-cols-3 gap-6">
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Type Of Business (Please select any one)
            </h1>
            <Select
              onValueChange={(value) => {
                setBusinessType(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Special Economic Zone">
                    Special Economic Zone
                  </SelectItem>
                  <SelectItem value="Compounding Schema">
                    Compounding Schema
                  </SelectItem>
                  <SelectItem value="Registered">Registered</SelectItem>
                  <SelectItem value="Not-Registered">Not-Registered</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div
          className={`col-span-3 grid grid-cols-3 gap-6 ${BusinessType == "Not-Registered" || BusinessType == "" ? "hidden" : ""}`}
        >
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              State
            </h1>
            <Input placeholder="Enter State" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              GST Number
            </h1>
            <Input placeholder="Enter GST Number" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              GST Registration Date
            </h1>
            <Input placeholder="Enter Registration Date" type="date" />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Upload GST Document
            </h1>
            <Input type="file" />
          </div>
          <div className=" flex items-end w-full">
            <Button className="bg-blue-400 hover:bg-blue-400">Add</Button>
          </div>
        </div>
        <div className="flex flex-col col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            MSME Registered?
          </h1>
          <Select
            onValueChange={(value) => {
              setIsMSME(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div
          className={`flex flex-col col-span-1 ${isMSME == "yes" ? "" : "hidden"}`}
        >
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            MSME Enterprise Type
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className={`${isMSME == "yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Udyam Registration No.
          </h1>
          <Input placeholder="" />
        </div>
        <div className={`${isMSME == "yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Name of Company in Udyam Certificate
          </h1>
          <Input placeholder="" />
        </div>
        <div className={`${isMSME == "yes" ? "" : "hidden"}`}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload Udyam Certificate
          </h1>
          <Input placeholder="" type="file" />
        </div>
      </div>
      <div className="grid grid-cols-3 pl-5 gap-6">
        <div className={``}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Enterprise Registration Number
          </h1>
          <Input placeholder="Enter Enterprise Registration Number" />
        </div>
        <div className={``}>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Upload Enterprise Registration Document
          </h1>
          <Input placeholder="" type="file" />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails;
