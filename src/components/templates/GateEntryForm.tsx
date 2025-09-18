"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '../atoms/button'
import QRScanner from '../molecules/QRScanner'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { TFetchedQRData } from '@/src/types/GateEntryTypes'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'

const GateEntryForm = () => {
    const [ScannedQRData,setScannedQRData] = useState<string | null>(null);
    const [fetchedData,setFetchedData] = useState<TFetchedQRData>();


    const fetchQRData = async()=>{
        const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.sendQRData,method:"POST",data:{data:ScannedQRData}});
        if(response?.status == 200){
            setFetchedData(response?.data?.message?.data);
            console.log(response?.data?.message?.data,"this is scanned qr data");
        }
    }
    

    useEffect(()=>{
        if(ScannedQRData){
            fetchQRData();
        }
    },[ScannedQRData])

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
                        <SelectItem key={index} defaultValue={item?.vendor_code}>{item?.vendor_code}</SelectItem>
                    ))
                } */}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Scan Barcode</h1>
          {/* <Input placeholder="" name='user' /> */}
          {/* <Button className='bg-blue-500 hover:bg-blue-400'>Scan BarCode</Button> */}
          <QRScanner setScannedQRData={setScannedQRData}/>
        </div>
        <div className="col-span-1">
          {/* <h1 className="text-[14px] font-normal text-[#000000] pb-3">Docket No</h1>
          <Input placeholder="" name='user' /> */}
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Name Of Company
          </h1>
          <Input placeholder="" disabled name='user' defaultValue={fetchedData?.company_name ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry No.</h1>
          <Input placeholder="" disabled name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry Date</h1>
          <Input placeholder="" disabled name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Name Of Supplier</h1>
          <Input placeholder="" defaultValue={fetchedData?.vendor_name ?? ""} disabled name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier GST</h1>
          <Input placeholder="" defaultValue={fetchedData?.supplier_gst ?? ""} name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier Address</h1>
          <Input placeholder="" defaultValue={fetchedData?.vendor_address ?? ""} name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice No.</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.invoice_number ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice Date.</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.invoice_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill of Entry No.</h1>
          <Input placeholder="" name='user' value={fetchedData?.bill_of_entry_no ?? ""} onChange={(e)=>{setFetchedData((prev:any)=>({...prev,bill_of_entry_no:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill Of Entry Date</h1>
          <Input placeholder="" name='user' type='date' value={fetchedData?.bill_of_entry_date ?? ""} onChange={(e)=>{setFetchedData((prev:any)=>({...prev,bill_of_entry_date:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill No.</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.e_way_bill_no ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill Date</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.e_way_bill_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Transport/Courier</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.courier_name ?? ""}/>
        </div>
        </div>
        {/* <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Purchase Order Number</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Order Date</h1>
          <Input placeholder="" name='user' type='date'/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Material Description</h1>
          <Input placeholder="" name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Qty as per Invoice/Challan</h1>
          <Input placeholder="" name='user' />
        </div> */}
         <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl mt-5">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Purchase Order Items
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">Purchase Order No</TableHead>
                <TableHead className="text-center">Order Date</TableHead>
                <TableHead className="text-center">Material Description</TableHead>
                <TableHead className="text-center">Qty as per Invoice/Challan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {
                fetchedData?.items?.map((item,index)=>(
                  <TableRow key={index}>
                    <TableCell>
                      {index+1}
                    </TableCell>
                    <TableCell>
                      {item?.po_number}
                    </TableCell>
                    <TableCell>
                      {item?.creation}
                    </TableCell>
                    <TableCell>
                      {item?.description}
                    </TableCell>
                    <TableCell>
                      {item?.quantity}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>

          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl mt-5">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Vehical List
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">Vehical Type</TableHead>
                <TableHead className="text-center">Vehical No</TableHead>
                <TableHead className="text-center">Driver Name</TableHead>
                <TableHead className="text-center">Driver Mobile No</TableHead>
                <TableHead className="text-center">LR/Airway Bill No.</TableHead>
                <TableHead className="text-center">LR/Airway Bill Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
             {
                fetchedData?.vehical_details?.map((item,index)=>(
                  <TableRow key={index}>
                    <TableCell>
                      {index+1}
                    </TableCell>
                    <TableCell>
                      {item?.vehicle_type}
                    </TableCell>
                    <TableCell>
                      {item?.vehicle_no}
                    </TableCell>
                    <TableCell>
                      {item?.driver_name}
                    </TableCell>
                    <TableCell>
                      {item?.driver_phone}
                    </TableCell>
                    <TableCell>
                      {item?.lr_number}
                    </TableCell>
                    <TableCell>
                      {item?.lr_date}
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>

        <div className='grid md:grid-cols-3 sm-grid-cols-3 gap-6'>
        {/* <div className="col-span-1">
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
        </div> */}
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Created By</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.owner ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Created Date</h1>
          <Input placeholder="" name='user' disabled type='date' defaultValue={fetchedData?.creation ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice Value</h1>
          <Input placeholder="" name='user' defaultValue={fetchedData?.invoice_amount ?? ""}/>
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
                        <SelectItem key={index} defaultValue={item?.vendor_code}>{item?.vendor_code}</SelectItem>
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