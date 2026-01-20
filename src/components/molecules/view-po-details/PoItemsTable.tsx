"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'


interface Props {
    POTableData: PoDetailsType["message"]["items"]
}

const PoItemsTable = ({POTableData}: Props) => {

    const [total_event_list, settotalEventList] = useState(0);
        const [record_per_page, setRecordPerPage] = useState<number>(10);
        const [currentPage, setCurrentPage] = useState<number>(1);
  return (
    <>
    <div className='bg-white mt-4 border rounded-xl p-4'>
        <h1></h1>
    <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center">
              <TableHead className="text-center text-black">Sr No.</TableHead>
              <TableHead className="text-center text-black">Material Code</TableHead>
              <TableHead className="text-center text-black text-nowrap">Material Description</TableHead>
              <TableHead className="text-center text-black">HSN Code</TableHead>
              <TableHead className="text-center text-black">UOM</TableHead>
              <TableHead className="text-center text-black text-nowrap">Quantity</TableHead>
              <TableHead className="text-center text-black text-nowrap">Rate</TableHead>
              <TableHead className="text-center text-black text-nowrap">Schedule Date</TableHead>
              <TableHead className="text-center text-black text-nowrap">Schedule Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-center text-black">
            {POTableData ? (
                POTableData?.map((item, index) => (
                    <TableRow key={index}>
                  <TableCell className="text-center">{(currentPage - 1) * record_per_page + index + 1}</TableCell>
                  {/* <TableCell className="text-center">{item?.srNo}</TableCell> */}
                  <TableCell className="text-center text-nowrap">{item?.material_code}</TableCell>
                  <TableCell className="text-center text-nowrap">{item?.short_text? item.short_text:"-"}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.hsnsac}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.uom}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.quantity}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.rate}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.schedule_date}</TableCell>
                   <TableCell className="text-center text-nowrap">{item?.schedule_date_qty_json}</TableCell>
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
        <Pagination currentPage={currentPage} record_per_page={record_per_page} setCurrentPage={setCurrentPage} total_event_list={total_event_list} />
        <div className='flex justify-between mt-4'>
            <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl">Back</Button>
            <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl">Send Email</Button>
        </div>
            </>
  )
}

export default PoItemsTable