"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { PurchaseRequestData, PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import { EyeIcon, Trash2 } from 'lucide-react';
import { PencilIcon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XIcon } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import MultiSelect, { GroupBase, MultiValue } from "react-select";
import { multiSelectStyles } from "@/src/components/common/sharedStyles";
import { companyDropdownBasedOnUserType, locationDropdownType, ProductNameDropdown, PurchaseTypeType, TPRInquiry } from '@/src/types/prEnquiry/prEnquiry.types'
import { acknowledgeEnquiry, addEnquiryItems, approvalEnquiry, createPurchaseEnquiry, deleteEnquiryItems, getlocationDropdown, getProductNameDropdown, getPurchaseEnquiryData, submitEnquiry } from '@/src/services/prEnquiry/prEnquiry.services'
import SearchableDropdown from '../molecules/SearchableDropdown'
import SearchSelectComponent from '../molecules/Selectsearchcomponent'
import PopUp from '../molecules/PopUp'



interface Props {
PRInquiryData:TPRInquiry
}


const ViewPRInquiryForm = ({PRInquiryData}:Props) => {
  const router = useRouter();
  const param = useSearchParams();
  const refno = param.get("cart_id");

  const [formData, setFormData] = useState<TPRInquiry>();
  

  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);

  const [isAcknowledgeDialog,setIsAcknowledgeDialog] = useState<boolean>(false);
  const [acknowledgeBody,setAcknowledgeBody] = useState<any>();
  const [isApprovalDialog,setIsApprovalDialog] = useState<boolean>(false);
  const [approvalBody,setApprovalBody] = useState<any>();
  const [isRejectionDialog,setIsRejectionDialog] = useState<boolean>(false);

  const [selectedProductName,setSelectedProductName] = useState<string>();


  useEffect(()=>{
    if(refno){
      getPurchaseEnquiryData(refno).then((data)=>{
        setFormData(data)
      })
    }
  },[])


  const handleClose = ()=>{
    setIsAcknowledgeDialog(false);
    setIsApprovalDialog(false);
    setIsRejectionDialog(false)
  }

  const handleAssestCodeCheck = (index:number,value:boolean)=>{
    setFormData((prev: any) => ({
      ...prev,
      cart_product: prev.cart_product.map((item: any, i: number) =>
        i === index ? { ...item, need_asset_code: value } : item
      )
    }));
  }

  const handleAcknowledge = ()=>{
    const formdata = new FormData();
    if(acknowledgeBody?.file){
      formdata.append("file",acknowledgeBody?.file);
    }

    const body = {
      ...acknowledgeBody,
      cart_id:refno
    };
    formdata?.append("data",JSON.stringify(body));
    acknowledgeEnquiry(formdata).then((data)=>{alert("Acknowledged successfully!");getPurchaseEnquiryData(refno as string).then((data)=>setFormData(data))}).finally(()=>{setAcknowledgeBody(null);setIsAcknowledgeDialog(false);setIsApprovalDialog(false)})
  }

  const handleFinalPriceChange = (index:number,value:string)=>{
    setFormData((prev:any)=>({
      ...prev,cart_product:formData?.cart_product?.map((item,i)=>(
        i === index ? {...item,final_price_by_purchase_team:value} : item
      ))
    }))
  }

  const handleApproval = ()=>{
    const body = {
      data:{
        ...approvalBody,
        cart_id:refno,
        action:1
      }
    }
  approvalEnquiry(body).then((data)=>{alert("approved successfully");}).finally(()=>{setApprovalBody(null);setIsApprovalDialog(false);getPurchaseEnquiryData(refno as string).then((data)=>(setFormData(data)))})
  }

  const handleReject = ()=>{
    const body = {
      data:{
        ...approvalBody,
        cart_id:refno,
        action:0
      }
    }
  approvalEnquiry(body).then((data)=>{alert("Rejected successfully");}).finally(()=>{setApprovalBody(null);setIsRejectionDialog(false)})
  }
  console.log(typeof(formData?.cart_product?.[0]?.purchase_team_acknowledgement) ,"this is type")

  return (
    <>
      <div className="flex flex-col bg-white rounded-lg px-2 pb-2 max-h-[80vh] w-full">
        <div className="grid grid-cols-3 gap-6 p-3">
        <div className='col-span-1 flex flex-col gap-1'>
          <h1 className='text-[#626973]'>User</h1>
          {PRInquiryData?.user}
        </div>
        <div className='col-span-1 flex flex-col gap-1'>
          <h1 className='text-[#626973]'>Cart Use</h1>
          {PRInquiryData?.cart_use}
        </div>
        <div className='col-span-1 flex flex-col gap-1'>
          <h1 className='text-[#626973]'>Enquiry Raise Date</h1>
          {PRInquiryData?.cart_date}
        </div>
        <div className='col-span-1 flex flex-col gap-1'>
          <h1 className='text-[#626973]'>Company</h1>
          {PRInquiryData?.company?.description}
        </div>
        </div>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl mt-4">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Items List
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll relative">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Product Type</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Is Assest Code? </TableHead>
                  <TableHead className="text-center">Product Quantity</TableHead>
                  <TableHead className="text-center">location</TableHead>
                  <TableHead className="text-center">User Specification</TableHead>
                  <TableHead className="text-center">Attachment</TableHead>
                  <TableHead className="text-center">Category Type</TableHead>
                  <TableHead className="text-center">Product Price</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Lead Time</TableHead>
                  <TableHead className="text-center">Final Price</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {
                    <TableHead className="text-center">Action</TableHead>
                  }
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
               {
                formData?.cart_product?.map((item,index)=>(
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className=''>{item?.purchase_type ?? ""}</TableCell>
                    <TableCell>{item?.product_details?.product_name}</TableCell> 
                    <TableCell className='flex justify-center'><Input className='w-5' type='checkbox' onChange={(e)=>{handleAssestCodeCheck(index,e.target?.checked)}} checked={item?.need_asset_code?true:false} disabled={item?.purchase_team_acknowledgement}/></TableCell>
                    <TableCell>{item?.product_quantity}</TableCell>
                    <TableCell>{item?.plant_details?.plant_name ?? ""}</TableCell>
                    <TableCell>{item?.user_specifications}</TableCell>
                    <TableCell><Link href={item?.attachment_details?.url ?? ""} target='blank'>{item?.attachment_details?.file_name}</Link></TableCell> 
                    <TableCell>{item?.category_type ?? ""}</TableCell>
                    <TableCell>{item?.product_price ?? ""}</TableCell>
                    <TableCell>{item?.uom}</TableCell>
                    <TableCell>{item?.lead_time}</TableCell>
                    <TableCell>
                      <Input type='number' disabled={item?.can_approve === 1?false:true} value={item?.final_price_by_purchase_team ?? ""} onChange={(e)=>{handleFinalPriceChange(index,e.target.value)}}/>
                      </TableCell>
                    <TableCell>{item?.remarks}</TableCell>
                    <TableCell>{item?.approval_status}</TableCell>
                      <TableCell>
                      {
                        !item?.purchase_team_acknowledgement &&
                        <div className='flex gap-4 justify-center items-center'>
                        <svg onClick={()=>{setIsAcknowledgeDialog(true);setAcknowledgeBody((prev:any)=>({...prev,need_asset_code:item?.need_asset_code,name:item?.name}))}} className='hover:cursor-pointer' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.75 8.25L9 10.5L16.5 3" stroke="#16A34A" strokeWidth="1.32" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15.75 9V14.25C15.75 14.6478 15.592 15.0294 15.3107 15.3107C15.0294 15.592 14.6478 15.75 14.25 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V3.75C2.25 3.35218 2.40804 2.97064 2.68934 2.68934C2.97064 2.40804 3.35218 2.25 3.75 2.25H12" stroke="#16A34A" strokeWidth="1.32" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                      
                        <svg onClick={()=>{setIsRejectionDialog(true);setApprovalBody((prev:any)=>({...prev,name:item?.name}))}} className='hover:cursor-pointer' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6602 0.660156L0.660156 12.6602M0.660156 0.660156L12.6602 12.6602" stroke="#F87171" strokeWidth="1.32" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>

                    </div>
}
                    {
                      (item?.purchase_team_acknowledgement && item?.can_approve) ? 
                  <Button
                   className=" rounded-xl px-2 py-2 font-normal"
                  variant="nextbtn"
                  size="nextbtnsize"
                  onClick={()=>{setIsApprovalDialog(true);setApprovalBody((prev:any)=>({...prev,name:item?.name,final_price_by_purchase_team:item?.final_price_by_purchase_team}))}}
                  >Proceed</Button>
                  :""
                    }
                    </TableCell>
                  </TableRow>
                ))
               }
              </TableBody>
            </Table>
          </div>
          {/* {
            !formData?.is_submited && 
            <div className={`flex justify-end pr-2 mt-4 pb-4 ${refno ? "" : "hidden"}`}><Button className='py-2.5' variant={"nextbtn"} size={"nextbtnsize"} >Submit</Button></div>
          } */}
      </div>
      {
        isAcknowledgeDialog &&
        <PopUp Submitbutton={() => { handleAcknowledge() }} isSubmit={true} headerText='Comments' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[900px] md:max-h-[700px]' isHeaderTextUnderline={true}>
          <Input className='mt-5 rounded-xl py-2' placeholder='Enter your comment here...' onChange={(e)=>{setAcknowledgeBody((prev:any)=>({...prev,remarks:e.target.value}))}}/>
          <div className='grid grid-cols-2 mt-4 gap-4'>
            <div className="col-span-1">
                            <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                              Expected Delivery <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                            </h1>
                            <Input onChange={(e)=>setAcknowledgeBody((prev:any)=>({...prev,expected_date:e.target.value}))} type='date' min={new Date().toISOString().split('T')[0]}/>
                          </div>
            <div className="col-span-1">
                            <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                              Attachment
                            </h1>
                            <Input type='file' onChange={(e)=>{setAcknowledgeBody((prev:any)=>({...prev,file:e.target.files?.[0]}))}}/>
                          </div>
          </div>
          <div className='bg-[#F6F6F7] mt-3 rounded-lg p-1'>
          <h1 className='font-semibold text-[14px] pl-3'>Disclaimer: <span className='font-normal text-[14px] text-inherit'>The Expected Delivery Date can be changed based on the receipt of Purchase Order and Purchase Requisition.</span></h1>
          </div>
        </PopUp>

      }
        {
          isApprovalDialog && 
          <PopUp Submitbutton={() => { handleApproval() }} isSubmit={true} headerText='Is Additional Approval Required ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[900px] md:max-h-[700px]' isHeaderTextUnderline={true}>
            <div className='flex w-full justify-start gap-4 '>
              <div className='flex gap-2 items-center'>
              <Input type='radio' className='w-3' name='isAdditional' onClick={()=>{setApprovalBody((prev:any)=>({...prev,required_additional_approver:true}))}}/>
                <h1>Yes</h1>
              </div>
              <div className='flex gap-2 items-center'>
              <Input type='radio' className='w-3' name='isAdditional' onClick={()=>{setApprovalBody((prev:any)=>({...prev,required_additional_approver:false}))}} />
              <h1>No</h1>
              </div>
            </div>
            {
              approvalBody?.required_additional_approver &&
              <div className='grid grid-cols-2 mt-3'>
            <div className="col-span-1">
                            <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                              Enter Additional Approval Email ID <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                            </h1>
                            <Input onChange={(e)=>setApprovalBody((prev:any)=>({...prev,additional_approver_email:e.target.value}))} placeholder='Type here...' />
                          </div>
              </div>
            }
            <Input className='mt-3' placeholder='Enter your comment here...' onChange={(e)=>{setApprovalBody((prev:any)=>({...prev,remarks:e.target.value}))}}/>
          </PopUp>
        }


        {
          isRejectionDialog && 
          <PopUp Submitbutton={() => { handleReject() }} isSubmit={true} headerText='Are You Sure You Want to Reject ?' handleClose={handleClose} classname='pb-3 md:w-full md:max-w-[900px] md:max-h-[700px]' isHeaderTextUnderline={true}>
            <Input className='mt-3' placeholder='Enter your comment here...' onChange={(e)=>{setApprovalBody((prev:any)=>({...prev,remarks:e.target.value}))}}/>
          </PopUp>
        }

    </>
  )
}

export default ViewPRInquiryForm