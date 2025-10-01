"use client"
import React, { useEffect, useState } from 'react'
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
import Cookies from 'js-cookie'
import { purchaseInquiryDropdown, TableData, TPRInquiry } from '../pages/Pr-Inquiry';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import PopUp from '../molecules/PopUp'


interface Props {
  Dropdown?: PurchaseRequestDropdown["message"]
  PRData?: PurchaseRequestData["message"]["data"]
  dropdown: purchaseInquiryDropdown["message"]
  PRInquiryData: TPRInquiry | null
  companyDropdown: { name: string, description: string }[]
  purchaseTypeDropdown: { name: string, purchase_requisition_type_name: string, description: string }[]
}


type ProductNameDropdown = {
  name: string,
  product_name: string,
  product_price: string,
  lead_time: string,
}
const currentDate = new Date();

const PRInquiryForm = ({ PRInquiryData, dropdown, companyDropdown, purchaseTypeDropdown }: Props) => {
  const user = Cookies.get("user_id");
  console.log(PRInquiryData, "__________-")
  const [formData, setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [isDialog,setIsDialog] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [showTable, setShowTable] = useState(PRInquiryData?.cart_product.length && PRInquiryData?.cart_product.length > 0 ? true : false);
  const [plantDropdown, setPlantDropdown] = useState<{ name: string, plant_name: string, description: string }[]>();
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<{ name: string, purchase_group_code: string, purchase_group_name: string, description: string }[]>();
  const [toEmail,setToEmail] = useState<string>("");
  const router = useRouter();
  const param = useSearchParams();
  const refno = param.get("cart_Id");
  useEffect(() => {
    if (PRInquiryData?.company) {
      handleCompanyChange(PRInquiryData?.company);
    }

    if (PRInquiryData?.category_type) {
      fetchProductName(PRInquiryData?.category_type);
    }
  }, [])


  const handleSelectChange = (value: any, name: string, isTable: boolean) => {
    if (isTable) {
      setSingleTableRow((prev: any) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }))
    }
  };

  const handleFieldChange = (isTable: boolean, e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >) => {
    const { name, value } = e.target;
    if (isTable) {
      setSingleTableRow((prev: any) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  const handleTableAdd = async() => {
    if (!singleTableRow) return;

    // setTableData(prev => {
    //   const rows = [...prev];
    //   if (index !== -1) {
    //     rows[index] = { ...singleTableRow };
    //   } else {
    //     rows.push({ ...singleTableRow });
    //   }
    //   return rows;
    // });
    // setShowTable(true);

  //   let assetCodeLine = 0;

  // if (PRInquiryData?.asked_to_modify == Boolean(1)) {
  //   for (let i = 0; i < tableData.length; i++) {
  //     const item = tableData[i];
  //     if (item?.need_asset_code == Boolean(1) && !item?.assest_code) {
  //       assetCodeLine = i + 1; // Line number is usually 1-based
  //       break;
  //     }
  //   }
  // }

// if (assetCodeLine !== 0) {
//   alert(`Please enter Asset Code for line ${assetCodeLine}`);
//   return;
// }
const formdata = new FormData();
for(const key of Object.keys(singleTableRow) as (keyof TableData)[]){
  const value = singleTableRow[key];
  if(typeof(value) == "string"){
    formdata.append(key,value);
  }
}
formdata.append("attachment",singleTableRow?.file);
 formdata.append("purchase_inquiry_id",refno as string);
const response:AxiosResponse = await requestWrapper({url:API_END_POINTS?.addProductInquiryProducts,method:"POST",data:formdata});
  if(response?.status == 200){
    alert("added successfully");
    // router.push(`pr-inquiry?cart_Id=${refno}`);
    location.reload();
  }

    setSingleTableRow(null);
    setIndex(-1);
  };

  const handleEdit = (data: TableData, index: number) => {
    setIndex(index);
    setSingleTableRow({ ...data });
  };

  const handleSubmit = async () => {
    const url = API_END_POINTS?.submitPrInquiry;
    const payload = {
      ...formData,
      cart_date: formData?.cart_date ?? formatDateISO(new Date()),
      cart_product: tableData,
      user: user,
    };

    let assetCodeLine = 0;

if (PRInquiryData?.asked_to_modify == Boolean(1)) {
  for (let i = 0; i < tableData.length; i++) {
    const item = tableData[i];
    if (item?.need_asset_code == Boolean(1) && !item?.assest_code) {
      assetCodeLine = i + 1; // Line number is usually 1-based
      break;
    }
  }
}

if (assetCodeLine !== 0) {
  alert(`Please enter Asset Code for line ${assetCodeLine}`);
  return;
}


    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: payload }, method: "POST", params:{purchase_inquiry_id:refno} });
    if (response?.status == 200) {
      setFormData(null);
      alert("submission successfull");
      const refno = response?.data?.message?.name;
      // router.push(`pr-inquiry?refno=${refno}`)
      router.push(`/dashboard`)
      // const redirectUrl = `/pr-inquiry?refno=${refno}`;
      // window.location.href = redirectUrl;
    } else {
      alert("error");
    }
  };

  const fetchProductName = async (value: string) => {
    const fetchProductNameUrl = API_END_POINTS?.fetchProductNameBasedOnCategory;
    const response: AxiosResponse = await requestWrapper({ url: fetchProductNameUrl, params: { category_type: value } });
    if (response?.status == 200) {
      setProductNameDropdown(response?.data?.message?.data);
    }
  };
  console.log(productNameDropdown, "productNameDropdown");

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const parseAndFormatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return formatDate(date);
  };

  const formatDateISO = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // const formatPriceRange = (priceRange: string) => {
  //   if (!priceRange) return "";

  //   const parts = priceRange.split("-");
  //   if (parts.length === 2) {
  //     const formattedStart = `₹${Number(parts[0]).toLocaleString("en-IN")}`;
  //     const formattedEnd = `₹${Number(parts[1]).toLocaleString("en-IN")}`;
  //     return `${formattedStart} - ${formattedEnd}`;
  //   }
  //   return `₹${Number(priceRange).toLocaleString("en-IN")}`;
  // };


  const handleCompanyChange = async (value: string) => {
    const url = `${API_END_POINTS?.InquiryDropdownsBasedOnCompany}?comp=${value}`
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPlantDropdown(response?.data?.message?.plants);
      setPurchaseGroupDropdown(response?.data?.message?.purchase_groups);
    }
  }

  const handleTableAssestCodeChange = (index: number, data: string) => {
    // const { name, value } = e.target;
    setTableData((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], assest_code: data };
      }
      return updated;
    });
  };

  const handleProductNameSelect = (value: string) => {
    const selectedProduct = productNameDropdown?.find((item) => item.name === value);

    handleSelectChange(value, "product_name", true);

    if (selectedProduct) {
      handleSelectChange(selectedProduct.product_price?.toString() || "", "product_price", true);
      handleSelectChange(selectedProduct.lead_time?.toString() || "", "lead_time", true);
    }
  };

  const handleNext = async()=>{
    const response:AxiosResponse = await  requestWrapper({url:API_END_POINTS?.submitPrInquiryNextButton,data:{data:{...formData,cart_date: formData?.cart_date ?? formatDateISO(new Date()),user: user,}},method:"POST"});
    if(response?.status == 200){
      router.push(`/pr-inquiry?cart_Id=${response?.data?.message?.name}`);
    }
  }

  const deleteProductItem = async(row_id:string)=>{
    const respone:AxiosResponse = await requestWrapper({url:API_END_POINTS?.deleteInquiryProductItem,method:"GET",params:{purchase_inquiry_id:refno,row_name:row_id}});
    if(respone?.status == 200){
      alert("deleted successfully");
      // router.push(`pr-inquiry?cart_Id=${refno}`);
      location.reload();
    }
  }

  const formatINRCurrencyRange = (value: string | null): string => {
    if (!value) return "";

    return value
      .split("-")
      .map((v) => `₹${v.trim()}`)
      .join(" - ");
  };





  return (
    <>
    
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      {/* <h1 className="border-b-2 border-gray-400 top-0 bg-white text-[#000000] text-lg">
        Purchase Inquiry
      </h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">User</h1>
          <Input placeholder="" name='user' onChange={(e) => { handleFieldChange(false, e) }} value={formData?.user ?? user ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Cart Use
          </h1>
          <Select value={formData?.cart_use ?? ""} onValueChange={(value) => { handleSelectChange(value, "cart_use", false) }} disabled={refno?true:false}>
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
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">Cart Date</h1>
          <Input type="text" name="cart_date" value={formData?.cart_date ? parseAndFormatDate(formData.cart_date) : formatDate(new Date())} readOnly />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Category Type
          </h1>
          <Select value={formData?.category_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "category_type", false); fetchProductName(value) }} disabled={refno?true:false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dropdown?.category_type?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.category_name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Company
          </h1>
          <Select value={formData?.company ?? ""} onValueChange={(value) => { handleSelectChange(value, "company", false); handleCompanyChange(value); }} disabled={refno?true:false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {companyDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Purchase Type
          </h1>
          <Select value={formData?.purchase_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_type", false) }} disabled={refno?true:false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {purchaseTypeDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Plant
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant", false) }} disabled={refno?true:false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {plantDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Purchase Group
          </h1>
          <Select value={formData?.purchase_group ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_group", false) }} disabled={refno?true:false}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {purchaseGroupDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className='col-span-1 flex items-end gap-4'>
                <Button className={`bg-blue-400 hover:bg-blue-300 ${refno?"hidden":""}`} onClick={(e)=>{handleNext()}}>Next</Button>
        </div>
      </div>
      {
        refno && 
      <>
      <h1 className="border-b-2 border-gray-400 font-bold text-[18px]">
        Purchase Inquiry Items
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        {/* <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Assest Code
          </h1>
          <Input placeholder="" name='assest_code' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.assest_code ?? ""} />
        </div> */}
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Product Name
          </h1>
          <Select
            // onValueChange={(value) => { handleSelectChange(value, "product_name",true) }} value={singleTableRow?.product_name ?? ""}
            // value={singleTableRow?.product_name ?? ""}
            onValueChange={handleProductNameSelect}
            value={singleTableRow?.product_name ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {productNameDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>
                    {item?.product_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Product Price Range
          </h1>
          <Input placeholder="" disabled name='product_price' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.product_price ?? ""}
          />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Lead Time
          </h1>
          <Input placeholder="" disabled name='lead_time' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.lead_time ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            UOM
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "uom", true) }} value={singleTableRow?.uom ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dropdown?.uom_master?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.name} - {item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Product Quantity
          </h1>
          <Input placeholder="" name='product_quantity' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.product_quantity ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            User Specification
          </h1>
          <Input placeholder="" name='user_specifications' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.user_specifications ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Attachment
          </h1>
          <Input type='file' onChange={(e) => {setSingleTableRow((prev:any)=>({...prev,file:e.target?.files?.[0]}))}}/>
        </div>
        <div className="col-span-1 mt-8">
          <Button className={`bg-blue-400 hover:bg-blue-400 ${PRInquiryData?.asked_to_modify ? "" : "hidden"}`} onClick={() => handleTableAdd()}>Add</Button>
          <Button className={`bg-blue-400 hover:bg-blue-400 ${PRInquiryData?.is_submited ? "hidden" : ""}`} onClick={() => handleTableAdd()}>Add</Button>
        </div>
      </div>
      </>
      }
      { PRInquiryData && PRInquiryData?.cart_product?.length>0 && (
        <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
          <div className="flex w-full justify-between pb-4">
            <h1 className="text-[20px] text-[#03111F] font-semibold">
              Items List
            </h1>
          </div>
          <Table className=" max-h-40 overflow-y-scroll">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">Product Name</TableHead>
                <TableHead className="text-center">Assest Code</TableHead>
                <TableHead className="text-center">Product Price</TableHead>
                <TableHead className="text-center">UOM</TableHead>
                <TableHead className="text-center">Lead Time</TableHead>
                <TableHead className="text-center">Product Quantity</TableHead>
                <TableHead className="text-center">User Specification</TableHead>
                <TableHead className="text-center">Attachment</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {tableData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {/* {item?.product_name} */}
                    <Select
                    disabled
            value={item?.product_name ?? ""}
          >
            <SelectTrigger className='disabled:opacity-100'>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {productNameDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>
                    {item?.product_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
                    </TableCell>
                  <TableCell className='flex justify-center'><Input disabled={item?.need_asset_code && PRInquiryData?.asked_to_modify ? false : true} className={`text-center w-28`} value={item?.assest_code ?? ""} onChange={(e) => { handleTableAssestCodeChange(index, e.target.value) }} /></TableCell>
                  <TableCell>{item?.product_price}</TableCell>
                  <TableCell>{item?.uom}</TableCell>
                  <TableCell>{item?.lead_time}</TableCell>
                  <TableCell>{item?.product_quantity}</TableCell>
                  <TableCell>{item?.user_specifications}</TableCell>
                  <TableCell><Link href={item?.attachment?.url ?? ""} target='blank'>{item?.attachment?.file_name}</Link></TableCell>
                  <TableCell><div className='flex gap-4 justify-center items-center'>
                    {/* <PencilIcon className='cursor-pointer' onClick={() => { handleEdit(item, index) }} /> */}
                    <Trash2 className={`text-red-400 cursor-pointer ${PRInquiryData?.is_submited?"hidden":""}`} onClick={()=>{deleteProductItem(item?.name ?? "")}}/>
                  </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className={`flex justify-end pr-4 ${refno?"":"hidden"}`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={() => { handleSubmit() }}>Submit</Button></div>
    </div>
    </>
  )
}

export default PRInquiryForm