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
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'
import { HandoverPersonDropdownT } from '../pages/ViewGateEntry'


interface Props {
  QrfetchedData : TFetchedQRData,
  refno:string | undefined,
  inwardLocationDropdown:{name:string,inward_location:string}[]
  handoverPersonDropdown:HandoverPersonDropdownT[]
}

const ViewGateEntryForm = ({QrfetchedData,refno,inwardLocationDropdown,handoverPersonDropdown}:Props) => {
    const [ScannedQRData,setScannedQRData] = useState<string | null>(null);
    const [fetchedData,setFetchedData] = useState<TFetchedQRData>(QrfetchedData);
    const {designation} = useAuth();
    const [isDisable,setIsDisable] = useState<boolean>(designation == "Store"?false:true);

    const router = useRouter();
    // const fetchQRData = async()=>{
    //     const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.sendQRData,method:"POST",data:{data:ScannedQRData}});
    //     if(response?.status == 200){
    //         setFetchedData(response?.data?.message?.data);
    //         console.log(response?.data?.message?.data,"this is scanned qr data");
    //     }
    // }
    

    // useEffect(()=>{
    //     if(ScannedQRData){
    //         fetchQRData();
    //     }
    // },[ScannedQRData])


    const handleGateEntrySubmit = async()=>{
      const updatedData = {
        ...fetchedData,
        vehicle_details_item : fetchedData?.vehicle_details_item?.map((item)=>{
          const updated = {
          vehicle_type:item?.vehicle_type,
          lr_date:item?.lr_date,
          lr_number:item?.lr_number,
          driver_name:item?.driver_name,
          driver_phone:item?.driver_phone,
          vehicle_no:item?.vehicle_no,
          vehicle_details:item?.name
          }
          return updated;
        })
      }
      const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.sendGateEntry,data:{data:{...updatedData,name:refno}},method:"POST"});
      if(response?.status == 200){
        alert("gate entry submitted successfully");
        router.push(`/view-gate-entry?refno=${refno}`);
      }
    }

   const tableEdit = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    
  const { name, value } = e.target;

  setFetchedData((prev: TFetchedQRData) => {
    if (!prev) return prev;
    
    // Copy the vehicle_details array
    const updatedVehicleDetails = [...prev.vehicle_details_item];

    // Update the specific item at index
    updatedVehicleDetails[index] = {
      ...updatedVehicleDetails[index],
      [name]: value,
    };

    // Return new state with updated vehicle_details array
    return {
      ...prev,
      vehicle_details_item: updatedVehicleDetails,
    };
  });
};

const handleHandOver = async()=>{
    const data = {
        name:refno,
        handover_person:fetchedData?.handover_to_person,
        handover_remarks:fetchedData?.handover_remark
    }
    const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.handover_submit,method:"POST",data:data});
    if(response?.status == 200){
        alert("handover submitted successfully");
        router.push(`/view-gate-entry?refno=${refno}`)
    }
}


  return (
    <div className='p-5'>
    <div className='grid md:grid-cols-3 sm-grid-cols-3 gap-6'>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Inward Location
          </h1>
          <Select disabled={isDisable}  value={fetchedData?.inward_location ?? ""} onValueChange={(value)=>{setFetchedData((prev)=>({...prev,inward_location:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                    inwardLocationDropdown?.map((item,index)=>(
                        <SelectItem key={index} value={item?.name}>{item?.inward_location}</SelectItem>
                    ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
          {/* <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Docket No</h1>
          <Input placeholder="" name='user' />
        </div> */}
          
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Name Of Company
          </h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.name_of_company ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry No.</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={refno} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Gate Entry Date</h1>
          <Input placeholder="" disabled={isDisable} name='user' type='date' defaultValue={fetchedData?.created_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Name Of Supplier</h1>
          <Input placeholder="" defaultValue={fetchedData?.name_of_vendor ?? ""} disabled={isDisable} name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier GST</h1>
          <Input placeholder="" disabled={isDisable} defaultValue={fetchedData?.vendor_gst ?? ""} name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Supplier Address</h1>
          <Input placeholder="" disabled={isDisable} defaultValue={fetchedData?.vendor_address ?? ""} name='user' />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice No.</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.challan_no ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Challan/Invoice Date.</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.challan_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill of Entry No.</h1>
          <Input placeholder="" disabled={isDisable} name='user' value={fetchedData?.bill_of_entry_no ?? ""} onChange={(e)=>{setFetchedData((prev:any)=>({...prev,bill_of_entry_no:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Bill Of Entry Date</h1>
          <Input placeholder=""  name='user' disabled={isDisable} type='date' value={fetchedData?.bill_of_entry_date ?? ""} onChange={(e)=>{setFetchedData((prev:any)=>({...prev,bill_of_entry_date:e.target.value}))}}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill No.</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.eway_bill_no ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">E-way Bill Date</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.eway_bill_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Transport/Courier</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.transport ?? ""}/>
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
                fetchedData?.gate_entry_details?.map((item,index)=>(
                  <TableRow key={index}>
                    <TableCell>
                      {index+1}
                    </TableCell>
                    <TableCell>
                      {item?.purchase_order}
                    </TableCell>
                    <TableCell>
                      {item?.creation}
                    </TableCell>
                    <TableCell>
                      {item?.description}
                    </TableCell>
                    <TableCell>
                      {item?.received_qty}
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
                fetchedData?.vehicle_details_item?.map((item,index)=>(
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
                    <TableCell className='flex justify-center'>
                      {/* {item?.driver_name} */}
                      <Input disabled={isDisable} className={`max-w-[200px] text-center`} name='driver_name' onChange={(e)=>{tableEdit(index,e)}} value={item?.driver_name ?? ""}/>
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
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.created_by ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Created Date</h1>
          <Input placeholder=""  name='user' disabled={isDisable} type='date' defaultValue={fetchedData?.created_date ?? ""}/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice Value</h1>
          <Input placeholder="" disabled={isDisable} name='user' defaultValue={fetchedData?.invoice_value ?? ""}/>
        </div>
    </div>
    <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Remarks</h1>
          <Textarea placeholder="" className='disabled:opacity-100' disabled={isDisable} value={fetchedData?.remarks ?? ""} onChange={(e)=>{setFetchedData((prev:any)=>({...prev,remarks:e.target.value}))}} />
    </div>
    {
      // designation == "Store" && 
      <>
      <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Received Remark</h1>
          <Textarea placeholder="" className='disabled:opacity-100' disabled={fetchedData?.status == "Received At Store"?true:false} onChange={(e)=>setFetchedData((prev)=>({...prev,received_remark:e.target.value}))} value={fetchedData?.received_remark ?? ""} name='user' />
    </div>
    {
        (fetchedData?.status == "Gate Received")  &&
        <div className='flex w-full justify-end gap-2 pt-4'>
                    <Button className='bg-blue-500 hover:bg-blue-400 rounded-xl' onClick={()=>handleGateEntrySubmit()}>Material Received</Button>
    </div>
    }
      </>
    }
    {
      // designation == "Store" && 
    <>
    <div className="md:max-w-[20%] pt-4">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3 text-nowrap">
            Handover to Person
          </h1>
          <Select value={fetchedData?.handover_to_person} onValueChange={(value)=>{setFetchedData((prev)=>({...prev,handover_to_person:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                    handoverPersonDropdown?.map((item,index)=>(
                        <SelectItem key={index} value={item?.name}>{item?.full_name}</SelectItem>
                    ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='pt-8'>
        <h1 className="text-[14px] font-normal text-[#000000] pb-3">Handover Remark</h1>
          <Textarea placeholder="" name='user' onChange={(e)=>{setFetchedData((prev)=>({...prev,handover_remark:e.target.value}))}} value={fetchedData?.handover_remark ?? ""}/>
    </div>
    {
        fetchedData?.status != "HandedOver" && 
        <div className='flex w-full justify-end gap-2 pt-4'>
                    <Button className='bg-blue-500 hover:bg-blue-400 rounded-xl' onClick={()=>{handleHandOver()}}>Hand Over</Button>
    </div>
    }
    </>
}
          </div>
  )
}

export default ViewGateEntryForm