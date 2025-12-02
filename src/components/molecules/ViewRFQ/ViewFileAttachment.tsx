import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/atoms/table";
import { RFQDetails } from '@/src/types/RFQtype';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import requestWrapper from "@/src/services/apiCall";
import { AxiosResponse } from "axios";
import API_END_POINTS from "@/src/services/apiEndPoints";


interface Props {
    RFQData: RFQDetails;
    refno?: string
}

const ViewFileAttachment = ({ RFQData }: Props) => {

    console.log(RFQData, "RFQData in file attachment")

    const viewFile = (fileId: string) => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.utils.file_handling.secure_file?file_id=${fileId}`;
        window.open(url, "_blank");
    };

    return (
        <div>
            <h1 className='text-lg py-2 font-semibold'>File Attachment</h1>
            <div className="border rounded-lg shadow-sm bg-gray-50">
                <Table className="">
                    <TableHeader className="text-center">
                        <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center rounded-lg">
                            <TableHead className="text-center">Sr No.</TableHead>
                            <TableHead className="text-center">File Name</TableHead>
                            <TableHead className="text-center">View</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-center bg-white ">
                        {RFQData.attachments.length > 0 ? (
                            RFQData.attachments?.map((item, index) => (
                                <TableRow key={index} >
                                    <TableCell className="font-medium text-center">{index + 1}</TableCell>
                                    <TableCell className="text-nowrap text-center">{item?.file_name}</TableCell>
                                    <TableCell className="text-nowrap text-center">
                                        {/* <Link href={`${item?.url}`} target='_blank'><Button className="bg-white text-black hover:bg-white hover:text-black">View</Button></Link> */}
                                        <Button
                                            className=" hover:bg-white hover:text-black py-2.5 hover:border hover:border-[#5291CD] rounded-[8px] w-[50px]"
                                            variant={"nextbtn"}
                                            size={"nextbtnsize"}
                                            onClick={() => viewFile(item?.name)}

                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default ViewFileAttachment
