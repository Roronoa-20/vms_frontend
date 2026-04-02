"use client"
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table'
import { Input } from '../../atoms/input'
import { Trash2 } from 'lucide-react'
import { purchaseRequisitionDataType } from '@/src/types/prRequisition/prRequisition.types'
import { deletePrDocument, uploadPrDocument } from '@/src/services/prRequisition/prRequisitionNb.services'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
  data: purchaseRequisitionDataType["attachment"];
  prId: string;
  canEdit?: boolean;
  fetchPrData: (prId?: string) => void;
  isSubmittingRef?: React.RefObject<boolean>;
}

const FileList = ({ data, prId, canEdit, fetchPrData, isSubmittingRef }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setFile(null);
    setAmount("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleDelete = async (name: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deletePrDocument(name);
      fetchPrData(prId);
    } catch (error) {
      alert("Failed to delete file");
    }
  }

  const handleAdd = async () => {
    if (isSubmittingRef?.current) return;
    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    try {
      await uploadPrDocument(prId, file, amount);
      handleReset();
      fetchPrData(prId);
    } catch (error) {
      alert("Failed to upload file");
    }
  }

  return (
    <div className="mt-4">
      <div className="flex w-full justify-between pb-4">
        <h1 className="text-[20px] text-[#03111F] font-semibold">File List</h1>
      </div>
      <Table className="border border-black/20">
        <TableHeader className="text-center">
          <TableRow className="bg-[#DDE8FE] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
            <TableHead className="">Sr No.</TableHead>
            <TableHead className="">File Name</TableHead>
            <TableHead className="">Amount</TableHead>
            {canEdit && <TableHead className="text-center w-[10%]">Action</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium ">{index + 1}</TableCell>
                <TableCell className="font-medium ">
                  <Link href={item?.url} target="_blank" className="text-blue-500 hover:underline">{item?.filename}</Link>
                </TableCell>
                <TableCell className="font-medium ">{item?.amount}</TableCell>
                {canEdit && (
                  <TableCell className="font-medium">
                    <div className="flex ">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Trash2 className="text-red-400 hover:cursor-pointer" onClick={() => handleDelete(item?.name)} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete File</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={canEdit ? 4 : 3} className="text-center text-gray-500 py-4">
                No files found
              </TableCell>
            </TableRow>
          )}
          {canEdit && (
            <TableRow>
              <TableCell className="font-medium "></TableCell>
              <TableCell className="font-medium">
                <div className="flex gap-2 items-center">
                  <label htmlFor="pr-file-upload" className="border-2 border-dashed rounded-xl py-2 px-4 flex items-center cursor-pointer truncate gap-2 bg-[#FCFCFC]">
                    <svg width="20" height="18" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.1883 10.4122L10.9983 19.6022C9.87249 20.7281 8.34552 21.3606 6.75334 21.3606C5.16115 21.3606 3.63418 20.7281 2.50834 19.6022C1.38249 18.4764 0.75 16.9494 0.75 15.3572C0.75 13.765 1.38249 12.2381 2.50834 11.1122L11.6983 1.92222C12.4489 1.17166 13.4669 0.75 14.5283 0.75C15.5898 0.75 16.6078 1.17166 17.3583 1.92222C18.1089 2.67279 18.5306 3.69077 18.5306 4.75222C18.5306 5.81368 18.1089 6.83166 17.3583 7.58222L8.15834 16.7722C7.78306 17.1475 7.27406 17.3583 6.74334 17.3583C6.21261 17.3583 5.70362 17.1475 5.32834 16.7722C4.95306 16.3969 4.74222 15.888 4.74222 15.3572C4.74222 14.8265 4.95306 14.3175 5.32834 13.9422L13.8183 5.46222" stroke="#5291CD" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm">{file ? file.name : "Choose File"}</span>
                    <Input id="pr-file-upload" className="hidden" type="file" ref={fileInputRef} onChange={(e) => setFile(e?.target?.files?.[0] || null)} />
                  </label>
                  {file && <Trash2 className="cursor-pointer text-red-500 w-5 h-5" onClick={handleReset} />}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
              </TableCell>
              <TableCell>
                <div className="flex">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`flex justify-center items-center text-2xl w-[30px] h-[30px] ${isSubmittingRef?.current ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#D1FAE5] text-[#065F46] hover:cursor-pointer"}`} onClick={handleAdd}>
                          +
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Row</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default FileList