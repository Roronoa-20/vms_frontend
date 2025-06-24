"use client"
import React, { useState } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { PurchaseRequestData, PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import { EyeIcon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import Comment_box from '../molecules/CommentBox'

interface Props {
    Dropdown:PurchaseRequestDropdown["message"]
    PRData:PurchaseRequestData["message"]["data"]
    hod:boolean,
    purchase_head:boolean,
    refno?:string
}

type TableData = {
      item_number_of_purchase_requisition: string;
  purchase_requisition_date: string; // Use Date if you plan to convert to Date object
  delivery_date: string;             // Same here
  store_location: string;
  item_category: string;
  material_group: string;
  uom: string;
  cost_center: string;
  main_asset_no: string;
  asset_subnumber: string;
  profit_ctr: string;
  short_text: string;
  quantity: string; // or number, depending on how you use it
  price_of_purchase_requisition: string; // or number
  gl_account_number: string;
  material_code: string;
  account_assignment_category: string;
  purchase_group: string;
  name?:string | number
}

type formData = {
    purchase_requisition_type:string,
    company:string,
    plant:string,
    requisitioner:string,
    company_code_area:string,
    purchase_group:string
    purchase_requisition_form_table:TableData[]
}


const ViewPRRequestForm = ({Dropdown,PRData,hod,purchase_head,refno}:Props) => {
  console.log(PRData,"this si data")
    const user = Cookies.get("user_id");
    const [formData,setFormData] = useState<formData | null>(PRData?{...PRData,requisitioner:PRData?.requisitioner ?? user}:null);
    const [singleTableRow,setSingleTableRow] = useState<TableData | null>(null);
    const [tableData,setTableData] = useState<TableData[]>(PRData?PRData?.purchase_requisition_form_table:[]);
    const [index,setIndex] = useState<number>(-1)
        const [isApproved,setIsApproved] = useState(false);
        const [isReject,setIsReject] = useState(false);
        const [isDialog,setIsDialog] = useState(false);
        const [comment,setComment] = useState<string>("")
        const router = useRouter();
    const handleSelectChange = (value: any, name: string ,isTable:boolean) => {
        if(isTable){
        setSingleTableRow((prev:any) => ({ ...prev, [name]: value }));    
        }else{   
            setFormData((prev:any) => ({ ...prev, [name]: value }))
        }
      };

      const handleFieldChange = (isTable:boolean,e:React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >)=>{
        const {name,value} = e.target;
        if(isTable){
           setSingleTableRow((prev:any) => ({ ...prev, [name]: value })) 
        }else{
            setFormData((prev:any)=>({...prev,[name]:value}));
        }
      }

     const handleTableAdd = () => {
  if (!singleTableRow) return;

  setTableData(prev => {
    const rows = [...prev];
    if (index !== -1) {
      // Editing existing row
      rows[index] = { ...singleTableRow};
    } else {
      // Adding new row
      rows.push({ ...singleTableRow });
    }
    return rows;
  });

  // Clear form
  setSingleTableRow(null);
  setIndex(-1);
};


     const handleEdit = (data:TableData,index:number)=>{
        setIndex(index);
            setSingleTableRow({...data});
        // handleTableAdd(index);
     }

let url = "";
     if(PRData?.hod){
      url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.purchase_requisition_approval.hod_approval_check`
     }else if(PRData?.purchase_head){
      url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.purchase_requisition_approval.purchase_head_approval_check`
     }

     const handleApproval = async()=>{
        const response:AxiosResponse = await requestWrapper({url:url,data:{data:{pur_req:refno,approve:isApproved,reject:isReject,user:user,comments:comment}},method:"POST"});
        if(response?.status == 200){
          setComment("");
          setIsApproved(false);
          setIsReject(false);
          router.push("/dashboard");
            alert("Approved Successfully");
        }else{
          alert("error");
        }
     }

     const handleClose = ()=>{
      setIsDialog(false);
     }
     
     const handleComment = (value:string)=>{
      setComment(value)
     }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Purchase Request
      </h1>
      {/* <h1 className="pl-5">Contact Person</h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Request Type
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"purchase_requisition_type",false)}} value={formData?.purchase_requisition_type ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_requisition_type?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company
          </h1>
          <Select value={formData?.company ?? ""} onValueChange={(value)=>{handleSelectChange(value,"company",false)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Plant
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value)=>{handleSelectChange(value,"plant",false)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.plant?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner</h1>
          <Input placeholder="" name='requisitioner' onChange={(e)=>{handleFieldChange(false,e)}} value={formData?.requisitioner ?? user ?? ""} disabled/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area
          </h1>
          <Select value={formData?.company_code_area ?? ""} onValueChange={(value)=>{handleSelectChange(value,"company_code_area",false)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company_code_area?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"purchase_group",false)}} value={formData?.purchase_group ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_group?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h1 className="pl-5">Purchase Request Items</h1>
        <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Purchase Requisition Date</TableHead>
                  <TableHead className="text-center">Delivery Date</TableHead>
                  <TableHead className="text-center">Store Location</TableHead>
                  <TableHead className="text-center">Item Category</TableHead>
                  <TableHead className="text-center">Material Group</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Cost Center</TableHead>
                  <TableHead className="text-center">Main Asset No</TableHead>
                  <TableHead className="text-center">Asset Subnumber</TableHead>
                  <TableHead className="text-center">Profit Center</TableHead>
                  <TableHead className="text-center">Description</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Price Of Purchase Requisition</TableHead>
                  <TableHead className="text-center">GL Account Number</TableHead>
                  <TableHead className="text-center">Material Code</TableHead>
                  <TableHead className="text-center">Account Assignment Category</TableHead>
                  <TableHead className="text-center">Purchase Group</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {tableData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index +1}</TableCell>
                    <TableCell>{item?.purchase_requisition_date}</TableCell>
                    <TableCell>{item?.delivery_date}</TableCell>
                    <TableCell>{item?.store_location}</TableCell>
                    <TableCell>{item?.item_category}</TableCell>
                    <TableCell>{item?.material_group}</TableCell>
                    <TableCell>{item?.uom}</TableCell>
                    <TableCell>{item?.cost_center}</TableCell>
                    <TableCell>{item?.main_asset_no}</TableCell>
                    <TableCell>{item?.asset_subnumber}</TableCell>
                    <TableCell>{item?.profit_ctr}</TableCell>
                    <TableCell>{item?.short_text}</TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell>{item?.price_of_purchase_requisition}</TableCell>
                    <TableCell>{item?.gl_account_number}</TableCell>
                    <TableCell>{item?.material_code}</TableCell>
                    <TableCell>{item?.account_assignment_category}</TableCell>
                    <TableCell>{item?.purchase_group}</TableCell>
                    <TableCell><div className='flex gap-4 justify-center items-center'>
                        <EyeIcon className='cursor-pointer' onClick={()=>{handleEdit(item,index)}}/>
                        </div>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={`flex justify-end pr-4 gap-4`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{setIsApproved(true);setIsDialog(true)}}>Approve</Button>
          <Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{setIsReject(true);setIsDialog(true)}}>Reject</Button></div>
          {
            isDialog && 
            <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
            <Comment_box handleClose={handleClose} Submitbutton={handleApproval} handleComment={handleComment}/>
            </div>
          }
    </div>
  )
}

export default ViewPRRequestForm