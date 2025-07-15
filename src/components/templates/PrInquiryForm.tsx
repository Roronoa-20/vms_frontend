"use client"
import React, { useEffect, useState } from 'react'
import { Input } from '../atoms/input'
import { Button } from '../atoms/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../atoms/select'
import { PurchaseRequestData, PurchaseRequestDropdown } from '@/src/types/PurchaseRequestType'
import { EyeIcon } from 'lucide-react';
import { PencilIcon } from 'lucide-react'
import API_END_POINTS from '@/src/services/apiEndPoints'
import { AxiosResponse } from 'axios'
import requestWrapper from '@/src/services/apiCall'
import Cookies from 'js-cookie'
import { purchaseInquiryDropdown, TableData, TPRInquiry } from '../pages/Pr-Inquiry';
import { useRouter } from 'next/navigation'


interface Props {
  Dropdown?: PurchaseRequestDropdown["message"]
  PRData?: PurchaseRequestData["message"]["data"]
  dropdown: purchaseInquiryDropdown["message"]
  PRInquiryData: TPRInquiry | null
  companyDropdown:{name:string,description:string}[]
  purchaseTypeDropdown:{name:string,purchase_requisition_type_name:string,description:string}[]
}


type ProductNameDropdown = {
  name: string,
  product_name: string,
  product_price: string,
  lead_time: string,
}
const currentDate = new Date();

const PRInquiryForm = ({ PRInquiryData, dropdown,companyDropdown, purchaseTypeDropdown }: Props) => {
  const user = Cookies.get("user_id");
  const [formData, setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [index, setIndex] = useState<number>(-1);
  const [showTable, setShowTable] = useState(PRInquiryData?.cart_product.length && PRInquiryData?.cart_product.length > 0?true:false);
  const [plantDropdown,setPlantDropdown] = useState<{name:string,plant_name:string,description:string}[]>();
  const [purchaseGroupDropdown,setPurchaseGroupDropdown] = useState<{name:string,purchase_group_code:string,purchase_group_name:string,description:string}[]>();
  const router = useRouter();

  useEffect(()=>{
    if(PRInquiryData?.company){
      handleCompanyChange(PRInquiryData?.company);
    }
  },[])


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

  const handleTableAdd = () => {
    if (!singleTableRow) return;

    setTableData(prev => {
      const rows = [...prev];
      if (index !== -1) {
        rows[index] = { ...singleTableRow };
      } else {
        rows.push({ ...singleTableRow });
      }
      return rows;
    });
    setShowTable(true);
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
    
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: payload }, method: "POST" });
    if (response?.status == 200) {
      setFormData(null);
      router.push("/dashboard");
      alert("submission successfull");
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


  const handleCompanyChange = async(value:string)=>{
    const url = `${API_END_POINTS?.InquiryDropdownsBasedOnCompany}?comp=${value}`
    const response:AxiosResponse = await  requestWrapper({url:url,method:"GET"});
    if(response?.status == 200){
      setPlantDropdown(response?.data?.message?.plants);
      setPurchaseGroupDropdown(response?.data?.message?.purchase_groups);
    }
  }



  return (
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
          <Select value={formData?.cart_use ?? ""} onValueChange={(value) => { handleSelectChange(value, "cart_use", false) }}>
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
          <Select value={formData?.category_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "category_type", false); fetchProductName(value) }}>
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
          <Select value={formData?.company ?? ""} onValueChange={(value) => { handleSelectChange(value, "company", false); handleCompanyChange(value);}}>
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
          <Select value={formData?.purchase_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_type", false)}}>
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
        {/* <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Plant
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant", false)}}>
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
        </div> */}
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Purchase Group
          </h1>
          <Select value={formData?.purchase_group ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_group", false)}}>
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
      </div>
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
            onValueChange={(value) => {
              handleSelectChange(value, "product_name", true);

              const selectedProduct = productNameDropdown.find((item) => item.name === value);

              if (selectedProduct) {
                setSingleTableRow(prev => ({
                  ...prev,
                  product_name: selectedProduct.name ?? "",
                  product_price: selectedProduct.product_price ?? "",
                  lead_time: selectedProduct.lead_time ?? "",
                  assest_code: prev?.assest_code ?? "",
                  uom: prev?.uom ?? "",
                  product_quantity: prev?.product_quantity ?? "",
                  user_specifications: prev?.user_specifications ?? ""
                }));
              }
            }}
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
            Product Price
          </h1>
          <Input placeholder="" name='product_price' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.product_price ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Lead Time
          </h1>
          <Input placeholder="" name='lead_time' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.lead_time ?? ""} />
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
                  <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
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
        <div className="col-span-1 mt-8">
          <Button className="bg-blue-400 hover:bg-blue-400" onClick={() => handleTableAdd()}>Add</Button>
        </div>
      </div>
      {showTable && (
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
                {/* <TableHead className="text-center">Assest Code</TableHead> */}
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
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  {/* <TableCell>{item?.assest_code}</TableCell> */}
                  <TableCell>{item?.product_name}</TableCell>
                  <TableCell>{item?.product_price}</TableCell>
                  <TableCell>{item?.uom}</TableCell>
                  <TableCell>{item?.lead_time}</TableCell>
                  <TableCell>{item?.product_quantity}</TableCell>
                  <TableCell>{item?.user_specifications}</TableCell>
                  <TableCell><div className='flex gap-4 justify-center items-center'>
                    <PencilIcon className='cursor-pointer' onClick={() => { handleEdit(item, index) }} />
                  </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className={`flex justify-end pr-4`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={() => { handleSubmit() }}>Submit</Button></div>
    </div>
  )
}

export default PRInquiryForm