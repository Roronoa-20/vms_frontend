"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { PencilIcon, Trash2 } from 'lucide-react'
import { Button } from '../atoms/button'
import { Input } from '../atoms/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { useMultipleVendorCodeStore } from '@/src/store/MultipleVendorCodeStore'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { MultiValue } from 'react-select'
import MultiSelect from 'react-select'
import { tableData } from '@/src/constants/dashboardTableData'
import { useRouter } from 'next/navigation'
import { TDisptachDetails } from '../pages/Dispatch'
import Link from 'next/link'

interface TPoDropdown{
    name:string
}

type OptionType = {
  value: string;
  label: string;
};

interface TableData {
    item_name:string,
    actual_quantity:number,
    dispatch_quantity:number,
    pending_quantity:number,
    uom:string,
    coa_document:File,
    msds_document:File,
    product_name:string,
    quantity:number
}

interface formData{
  vendor_code?:string,
  docket_number:string,
  courier_number:string,
  courier_name:string,
  dispatch_date:string,
  invoice_number:string,
  invoice_date:string,
  invoice_amount:string,
  invoice_attachment:File,
  packing_list_attachment:File,
  commercial_attachment:File,
  e_way_bill_attachment:File,
  test_certificates_attachment:File
  
}

interface Props {
  DispatchDetails:TDisptachDetails | null,
  refno?:string
}

type FileAttachment = {
  url:string,
  file_name:string,
  name:string
}

interface uploadedFiles {
invoice_attachment:FileAttachment,
packing_list_attachment:FileAttachment,
commercial_attachment:FileAttachment,
e_way_bill_attachment:FileAttachment,
test_certificates_attachment:FileAttachment
}


interface tablerow  {
    name:string,
    po_number:string,
    product_name:string,
    quantity:number,
    uom:string,
    coa_document_upload:File,
    msds_document_upload:File,
    item_name:string,
    actual_quantity:number,
    dispatch_qty:number,
    pending_qty:number,
}[]

const DispatchForm = ({DispatchDetails,refno}:Props) => {
    const {MultipleVendorCode} = useMultipleVendorCodeStore();
    const [PODropdown,setPODropdown] = useState<MultiValue<OptionType>>([]);
    const [selectedPO,setSelectedPO] = useState<string[]>([]);
    const [selectedPOMultiple,setSelectedPOMultiple] = useState<MultiValue<OptionType>>();
    const [table,setTable] = useState<TDisptachDetails["items"]>(DispatchDetails?.items ?? []);
    const [formData,setFormData] = useState<formData>();
    const [uploadedFiles,setUploadedFiles] = useState<uploadedFiles | null>(DispatchDetails);
    console.log(DispatchDetails?.items,"this si table")
    // const [newVendorTypeDropdown,setNewVendorTypeDropdown] = useState<MultiValue<OptionType>>([]);
    const [poTable,setPOTable] = useState();
    const router = useRouter();

    useEffect(()=>{
      if(DispatchDetails?.vendor_code){
        handleVendorCodeChange(DispatchDetails?.vendor_code);
      }

      if(DispatchDetails?.purchase_number){
       const data =  DispatchDetails?.purchase_number?.map((item)=>{
          return ({
            label:item?.purchase_number,value:item?.purchase_number
          }
          )
        })
        setSelectedPOMultiple(data)
      }

      console.log(DispatchDetails?.purchase_number,"this is po")

    },[])

    const handleVendorCodeChange = async(value:string)=>{
        setFormData((prev:any)=>({...prev,vendor_code:value}))
        const url = `${API_END_POINTS?.poBasedOnVendorCode}?vendor_code=${value}`;
        const response:AxiosResponse = await requestWrapper({url:url,method:"GET"});
        if(response?.status == 200){
            const newDropdown = response?.data?.message?.data?.map((item:any)=>{
            return (
                {label:item?.name,value:item?.name}
            )
        })
            setPODropdown(()=>([...newDropdown]))
        }
    }



      const handlePOChange = async(value:MultiValue<OptionType>)=>{
        const newArray = await Promise.all(
          value?.map((item)=>{
            return (
              item?.value
            )
          })
          )
        const newArray2 = await Promise.all(
          value?.map((item)=>{
            return ({
              purchase_number:
              item?.value
            }
            )
          })
        )
        // updateVendorTypes(newArray2)
        setSelectedPO(newArray);
        setSelectedPOMultiple(value);
        console.log(value,'this is after change')
        setFormData((prev):any=>({...prev,purchase_number:newArray2}))
        //  fetchPOTable(newArray);
      }

      const fetchPOTable = async(po:string[])=>{
        const url = API_END_POINTS?.PODetailsBasedOnPOCode;
        const response:AxiosResponse = await requestWrapper({url:url,method:"POST",data:{data:{po_name:po}}});
        if(response?.status == 200){
            setTable(response?.data?.message?.data);
        }
      }


      const handleTableInput = (index: number, value: number , actual_quantity:number) => {
        if(value > actual_quantity) {
          alert("dispatch quantity cannot be greated than total quantity"); 
          return;
        }
    setTable((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], dispatch_qty: value, pending_qty: (actual_quantity-value) };
      }
      return updated;
    });
  }


  const handleTableFile = (index:number, e:React.ChangeEvent<HTMLInputElement>)=>{
    // if(!file) return; // 'file' is not defined, so this line is commented out
    const {name} = e.target;
    setTable((prev)=>{
      const updated = [...prev];
      if(updated[index]){
        updated[index] = {...updated[index],[name]:e?.target?.files?.[0]};
      }
      return updated;
    })
  }


  const handleTableFileDelete = (index:number,name:string)=>{
    setTable((prev)=>{
      const updated = [...prev];
      if(updated[index]){
        updated[index] = {...updated[index],[name]:null}
      }
      return updated;
    })
  }

  const handleAdd = async()=>{
    const url = API_END_POINTS?.AddDispatch;

    const formdata = new FormData();
    if(formData?.packing_list_attachment){
      formdata.append("packing_list_attachment",formData?.packing_list_attachment);
    }
    if(formData?.invoice_attachment){
      formdata.append("invoice_attachment",formData?.invoice_attachment);
    }
    if(formData?.test_certificates_attachment){
      formdata.append("test_certificates_attachment",formData?.test_certificates_attachment);
    }
    if(formData?.commercial_attachment){
      formdata.append("commercial_attachment",formData?.commercial_attachment);
    }
    if(formData?.e_way_bill_attachment){
      formdata.append("e_way_bill_attachment",formData?.e_way_bill_attachment);
    }
    const updated = {...formData,name:refno}
    formdata.append("data",JSON.stringify(updated));

    const respose:AxiosResponse = await requestWrapper({url:url,method:"POST",data:formdata});
    if(respose?.status == 200){
      alert("Added Successfully");
      router.push(`/dispatch?refno=${respose?.data?.message?.dis_name}`)
    }
  }


  const handleTableRowUpdate = async(item:tablerow)=>{
    const url = API_END_POINTS?.dispatchTableRowSubmit;
    const formdata = new FormData();
    const updated = {...item,name:refno,row_name:item?.name};
    formdata.append("data",JSON.stringify(updated));
    if(item?.coa_document_upload){
      formdata.append("coa_document",item?.coa_document_upload as Blob);
    }
    if(item?.msds_document_upload){
      formdata.append("msds_document",item?.msds_document_upload as Blob);
    }
     const resposne:AxiosResponse = await requestWrapper({url:url,data:formdata,method:"POST"});
     if(resposne?.status == 200){
      alert("row updated successfully");
      router.refresh();
     }
  }

  const handleSubmit = async()=>{
    const url = API_END_POINTS?.SubmitDispatch;
    const response:AxiosResponse = await requestWrapper({url:url,data:{data:{name:refno,submit:1}},method:"POST"});
    if(response?.status == 200){
      alert("Submitted Successfully");
      router.push("/vendor-dashboard");
    }
  }

  console.log(formData, "this is form Data")
      
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      {/* <h1 className="border-b-2 border-gray-400 top-0 bg-white text-[#000000] text-lg">
        Purchase Inquiry
      </h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Vendor Code
          </h1>
          <Select value={formData?.vendor_code ?? DispatchDetails?.vendor_code ??  ""} onValueChange={(value)=>{handleVendorCodeChange(value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                    MultipleVendorCode?.map((item,index)=>(
                        <SelectItem key={index} value={item?.vendor_code}>{item?.vendor_code}</SelectItem>
                    ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
          <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            PO No
          </h1>
          <MultiSelect value={selectedPOMultiple ?? []} onChange={(value)=>{handlePOChange(value)}} instanceId="multiselect" options={PODropdown} isMulti required={true}/>
        </div>
        <div className="col-span-1">
          <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Docket No</h1>
          <Input placeholder="" name='user' value={formData?.docket_number ?? DispatchDetails?.docket_number ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,docket_number:e.target.value}))}} />
        </div>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Courier No</h1>
          <Input type="text" name="cart_date" value={formData?.courier_number ?? DispatchDetails?.courier_number ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,courier_number:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Courier Name</h1>
          <Input placeholder="" name='user' value={formData?.courier_name ?? DispatchDetails?.courier_name ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,courier_name:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Dispatch Date</h1>
          <Input placeholder="" type='date' name='user' value={formData?.dispatch_date ?? DispatchDetails?.dispatch_date ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,dispatch_date:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice No</h1>
          <Input placeholder="" name='user' value={formData?.invoice_number ?? DispatchDetails?.invoice_number ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,invoice_number:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice Date</h1>
          <Input placeholder="" type='date' name='user' value={formData?.invoice_date ?? DispatchDetails?.invoice_date ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,invoice_date:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Invoice Amount</h1>
          <Input placeholder="" name='user' value={formData?.invoice_amount ?? DispatchDetails?.invoice_amount ??  ""} onChange={(e)=>{setFormData((prev:any)=>({...prev,invoice_amount:e.target.value}))}} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Upload Invoice</h1>
          {
            uploadedFiles?.invoice_attachment?
            <div className='flex gap-4 justify-center'><Link target='blank' href={`${uploadedFiles?.invoice_attachment?.url}`}><h1>{uploadedFiles?.invoice_attachment?.file_name}</h1></Link><Trash2 onClick={()=>{setUploadedFiles((prev:any)=>({...prev,invoice_attachment:null}))}} className='cursor-pointer text-red-500'/></div>
            :
          <Input type='file' placeholder="" name='user' onChange={(e)=>{setFormData((prev:any)=>({...prev,invoice_attachment:e.target.files?.[0]}))}} />
          }
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Upload packing list document</h1>
          {
            uploadedFiles?.packing_list_attachment?
            <div className='flex gap-4 justify-center'><Link target='blank' href={`${uploadedFiles?.packing_list_attachment?.url}`}><h1>{uploadedFiles?.packing_list_attachment?.file_name}</h1></Link><Trash2 onClick={()=>{setUploadedFiles((prev:any)=>({...prev,packing_list_attachment:null}))}} className='cursor-pointer text-red-500'/></div>
            :
            <Input placeholder="" type='file' name='user' onChange={(e)=>{setFormData((prev:any)=>({...prev,packing_list_attachment:e.target.files?.[0]}))}} />
          }
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Upload commercial invoice</h1>
          {
            uploadedFiles?.commercial_attachment?
            <div className='flex gap-4 justify-center'><Link target='blank' href={`${uploadedFiles?.commercial_attachment?.url}`}><h1>{uploadedFiles?.commercial_attachment?.file_name}</h1></Link><Trash2 onClick={()=>{setUploadedFiles((prev:any)=>({...prev,commercial_attachment:null}))}} className='cursor-pointer text-red-500'/></div>
            :
            <Input placeholder="" type='file' name='user' onChange={(e)=>{setFormData((prev:any)=>({...prev,commercial_attachment:e.target.files?.[0]}))}} />
          }
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Upload e-way bill</h1>
          {
            uploadedFiles?.e_way_bill_attachment?
            <div className='flex gap-4 justify-center'><Link target='blank' href={`${uploadedFiles?.e_way_bill_attachment?.url}`}><h1>{uploadedFiles?.e_way_bill_attachment?.file_name}</h1></Link><Trash2 onClick={()=>{setUploadedFiles((prev:any)=>({...prev,e_way_bill_attachment:null}))}} className='cursor-pointer text-red-500'/></div>
            :
            <Input placeholder="" type='file' name='user' onChange={(e)=>{setFormData((prev:any)=>({...prev,e_way_bill_attachment:e.target.files?.[0]}))}} />
          }
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Upload test certificates</h1>
          {
            uploadedFiles?.test_certificates_attachment?
            <div className='flex gap-4 justify-center'><Link target='blank' href={`${uploadedFiles?.test_certificates_attachment?.url}`}><h1>{uploadedFiles?.test_certificates_attachment?.file_name}</h1></Link><Trash2 onClick={()=>{setUploadedFiles((prev:any)=>({...prev,test_certificates_attachment:null}))}} className='cursor-pointer text-red-500'/></div>
            :
          <Input placeholder="" type='file' name='user' onChange={(e)=>{setFormData((prev:any)=>({...prev,test_certificates_attachment:e.target.files?.[0]}))}} />
          }
        </div>
        <div className='col-span-1 flex items-end'>
        <Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{handleAdd()}} >Add</Button>
        </div>
      </div>
      
        <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Items List
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="text-center">Items Name</TableHead>
                <TableHead className="text-center">Total Quantity</TableHead>
                <TableHead className="text-center">Dispatch Quantity</TableHead>
                <TableHead className="text-center">Pending Quantity</TableHead>
                <TableHead className="text-center">UOM</TableHead>
                <TableHead className="text-center">COA</TableHead>
                <TableHead className="text-center">MSDS</TableHead>
                <TableHead className="text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {table?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item?.product_name}</TableCell>
                  <TableCell>{item?.quantity}</TableCell>
                  <TableCell className='flex justify-center'><Input value={table[index]?.dispatch_qty ?? 0} onChange={(e)=>{handleTableInput(index,Number(e.target.value),Number(item?.quantity))}} min={0}  className='w-24' type='number'/></TableCell>
                  <TableCell>{item?.pending_qty}</TableCell>
                  <TableCell>{item?.uom}</TableCell>
                  <TableCell className='flex justify-center'>
                    {
                      item?.coa_document_upload?
                      <div className='flex gap-4 justify-center'><h1>{item?.coa_document_upload?.name}</h1><Trash2 onClick={()=>{handleTableFileDelete(index,"coa_document_upload")}} className='cursor-pointer text-red-500'/></div> :
                      item?.coa_document?
                      <div className='flex gap-4 justify-center'><h1>{item?.coa_document?.file_name}</h1><Trash2 onClick={()=>{handleTableFileDelete(index,"coa_document")}} className='cursor-pointer text-red-500'/></div>:
                    <input onChange={(e)=>{handleTableFile(index,e)}} name='coa_document_upload' type='file' className='w-24'/>
                    }
                    </TableCell>
                  <TableCell>
                    {
                      item?.msds_document_upload ?
                     <div className='flex gap-4 justify-center'><h1>{item?.msds_document_upload?.name}</h1><Trash2 onClick={()=>{handleTableFileDelete(index,"msds_document_upload")}} className='cursor-pointer text-red-500'/></div> :
                      item?.msds_document ?
                     <div className='flex gap-4 justify-center'><h1>{ item?.msds_document?.file_name}</h1><Trash2 onClick={()=>{handleTableFileDelete(index,"msds_document")}} className='cursor-pointer text-red-500'/></div> :
                    <input type='file' name='msds_document_upload' onChange={(e)=>{handleTableFile(index,e)}} className='w-24'/>
                    }
                    </TableCell>
                    <TableCell><Button className='bg-blue-400 hover:bg-blue-300' onClick={()=>{handleTableRowUpdate(item)}}>Update</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      
      <div className={`flex justify-end pr-4 gap-4`}>
        {/* <Button className='bg-blue-400 hover:bg-blue-400' >Save As Draft</Button> */}
      <Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{handleSubmit()}} >Submit</Button></div>
    </div>
  )
}

export default DispatchForm