import React from 'react'
import { Input } from '../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '../atoms/button'

const GateEntryForm = () => {
  return (
    <div className='p-5'>
    <div className='grid md:grid-cols-3 sm-grid-cols-3 gap-6'>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Inward Location
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* {
                    MultipleVendorCode?.map((item,index)=>(
                        <SelectItem key={index} value={item?.vendor_code}>{item?.vendor_code}</SelectItem>
                    ))
                } */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Scan Barcode</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          {/* <h1 className="text-[14px] font-normal text-[#000000] pb-3">Docket No</h1>
          <Input placeholder="" name='user' /> */}
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Name Of Company
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* {
                    MultipleVendorCode?.map((item,index)=>(
                        <SelectItem key={index} value={item?.vendor_code}>{item?.vendor_code}</SelectItem>
                    ))
                } */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Name Of Supplier</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier GST</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier Address</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Purchase Order Number</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Order Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice Date.</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill of Entry No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill Of Entry Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Material Description</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Qty as per Invoice/Challan</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Transport/Courier</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">LR/Airway Bill No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">LR/Airway Bill Date</h1>
          <Input placeholder="" name='user' type='date' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Vehicle Type</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Vehical No</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Driver Name</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Driver Mobile No.</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Created By</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Created Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice Value</h1>
          <Input placeholder="" name='user' />
        </div>
    </div>
    <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Remarks</h1>
          <Textarea placeholder="" name='user' />
    </div>
    <div className='flex w-full justify-end gap-2 pt-4'>
                    <Button className='bg-blue-500 hover:bg-blue-400 rounded-xl'>Submit</Button>
                    <Button className='bg-white hover:bg-white text-blue-500 border border-blue-500 rounded-xl'>Print</Button>
    </div>
    <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Received Remark</h1>
          <Textarea placeholder="" name='user' />
    </div>
    <div className='flex w-full justify-end gap-2 pt-4'>
                    <Button className='bg-blue-500 hover:bg-blue-400 rounded-xl'>Material Received</Button>
    </div>
    <div className="md:max-w-[20%]">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3 text-nowrap">
            Handover to Person
          </h1>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {/* {
                    MultipleVendorCode?.map((item,index)=>(
                        <SelectItem key={index} value={item?.vendor_code}>{item?.vendor_code}</SelectItem>
                    ))
                } */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Handover Remark</h1>
          <Textarea placeholder="" name='user' />
    </div>
    <div className='flex w-full justify-end gap-2 pt-4'>
                    <Button className='bg-blue-500 hover:bg-blue-400 rounded-xl'>Hand Over</Button>
    </div>
          </div>
  )
}

export default GateEntryForm