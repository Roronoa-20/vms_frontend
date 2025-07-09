"use client"
import React, { useState, useEffect, useCallback } from 'react'
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
import { validateRequiredFields } from '@/src/app/utils/pr-validate'

interface Props {
  Dropdown: PurchaseRequestDropdown["message"]
  PRData: PurchaseRequestData["message"]["data"] | null
  cartId?: string
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
  name?: string | number
}

type formData = {
  purchase_requisition_type: string,
  company: string,
  plant: string,
  requisitioner: string,
  company_code_area: string,
  purchase_requisition_form_table: TableData[]
  purchase_group: string
}


const PRRequestForm = ({ Dropdown, PRData, cartId }: Props) => {
  const user = Cookies.get("user_id");
  const [formData, setFormData] = useState<formData | null>(PRData ? { ...PRData, requisitioner: PRData?.requisitioner ?? user } : null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRData ? PRData?.purchase_requisition_form_table : []);
  const [filterDropdown, setFilterDropdown] = useState<TableData | null>(null);
  const [requiredField, setRequiredField] = useState(null);
  const [index, setIndex] = useState<number>(-1)
  const [errors, setErrors] = useState<Record<string, string>>({});
  // const handleSelectChange = (value: any, name: string, isTable: boolean) => {
  //   if (isTable) {
  //     setSingleTableRow((prev: any) => ({ ...prev, [name]: value }));
  //   } else {
  //     setFormData((prev: any) => ({ ...prev, [name]: value }))
  //   }
  // };

  // const handleFieldChange = (isTable: boolean, e: React.ChangeEvent<
  //   HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  // >) => {
  //   const { name, value } = e.target;
  //   if (isTable) {
  //     setSingleTableRow((prev: any) => ({ ...prev, [name]: value }))
  //   } else {
  //     setFormData((prev: any) => ({ ...prev, [name]: value }));
  //   }
  // }


  const handleFieldChange = useCallback(
    (
      isTable: boolean,
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      if (isTable) {
        setSingleTableRow((prev) => ({ ...prev, [name]: value }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error for the field
      if (value.trim() !== "") {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    []
  );

  const handleSelectChange = useCallback(
    (value: any, name: string, isTable: boolean) => {
      if (isTable) {
        setSingleTableRow((prev) => ({ ...prev, [name]: value }));
      } else {
        setSingleTableRow((prev) => ({ ...prev, [name]: value }));
        setFormData((prev) => ({ ...prev, [name]: value }));
      }

      // Clear error for the field
      if (value !== "") {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    []
  );

  const handleTableAdd = () => {
    setSingleTableRow(prev => ({
      ...prev,
      requisitioner: formData?.requisitioner || ''
    }))
    if (!singleTableRow) return;
    const result = validateRequiredFields(singleTableRow, requiredField);
    setErrors(result.errors);
    if (result.isValid) {
      setTableData(prev => {
        const rows = [...prev];
        if (index !== -1) {
          // Editing existing row
          rows[index] = { ...singleTableRow };
        } else {
          // Adding new row
          rows.push({ ...singleTableRow });
        }
        return rows;
      });
      // Clear form
      setSingleTableRow(null);
      setIndex(-1);
    }
  };


  const handleEdit = (data: TableData, index: number) => {
    setIndex(index);
    setSingleTableRow({ ...data });
    // handleTableAdd(index);
  }
  const handleCompanyChange = async (value: string) => {
    console.log(value, "value in api")
    try {
      const Data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.handle_req_field_pr.filter_master_field?company=${value}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );
      if (Data.ok) {
        const data = await Data.json();
        setFilterDropdown(data?.message)
        console.log(data, "datadatadatadatadatadata  response")
      }

    } catch (error) {
      console.log(error, "something went wrong");
    }
  }

  const handleSubmit = async () => {
    const url = API_END_POINTS?.submitPR;
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { ...formData, requisitioner: user, purchase_requisition_form_table: tableData, cart_details_id: cartId } }, method: "POST" });
    if (response?.status == 200) {
      setFormData(null);
      alert("submission successfull");
    } else {
      alert("error");
    }
  }
  const fetchRequiredData = async (company: string, pur_type: string, acct_cate: string) => {
    console.log(company, pur_type, acct_cate)
    try {
      const Data = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.handle_req_field_pr.filter_req_fields?company=${company}&pur_type=${pur_type}&acct_cate=${acct_cate}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        }
      );
      if (Data.ok) {
        const data = await Data.json();
        setRequiredField(data?.message)
        console.log(data, "data in required")
      }
    } catch (error) {
      console.log(error, "something went wrong");
    }
  };
  useEffect(() => {
    fetchRequiredData(formData?.company, formData?.purchase_requisition_type, singleTableRow?.account_assignment_category);
  }, [formData?.company, formData?.purchase_requisition_type, singleTableRow?.account_assignment_category])

  console.log(filterDropdown, requiredField, "filterDropdown , requiredField")
  console.log(errors, "errors")
  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Purchase Request
      </h1>
      {/* <h1 className="pl-5">Contact Person</h1> */}
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Request Type <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "purchase_requisition_type", false) }} value={formData?.purchase_requisition_type ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_requisition_type?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select value={formData?.company ?? ""} onValueChange={(value) => { handleSelectChange(value, "company", false); handleCompanyChange(value) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Plant <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant", false) }}>
            <SelectTrigger className={`${errors?.plant
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.plant?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Requisitioner <span className="text-red-600 ml-1">*</span></h1>
          <Input placeholder="" name='requisitioner' onChange={(e) => { handleFieldChange(false, e) }} value={formData?.requisitioner ?? user ?? ""} disabled />
        </div>
        {/* <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Code Area
          </h1>
          <Select value={formData?.company_code_area ?? ""} onValueChange={(value) => { handleSelectChange(value, "company_code_area", false) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.company_code_area?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div> */}
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "purchase_group", false) }} value={formData?.purchase_group ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.purchase_group?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">Cart Id</h1>
          <Input placeholder="" name='requisitioner' defaultValue={cartId ?? ""} disabled />
        </div>
      </div>
      <h1 className="pl-5">Purchase Request Items</h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Item Number of Purchase Requisition
          </h1>
          <Input placeholder="" name='item_number_of_purchase_requisition' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.item_number_of_purchase_requisition ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Requisition Date
          </h1>
          <Input placeholder="" name='purchase_requisition_date' onChange={(e) => { handleFieldChange(true, e) }} type="date" value={singleTableRow?.purchase_requisition_date ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Assignment Category <span className="text-red-600 ml-1">*</span>
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "account_assignment_category", true) }} value={singleTableRow?.account_assignment_category ?? ""}>
            <SelectTrigger className={`${errors?.account_assignment_category
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger >
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.account_assignment_category?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Store Location {errors?.store_location && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.store_location ? "border-red-600" : "border-neutral-200"}`} placeholder="" name='store_location' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.store_location ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Delivery Date {errors?.delivery_date && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.delivery_date ? "border-red-600" : "border-neutral-200"}`} placeholder="" type="date" name='delivery_date' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.delivery_date ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Item Category {errors?.item_category && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "item_category", true) }} value={singleTableRow?.item_category ?? ""}>
            <SelectTrigger className={`${errors?.item_category
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.item_category_master?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Material Group {errors?.material_group && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "material_group", true) }} value={singleTableRow?.material_group ?? ""}>
            <SelectTrigger className={`${errors?.material_group
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.material_group_master?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            UOM {errors?.uom && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "uom", true) }} value={singleTableRow?.uom ?? ""}>
            <SelectTrigger className={`${errors?.uom
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.uom_master?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Cost Center {errors?.cost_center && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "cost_center", true) }} value={singleTableRow?.cost_center ?? ""}>
            <SelectTrigger className={`${errors?.cost_center
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.cost_center?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Main Asset No {errors?.main_asset_no && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.main_asset_no ? "border-red-600" : "border-neutral-200"}`} placeholder="" name='main_asset_no' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.main_asset_no ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Asset Subnumber {errors?.asset_subnumber && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.asset_subnumber ? "border-red-600" : "border-neutral-200"}`} placeholder="" name='asset_subnumber' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.asset_subnumber ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Profit Center {errors?.profit_ctr && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "profit_ctr", true) }} value={singleTableRow?.profit_ctr ?? ""}>
            <SelectTrigger className={`${errors?.profit_ctr
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.profit_center?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Description {errors?.short_text && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.short_text ? "border-red-600" : "border-neutral-200"}`}
            placeholder="" name='short_text' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.short_text ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Quantity {errors?.quantity && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.quantity ? "border-red-600" : "border-neutral-200"}`}
            placeholder="" name='quantity' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.quantity ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Price Of Purchase Requisition {errors?.price_of_purchase_requisition && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Input className={`${errors?.price_of_purchase_requisition ? "border-red-600" : "border-neutral-200"}`} placeholder="" name='price_of_purchase_requisition' onChange={(e) => { handleFieldChange(true, e) }} value={singleTableRow?.price_of_purchase_requisition ?? ""} />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            GL Account Number {errors?.gl_account_number && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "gl_account_number", true) }} value={singleTableRow?.gl_account_number ?? ""}>
            <SelectTrigger className={`${errors?.gl_account_number
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.gl_account_number?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Material Code {errors?.material_code && <span className="text-red-600 ml-1">*</span>}
          </h1>
          <Select onValueChange={(value) => { handleSelectChange(value, "material_code", true) }} value={singleTableRow?.material_code ?? ""}>
            <SelectTrigger className={`${errors?.material_code
              ? `border border-red-600`
              : ``
              }`}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  Dropdown?.material_code?.map((item, index) => (
                    <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

      </div>
      <div className={`flex justify-end pb-4`}>
        <Button className="bg-blue-400 hover:bg-blue-400" onClick={() => handleTableAdd()}>Add</Button>
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
                <TableCell className="font-medium">{index + 1}</TableCell>
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
                  <EyeIcon className='cursor-pointer' onClick={() => { handleEdit(item, index) }} />
                </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={`flex justify-end pr-4`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={() => { handleSubmit() }}>Submit</Button></div>
    </div>
  )
}

export default PRRequestForm