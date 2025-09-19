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
        { account_document_no: string; miro_no: string }
    >>({});
    const [tableData, setTableData] = useState<GRNForm[]>(GRNData || []);

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
                item?.grn_no?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (companyFilter && companyFilter !== "--Select--") {
            data = data.filter((item) => item.company_code === companyFilter);
        }
        return data;
    }, [tableData, searchTerm, companyFilter]);

    console.log("1st table--->",GRNData);
    console.log("2nd table--->",tableData);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleInputChange = (
        grn_no: string,
        field: "account_document_no" | "miro_no",
        value: string
    ) => {
        setEditValues((prev) => ({
            ...prev,
            [grn_no]: {
                ...prev[grn_no],
                [field]: value,
            },
        }));
    };

    const handleSave = async (grn_no: string) => {
        const payload = {
            grn_number: grn_no,
            sap_booking_id: editValues[grn_no]?.account_document_no || "",
            miro_no: editValues[grn_no]?.miro_no || "",
        };

        try {
            const response: AxiosResponse = await requestWrapper({
                url: API_END_POINTS.GRNUpdateDetails,
                method: "POST",
                data: payload,
            });

            if (response?.data?.message?.status === "success") {
                alert(`Saved GRN ${grn_no} successfully!`);
                await fetchGRNData();
                setEditValues((prev) => ({
                    ...prev,
                    [grn_no]: { account_document_no: "", miro_no: "" },
                }));
            } else {
                alert(response?.data?.message || "Failed to save. Please try again.");
            }
        } catch (error) {
            console.error("Error saving GRN:", error);
            alert("Failed to save. Please try again.");
        }
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
                            <TableHead className="text-black text-center">Sr No.</TableHead>
                            <TableHead className="text-black text-center">Company</TableHead>
                            <TableHead className="text-black text-center">GRN No.</TableHead>
                            <TableHead className="text-black text-center">GRN Date</TableHead>
                            <TableHead className="text-black text-center">Account Document No.</TableHead>
                            <TableHead className="text-black text-center">MIRO No.</TableHead>
                            <TableHead className="text-black text-center text-nowrap">SAP Status</TableHead>
                            <TableHead className="text-black text-center">View GRN</TableHead>
                            <TableHead className="text-black text-center">Upload Invoice</TableHead>
                            <TableHead className="text-black text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredData && filteredData.length > 0 ? (
                            filteredData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell className="text-center">{item?.company_code}</TableCell>
                                    <TableCell className="text-center">{item?.grn_no}</TableCell>
                                    <TableCell className="text-center text-nowrap">{formatDate(item?.grn_date)}</TableCell>
                                    <TableCell className="text-center">
                                        {item?.sap_booking_id ? (
                                            <span>{item.sap_booking_id}</span>
                                        ) : (
                                            <Input
                                                value={editValues[item.grn_no]?.account_document_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_no, "account_document_no", e.target.value)
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
                                                value={editValues[item.grn_no]?.miro_no || ""}
                                                onChange={(e) =>
                                                    handleInputChange(item.grn_no, "miro_no", e.target.value)
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
                                    <TableCell className="text-center">
                                        <Link href={`/view-grn-details?grn_ref=${item?.grn_no}`}>
                                            <Button variant={"nextbtn"} size={"nextbtnsize"} className="py-2">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {item?.invoice_url ? (
                                            <Link
                                                href={item.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex justify-center text-blue-600"
                                            >
                                                <FileText className="w-5 h-5" />
                                            </Link>
                                        ) : (
                                            "--"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSave(item.grn_no)}
                                            disabled={item?.sap_status === "Closed"}
                                            className={item?.sap_status === "Closed" ? "cursor-not-allowed" : ""}
                                        >
                                            <Save
                                                className={`w-5 h-5 ${item?.sap_status === "Closed" ? "text-gray-400" : "text-green-600"}`}
                                            />
                                        </Button>
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
