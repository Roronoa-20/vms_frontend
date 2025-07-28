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
import { useQMSForm } from '@/src/hooks/useQMSForm';


export const MLSPLQualityAgreementForm = ({ vendor_onboarding, company_code }: { vendor_onboarding: string; company_code: string; }) => {
    const params = useSearchParams();
    const currentTab = params.get("tabtype")?.toLowerCase() || "vendor information";
    const { formData, handleNextTab, handleDelete, handleBacktab } = useQMSForm(vendor_onboarding, currentTab);
    const qaList = formData?.mlspl_qa_list;



    return (
        <div className="bg-white p-2 rounded-[8px]">
            <h2 className="text-lg font-bold bg-gray-200 border border-gray-300 p-3">
                QUALITY AGREEMENT
            </h2>
            <div className="border border-gray-300">
                {qaList?.length ? (
                    <Table className="mt-6">
                        {/* table headers */}
                        <TableBody>
                            {qaList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{row.document_type}</TableCell>
                                    <TableCell>
                                        <a
                                            href={row.qa_attachment}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline"
                                        >
                                            {row.qa_attachment?.split("/").pop()}
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
                ) : (
                    <p className="text-sm text-gray-500 italic mt-4">No Agreement uploaded.</p>
                )}
            </div>

            <div className="flex justify-end space-x-5 items-center pt-[20px]">
                <Button
                    variant="backbtn"
                    className="py-2.5"
                    size="backbtnsize"
                    onClick={handleBacktab}
                >
                    Back
                </Button>

                <Button
                    variant="nextbtn"
                    size="nextbtnsize"
                    className="py-2.5"
                    onClick={handleNextTab}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
