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
import Comment_box from '../molecules/CommentBox'
import { Value } from '@radix-ui/react-select'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/src/context/AuthContext'

interface Props {
  Dropdown?: PurchaseRequestDropdown["message"]
  PRData?: PurchaseRequestData["message"]["data"]
  dropdown: purchaseInquiryDropdown["message"]
  PRInquiryData: TPRInquiry | null
  refno?: string
}


type ProductNameDropdown = {
  name: string,
  product_name: string
}
const currentDate = new Date();

const PRInquiryForm = ({ PRInquiryData, dropdown, refno }: Props) => {
  const user = Cookies.get("user_id");
  const [formData, setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [index, setIndex] = useState<number>(-1)
  const [isApproved, setIsApproved] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isDialog, setIsDialog] = useState(false);
  const [comment, setComment] = useState<string>("")
  const router = useRouter();
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
  };

  let url = "";
  if (PRInquiryData?.hod) {
    url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.purchase_inquiry_approvals.hod_approval_check`
  } else if (PRInquiryData?.purchase_team) {
    url = `${process.env.NEXT_PUBLIC_BACKEND_END}/api/method/vms.APIs.purchase_api.purchase_inquiry_approvals.purchase_approval_check`
  }

  const handleApproval = async () => {
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { cart_id: refno, approve: isApproved, reject: isReject, user: user, comments: comment } }, method: "POST" });
    if (response?.status == 200) {
      setComment("");
      setIsApproved(false);
      setIsReject(false);
      router.push("/dashboard");

      if (isReject) {
        alert("Rejected Successfully");
      } else if (isApproved) {
        alert("Approved Successfully");
      } else {
        alert("Action completed successfully");
      }
    } else {
      alert("Something went wrong");
    }
  };

  const fetchProductName = async (value: string) => {
    const fetchProductNameUrl = API_END_POINTS?.fetchProductNameBasedOnCategory;
    const response: AxiosResponse = await requestWrapper({ url: fetchProductNameUrl, params: { category_type: value } });
    if (response?.status == 200) {
      setProductNameDropdown(response?.data?.message?.data);
    }
  }

  const handleClose = () => {
    setIsDialog(false);
  }

  const handleComment = (value: string) => {
    setComment(value)
  }

  const { designation } = useAuth()

  return (
    <div className="flex flex-col bg-white rounded-lg px-4 pb-4 max-h-[80vh] overflow-y-scroll w-full">
      <h1 className="border-b-2 pb-2 mb-4 sticky top-0 bg-white py-4 text-lg">
        Purchase Inquiry
      </h1>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">User</h1>
          <Input placeholder="" name='user' onChange={(e) => {handleFieldChange(false, e) }} value={formData?.user ?? user ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Cart Use
          </h1>
          <Select value={formData?.cart_use ?? ""} onValueChange={(value) => {handleSelectChange(value, "cart_use", false) }}>
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
          <Input placeholder="" name='cart_date' onChange={(e) => {handleFieldChange(false, e) }} value={formData?.cart_date ?? currentDate?.toLocaleDateString() ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Category Type
          </h1>
          <Select value={formData?.category_type ?? ""} onValueChange={(value) => {handleSelectChange(value, "category_type", false); fetchProductName(value) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {dropdown?.category_type?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.category_name}</SelectItem>
                ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <h1 className="pl-5">Purchase Inquiry Items</h1>
      <div className="shadow- bg-[#f6f6f7] mb-4 p-4 rounded-2xl">
        <Table className=" max-h-40 overflow-y-scroll">
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
            </TableRow>
          </TableHeader>
          <TableBody className="text-center">
            {tableData?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.assest_code}</TableCell>
                <TableCell>{item?.product_name}</TableCell>
                <TableCell>{item?.product_price}</TableCell>
                <TableCell>{item?.uom}</TableCell>
                <TableCell>{item?.lead_time}</TableCell>
                <TableCell>{item?.product_quantity}</TableCell>
                <TableCell>{item?.user_specifications}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className={`flex justify-end pr-4 gap-4 ${designation != "Enquirer" ? "" : "hidden"}`}><Button className='bg-blue-400 hover:bg-blue-400' onClick={() => {setIsApproved(true); setIsDialog(true) }}>Approve</Button>
        <Button className={`bg-blue-400 hover:bg-blue-400 ${designation != "Enquirer" ? "" : "hidden"}`} onClick={() => {setIsReject(true); setIsDialog(true) }}>Reject</Button></div>
      {isDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
          <Comment_box handleClose={handleClose} Submitbutton={handleApproval} handleComment={handleComment} />
        </div>
      }
    </div>

  )
}

export default PRInquiryForm