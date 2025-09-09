'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { GRNForm } from '@/src/types/grntypes';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/atoms/table';

const ViewGRNDetails = ({ grn }: { grn: GRNForm }) => {
    const params = useSearchParams();
    const grn_no = params.get("grn_ref") || "";
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const openDialog = (item: any) => {
        setSelectedItem(item);
        setOpen(true);
    };
    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return '-';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };


    return (
        <div className="p-3 bg-gray-300 min-h-screen">
            {/* Header Section */}
            <div className="bg-white shadow rounded-xl p-4 mb-4 flex items-center space-x-32">
                <p className="text-lg font-semibold">
                    GRN Number: <span className="text-blue-600">{grn?.grn_no}</span>
                </p>
                <p className="text-lg font-semibold">
                    GRN Date: <span className="text-green-700">{formatDate(grn?.grn_date)}</span>
                </p>
            </div>



            {/* GRN Items Table */}
            <div className="bg-white shadow rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">GRN Items</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sr No</TableHead>
                            <TableHead>Plant</TableHead>
                            <TableHead>PO Number</TableHead>
                            {/* <TableHead>PR Number</TableHead> */}
                            <TableHead>Material</TableHead>
                            <TableHead>Batch No</TableHead>
                            <TableHead>Vendor Name</TableHead>
                            <TableHead>PO Date</TableHead>
                            <TableHead>Invoice No</TableHead>
                            <TableHead>GRN Status</TableHead>
                            <TableHead>View GRN Details</TableHead>
                            <TableHead>View PO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(Array.isArray(grn?.grn_items) ? grn.grn_items : []).map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{item?.plant}</TableCell>
                                <TableCell>{item?.po_no}</TableCell>
                                {/* <TableCell>{item?.pr_no}</TableCell> */}
                                <TableCell>{item?.material}</TableCell>
                                <TableCell>{item?.batch_no}</TableCell>
                                <TableCell>{item?.vendor_name}</TableCell>
                                <TableCell>{formatDate(item?.po_date)}</TableCell>
                                <TableCell>{item?.invoice_no}</TableCell>
                                <TableCell>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                        {item?.grn_status || '-'}
                                    </span>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Button
                                        variant="outline"
                                        className="text-blue-600 border-blue-400"
                                        onClick={() => openDialog(item)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        className="text-blue-600 border-blue-400"
                                        onClick={() => router.push(`/view-po-conf?po_number=${item.po_no}&grn_ref=${grn_no}`)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog for full details */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto w-[80vw]">
                    <DialogHeader>
                        <DialogTitle>GRN Item Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        {selectedItem &&
                            Object.entries(selectedItem).map(([key, value], idx) => (
                                <div key={idx}>
                                    <p className="font-semibold capitalize">
                                        {key.replace(/_/g, ' ')}:
                                    </p>
                                    <p className="text-gray-700 break-all">
                                        {key.includes('date') ? formatDate(String(value)) : String(value || '-')}
                                    </p>
                                </div>
                            ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ViewGRNDetails;