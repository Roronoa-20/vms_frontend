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
  /** When true, blocks file add/delete while PR submit is in progress (ref updates do not re-render). */
  isSubmittingRef?: React.RefObject<boolean | null>;
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
    if (isSubmittingRef?.current) {
      alert("Please wait until the purchase requisition finishes submitting.");
      return;
    }
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deletePrDocument(name);
      fetchPrData(prId);
    } catch (error) {
      alert("Failed to delete file");
    }
  }

  const handleAdd = async () => {
    if (isSubmittingRef?.current) {
      alert("Please wait until the purchase requisition finishes submitting.");
      return;
    }
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
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#F97316] flex items-center justify-center shadow-sm">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[#0F172A] tracking-tight">Quotation List</CardTitle>
            <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium">{data?.length || 0} file{(data?.length || 0) !== 1 ? 's' : ''} attached</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3 px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC] border-b border-slate-200">
                <TableHead className="h-9 py-0 text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">Sr No.</TableHead>
                <TableHead className="h-9 py-0 text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">File Name</TableHead>
                <TableHead className="h-9 py-0 text-[11px] text-[#64748B] font-semibold uppercase tracking-wide">Amount</TableHead>
                {canEdit && <TableHead className="h-9 py-0 text-center text-[11px] text-[#64748B] font-semibold uppercase tracking-wide w-[10%]">Action</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                    <TableCell className="py-2 text-xs text-[#64748B] tabular-nums leading-snug">{index + 1}</TableCell>
                    <TableCell className="py-2 text-xs leading-snug">
                      <Link href={item?.url} target="_blank" className="font-medium text-[#4F6BED] hover:text-[#3B54D4] hover:underline transition-colors">{item?.filename}</Link>
                    </TableCell>
                    <TableCell className="py-2 text-xs font-semibold text-[#0F172A] tabular-nums leading-snug">{item?.amount}</TableCell>
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
              ) : null}
              {canEdit && (
                <TableRow className="bg-[#FAFBFC]">
                  <TableCell></TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      <label htmlFor="pr-file-upload" className="border-2 border-dashed rounded-md py-1.5 px-3 flex items-center cursor-pointer truncate gap-2 bg-white hover:border-[#4F6BED] hover:bg-[#F8F9FF] transition-colors min-h-8">
                        <Upload className="w-3.5 h-3.5 text-[#4F6BED] shrink-0" />
                        <span className="text-xs font-medium text-[#334155]">{file ? file.name : "Choose File"}</span>
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
                    <Input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="rounded-md h-8 border-slate-200 text-xs px-2" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={handleAdd} className="w-7 h-7 rounded-md bg-emerald-50 flex items-center justify-center hover:bg-emerald-100 transition-colors border border-emerald-200">
                              <Plus className="w-3.5 h-3.5 text-emerald-600" />
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