"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GRNForm } from "@/src/types/grntypes";
import { TvendorRegistrationDropdown } from "@/src/types/types";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/atoms/select";
import { Input } from "@/components/ui/input";
import { FileText, Save } from "lucide-react";
import API_END_POINTS from '@/src/services/apiEndPoints';
import requestWrapper from '@/src/services/apiCall';
import { AxiosResponse } from 'axios';
import SimpleFileUpload from "@/src/components/molecules/multiple_file_upload";
import { useAuth } from "@/src/context/AuthContext";


type Props = {
    GRNData?: GRNForm[];
    user?: string;
    grn_ref?: string;
    companyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"];
};

const ViewGRNEntry = ({ GRNData, companyDropdown }: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [companyFilter, setCompanyFilter] = useState("");
    const [editValues, setEditValues] = useState<Record<
        string,
        { account_document_no: string; miro_no: string; files: File[] }
    >>({});
    const [tableData, setTableData] = useState<GRNForm[]>(GRNData || []);
    const { designation } = useAuth();


    const fetchGRNData = async () => {
        try {
            const response: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.AllGRNdetails,
                method: "GET",
            });
            if (response?.data?.message?.data) {
                setTableData(response.data.message.data);
            }
        } catch (error) {
            console.error("Error fetching GRN data:", error);
        }
    };

    useEffect(() => {
        if (!GRNData) {
            fetchGRNData();
        }
    }, []);

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return "-";
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    const filteredData = useMemo(() => {
        if (!tableData) return [];
        let data = [...tableData];

        if (searchTerm.trim()) {
            data = data.filter((item) =>
                item?.grn_number?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (companyFilter && companyFilter !== "--Select--") {
            data = data.filter((item) => item.company_code === companyFilter);
        }
        return data;
    }, [tableData, searchTerm, companyFilter]);

    console.log("1st table--->", GRNData);
    console.log("2nd table--->", tableData);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (
        grn_number: string,
        field: "account_document_no" | "miro_no",
        value: string
    ) => {
        setEditValues((prev) => ({
            ...prev,
            [grn_number]: {
                ...prev[grn_number],
                [field]: value,
            },
        }));
    };

    const handleSave = async (grn_number: string) => {
        try {
            const formData = new FormData();
            formData.append("grn_number", grn_number);

            if (editValues[grn_number]?.account_document_no) {
                formData.append("sap_booking_id", editValues[grn_number].account_document_no);
            }
            if (editValues[grn_number]?.miro_no) {
                formData.append("miro_no", editValues[grn_number].miro_no);
            }

            if (editValues[grn_number]?.files?.length) {
                editValues[grn_number].files.forEach((file: File) => {
                    formData.append("attachment", file);
                });
            }

            const response: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.GRNUpdateDetails,
                method: "POST",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response?.data?.message?.status === "success") {
                alert(`GRN ${grn_number} updated successfully ✅`);
                await fetchGRNData();

                // Reset input & files after successful save
                setEditValues((prev) => ({
                    ...prev,
                    [grn_number]: { account_document_no: "", miro_no: "", files: [] },
                }));
                location.reload();
            } else {
                alert(response?.data?.message || "Failed to save. Please try again.");
            }
        } catch (error) {
            console.error("Error saving GRN:", error);
            alert("Failed to save. Please try again.");
        }
    };


    const canSave = (grn_number: string) => {
        const values = editValues[grn_number];
        return (
            (values?.account_document_no?.trim() ||
                values?.miro_no?.trim() ||
                (values?.files && values.files.length > 0)) &&
            tableData.find((item) => item.grn_number === grn_number)?.sap_status !== "Closed"
        );
    };


    return (
        <div className="p-3 bg-gray-300 min-h-screen">
            <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
                <div className="flex w-full justify-between pb-4">
                    <h1 className="text-[20px] text-[#03111F] font-semibold">
                        GRN Entries
                    </h1>
                    <div className="flex gap-4">
                        <Input
                            placeholder="Search by GRN No..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        <Select
                            value={companyFilter}
                            onValueChange={(value) => setCompanyFilter(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="w-full">
                                    <SelectItem value="--Select--">
                                        --Select--
                                    </SelectItem>
                                    {companyDropdown?.map((item, index) => (
                                        <SelectItem key={index} value={item?.name}>
                                            {item?.description}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#a4c0fb] text-[14px] hover:bg-[#a4c0fb]">
                            <TableHead className="text-black text-center text-nowrap">Sr No.</TableHead>
                            <TableHead className="text-black text-center">Company</TableHead>
                            <TableHead className="text-black text-center">GRN No.</TableHead>
                            <TableHead className="text-black text-center text-nowrap">GRN Date</TableHead>
                            <TableHead className="text-black text-center">Account Document No.</TableHead>
                            <TableHead className="text-black text-center">MIRO No.</TableHead>
                            <TableHead className="text-black text-center text-nowrap">SAP Status</TableHead>
                            {designation !== "Purchase Team" && (
                                <>
                                    <TableHead className="text-black text-center">Upload Invoice</TableHead>
                                    <TableHead className="text-black text-center">Action</TableHead>
                                </>
                            )}
                            <TableHead className="text-black text-center">View GRN</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell className="text-center">{item?.company_code}</TableCell>
                                    <TableCell className="text-center">{item?.grn_number}</TableCell>
                                    <TableCell className="text-center text-nowrap">{formatDate(item?.grn_date)}</TableCell>
                                    {/* <TableCell className="text-center">
                                        {item.sap_booking_id ? (
                                            <span>{item.sap_booking_id}</span>
                                        ) : (
                                            <Input
                                                value={editValues[item.grn_number]?.account_document_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_number, "account_document_no", e.target.value)
                                                }
                                                placeholder="Enter Account Doc No"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item?.miro_no ? (
                                            <span>{item.miro_no}</span>
                                        ) : (
                                            <Input
                                                value={editValues[item.grn_number]?.miro_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_number, "miro_no", e.target.value)
                                                }
                                                placeholder="Enter MIRO No"
                                            />
                                        )}
                                    </TableCell> */}
                                    <TableCell className="text-center">
                                        {item.sap_booking_id ? (
                                            <span>{item.sap_booking_id}</span>
                                        ) : designation === "Purchase Team" ? (
                                            <span className="text-gray-600">{item.sap_booking_id}</span>
                                        ) : (
                                            <Input
                                                value={editValues[item.grn_number]?.account_document_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_number, "account_document_no", e.target.value)
                                                }
                                                placeholder="Enter Account Doc No"
                                            />
                                        )}
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {item?.miro_no ? (
                                            <span>{item.miro_no}</span>
                                        ) : designation === "Purchase Team" ? (
                                            <span className="text-gray-600">{item.miro_no}</span>
                                        ) : (
                                            <Input
                                                value={editValues[item.grn_number]?.miro_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_number, "miro_no", e.target.value)
                                                }
                                                placeholder="Enter MIRO No"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div
                                            className={`text-center px-2 py-3 rounded-xl uppercase ${item?.sap_status === "Open"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : item?.sap_status === "Closed"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {item?.sap_status}
                                        </div>
                                    </TableCell>

                                    {designation !== "Purchase Team" && (
                                        <>
                                            <TableCell className="text-center">
                                                <SimpleFileUpload
                                                    buttonText="Upload Invoice"
                                                    files={editValues[item.grn_number]?.files || []}
                                                    setFiles={(newFiles) =>
                                                        setEditValues((prev) => {
                                                            const files =
                                                                typeof newFiles === "function"
                                                                    ? newFiles(prev[item.grn_number]?.files || [])
                                                                    : newFiles;
                                                            return {
                                                                ...prev,
                                                                [item.grn_number]: {
                                                                    ...prev[item.grn_number],
                                                                    files,
                                                                },
                                                            };
                                                        })
                                                    }
                                                    setUploadedFiles={() => { }}
                                                    onNext={() => handleSave(item.grn_number)}
                                                />
                                            </TableCell>

                                            <TableCell className="text-center">
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={() => handleSave(item.grn_number)}
                                                    disabled={!canSave(item.grn_number)}
                                                    className={`px-3 py-1 rounded-[28px] text-sm font-medium ${!canSave(item.grn_number)
                                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                            : "bg-green-600 text-white hover:bg-green-700"
                                                        }`}
                                                >
                                                    Save
                                                </Button>
                                            </TableCell>
                                        </>
                                    )}

                                    <TableCell className="text-center">
                                        <Link href={`/view-grn-details?grn_ref=${item?.grn_number}`}>
                                            <Button variant={"nextbtn"} size={"nextbtnsize"} className="py-2">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center text-gray-500 py-4">
                                    No GRN entries found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ViewGRNEntry;
