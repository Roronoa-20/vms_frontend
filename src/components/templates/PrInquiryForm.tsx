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
import Cookies from 'js-cookie'
import { purchaseInquiryDropdown, TableData, TPRInquiry } from '../pages/Pr-Inquiry';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XIcon } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import MultiSelect, { GroupBase, MultiValue } from "react-select";
import { multiSelectStyles } from "@/src/components/common/sharedStyles";



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

type OptionType = {
  value: string;
  label: string;
};

const currentDate = new Date();

const PRInquiryForm = ({ PRInquiryData, dropdown, companyDropdown, purchaseTypeDropdown }: Props) => {
  const user = Cookies.get("user_id");
  console.log(PRInquiryData, "__________-");

  const [formData, setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [isDialog, setIsDialog] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(-1);
  const [showTable, setShowTable] = useState(PRInquiryData?.cart_product.length && PRInquiryData?.cart_product.length > 0 ? true : false);
  const [plantDropdown, setPlantDropdown] = useState<{ name: string, plant_name: string, description: string }[]>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<{ name: string, purchase_group_code: string, purchase_group_name: string, description: string }[]>();
  const [costCenterDropdown, setCostCenterDropdown] = useState<readonly (string | GroupBase<string>)[]>([]);
  const [glAccountDropdown, setGLAccountDropdown] = useState<readonly (string | GroupBase<string>)[]>([]);

  const [toEmail, setToEmail] = useState<string>("");
  const router = useRouter();
  const param = useSearchParams();
  const refno = param.get("cart_Id");

  const fileUploadRef = useRef<HTMLInputElement>(null);

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
  console.log(formData,"this is form data")
  const requiredTableFields = {
    product_name: "Please Select Product",
    uom: "Please Select UOM",
    product_quantity: "Please Enter Product Quantity",
    user_specifications: "Please Enter User Specification"
  }

  const handleTableAdd = async () => {
    for (const [key, message] of Object.entries(requiredTableFields)) {
      if (!singleTableRow?.[key as keyof TableData]) {
        alert(message);
        return;
      }
    }

    if (!singleTableRow) return;

    const formdata = new FormData();
    for (const key of Object.keys(singleTableRow) as (keyof TableData)[]) {
      const value = singleTableRow[key];
      if (typeof (value) == "string") {
        formdata.append(key, value);
      }
    }
    formdata.append("attachment", singleTableRow?.file);
    formdata.append("purchase_inquiry_id", refno as string);
    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.addProductInquiryProducts, method: "POST", data: formdata });
    if (response?.status == 200) {
      toast.success("Product Details Added Successfully!!!");
      location.reload();
    }

    setSingleTableRow(null);
    setIndex(-1);
  };

  const handleEdit = (data: TableData, index: number) => {
    setIndex(index);
    setSingleTableRow({ ...data });
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    router.push("/dashboard");
  };

  const handleSubmit = async () => {
    if (!tableData || tableData.length === 0) {
      alert("Please add at least 1 Product Item before submitting.");
      return;
    }
    const url = API_END_POINTS?.submitPrInquiry;
    const payload = {
      ...formData,
      cart_date: formData?.cart_date ?? formatDateISO(new Date()),
      cart_product: tableData,
      user: user,
    };

    let assetCodeLine = 0;

    if (PRInquiryData?.asked_to_modify) {
      for (let i = 0; i < tableData.length; i++) {
        const item = tableData[i];
        if (item?.need_asset_code && !item?.assest_code) {
          assetCodeLine = i + 1; // Line number is usually 1-based
          break;
        }
      }
    }

    if (assetCodeLine !== 0) {
      alert(`Please enter Asset Code for line ${assetCodeLine}`);
      return;
    }


    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: payload }, method: "POST", params: { purchase_inquiry_id: refno } });
    if (response?.status == 200) {
      setFormData(null);
      setSuccessMessage("Product Enquiry Submitted Successfully!");
      setShowSuccessModal(true);
    } else {
      alert("Error while submitting. Try again!");
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


  const handleCompanyChange = async (value: string) => {
    const url = `${API_END_POINTS?.InquiryDropdownsBasedOnCompany}?comp=${value}`
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPlantDropdown(response?.data?.message?.plants?.data);
      setPurchaseGroupDropdown(response?.data?.message?.purchase_groups?.data);
      console.log(response?.data?.message?.purchase_groups?.data,"jdjfdjfjdhfj")
      // setCostCenterDropdown(response?.data?.message?.cost_centers?.data);
      // setGLAccountDropdown(response?.data?.message?.gl_accounts?.data);

      console.log(response?.data?.message?.cost_centers?.data,"this is cost center")

      setCostCenterDropdown(
        response?.data?.message?.cost_centers?.data?.map((item:any) => ({
          label: item?.cost_center_code+item?.cost_center_name,
          value: item?.name,
        }))
      );

      setGLAccountDropdown(
        response?.data?.message?.gl_accounts?.data?.map((item:any) => ({
          label: item?.description,
          value: item?.name,
        }))
      );

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

  let requiredFields: { [key: string]: string } = {
    cart_use: "Please Select Cart Use",
    category_type: "Please Select Category Type",
    company: "Please Select Company",
    purchase_type: "Please Select Purchase Type",
    plant: "Please Select Plant",
    purchase_group: "Please Select Purchase Group",
    cost_center: "Please Select Cost Center",
    gl_account: "Please Select GL Account"
  };


  const handleNext = async () => {

    //validation
    // if(formData?.purchase_type == "SB"){
    //   requiredFields.cost_center = "Please Select Cost Center";
    //   requiredFields.gl_account = "Please Select GL Account";
    // }

    for (const [key, message] of Object.entries(requiredFields)) {
      if (!formData?.[key as keyof TPRInquiry]) {
        alert(message);
        return;
      }
    }

    const updatedData = {...formData,gl_account:formData?.gl_account?.value,cost_center:formData?.cost_center?.value}

    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.submitPrInquiryNextButton, data: { data: { ...updatedData, cart_date: formData?.cart_date ?? formatDateISO(new Date()), user: user, } }, method: "POST" });
    if (response?.status == 200) {
      router.push(`/pr-inquiry?cart_Id=${response?.data?.message?.name}`);
    }
  }

  const deleteProductItem = async (row_id: string) => {
    const respone: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.deleteInquiryProductItem, method: "GET", params: { purchase_inquiry_id: refno, row_name: row_id } });
    if (respone?.status == 200) {
      alert("Product Item Deleted Successfully!!!");
      // router.push(`pr-inquiry?cart_Id=${refno}`);
      location.reload();
    }
  };

  // const handleNumberInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
  //   if (allowedKeys.includes(e.key)) return;
  //   if (e.key === ".") {
  //     if (e.currentTarget.value.includes(".")) {
  //       e.preventDefault();
  //     }
  //     return;
  //   }
  //   if (!/^\d$/.test(e.key)) {
  //     e.preventDefault();
  //   }
  // };

  const handleFileDelete = () => {
    if (fileUploadRef?.current) {
      fileUploadRef.current.value = "";
      setSingleTableRow((prev: any) => ({ ...prev, file: null }));
    }
    return;
  };


  return (
    <>
      <div className="flex flex-col bg-white rounded-lg px-2 pb-2 max-h-[80vh] w-full">
        {/* <h1 className="border-b-2 border-gray-400 top-0 bg-white text-[#000000] text-lg">
        Purchase Inquiry
      </h1> */}
        <div className="grid grid-cols-3 gap-6 p-3">
          {/* <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">User</h1>
            <Input placeholder="" name='user' onChange={(e) => { handleFieldChange(false, e) }} value={formData?.user ?? user ?? ""} disabled />
          </div> */}
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Cart Use <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.cart_use ?? ""} onValueChange={(value) => { handleSelectChange(value, "cart_use", false) }} disabled={refno ? true : false}>
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
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">Cart Date <span className='text-red-400 text-[20px]'>*</span></h1>
            <Input type="text" name="cart_date" value={formData?.cart_date ? parseAndFormatDate(formData.cart_date) : formatDate(new Date())} readOnly />
          </div>
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Category Type <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.category_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "category_type", false); fetchProductName(value) }} disabled={refno ? true : false}>
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
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Company <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.company ?? ""} onValueChange={(value) => { handleSelectChange(value, "company", false); handleCompanyChange(value); }} disabled={refno ? true : false}>
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
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Purchase Type <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.purchase_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_type", false) }} disabled={refno ? true : false}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {purchaseTypeDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}-{item?.description}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Plant <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant", false) }} disabled={refno ? true : false}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {plantDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.plant_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Purchase Group <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            <Select value={formData?.purchase_group ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_group", false) }} disabled={refno ? true : false}>
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
          {/* Cost Center */}
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              Cost Center <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            {/* <Select
              value={formData?.cost_center ?? ""}
              onValueChange={(value) => handleSelectChange(value, "cost_center", false)}
              disabled={refno ? true : false}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {costCenterDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.cost_center_code}-{item?.cost_center_name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <MultiSelect
              onChange={(value)=>{handleSelectChange(value, "cost_center", false)}}
              instanceId="multiselect"
              options={costCenterDropdown}
              value={formData?.cost_center}
              className="text-[12px] text-black"
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              styles={multiSelectStyles}
            />
          </div>

          {/* G/L Account */}
          <div className="col-span-1">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              G/L Account <span className='text-red-400 text-[20px]'>*</span>
            </h1>
            {/* <Select
              value={formData?.gl_account ?? ""}
              onValueChange={(value) => handleSelectChange(value, "gl_account", false)}
              disabled={refno ? true : false}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {glAccountDropdown?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
            <MultiSelect
              onChange={(value)=>{handleSelectChange(value, "gl_account", false)}}
              instanceId="multiselect2"
              options={glAccountDropdown}
              value={formData?.gl_account}
              className="text-[12px] text-black"
              menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
              styles={multiSelectStyles}
            />
          </div>
          <div className='col-span-1 flex items-end gap-4'>
            <Button className={`py-1.5 ${refno ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={(e) => { handleNext() }}>Next</Button>
          </div>
        </div>
        {refno &&
          <>
            <h1 className="border-b-2 border-gray-400 font-bold text-[18px] p-1">
              Purchase Inquiry Items
            </h1>
            <div className="grid grid-cols-3 gap-6 p-3">
              {/* <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-3">
            Assest Code
          </h1>
          <Input placeholder="" name='assest_code' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.assest_code ?? ""} />
        </div> */}
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Product Name <span className='text-red-400 text-[20px]'>*</span>
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
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Product Price Range <span className='text-red-400 text-[20px]'>*</span>
                </h1>
                <Input placeholder="" disabled name='product_price' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.product_price ?? ""}
                />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Lead Time <span className='text-red-400 text-[20px]'>*</span>
                </h1>
                <Input placeholder="" disabled name='lead_time' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.lead_time ?? ""} />
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  UOM <span className='text-red-400 text-[20px]'>*</span>
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
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Product Quantity <span className='text-red-400 text-[20px]'>*</span>
                </h1>
                <Input placeholder="" name='product_quantity' type='number' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.product_quantity ?? ""} />
                {/* <Input placeholder="" name='product_quantity' onChange={(e) => { handleFieldChange(true, e) }} onKeyDown={handleNumberInputKeyDown} inputMode="decimal" value={singleTableRow?.product_quantity ?? ""} /> */}
              </div>
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  User Specification <span className='text-red-400 text-[20px]'>*</span>
                </h1>
                <Input placeholder="" name='user_specifications' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.user_specifications ?? ""} />
              </div>
              {/* <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Attachment
                </h1>
                {!singleTableRow?.file && (
                  <Input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSingleTableRow((prev: any) => ({ ...prev, file }));
                      }
                    }}
                  />
                )}

                {singleTableRow?.file && (
                  <div className="flex items-center gap-3 border p-2 rounded-md bg-gray-50">
                    <span className="text-sm">{singleTableRow.file.name}</span>

                    <XIcon
                      size={20}
                      className="text-red-500 cursor-pointer hover:text-red-700 transition"
                      onClick={() => {
                        setSingleTableRow((prev: any) => ({
                          ...prev,
                          file: null,
                        }));
                      }}
                    />
                  </div>
                )}
              </div> */}
              <div className="col-span-1">
                <h1 className="text-[14px] font-normal text-[#000000] pb-2">
                  Attachment
                </h1>
                <div className='flex gap-3 items-center'>
                  <Input ref={fileUploadRef} type='file' onChange={(e) => { setSingleTableRow((prev: any) => ({ ...prev, file: e.target?.files?.[0] })) }} />
                  <XIcon className={`text-red-400 ${singleTableRow?.file ? "" : "hidden"} hover:cursor-pointer`} onClick={() => { handleFileDelete() }} />
                </div>
              </div>
              {
                <div className="col-span-1 mt-8">
                  <Button className={`py-1.5 ${PRInquiryData?.asked_to_modify && PRInquiryData?.is_submited ? "" : "hidden"}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => handleTableAdd()}>Add</Button>
                  <Button className={`py-1.5 ${PRInquiryData?.is_submited ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={() => handleTableAdd()}>Add</Button>
                </div>
              }
            </div>
          </>
        }
        {PRInquiryData && PRInquiryData?.cart_product?.length > 0 && (
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
                  <TableHead className="text-center">Product Name</TableHead>
                  <TableHead className="text-center">Assest Code</TableHead>
                  <TableHead className="text-center">Product Price</TableHead>
                  <TableHead className="text-center">UOM</TableHead>
                  <TableHead className="text-center">Lead Time</TableHead>
                  <TableHead className="text-center">Product Quantity</TableHead>
                  <TableHead className="text-center">User Specification</TableHead>
                  <TableHead className="text-center">Attachment</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                  <TableHead className="text-center">Edit</TableHead>
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
                      <Trash2 className={`text-red-400 cursor-pointer ${PRInquiryData?.is_submited ? "hidden" : ""}`} onClick={() => { deleteProductItem(item?.name ?? "") }} />
                    </div>
                    </TableCell>
                    <TableCell>
                      {(PRInquiryData?.asked_to_modify || !PRInquiryData?.is_submited) ? (
                        <PencilIcon
                          className="cursor-pointer"
                          onClick={() => handleEdit(item, index)}
                        />
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className={`flex justify-end pr-2 mt-4 pb-4 ${refno ? "" : "hidden"}`}><Button className='py-2.5' variant={"nextbtn"} size={"nextbtnsize"} onClick={() => { handleSubmit() }} disabled={tableData.length === 0}>Submit</Button></div>

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
                  onClick={handleSuccessOk}
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