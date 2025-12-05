"use client";

import React, { useEffect, useRef } from "react";
import { Label } from "../../atoms/label";
import { Input } from "../../atoms/input";
import { Button } from "../../atoms/button";
import { useSearchParams } from "next/navigation";
import { FaDownload } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../atoms/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../atoms/select";
import { useQMSForm } from '@/src/hooks/useQMSForm';


export const MLSPLQualityAgreementForm = ({ vendor_onboarding, ref_no, company_code }: { vendor_onboarding: string; ref_no: string; company_code: string; }) => {
    const params = useSearchParams();
    const formRef = useRef<HTMLInputElement | null>(null);
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const { formData, documentTypes, selectedDocumentType, handleDocumentTypeChange, handleAdd, clearFileSelection, handleFileUpload, handleDelete, handleBack, tableData, fileSelected, fileName, } = useQMSForm(vendor_onboarding, currentTab);

    const companyCodes = company_code.split(',').map((code) => code.trim());
    const is2000 = companyCodes.includes('2000');
    const is7000 = companyCodes.includes('7000');

    console.log(tableData, "--------tabledata")


    return (
        <div className="bg-white p-2 rounded-[8px]">
            <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                QUALITY AGREEMENT
            </h2>
            <div className="border border-gray-300">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-2">
                    <div className="flex flex-col">
                        <Label className="text-[13px] mb-1" >Select Document Type</Label>
                        <Select value={selectedDocumentType} onValueChange={handleDocumentTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option">
                                    {selectedDocumentType || "Select an option"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="-Select-">-Select-</SelectItem>
                                {documentTypes.map((doc) => (
                                    <SelectItem key={doc.name} value={doc.name}>{doc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                    </div>

                    {selectedDocumentType && (
                        <div className="flex flex-col">
                            <Label className="text-[13px] mb-1">Upload File</Label>
                            <div className="items-center flex">
                                {fileSelected ? (
                                    <>
                                        <Label className="font-bold cursor-pointer text-green-500">
                                            {fileName}
                                        </Label>
                                        <span
                                            className="cursor-pointer text-red-500 ml-2"
                                            onClick={clearFileSelection}
                                        >
                                            &#x2715;
                                        </span>
                                    </>
                                ) : (
                                    <Input
                                        type="file"
                                        ref={formRef}
                                        onChange={handleFileUpload}
                                        className="text-blue-600 underline cursor-pointer placeholder:pl-1 pt-2"
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-start ml-1 mt-4 mb-2">
                    <Button
                        type="button"
                        variant="nextbtn"
                        size="nextbtnsize"
                        onClick={handleAdd}
                    >
                        Add
                    </Button>
                </div>
                {tableData.length > 0 && (
                    <Table className="mt-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sr.No.</TableHead>
                                <TableHead>Document Type</TableHead>
                                <TableHead>File Name</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.document_type}</TableCell>
                                    <TableCell>
                                        <a
                                            href={row.fileURL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {row.fileName}
                                        </a>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleDelete(index)}
                                            variant="uploadbtn"
                                            size="uploadbtnsize"
                                            className="cursor-pointer text-red-500"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                <div className="flex border-t border-gray-300 justify-end space-x-4 items-center pt-[10px] pr-2 mb-2">
                    <Button
                        variant="backbtn"
                        className="py-2.5"
                        size="backbtnsize"
                        onClick={(handleBack)}
                    >
                        Back
                    </Button>

                    <Button
                        variant="nextbtn"
                        size="nextbtnsize"
                        className="py-2.5"
                        // onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
}
