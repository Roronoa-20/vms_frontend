"use client"
import React, { useState } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'

interface Props {
    Dropdown:PurchaseRequestDropdown["message"]
}


const PRRequestForm = ({Dropdown}:Props) => {
    const [formData,setFormData] = useState();

    const handleSelectChange = (value: any, name: string) => {
        setFormData((prev:any) => ({ ...prev, [name]: value }))
      };

      const handleFieldChange = (e:React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >)=>{
        const {name,value} = e.target;
        setFormData((prev:any)=>({...prev,[name]:value}));
      }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Purchase Request
      </h1>
      {/* <h1 className="pl-5">Contact Person</h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Request Type
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"purchase_requisition_type")}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_requisition_type?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"company")}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Plant
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"plant")}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.plant?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner</h1>
          <Input placeholder="" name='requisitioner' onChange={(e)=>{handleFieldChange(e)}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"company_code_area")}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company_code_area?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h1 className="pl-5">Purchase Request Items</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Item Number of Purchase Requisition
          </h1>
          <Input placeholder="" name='' onChange={(e)=>{handleFieldChange(e)}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Requisition Date
          </h1>
          <Input placeholder="" type="date" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Delivery Date
          </h1>
          <Input placeholder="" type="date" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Item Category
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Material Group
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.material_group_master?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            UOM
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.uom_master?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Cost Center
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.cost_center?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Main Asset No
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Asset Subnumber
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Profit Center
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.profit_center?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Description
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Quantity
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Price Of Purchase Requisition
          </h1>
          <Input placeholder="" />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            GL Account Number
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.gl_account_number?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Material Code
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.material_code?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Assignment Category
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.account_assignment_category?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_group?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        </div>
      <div className={`flex justify-end pb-4`}>
        <Button className="bg-blue-400 hover:bg-blue-400">Add</Button>
      </div>
        <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Purchase Requisition Date</TableHead>
                  <TableHead className="text-center">Delivery Date</TableHead>
                  <TableHead className="text-center">Store Location</TableHead>
                  <TableHead className="text-center">Item Category</TableHead>
                  <TableHead className="text-center">Material Group</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Cost Center</TableHead>
                  <TableHead className="text-center">Main Asset No</TableHead>
                  <TableHead className="text-center">Asset Subnumber</TableHead>
                  <TableHead className="text-center">Profit Center</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price Of Purchase Requisition</TableHead>
                  <TableHead className="text-center">GL Account Number</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Account Assignment Category</TableHead>
                  <TableHead className="text-center">Purchase Group</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {/* {contactDetail?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index +1}</TableCell>
                    <TableCell>{item?.first_name}</TableCell>
                    <TableCell>{item?.last_name}</TableCell>
                    <TableCell>{item?.designation}</TableCell>
                    <TableCell>
                      {item?.email}
                    </TableCell>
                    <TableCell>{item?.contact_number}</TableCell>
                    <TableCell>{item?.department_name}</TableCell>
                  </TableRow>
                ))} */}
              </TableBody>
            </Table>
          </div>
          <div className={`flex justify-end pr-4`}><Button >Next</Button></div>
    </div>
  )
}

export default PRRequestForm