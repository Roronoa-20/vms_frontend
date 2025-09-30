import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/atoms/table";
import { newVendorTable } from "../../templates/RFQTemplates/LogisticsImportRFQ";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Props = {
    newVendorTable: newVendorTable[] | null;
    setNewVendorTable: React.Dispatch<React.SetStateAction<newVendorTable[]>>;
    handleOpen: () => void;
};

const NewVendorTable = ({ newVendorTable, setNewVendorTable, handleOpen }: Props) => {
    // delete handler
    const handleDelete = (index: number) => {
        if (!newVendorTable) return;
        const updated = newVendorTable.filter((_, i) => i !== index);
        setNewVendorTable(updated);

    };

    return (
        <div className="shadow- bg-[#f6f6f7] p-4 rounded-2xl">
            <div className="flex w-full justify-between items-center pb-4">
                <h1 className="text-[20px] text-[#03111F] font-semibold text-nowrap">
                    New Vendors
                </h1>
                <Button
                    className="bg-[#5291CD] font-medium text-[14px] inline-flex items-center gap-2"
                    onClick={() => handleOpen()}
                >
                    <Plus className="w-4 h-4" />
                    Add New Vendor
                </Button>
            </div>

            <Table>
                <TableHeader className="text-center">
                    <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
                        <TableHead className="text-center">Vendor Name</TableHead>
                        <TableHead className="text-center">Email</TableHead>
                        <TableHead className="text-center">Mobile</TableHead>
                        <TableHead className="text-center">GST Number</TableHead>
                        <TableHead className="text-center">PAN Number</TableHead>
                        <TableHead className="text-center">Country</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody className="text-center text-black">
                    {newVendorTable && newVendorTable.length > 0 ? (
                        newVendorTable.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item?.vendor_name || "-"}</TableCell>
                                <TableCell>{item?.office_email_primary || "-"}</TableCell>
                                <TableCell>{item?.mobile_number || "-"}</TableCell>
                                <TableCell>{item?.gst_number || "-"}</TableCell>
                                <TableCell>{item?.pan_number || "-"}</TableCell>
                                <TableCell>{item?.country || "-"}</TableCell>
                                <TableCell className="flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(index)}
                                        className="flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                                No results found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default NewVendorTable;
