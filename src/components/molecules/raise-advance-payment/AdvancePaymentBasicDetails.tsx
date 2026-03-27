"use client"
import React, { useRef, useState } from 'react'
import { Input } from '../../atoms/input'
import { Button } from '../../atoms/button'
import { Trash2 } from 'lucide-react'
import { deleteFileApi, uploadFileApi } from '../view-po-details/apiCalls'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import Link from 'next/link'
import { fetchPoDetailsData } from '../view-po-details/fetchData'

interface Props {
    poBasicDetails: PoDetailsType["message"]
}

const AdvancePaymentBasicDetails = ({ poBasicDetails }: Props) => {
    const [poAttachment, setPoAttachment] = useState<File | null>(null);
    const uploadPoRef = useRef<HTMLInputElement>(null);
    const [poBasicDetailsState, setPoBasicDetailsState] = useState<PoDetailsType["message"]>(poBasicDetails);

    const resetFileUpload = () => {
        if (uploadPoRef.current) {
            uploadPoRef.current.value = "";
        }
    }

    const uploadPoDocument = async () => {
        if (!poAttachment) {
            alert("Please select a file to upload");
            return;
        }
        await uploadFileApi(poAttachment, poBasicDetailsState.po_name).then(async (res) => {
            alert("File uploaded successfully");
            resetFileUpload();
            setPoAttachment(null);
            const poDetails: PoDetailsType | undefined = await fetchPoDetailsData(poBasicDetailsState.po_name);
            setPoBasicDetailsState(poDetails?.message as PoDetailsType["message"]);
        });
    }

    const deletePoDocument = async () => {
        await deleteFileApi(poBasicDetailsState.po_name).then(async (res) => {
            alert("File deleted successfully");
            const poDetails: PoDetailsType | undefined = await fetchPoDetailsData(poBasicDetailsState.po_name);
            setPoBasicDetailsState(poDetails?.message as PoDetailsType["message"]);
        }).catch((err) => {
            alert("Failed to delete file");
        });
    }

    return (
        <>
            <div className='bg-white shadow-md border grid grid-cols-4 gap-3 p-4 rounded-xl mt-3 mx-2'>
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
                <div className='flex gap-2'>
                    <h1 className='font-semibold'>Total Value of PO/SO: </h1>
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
                        <span className='text-sm font-light flex justify-end' style={{ fontFamily: 'sans-serif' }}>(Only PDF)</span>
                    </div>
                    <div className='flex gap-2 items-center justify-start'>
                        <label htmlFor='advance-payment-file' className='border-2 border-dashed rounded-xl py-3 px-4 flex justify-center items-center cursor-pointer truncate gap-2 bg-[#FCFCFC]'>
                            <svg className='' width="30" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.1883 10.4122L10.9983 19.6022C9.87249 20.7281 8.34552 21.3606 6.75334 21.3606C5.16115 21.3606 3.63418 20.7281 2.50834 19.6022C1.38249 18.4764 0.75 16.9494 0.75 15.3572C0.75 13.765 1.38249 12.2381 2.50834 11.1122L11.6983 1.92222C12.4489 1.17166 13.4669 0.75 14.5283 0.75C15.5898 0.75 16.6078 1.17166 17.3583 1.92222C18.1089 2.67279 18.5306 3.69077 18.5306 4.75222C18.5306 5.81368 18.1089 6.83166 17.3583 7.58222L8.15834 16.7722C7.78306 17.1475 7.27406 17.3583 6.74334 17.3583C6.21261 17.3583 5.70362 17.1475 5.32834 16.7722C4.95306 16.3969 4.74222 15.888 4.74222 15.3572C4.74222 14.8265 4.95306 14.3175 5.32834 13.9422L13.8183 5.46222" stroke="#5291CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className=' font-medium'>{!poAttachment && "Choose File"}</span>
                            <span>{poAttachment ? poAttachment?.name : "No file chosen"}</span>
                            <Input id="advance-payment-file" className='hidden' type='file' ref={uploadPoRef} onChange={(e) => { setPoAttachment(e.target.files?.[0] || null); }} />
                        </label>

                        <Trash2 className={`cursor-pointer text-xl text-red-500 ${poAttachment ? '' : 'hidden'}`} onClick={(e) => { setPoAttachment(null); resetFileUpload(); }} />
                        <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mx-2 rounded-xl" onClick={() => uploadPoDocument()}>Upload</Button>
                    </div>
                    <div className='flex gap-4 items-end justify-start mt-2 pl-4'>
                        <h1 className='text-blue-500 mt-2'><Link target='blank' href={poBasicDetailsState?.po_details_attachment?.url}>{poBasicDetailsState?.po_details_attachment?.file_name}</Link></h1>
                        <h1 className={`cursor-pointer text-lg text-red-500 ${poBasicDetailsState?.po_details_attachment?.url ? '' : 'hidden'}`} onClick={() => { deletePoDocument(); }}> X </h1>
                    </div>
                </div>
                <div></div>
            </div>
        </>
    )
}

export default AdvancePaymentBasicDetails