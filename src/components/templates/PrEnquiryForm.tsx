"use client"
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { PurchaseRequestData, PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import { EyeIcon, Trash2 } from 'lucide-react';
import { PencilIcon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XIcon } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import MultiSelect, { GroupBase, MultiValue } from "react-select";
import { multiSelectStyles } from "@/src/components/common/sharedStyles";
import { categoryTypeDropdownType, cityDropdownType, companyDropdownBasedOnUserType, locationDropdownType, ProductNameDropdown, PurchaseTypeType, TPRInquiry } from '@/src/types/prEnquiry/prEnquiry.types'
import { addEnquiryItems, createPurchaseEnquiry, deleteEnquiryItems, getCityDropdown, getlocationDropdown, getProductNameDropdown, getPurchaseEnquiryData, submitEnquiry } from '@/src/services/prEnquiry/prEnquiry.services'
import SearchableDropdown from '../molecules/SearchableDropdown'
import SearchSelectComponent from '../molecules/Selectsearchcomponent'



interface Props {
 companyDropdown:companyDropdownBasedOnUserType[]
 purchaseTypeDropdown:PurchaseTypeType[]
 categoryTypeDropdown:categoryTypeDropdownType[]
 cityDropdown:cityDropdownType[]
 data:TPRInquiry
}


const PRInquiryForm = ({  companyDropdown,purchaseTypeDropdown,categoryTypeDropdown,cityDropdown,data}: Props) => {
  const router = useRouter();
  const param = useSearchParams();
  const refno = param.get("cart_id");

  const [formData, setFormData] = useState<TPRInquiry>(data);
  const [singleTableRow, setSingleTableRow] = useState<any>(null);
  

  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [locationDropdown, setLocationDropdown] = useState<cityDropdownType[]>(cityDropdown);
  const [selectedLocation,setSelectedLocation] = useState<string>()
  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);

  const [plantDropdown, setPlantDropdown] = useState<{ name: string, plant_name: string, description: string }[]>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedProductName,setSelectedProductName] = useState<string>();
  const [attachment,setAttachment] = useState<File>()

  const fileUploadRef = useRef<HTMLInputElement>(null);

  console.log(cityDropdown,"this is city")

  useEffect(()=>{
    if(selectedProductName){
      const data = productNameDropdown?.filter((item)=>{
        if(item?.name == selectedProductName ){
          return item;
        }
      });
      setSingleTableRow((prev:any)=>({...prev,category_type:data?.[0]?.category_type,product_price:data?.[0]?.product_price,uom:data?.[0]?.uom,lead_time:data?.[0]?.lead_time}))
    }
  },[selectedProductName])

  // useEffect(()=>{
  //   if(refno){
  //     getPurchaseEnquiryData(refno).then((data)=>{
  //       setFormData(data)
  //     })
  //   }
  // },[])


  const requiredTableFields = {
    product_name: "Please Select Product",
    uom: "Please Select UOM",
    product_quantity: "Please Enter Product Quantity",
    user_specifications: "Please Enter User Specification"
  }


  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  
  const handleSelectChange = (value:string,name:string) => {
    setFormData((prev:any)=>({...prev,[name]:value}));
  }

  const handleFillMaterialDetails = async()=>{
    if(!formData?.company){
      alert("please select company");
      return;
    }

    if(!formData?.cart_use){
      alert("please select Cart Use");
      return;
    }

    const body = {
      data:{
        company:formData?.company,
        cart_use:formData?.cart_use
      }
    }

    const response = await createPurchaseEnquiry(body);
    router.replace(`/pr-enquiry?cart_id=${response?.name}`);
    getPurchaseEnquiryData(response?.name).then((data)=>{setFormData(data)})
  }

  // const fetchLocationDropdown = async(query:string)=>{
  //   if(formData?.company){
  //     return await getlocationDropdown(query,formData?.company?.name as string)
  //   }else{
  //     return []
  //   }
  // }

  const fetchCityDropdown = async(query?:string)=>{
    if(formData?.company?.name){
      return await getCityDropdown(query as string,formData?.company?.name as string)
    }else{
      return []
    }
  }

  useEffect(()=>{
    fetchCityDropdown();
  },[formData?.company?.name])
  let nbrequiredFields: { [key: string]: string } = {
    // cart_use: "Please Select Cart Use",
    // category_type: "Please Select Category Type",
    // company: "Please Select Company",
    product_name: "Please Select Product Name",
    quantity:"Please Enter Quantity",
    location:"Please Select Location",
  };

  let sbrequiredFields:{[key: string]:string} = {
    category_type:"Please Select Category Type",
    location:"Please Select Location",
  }

  const addItems = ()=>{

    if(!singleTableRow?.purchase_type){
      alert("Please Select Purchase Type");
      return;
    }

    if(singleTableRow?.purchase_type == "SB"){
      if(!singleTableRow?.category_type){
        alert("Please Select Category Type");
        return;
      }
      if(!selectedLocation){
        alert("Please Select Location");
        return;
      }
    }


    if(singleTableRow?.purchase_type == "NB"){
      if(!selectedProductName){
        alert("Please Select Purchase Name");
        return;
      }

      if(!singleTableRow?.product_quantity){
        alert("Please select quantity");
        return;
      }

      if(!selectedLocation){
        alert("Please Select Location");
        return;
      }
    }



    const data = {
        purchase_type:singleTableRow?.purchase_type,
        product_name:selectedProductName,
        product_quantity:singleTableRow?.product_quantity,
        location:selectedLocation,
        cart_id:refno,
        user_specifications:singleTableRow?.user_specifications,
        name:singleTableRow?.name,
        category_type:singleTableRow?.category_type
    }

    const body = new FormData();
    body.append("data",JSON.stringify(data));
    if(attachment){
      body.append("attachment",attachment);
    }
     addEnquiryItems(body).then(()=>{
      alert("Items added successfully!");
      getPurchaseEnquiryData(refno as string).then((data)=>setFormData(data));
      setSingleTableRow(null);
      setSelectedLocation("");
      setSelectedProductName("");
      if(fileUploadRef?.current){
        fileUploadRef.current.value = "";
      }
     })
     .catch(()=>{
      alert("failed to add item");
     })
  }

  const handleEdit = async(index:number)=>{
    setSingleTableRow((prev:any)=>({
      purchase_type:formData?.cart_product[index]?.purchase_type,
      product_quantity:formData?.cart_product[index]?.product_quantity,
      user_specifications:formData?.cart_product[index]?.user_specifications,
      file:formData?.cart_product[index]?.attachment_details,
      category_type:formData?.cart_product[index]?.category_type,
      product_price:formData?.cart_product[index]?.product_price,
      uom:formData?.cart_product[index]?.uom,
      lead_time:formData?.cart_product[index]?.lead_time,
      name:formData?.cart_product[index]?.name
    }));
    await fetchCityDropdown(formData?.cart_product[index]?.location_details?.name as string).then((data)=>setLocationDropdown(data));
    await getProductNameDropdown(formData?.cart_product[index]?.product_details?.name as string).then((data)=>setProductNameDropdown(data));
    setSelectedProductName(formData?.cart_product[index]?.product_details?.name)
    setSelectedLocation(formData?.cart_product[index]?.location_details?.name)
  }

  const handleRowDelete = async(row_id:string)=>{
    if(confirm("are you sure you want to delete this row?")){
      deleteEnquiryItems(refno as string,row_id).then((data)=>{alert("Row deleted successfully!"); getPurchaseEnquiryData(refno as string).then((data)=>{setFormData(data)})});
    } 
  }


  return (
    <>
      <div className="flex flex-col bg-white rounded-lg px-2 pb-2 max-h-[80vh] w-full">
        <div className="grid grid-cols-3 gap-6 p-3">
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
              Cart Use <span className='text-red-400 text-[20px] absolute -top-2 left-16'>*</span>
            </h1>
            <Select onValueChange={(value)=>{handleSelectChange(value,"cart_use")}} value={formData?.cart_use} disabled={refno?true:false}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="Individual Use">Individual Use</SelectItem>
                  <SelectItem value="Commercial Use">Group Use</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
              Company <span className='text-red-400 text-[20px] absolute -top-2 left-[4rem]'>*</span>
            </h1>
            <Select onValueChange={(value)=>{handleSelectChange(value,"company")}} value={formData?.company?.name} disabled={refno?true:false}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    companyDropdown?.map((item)=>(
                      <SelectItem key={item?.name} value={item?.name}>{item?.company_name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='col-span-1 flex items-end  justify-end gap-4'>
            <Button className={` ${refno ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={(e) => { (handleFillMaterialDetails()) }}>Fill Material Details</Button>
          </div>
        </div>
        {refno && !formData?.is_submited && 
          <>
            <h1 className="border-b-2 border-gray-400 font-bold text-[18px] p-1">
              Material Details
            </h1>
            <div className="grid grid-cols-3 gap-6 p-3">
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Purchase Type <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Select onValueChange={(value)=>{setSingleTableRow((prev:any)=>({...prev,purchase_type:value}))}} value={singleTableRow?.purchase_type ?? ""}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    purchaseTypeDropdown?.map((item)=>(
                      <SelectItem key={item?.name} value={item?.name}>{item?.purchase_requisition_type_name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
              </div>
              {
                singleTableRow?.purchase_type == "SB" && 
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Category Type <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Select onValueChange={(value)=>{setSingleTableRow((prev:any)=>({...prev,category_type:value}))}} value={singleTableRow?.category_type ?? ""}>
              <SelectTrigger className='rounded-xl'>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {
                    categoryTypeDropdown?.map((item)=>(
                      <SelectItem key={item?.name} value={item?.name}>{item?.category_name}</SelectItem>
                    ))
                  }
                </SelectGroup>
              </SelectContent>
            </Select>
              </div>
                  }
              {
                singleTableRow?.purchase_type !== "SB" &&
                <>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Product Name <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
            {/* <SearchableDropdown /> */}
            <SearchSelectComponent searchApi={getProductNameDropdown} getLabel={(item) => item?.product_name} getValue={(item)=> item?.name} setDropdown={setProductNameDropdown} dropdown={productNameDropdown} setData={(value) => setSelectedProductName(value ?? "")} data={selectedProductName} />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  
                  Quantity <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Input placeholder="" name='product_quantity' value={singleTableRow?.product_quantity ?? ""} className='rounded-xl' type='number' onChange={(e) => { setSingleTableRow((prev:any)=>({...prev,product_quantity:e?.target?.value})) }}/>
              </div>
                </>
              }

              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Location <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
            <SearchSelectComponent searchApi={fetchCityDropdown} getLabel={(item) => item?.city_name} getValue={(item)=> item?.name} setDropdown={setLocationDropdown} dropdown={locationDropdown} setData={(value) => setSelectedLocation(value ?? "")} data={selectedLocation} />
               </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  User Specification 
                  {/* <span className='text-red-400 text-[20px] absolute -top-2'>*</span> */}
                </h1>
                <Input placeholder="" className='rounded-xl' name='user_specifications' onChange={(e) => { setSingleTableRow((prev:any)=>({...prev,user_specifications:e?.target?.value})) }} value={singleTableRow?.user_specifications ?? ""} />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Attachment
                </h1>
                <div className='flex gap-3 items-center'>
                  <Input ref={fileUploadRef} type='file' onChange={(e) => {setAttachment(e.target.files?.[0]) }} className='rounded-xl' />
                  { singleTableRow?.file?.url && !attachment && <Link href={singleTableRow?.file?.url}>{singleTableRow?.file?.file_name}</Link>}
                  {/* <XIcon className={`text-red-400 ${singleTableRow?.file?.url ? "" : "hidden"} hover:cursor-pointer`} onClick={() => { handleFileDelete() }} /> */}
                </div>
              </div>
              {
                singleTableRow?.purchase_type !== "SB" &&
                <>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Category Type <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Input placeholder="" className='rounded-xl' value={singleTableRow?.category_type ?? ""} name='category_type' disabled />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Product Price Range <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Input placeholder="" className='rounded-xl' name='product_price_range' value={singleTableRow?.product_price ?? ""} onChange={(e) => { setSingleTableRow((prev:any)=>({...prev,product_price:e.target.value})) }} disabled />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  UOM <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Input placeholder="" className='rounded-xl' name='uom' value={singleTableRow?.uom ?? ""} disabled />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2 relative">
                  Lead Time <span className='text-red-400 text-[20px] absolute -top-2'>*</span>
                </h1>
                <Input placeholder="" className='rounded-xl' name='lead_time' value={singleTableRow?.lead_time ?? ""} disabled />
              </div>
                </>
              }
              <div className='col-span-1 flex items-end pb-[2px]'>
                  <Button
                  className=" rounded-xl px-3 py-2 font-normal"
                  variant="nextbtn"
                  size="nextbtnsize"
                  onClick={()=>{addItems()}}
                >
                  Add
                </Button>
              </div>
            </div>
          </>
        }
        
        
          <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl mt-4">
            <div className="flex w-full justify-between pb-4">
              <h1 className="text-[20px] text-[#03111F] font-semibold">
                Items List
              </h1>
            </div>
            <Table className=" max-h-40 overflow-y-scroll">
              <TableHeader className="text-center">
                <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                  <TableHead className="w-[100px]">Sr No.</TableHead>
                  <TableHead className="text-center">Product Type</TableHead>
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Is Assest Code? </TableHead>
                  <TableHead className="text-center">Product Quantity</TableHead>
                  <TableHead className="text-center">location</TableHead>
                  <TableHead className="text-center">User Specification</TableHead>
                  <TableHead className="text-center">Attachment</TableHead>
                  <TableHead className="text-center">Category Type</TableHead>
                  <TableHead className="text-center">Product Price</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Lead Time</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  {
                    !formData?.is_submited && 
                    <TableHead className="text-center">Action</TableHead>
                  }
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
               {
                formData?.cart_product?.map((item,index)=>(
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className=''>{item?.purchase_type ?? ""}</TableCell>
                    <TableCell>{item?.product_details?.product_name}</TableCell> 
                    <TableCell className='flex justify-center'><Input className='w-5' type='checkbox' checked={item?.need_asset_code?true:false} disabled/></TableCell>
                    <TableCell>{item?.product_quantity}</TableCell>
                    <TableCell>{item?.location_details?.location_name ?? ""}</TableCell>
                    <TableCell>{item?.user_specifications}</TableCell>
                    <TableCell><Link href={item?.attachment_details?.url ?? ""} target='blank'>{item?.attachment_details?.file_name}</Link></TableCell> 
                    <TableCell>{item?.category_type ?? ""}</TableCell>
                    <TableCell>{item?.product_price ?? ""}</TableCell>
                    <TableCell>{item?.uom}</TableCell>
                    <TableCell>{item?.lead_time}</TableCell>
                    <TableCell>{item?.approval_status}</TableCell>
                    {
                      !formData?.is_submited &&
                      <TableCell><div className='flex gap-4 justify-center items-center'>
                      <svg onClick={()=>{handleEdit(index)}} className='hover:cursor-pointer' width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 20.0008H20.0001M14.0001 4.00045L18.0001 8.00054M20.1741 5.81249C20.7028 5.2839 20.9999 4.56693 21 3.8193C21.0001 3.07167 20.7032 2.35462 20.1746 1.8259C19.646 1.29718 18.9291 1.00009 18.1814 1C17.4338 0.999906 16.7168 1.29681 16.1881 1.8254L2.84195 15.1747C2.60977 15.4062 2.43806 15.6912 2.34195 16.0047L1.02093 20.3568C0.99509 20.4433 0.993138 20.5352 1.01529 20.6227C1.03743 20.7102 1.08286 20.7901 1.14673 20.8538C1.21061 20.9176 1.29056 20.9629 1.3781 20.9849C1.46564 21.0069 1.5575 21.0048 1.64394 20.9788L5.99698 19.6588C6.31015 19.5636 6.59516 19.3929 6.82699 19.1618L20.1741 5.81249Z" stroke="#03111F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <Trash2 onClick={()=>{handleRowDelete(item?.name as string)}} className={`text-red-400 cursor-pointer`} />
                    </div>
                    </TableCell>
                    }
                  </TableRow>
                
                ))
               }
              </TableBody>
            </Table>
          </div>
          {
            !formData?.is_submited && 
            <div className={`flex justify-end pr-2 mt-4 pb-4 ${refno && formData?.cart_product.length>0 ? "" : "hidden"}`}><Button className='py-2.5' variant={"nextbtn"} size={"nextbtnsize"} onClick={() => {submitEnquiry(refno as string).then(()=>setShowSuccessModal(true)) }} >Submit</Button></div>
          }

        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <Card className="bg-white p-6 w-[400px] text-center rounded-lg shadow-lg">
              <CardContent className="p-8 text-center bg-gradient-to-b from-white to-gray-50 rounded-2xl">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Success</h2>
                <p className="text-sm text-gray-600">{successMessage}</p>
                <Button
                  className="mt-2"
                  variant="nextbtn"
                  size="nextbtnsize"
                  onClick={()=>handleSuccessOk()}
                >
                  OK
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <ToastContainer closeButton theme="dark" autoClose={2000} />
    </>
  )
}

export default PRInquiryForm