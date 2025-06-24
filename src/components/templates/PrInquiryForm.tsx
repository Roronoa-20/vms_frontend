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
import { purchaseInquiryDropdown, TableData, TPRInquiry } from '../pages/Pr-Inquiry'

interface Props {
    Dropdown?:PurchaseRequestDropdown["message"]
    PRData?:PurchaseRequestData["message"]["data"]
    dropdown:purchaseInquiryDropdown["message"]
    PRInquiryData:TPRInquiry | null
}


type ProductNameDropdown = {
  name:string,
  product_name:string,
}
const currentDate = new Date();

const PRInquiryForm = ({PRInquiryData,dropdown}:Props) => {
    const user = Cookies.get("user_id");
    const [formData,setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
    const [singleTableRow,setSingleTableRow] = useState<TableData | null>(null);
    const [tableData,setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
    const [productNameDropdown,setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
    const [index,setIndex] = useState<number>(-1)
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


     const handleSubmit = async()=>{
        const url = API_END_POINTS?.submitPrInquiry;
        const response:AxiosResponse = await requestWrapper({url:url,data:{data:{...formData,cart_product:tableData,user:user}},method:"POST"});
        if(response?.status == 200){
            setFormData(null);
            alert("submission successfull");
        }else{
            alert("error");
        }
     }

     const fetchProductName = async(value:string)=>{
      const fetchProductNameUrl = API_END_POINTS?.fetchProductNameBasedOnCategory;
      const response:AxiosResponse = await requestWrapper({url:fetchProductNameUrl,params:{category_type:value}});
      if(response?.status == 200){
        setProductNameDropdown(response?.data?.message?.data);
      }
     }

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Purchase Inquiry
      </h1>
      {/* <h1 className="pl-5">Contact Person</h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">user</h1>
          <Input placeholder="" name='user' onChange={(e)=>{handleFieldChange(false,e)}} value={formData?.user ?? user ?? ""} disabled/>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Cart Use
          </h1>
          <Select value={formData?.cart_use ?? ""} onValueChange={(value)=>{handleSelectChange(value,"cart_use",false)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
               <SelectItem value="Individual Use">Individual Use</SelectItem>
               <SelectItem value="Commercial Use">Commercial Use</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Cart Date</h1>
          <Input placeholder="" name='cart_date' onChange={(e)=>{handleFieldChange(false,e)}} value={formData?.cart_date ?? currentDate?.toLocaleDateString() ?? ""} disabled/>
        </div>
        {/* <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner</h1>
          <Input placeholder="" name='requisitioner' onChange={(e)=>{handleFieldChange(false,e)}} value={formData?.requisitioner ?? user ?? ""} disabled/>
        </div> */}
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Category Type
          </h1>
          <Select value={formData?.category_type ?? ""} onValueChange={(value)=>{handleSelectChange(value,"category_type",false); fetchProductName(value)}}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  dropdown?.category_type?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.category_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h1 className="pl-5">Purchase Inquiry Items</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Assest Code
          </h1>
          <Input placeholder="" name='assest_code' onChange={(e)=>{handleFieldChange(true,e)}} value={singleTableRow?.assest_code ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Product Name
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"product_name",true)}} value={singleTableRow?.product_name ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  productNameDropdown?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.product_name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Product Price
          </h1>
          <Input placeholder="" name='product_price' onChange={(e)=>{handleFieldChange(true,e)}} value={singleTableRow?.product_price ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            UOM
          </h1>
          <Select onValueChange={(value)=>{handleSelectChange(value,"uom",true)}} value={singleTableRow?.uom ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  dropdown?.uom_master?.map((item,index)=>(
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Lead Time
          </h1>
          <Input placeholder="" name='lead_time' onChange={(e)=>{handleFieldChange(true,e)}} value={singleTableRow?.lead_time ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Product Quantity
          </h1>
          <Input placeholder="" name='product_quantity' onChange={(e)=>{handleFieldChange(true,e)}} value={singleTableRow?.product_quantity ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            User Specification
          </h1>
          <Input placeholder="" name='user_specifications' onChange={(e)=>{handleFieldChange(true,e)}} value={singleTableRow?.user_specifications ?? ""} />
        </div>
        </div>
      <div className={`flex justify-end pb-4`}>
        <Button className="bg-blue-400 hover:bg-blue-400" onClick={()=>handleTableAdd()}>Add</Button>
      </div>
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
                  <TableHead className="text-center">Assest Code</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Product Price</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Lead Time</TableHead>
                  <TableHead className="text-center">Product Quantity</TableHead>
                  <TableHead className="text-center">User Specification</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {tableData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index +1}</TableCell>
                    <TableCell>{item?.assest_code}</TableCell>
                    <TableCell>{item?.product_name}</TableCell>
                    <TableCell>{item?.product_price}</TableCell>
                    <TableCell>{item?.uom}</TableCell>
                    <TableCell>{item?.lead_time}</TableCell>
                    <TableCell>{item?.product_quantity}</TableCell>
                    <TableCell>{item?.user_specifications}</TableCell>
                    <TableCell><div className='flex gap-4 justify-center items-center'>
                        <EyeIcon className='cursor-pointer' onClick={()=>{handleEdit(item,index)}}/>
                        </div>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={`flex justify-end pr-4`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={()=>{handleSubmit()}}>Submit</Button></div>
    </div>
  )
}

export default PRInquiryForm