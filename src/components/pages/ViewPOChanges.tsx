"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table';
import API_END_POINTS from '@/src/services/apiEndPoints';
import { AxiosResponse } from 'axios';
import requestWrapper from '@/src/services/apiCall';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';

interface POItemsTable {
name:string,
product_name:string,
material_code:string,
plant:string,
schedule_date:string,
quantity:string,
early_delivery_date:string
purchase_team_remarks:string,
requested_for_earlydelivery:boolean,
vendor_remarks:string,
rejected_by_vendor:boolean,
approved_by_vendor:boolean
}

interface Props {
    po_name:string
}

const ViewPOChanges = ({po_name}:Props) => {

    const [prDetails,setPRDetails] = useState();
    const [PRNumber,setPRNumber] = useState<string>(po_name);
    const [POItemsTable,setPOItemsTable] = useState<POItemsTable[]>([]);
    const [isEarlyDeliveryDialog,setIsEarlyDeliveryDialog] = useState<boolean>(false);

    useEffect(()=>{
        if(PRNumber){
            fetchPOItems();
        }
    },[])

    const getPODetails = async()=>{
        const url = `${API_END_POINTS?.getPrintFormatData}?po_name=${PRNumber}`;
        const response:AxiosResponse = await requestWrapper({url:url,method:"GET"})
        if(response?.status == 200){
            // console.log(response?.data?.message,"this is response")
            setPRDetails(response?.data?.message);
        }
    }


    const fetchPOItems = async ()=>{
      const url = `${API_END_POINTS?.POItemsTable}?po_name=${PRNumber}`;
      const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
      if(response?.status == 200){
        setPOItemsTable(response?.data?.message?.items)
      }
    }




    const handleTableChange = (index: number, name:string,value:string | boolean) => {
    // const { name, value } = e.target;
    setPOItemsTable((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index],[name]:value};
      }
      return updated;
    });
  }


  const handlePoItemsSubmit = async()=>{
    const url = API_END_POINTS?.POItemsApproval;
    const updatedData = {items:POItemsTable,po_name:PRNumber};
    const response:AxiosResponse = await requestWrapper({url:url,method:"POST",data:{data:updatedData}});
    if(response?.status == 200){
      alert("submitted successfully");
    }
  }
  return (
<>
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
              <TableHead className="text-center">Approved</TableHead>
              <TableHead className="text-center">Rejected</TableHead>
              <TableHead className="text-center">Vendor Remarks</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {POItemsTable?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item?.product_name}</TableCell>
                <TableCell className='text-center'>{item?.material_code}</TableCell>
                <TableCell>{item?.plant}</TableCell>
                <TableCell>{item?.schedule_date}</TableCell>  
                <TableCell>{item?.quantity}</TableCell>  
                <TableCell className={`flex justify-center`}>{item?.early_delivery_date}</TableCell>
                <TableCell>{item?.purchase_team_remarks}</TableCell>
                {/* <TableCell>
                  <div className={`flex justify-center gap-2`}>
                    <div className="flex flex-col gap-2 w-3">
                  <Input  type="radio" name="early_delivery_date" onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} value={item?.early_delivery_date ?? ""}  className=' disabled:opacity-100' />
                  <h1>approved</h1>
                    </div>
                    <div className="flex flex-col gap-2 w-3">
                  <Input  type="radio" name="early_delivery_date" onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} value={item?.early_delivery_date ?? ""}  className=' disabled:opacity-100' />
                  <h1>rejected</h1>
                    </div>
                  </div>
                  </TableCell> */}
                  <TableCell>
                    <input
                    className="w-4"
                      type="radio"
                      name={`vendor_response_${index}`}
                      checked={item.approved_by_vendor}
                      onChange={() => {
                        handleTableChange(index, "approved_by_vendor", true);
                        handleTableChange(index, "rejected_by_vendor", false);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                    className="w-4"
                      type="radio"
                      name={`vendor_response_${index}`}
                      checked={item.rejected_by_vendor}
                      onChange={() => {
                        handleTableChange(index, "approved_by_vendor", false);
                        handleTableChange(index, "rejected_by_vendor", true);
                      }}
                    />
                  </TableCell>
                <TableCell><div className={`flex justify-center`}> <Input name="vendor_remarks" onChange={(e)=>{handleTableChange(index,e.target.name,e.target.value)}} value={item?.vendor_remarks ?? ""}  className=' w-36 disabled:opacity-100' /></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
        <Button onClick={()=>{handlePoItemsSubmit()}}>Submit</Button>
        </>
  )
}

export default ViewPOChanges