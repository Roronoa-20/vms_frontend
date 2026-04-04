"use client"
import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../atoms/table'
import { Input } from '../../atoms/input'
import { Trash2, FileText, Upload, Plus } from 'lucide-react'
import { purchaseRequisitionDataType } from '@/src/types/prRequisition/prRequisition.types'
import { deletePrDocument, uploadPrDocument } from '@/src/services/prRequisition/prRequisitionNb.services'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
  const isUploadingRef = useRef<boolean>(false);

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
    if (isSubmittingRef?.current || isUploadingRef.current) return;
    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    isUploadingRef.current = true;
    try {
      await uploadPrDocument(prId, file, amount);
      handleReset();
      fetchPrData(prId);
    } catch (error) {
      alert("Failed to upload file");
    } finally {
      isUploadingRef.current = false;
    }
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-[#0F172A] tracking-tight">File List</CardTitle>
            <p className="text-xs text-[#94A3B8] mt-0.5 font-medium">{data?.length || 0} file{(data?.length || 0) !== 1 ? 's' : ''} attached</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC] text-xs hover:bg-[#F8FAFC] border-b border-slate-200">
                <TableHead className="text-[#64748B] font-semibold uppercase tracking-wider">Sr No.</TableHead>
                <TableHead className="text-[#64748B] font-semibold uppercase tracking-wider">File Name</TableHead>
                <TableHead className="text-[#64748B] font-semibold uppercase tracking-wider">Amount</TableHead>
                {canEdit && <TableHead className="text-center text-[#64748B] font-semibold uppercase tracking-wider w-[10%]">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <TableCell className="text-sm text-[#64748B] tabular-nums">{index + 1}</TableCell>
                    <TableCell className="text-sm">
                      <Link href={item?.url} target="_blank" className="font-medium text-[#4F6BED] hover:text-[#3B54D4] hover:underline transition-colors">{item?.filename}</Link>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-[#0F172A] tabular-nums">{item?.amount}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button onClick={() => handleDelete(item?.name)} className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent><p>Delete File</p></TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canEdit ? 4 : 3} className="text-center py-10">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-10 h-10 text-slate-300" />
                      <p className="text-sm font-medium text-[#94A3B8]">No files attached</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {canEdit && (
                <TableRow className="bg-[#FAFBFC]">
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <label htmlFor="pr-file-upload" className="border-2 border-dashed rounded-lg py-2 px-4 flex items-center cursor-pointer truncate gap-2 bg-white hover:border-[#4F6BED] hover:bg-[#F8F9FF] transition-colors">
                        <Upload className="w-4 h-4 text-[#4F6BED]" />
                        <span className="text-sm font-medium text-[#334155]">{file ? file.name : "Choose File"}</span>
                        <Input id="pr-file-upload" className="hidden" type="file" ref={fileInputRef} onChange={(e) => setFile(e?.target?.files?.[0] || null)} />
                      </label>
                      {file && (
                        <button onClick={handleReset} className="w-7 h-7 rounded-md bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="rounded-lg h-9 border-slate-200 text-sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={handleAdd} className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-200">
                              <Plus className="w-4 h-4 text-emerald-600" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent><p>Add File</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

export default FileList