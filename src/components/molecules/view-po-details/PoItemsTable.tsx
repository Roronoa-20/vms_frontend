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
import { sendPoConfirmationEmail } from '@/src/services/purchaseOrder/purchaseOrder.services'
import { useRouter } from 'next/navigation'


interface Props {
    POTableData: PoDetailsType["message"]["items"]
    poName:string
    po_mail_sent:number
}

const PoItemsTable = ({POTableData,poName,po_mail_sent}: Props) => {

        const [total_event_list, settotalEventList] = useState(0);
        const [record_per_page, setRecordPerPage] = useState<number>(10);
        const [currentPage, setCurrentPage] = useState<number>(1);
        const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
        const [isSuccessDialog, setIsSuccessDialog] = useState(false);
        const [ccEmailsList, setCCEmailsList] = useState<{ value: string, label: string }[]>([]);
        

          const [email, setEmail] = useState<any>();
          const [toTags, setToTags] = useState<string[]>([]);
          const [toInput, setToInput] = useState("");

          const router = useRouter();

          useEffect(() => {
            if(poName){
    fetchPurchaseEmailIds();
  }
          },[]);


           const fetchPurchaseEmailIds = async()=>{
    const response = await fetch(`${API_END_POINTS?.getPurchaseTeamEmailList}?po_no=${poName}`,{
      method:"get",
      credentials:"include"
    });
    const data = await response?.json();
    const emails = data?.message?.pur_team_emails?.map((item: any, index: any) => {
        const obj = {
          label: item,
          value: item
        }
        return obj;
      })
      const vendorEmail = data?.message?.vendor_email || "";
      if (vendorEmail) {
        setToTags([vendorEmail]);
      }
      setEmail((prev:any)=>({...prev,to:vendorEmail}))
      setCCEmailsList(emails);
  } 

    const handleClose = () => {
    setIsEmailDialog(false);
    setEmail((prev: any) => ({ ...prev, cc: [] }));
  }


  const handleSubmit = async () => {
    // Flush any pending email in the input that wasn't committed with a comma
    const finalToTags = [...toTags];
    const pendingEmail = toInput.trim();
    if (pendingEmail) {
      finalToTags.push(pendingEmail);
      setToTags(finalToTags);
      setToInput("");
    }

    if (!email?.cc || email?.cc?.length === 0) {
      alert("please select at least 1 cc email");
      return;
    }


      await sendPoConfirmationEmail({
        po_no: poName,
        vendor_emails: finalToTags,
        pur_team_emails: email?.cc,
      }).then(()=>{
        setIsSuccessDialog(true);
        handleClose();
      })
      .catch((error)=>{
        console.error(error);
        alert("Failed to send email");
      })
    } 

   const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.includes(",")) {
        const newEmail = value.replace(",", "").trim();
        if (newEmail) {
          const updatedTags = [...toTags, newEmail];
          setToTags(updatedTags);
          setEmail((prev: any) => ({ ...prev, to: updatedTags.join(",") }));
        }
        setToInput("");
      } else {
        setToInput(value);
      }
    }

    const removeToTag = (index: number) => {
      const updatedTags = toTags.filter((_, i) => i !== index);
      setToTags(updatedTags);
      setEmail((prev: any) => ({ ...prev, to: updatedTags.join(",") }));
    }

   const handleCcEmailChange = (value: MultiValue<{ value: string; label: string; }>) => {
      const emailList = value?.map((item) => (item?.value));
      setEmail((prev: any) => ({ ...prev, cc: emailList }));
    }



  return (
    <>
    <div className='bg-white mt-4 border rounded-xl p-4'>
        <h1 className='pb-5 font-semibold'> PO Items</h1>
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
            {
              !po_mail_sent &&
              <Button variant={"nextbtn"} size={"nextbtnsize"} className="px-4 mt-4 mx-2 rounded-xl" onClick={()=>{setIsEmailDialog(true)}}>Send Email</Button>
            }
        </div>

            {isEmailDialog &&
        <PopUp handleClose={handleClose} classname="md:max-h-[400px]" headerText="Send Email" isSubmit={true} Submitbutton={handleSubmit}>
          <div className="mb-2">
            <h1 className="text-[14px] font-normal text-[#626973] pb-2">
              To
            </h1>
            <div className="flex flex-wrap items-center gap-1 border rounded-md p-2 min-h-[40px]">
              {toTags.map((tag, index) => (
                <span key={index} className="bg-gray-200 text-black text-[13px] px-2 py-1 rounded-md flex items-center gap-1">
                  {tag}
                  {index !== 0 && <button type="button" onClick={() => removeToTag(index)} className="text-gray-500 hover:text-red-500 text-xs ml-1">&times;</button>}
                </span>
              ))}
              <input
                type="text"
                value={toInput}
                onChange={handleToInputChange}
                placeholder={toTags.length === 0 ? "Enter email address..." : ""}
                className="flex-1 min-w-[120px] outline-none text-[14px] border-none bg-transparent"
              />
            </div>
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