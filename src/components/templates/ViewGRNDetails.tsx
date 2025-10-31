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

    console.log("View GRN Data--->",grn);
    console.log("Attachments on render:", grn.attachments);

    return (
        <div className="p-3 bg-gray-300 min-h-screen">
            {/* Header Section */}
            <div className="bg-white shadow rounded-xl p-4 mb-4 flex items-center space-x-36">
                <p className="text-lg font-semibold">
                    GRN Number:<br /> <span className="text-blue-600">{grn?.grn_no}</span>
                </p>
                <p className="text-lg font-semibold">
                    GRN Date:<br /> <span className="text-green-700">{formatDate(grn?.grn_date)}</span>
                </p>
                <p className="text-lg font-semibold">
                    Account Document No.:<br /> <span className="text-green-700">{grn?.sap_booking_id}</span>
                </p>
                <p className="text-lg font-semibold">
                    MIRO No.:<br /> <span className="text-green-700">{grn?.miro_no}</span>
                </p>
                <p className="text-lg font-semibold">
                    Status:<br /> <span className="text-green-700">{grn?.sap_status}</span>
                </p>
            </div>

            <div className="bg-white shadow rounded-xl p-4 mb-4">
                <p className="text-lg font-semibold">View Invoice:</p>
                {grn?.attachments?.length ? (
                    <ul className="list-disc pl-5">
                        {grn.attachments.map((file, idx) => (
                            <li key={idx}>
                                <a
                                    href={file.full_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {file.actual_file_name || file.file_name || `Attachment ${idx + 1}`}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <span className="text-gray-500">No attachments available</span>
                )}
            </div>

            {/* GRN Items Table */}
            <div className="bg-white shadow rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">GRN Items</h3>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-blue-200'>
                            <TableHead className='text-center text-black'>Sr No</TableHead>
                            <TableHead className='text-center text-black'>Plant</TableHead>
                            <TableHead className='text-center text-black'>PO Number</TableHead>
                            {/* <TableHead>PR Number</TableHead> */}
                            <TableHead className='text-center text-black'>Material</TableHead>
                            <TableHead className='text-center text-black'>Batch No</TableHead>
                            <TableHead className='text-center text-black'>Vendor Name</TableHead>
                            <TableHead className='text-center text-black'>PO Date</TableHead>
                            <TableHead className='text-center text-black'>Invoice No</TableHead>
                            <TableHead className='text-center text-black'>GRN Status</TableHead>
                            <TableHead className='text-center text-black'>View GRN Details</TableHead>
                            <TableHead className='text-center text-black'>View PO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(Array.isArray(grn?.grn_items) ? grn.grn_items : []).map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell className='text-center'>{idx + 1}</TableCell>
                                <TableCell className='text-center'>{item?.plant}</TableCell>
                                <TableCell className='text-center'>{item?.po_no}</TableCell>
                                {/* <TableCell>{item?.pr_no}</TableCell> */}
                                <TableCell className='text-center'>{item?.material}</TableCell>
                                <TableCell className='text-center'>{item?.batch_no}</TableCell>
                                <TableCell className='text-center'>{item?.vendor_name}</TableCell>
                                <TableCell className='text-center'>{formatDate(item?.po_date)}</TableCell>
                                <TableCell className='text-center'>{item?.invoice_no}</TableCell>
                                <TableCell className='text-center'>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                                        {item?.grn_status || '-'}
                                    </span>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Button
                                        variant="nextbtn"
                                        size="nextbtnsize"
                                        className="py-2"
                                        onClick={() => openDialog(item)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Button
                                        variant="nextbtn"
                                        size="nextbtnsize"
                                        className="py-2"
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
            <div className='flex justify-end mt-4'>
                <Button
                    variant={"nextbtn"}
                    size={"nextbtnsize"}
                    onClick={() => {
                        router.push("/view-grn");
                    }}>
                    Back
                </Button>
            </div>

            {/* Dialog for full details */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto w-[80vw] max-w-[45rem]">
                    <DialogHeader>
                        <DialogTitle>GRN Item Details</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
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
        </div >
    );
};

export default ViewGRNDetails;