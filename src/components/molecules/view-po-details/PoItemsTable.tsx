"use client"
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../atoms/table'
import React, { use, useEffect, useState } from 'react'
import { TableHeader } from '../../atoms/table'
import { Button } from '../../atoms/button'
import Pagination from '../Pagination'
import { PoDetailsType } from '@/src/types/view-po-details/poDetailsType'
import PopUp from '../PopUp'
import { Input } from '../../atoms/input'
import MultiSelect, { MultiValue } from "react-select";
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation'


interface Props {
    POTableData: PoDetailsType["message"]["items"]
    poName:string
}

const PoItemsTable = ({POTableData,poName}: Props) => {

    const [total_event_list, settotalEventList] = useState(0);
        const [record_per_page, setRecordPerPage] = useState<number>(10);
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
        const [isSuccessDialog, setIsSuccessDialog] = useState(false);
        const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);
        

          const [email, setEmail] = useState<any>();

          const router = useRouter();

          useEffect(() => {
            const fetchEmails = async () => {
             const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.dataBasedOnPo, method: "GET", params: { po_number: poName } });
    if (response?.status == 200) {
      setEmail((prev: any) => ({ ...prev, to: response?.data?.message?.vendor_emails?.office_email_primary }));
      console.log(response?.data?.message?.team_members?.all_team_user_ids, "this is cc emails")
      const emailList = response?.data?.message?.team_members?.all_team_user_ids?.map((item: any, index: any) => {
        const obj = {
          label: item,
          value: item
        }
        return obj;
      })
      setCCEmailsList(emailList);
    }
  }
  if(poName){
    fetchEmails();
  }
          },[]);

    const handleClose = () => {
    setIsEmailDialog(false);
    setEmail((prev: any) => ({ ...prev, cc: [] }));
  }


  const handleSubmit = async () => {

    if (!email?.cc) {
      alert("please select at least 1 cc email");
      return;
    }

    const sendPoEmailUrl = `${API_END_POINTS.sendPOEmailVendor}?po_name=${poName}`;
    const formdata = new FormData();
    formdata.append("to", JSON.stringify(email?.to))
    formdata.append("cc", JSON.stringify(email?.cc))
    const response: AxiosResponse = await requestWrapper({ url: sendPoEmailUrl, data: formdata, method: "POST" });
    if (response?.status === 200) {
      setIsSuccessDialog(true);
      handleClose();
    }
  };

   const handleCcEmailChange = (value: MultiValue<{ value: string; label: string; }>) => {
      const emailList = value?.map((item) => (item?.value));
      setEmail((prev: any) => ({ ...prev, cc: emailList }));
    }



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
            <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={()=>{router.back()}}>Back</Button>
            <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={()=>{setIsEmailDialog(true)}}>Send Email</Button>
        </div>

            {isEmailDialog &&
        <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
          <div className="mb-2">
            <h1 className="text-[14px] font-normal text-[#626973] pb-2">
              To
            </h1>
            <Input onChange={(e) => { setEmail((prev: any) => ({ ...prev, to: e.target.value })); }} value={email?.to ?? ""} />
          </div>
          <div>
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">
              CC
            </h1>
            {/* <Input onChange={(e) => { setEmail((prev: any) => ({ ...prev, cc: e.target.value })) }} /> */}
            <MultiSelect
              onChange={(value) => handleCcEmailChange(value)}
              instanceId="vendor-type-multiselect"
              options={ccEmailsList}
              isMulti
              required
              className="text-[14px] text-black"
            // menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
            // styles={multiSelectStyles}
            />
          </div>
          {/* <Input onChange={(e) => { setPOFile(e.target.files && e.target.files[0]) }} className="mt-4" type="file" /> */}
        </PopUp>
      }

            </>
  )
}

export default PoItemsTable