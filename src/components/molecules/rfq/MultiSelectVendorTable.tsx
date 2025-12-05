import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { VendorDataRFQ, VendorSelectType } from "@/src/types/RFQtype";

type Props = {
    VendorList: VendorDataRFQ[];
    loading: boolean;
    setSelectedRows: React.Dispatch<React.SetStateAction<VendorSelectType>>;
    selectedRows: VendorSelectType;
    handleVendorSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MultiSelectVendorTable = ({
    VendorList,
    setSelectedRows,
    selectedRows,
    handleVendorSearch,
}: Props) => {
    const [newEmail, setNewEmail] = useState("");
    const [dialogOpenFor, setDialogOpenFor] = React.useState<string | null>(null);

    const handleCheckboxChange = (item: VendorDataRFQ) => {
        setSelectedRows((prevSelectedRows) => {
            const currentVendors = prevSelectedRows?.vendors ?? [];

            const isAlreadySelected = currentVendors.some(
                (vendor) => vendor.refno === item.refno
            );

            const updatedVendors = isAlreadySelected
                ? currentVendors.filter((vendor) => vendor.refno !== item.refno)
                : [
                    ...currentVendors,
                    {
                        ...item,
                        secondary_emails: [], // NEW COLUMN INITIALLY EMPTY
                    },
                ];

            return { vendors: updatedVendors };
        });
    };

    const openEmailDialog = (refno: string) => {
        setDialogOpenFor(refno);
        setNewEmail("");
    };

    const addSecondaryEmail = () => {
        if (!dialogOpenFor || !newEmail.trim()) return;

        setSelectedRows(prev => {
            const list = prev.vendors || [];
            return {
                vendors: list.map(v =>
                    v.refno === dialogOpenFor
                        ? {
                            ...v,
                            secondary_emails: [
                                ...(v.secondary_emails || []),
                                newEmail.trim()
                            ]
                        }
                        : v
                )
            };
        });

        setDialogOpenFor(null);
    };

    const removeSecondaryEmail = (refno: string, email: string) => {
        setSelectedRows(prev => {
            const list = prev.vendors || [];
            return {
                vendors: list.map(v =>
                    v.refno === refno
                        ? {
                            ...v,
                            secondary_emails: v.secondary_emails.filter(e => e !== email)
                        }
                        : v
                )
            };
        });
    };

    return (
        <div className="shadow bg-[#f6f6f7] p-4 rounded-2xl">
            {/* ---------------- Search ---------------- */}
            <div className="flex w-full justify-between pb-4">
                <h1 className="text-[20px] text-[#03111F] font-semibold text-nowrap">
                    Total Vendors
                </h1>
                <div className="flex gap-4">
                    <input
                        placeholder="Search..."
                        className="px-3 py-2 border rounded-lg"
                        onChange={handleVendorSearch}
                    />
                </div>
            </div>

            {/* ---------------- Table ---------------- */}
            <Table>
                <TableHeader>
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px]">
                        <TableHead>Select</TableHead>
                        <TableHead>Ref No.</TableHead>
                        <TableHead>Vendor Name</TableHead>
                        <TableHead>Vendor Code</TableHead>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Official Email</TableHead>
                        <TableHead>Secondary Emails</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Country</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {VendorList?.length > 0 ? (
                        VendorList.map((item, index) => {
                            const isSelected = selectedRows?.vendors?.some(
                                (row) => row.refno === item.refno
                            );

                            const selectedVendor = selectedRows?.vendors?.find(
                                (v) => v.refno === item.refno
                            );

                            return (
                                <TableRow key={index}>
                                    {/* Checkbox */}
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleCheckboxChange(item)}
                                            className="ml-4"
                                        />
                                    </TableCell>

                                    <TableCell>{item?.refno ?? "-"}</TableCell>
                                    <TableCell>{item?.vendor_name ?? "-"}</TableCell>

                                    <TableCell>
                                        {item.vendor_code?.length > 0
                                            ? item.vendor_code.join(", ")
                                            : "-"}
                                    </TableCell>

                                    <TableCell>{item?.service_provider_type ?? "-"}</TableCell>

                                    {/* ------------------------- Official Email ------------------------- */}
                                    <TableCell>
                                        {item?.office_email_primary ?? "-"}
                                    </TableCell>

                                    {/* ---------------------- Secondary Email Chips ---------------------- */}
                                    <TableCell>
                                        {isSelected ? (
                                            <div className="flex flex-wrap items-center gap-2">

                                                {/* EXISTING EMAIL BADGES */}
                                                {selectedVendor?.secondary_emails?.map((email, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs"
                                                    >
                                                        {email}
                                                        <button
                                                            onClick={() => removeSecondaryEmail(item.refno, email)}
                                                            className="text-red-500 hover:text-red-700 font-bold ml-1"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* ADD BUTTON */}
                                                <button
                                                    onClick={() => openEmailDialog(item.refno)}
                                                    className="px-2 py-1 text-xs rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50"
                                                >
                                                    + Add
                                                </button>

                                            </div>
                                        ) : (
                                            selectedVendor?.secondary_emails?.join(", ") || "-"
                                        )}
                                    </TableCell>


                                    <TableCell>{item?.mobile_number ?? "-"}</TableCell>
                                    <TableCell>{item?.country ?? "-"}</TableCell>
                                </TableRow>
                            );
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={10} className="text-center py-3 text-gray-500">
                                No Vendors Found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {dialogOpenFor && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-xl shadow-lg w-72">
                        <h3 className="font-semibold mb-3 text-sm">Add Secondary Email</h3>

                        <input
                            type="email"
                            className="w-full border px-3 py-2 rounded-md mb-3"
                            placeholder="Enter email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                className="px-3 py-1 border rounded-md"
                                onClick={() => setDialogOpenFor(null)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded-md"
                                onClick={addSecondaryEmail}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MultiSelectVendorTable;
