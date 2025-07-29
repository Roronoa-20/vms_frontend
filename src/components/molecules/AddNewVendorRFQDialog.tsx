import React from 'react'
import PopUp from './PopUp'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { Input } from '../atoms/input'


interface Props {
    handleClose:()=>void
}

const AddNewVendorRFQDialog = ({handleClose}:Props) => {
  return (
    <PopUp headerText='Add New Vendor' classname='w-full h-full overflow-y-scroll' handleClose={handleClose}>
        <div className="grid grid-cols-3 gap-6 p-5">
          <div>
            <div className="grid grid-cols-4 gap-1">
              <div className="flex flex-col col-span-1">
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Vendor Title
                </h1>
                <Input className="col-span-2" placeholder="Enter Company Name" />
              </div>
              <div className="col-span-3">
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Company Name
                </h1>
                <Input className="col-span-2 w-full border rounded-lg" placeholder="Enter Company Name" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Type Of Business (Please select any one) <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* {
                    companyDetailDropdown?.type_of_business?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  } */}
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* {errors?.type_of_business && !data?.type_of_business && <span style={{ color: 'red' }}>{errors?.type_of_business}</span>} */}
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
                  <SelectItem value="apple">50-100</SelectItem>
                  <SelectItem value="banana">100-200</SelectItem>
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
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Reg No.
              {/* <span className="pl-2 text-red-400 text-xl">*</span> */}
            </h1>
            <Input placeholder="Enter Reg No." />
            {/* {errors?.registered_office_number && !data?.registered_office_number && <span style={{ color: 'red' }}>{errors?.registered_office_number}</span>} */}
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
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Corporate Identification No.(CIN No.) <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Input placeholder="" />
            {/* {errors?.corporate_identification_number && !data?.corporate_identification_number && <span style={{ color: 'red' }}>{errors?.corporate_identification_number}</span>} */}
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] flex">
              Cin Date <span className="pl-2 text-red-400 text-xl">*</span>
            </h1>
            <Input type="date" placeholder="Enter your CIN Date" max={new Date().toISOString().split("T")[0]}/>
            {/* {errors?.cin_date && !data?.cin_date && <span style={{ color: 'red' }}>{errors?.cin_date}</span>} */}
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
                  {/* {
                    companyDetailDropdown?.company_nature_master?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  } */}
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
                  {/* {
                    companyDetailDropdown?.business_nature_master?.map((item, index) => (
                      <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                    ))
                  } */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-3">
              Vendor Type
            </h1>
          </div>
        </div>
    </PopUp>
  )
}

export default AddNewVendorRFQDialog