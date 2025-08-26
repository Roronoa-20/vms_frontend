"use client"
import React, { useEffect, useState } from 'react'
import PopUp from '../molecules/PopUp';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { Button } from '../atoms/button';


interface table {
  po_number: string,
  po_date: string,
  status: string,
  bill_to_company: string,
  total_value_of_po: string
  childTable: {
    name: string,
    product_name: string,
    material_code: string,
    plant: string,
    schedule_date: string,
    quantity: string,
    early_delivery_date: string
    purchase_team_remarks: string,
    requested_for_earlydelivery: boolean
  }[]
}

const ViewAllPOChanges = () => {
  const [table, setTable] = useState<table[]>();
  const [selectedTable, setSelectedTable] = useState<table["childTable"]>([]);
  const [isDialog, setIsDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchTable();
  }, [])
  const fetchTable = async () => {
    const url = API_END_POINTS?.getAllPOChangesTable;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setTable(response?.data?.message?.total_po);
    }
  }

  const handleOpen = (item: table["childTable"]) => {
    setSelectedTable(item);
    setIsDialog(true);
  }

  const handleClose = () => {
    setIsDialog(false);
  }


  return (
    <div>
      <h1 className="pl-5">View All PO Changes</h1>
      <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
        <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
          <TableHeader className="text-center">
            <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
              <TableHead className="text-center">PO Number</TableHead>
              <TableHead className="text-center">PO Date</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Bill To Company</TableHead>
              <TableHead className="text-center">PO Amount</TableHead>
              <TableHead className="text-center">View</TableHead>
              {/* <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Early Delivery Date</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Approved</TableHead>
              <TableHead className="text-center">Rejected</TableHead>
              <TableHead className="text-center">Vendor Remarks</TableHead> */}

            </TableRow>
          </TableHeader>
          <TableBody>
            {
              table?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.po_number}</TableCell>
                  <TableCell>{item?.po_date}</TableCell>
                  <TableCell>{item?.status}</TableCell>
                  <TableCell>{item?.bill_to_company}</TableCell>
                  <TableCell>{item?.total_value_of_po}</TableCell>
                  <TableCell><Button onClick={() => { handleOpen(item?.childTable) }}>View</Button></TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
      {
        isDialog &&
        <PopUp classname="w-full md:max-w-[60vw] md:max-h-[60vh] h-full overflow-y-scroll" handleClose={handleClose}>
          <h1 className="pl-5">Purchase Inquiry Items</h1>
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <Table className=" max-h-40 overflow-y-scroll overflow-x-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Plant</TableHead>
                  <TableHead className="text-center">Schedule Date</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Early Delivery Date</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {selectedTable?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item?.product_name}</TableCell>
                    <TableCell className='text-center'>{item?.material_code}</TableCell>
                    <TableCell>{item?.plant}</TableCell>
                    <TableCell>{item?.schedule_date}</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PopUp>
      }

    </div>

  )
}


export default ViewAllPOChanges