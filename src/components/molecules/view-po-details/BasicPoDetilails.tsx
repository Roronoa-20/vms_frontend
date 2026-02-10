"use client"
import React, { useRef, useState } from 'react'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { Cross, Italic, Trash2 } from 'lucide-react'
import { deleteFileApi, uploadFileApi } from './apiCalls'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import Link from 'next/link'
import { fetchPoDetailsData } from './fetchData'
import { set } from 'nprogress'
import PopUp from '../PopUp'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'

interface POItemsTable {
    requested_for_earlydelivery?: boolean;
    product_name?: string;
    material_code?: string;
    short_text?: string;
    plant?: string;
    schedule_date?: string;
    quantity?: string | number;
    early_delivery_date?: string;
    purchase_team_remarks?: string;
}

interface Props {
    poBasicDetails: PoDetailsType["message"]
}

const BasicPoDetilails = ({poBasicDetails}: Props) => {
    const [poAttachment,setPoAttachment] = useState<File | null>(null);
    const uploadPoRef = useRef<HTMLInputElement>(null);
    const [poBasicDetailsState, setPoBasicDetailsState] = useState<PoDetailsType["message"]>(poBasicDetails);
    const [POItemsTable, setPOItemsTable] = useState<POItemsTable[]>([]);
    const [isEarlyDeliveryDialog, setIsEarlyDeliveryDialog] = useState<boolean>(false);

    const resetFileUpload = () => {
        if(uploadPoRef.current){
            uploadPoRef.current.value = "";
        }
    }

    const uploadPoDocument = async() => {
        if(!poAttachment){
            alert("Please select a file to upload");
            return;
        }
        await uploadFileApi(poAttachment, poBasicDetailsState.po_name).then(async (res)=>{
                alert("File uploaded successfully");
                resetFileUpload();
                setPoAttachment(null);
                const poDetails:PoDetailsType | undefined = await fetchPoDetailsData(poBasicDetailsState.po_name);
            setPoBasicDetailsState(poDetails?.message as PoDetailsType["message"]);
        });
    }

    const deletePoDocument = async() => {
        await deleteFileApi(poBasicDetailsState.po_name).then(async(res)=>{
                alert("File deleted successfully");
            const poDetails:PoDetailsType | undefined = await fetchPoDetailsData(poBasicDetailsState.po_name);
            setPoBasicDetailsState(poDetails?.message as PoDetailsType["message"]);
        }
    ).catch((err)=>{
        alert("Failed to delete file");
    });
    }


    const handleTableChange = (index: number, name: string, value: string | boolean) => {
    // const { name, value } = e.target;
    setPOItemsTable((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
  }

  const handlePoItemsSubmit = async () => {
    const url = API_END_POINTS?.submitPOItems;
    const updatedData = { items: POItemsTable, po_name: poBasicDetailsState.po_name };
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: updatedData } });
    if (response?.status == 200) {
      alert("submitted successfully");
    }
  }

  const handleClose = () => {
    setIsEarlyDeliveryDialog(false);
    // setIsEmailDialog(false);
    // setDate("");
    // setComments("");
    // setEmail((prev: any) => ({ ...prev, cc: [] }));
  }

  const handleOpen = () => {
    fetchPOItems();
    setIsEarlyDeliveryDialog(true);
  }

  const fetchPOItems = async () => {
    const url = `${API_END_POINTS?.POItemsTable}?po_name=${poBasicDetailsState.po_name}`;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPOItemsTable(response?.data?.message?.items)
    }
  }

  return (
    <>
    <div className='bg-white shadow-md border grid grid-cols-3 gap-3 p-4 rounded-xl mt-3 mx-2'>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>PO Number: </h1>
            <p>{poBasicDetailsState?.po_name}</p>
        </div>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>PO Date: </h1>
            <p>{poBasicDetailsState?.po_date}</p>
        </div>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>Vendor Code: </h1>
            <p>{poBasicDetailsState?.vendor_code}</p>
        </div>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>Vendor Name: </h1>
            <p>{poBasicDetailsState?.supplier_name}</p>
        </div>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>Purchase Group: </h1>
            <p>{poBasicDetailsState?.purchase_group_name}</p>
        </div>
        <div className='flex gap-2'>
            <h1 className='font-semibold'>Purchase Contact Person: </h1>
            <p>{poBasicDetailsState?.contact_person}</p>
        </div>
        <div className="flex gap-2">
            <h1 className='font-semibold'>Status: </h1>
            <p>{poBasicDetailsState?.po_status}</p>
        </div>
    </div>
    <div className='bg-white shadow-md border gap-3 p-4 rounded-xl mt-3 mx-2'>
        <div className='flex flex-col relative w-[30%] justify-center'>
          <div className='flex gap-5 justify-start'>
        <h1 className='pb-2 font-semibold'>Attach PO</h1>
        <div className='absolute left-20 top-0 text-red-500 text-xl'>*</div>
        <span className='text-sm font-light flex justify-end' style={{fontFamily:'sans-serif'}}>(Only PDF)</span>
          </div>
        <div className='flex gap-2 items-center justify-start'>
          
        <label htmlFor='file' className='border-2 border-dashed rounded-xl py-3 px-4 flex justify-center items-center cursor-pointer truncate gap-2 bg-[#FCFCFC]'>
        <svg className='' width="30" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.1883 10.4122L10.9983 19.6022C9.87249 20.7281 8.34552 21.3606 6.75334 21.3606C5.16115 21.3606 3.63418 20.7281 2.50834 19.6022C1.38249 18.4764 0.75 16.9494 0.75 15.3572C0.75 13.765 1.38249 12.2381 2.50834 11.1122L11.6983 1.92222C12.4489 1.17166 13.4669 0.75 14.5283 0.75C15.5898 0.75 16.6078 1.17166 17.3583 1.92222C18.1089 2.67279 18.5306 3.69077 18.5306 4.75222C18.5306 5.81368 18.1089 6.83166 17.3583 7.58222L8.15834 16.7722C7.78306 17.1475 7.27406 17.3583 6.74334 17.3583C6.21261 17.3583 5.70362 17.1475 5.32834 16.7722C4.95306 16.3969 4.74222 15.888 4.74222 15.3572C4.74222 14.8265 4.95306 14.3175 5.32834 13.9422L13.8183 5.46222" stroke="#5291CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
        <span className=' font-medium'>{!poAttachment && "Choose File"}</span>
        <span>{poAttachment ? poAttachment?.name : "No file chosen"}</span>
        <Input id="file" className='hidden' type='file' ref={uploadPoRef} onChange={(e)=>{setPoAttachment(e.target.files?.[0] || null);}}/>
        </label>

        <Trash2 className={`cursor-pointer text-xl text-red-500 ${poAttachment ? '' : 'hidden'}`} onClick={(e)=>{setPoAttachment(null);resetFileUpload();}}/>
            <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mx-2 rounded-xl" onClick={()=>uploadPoDocument()}>Upload</Button>
        </div>
        <div className='flex gap-4 items-end justify-start mt-2 pl-4'>
        <h1 className='text-blue-500 mt-2'><Link target='blank' href={poBasicDetailsState?.po_details_attachment?.url}>{poBasicDetailsState?.po_details_attachment?.file_name}</Link></h1>
        <h1 className={`cursor-pointer text-lg text-red-500 ${poBasicDetailsState?.po_details_attachment?.url ? '' : 'hidden'}`} onClick={()=>{deletePoDocument();}}> X </h1>
        </div>
        </div>

        
        
        <div></div>
    </div>
    <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={handleOpen}>Early Delivery</Button>


    {isEarlyDeliveryDialog &&
        <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose} isSubmit={true} Submitbutton={handlePoItemsSubmit}>
          <h1 className="text-[16px] font-medium pb-3 pl-1">Purchase Order Items</h1>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="text-center">Select</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Material Description</TableHead>
                  <TableHead className="text-center">Plant</TableHead>
                  <TableHead className="text-center">Schedule Date</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Early Delivery Date</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {POItemsTable?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className='text-center'><input type="checkbox" name="requested_for_earlydelivery" onChange={(e) => { handleTableChange(index, e.target.name, e.target.checked) }} checked={item?.requested_for_earlydelivery ?? undefined} /></TableCell>
                    <TableCell className='text-center'>{item?.product_name}</TableCell>
                    <TableCell className='text-center text-nowrap'>{item?.material_code}</TableCell>
                    <TableCell className='text-center text-nowrap'>{item?.short_text}</TableCell>
                    <TableCell className='text-center'>{item?.plant}</TableCell>
                    <TableCell className='text-center'>{item?.schedule_date}</TableCell>
                    <TableCell className='text-center'>
                      <div className={`flex justify-center`}>
                        <Input type="number" name="quantity" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.quantity ?? ""} className='w-16 disabled:opacity-100' />
                      </div>
                    </TableCell>
                    <TableCell className={`flex justify-center`}><Input type="date" name="early_delivery_date" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.early_delivery_date ?? ""} className='w-36 disabled:opacity-100' /></TableCell>
                    <TableCell><div className={`flex justify-center`}> <Input name="purchase_team_remarks" onChange={(e) => { handleTableChange(index, e.target.name, e.target.value) }} value={item?.purchase_team_remarks ?? ""} className='w-24 disabled:opacity-100' /></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PopUp>
      }

    </>
  )
}

export default BasicPoDetilails