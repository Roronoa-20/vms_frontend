"use client"
import React, { useEffect, useRef, useState } from 'react'
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
import { TvendorRegistrationDropdown } from '@/src/types/types'
import Link from 'next/link'
import PopUp from '../molecules/PopUp'

interface Props {
  Dropdown?: PurchaseRequestDropdown["message"]
  PRData?: PurchaseRequestData["message"]["data"]
  dropdown: purchaseInquiryDropdown["message"]
  PRInquiryData: TPRInquiry | null
  refno?: string
  companyDropdown: { name: string, description: string }[]
  purchaseTypeDropdown: { name: string, purchase_requisition_type_name: string, description: string }[]
  AllcompanyDropdown: TvendorRegistrationDropdown["message"]["data"]["company_master"]
}


type ProductNameDropdown = {
  name: string,
  product_name: string
}
const currentDate = new Date();

const PRInquiryForm = ({ PRInquiryData, dropdown, refno, companyDropdown, purchaseTypeDropdown, AllcompanyDropdown }: Props) => {
  const user = Cookies.get("user_id");
  const [formData, setFormData] = useState<TPRInquiry | null>(PRInquiryData ?? null);
  const [singleTableRow, setSingleTableRow] = useState<TableData | null>(null);
  const [tableData, setTableData] = useState<TableData[]>(PRInquiryData?.cart_product ?? []);
  const [productNameDropdown, setProductNameDropdown] = useState<ProductNameDropdown[]>([]);
  const [index, setIndex] = useState<number>(-1)
  const [isApproved, setIsApproved] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isDialog, setIsDialog] = useState(false);
  const [isAcknowledgeDialog, setIsAcknowledgeDialog] = useState(false);
  const [comment, setComment] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const [isModifyDialog, setIsModifyDialog] = useState<boolean>(false);
  const [plantDropdown, setPlantDropdown] = useState<{ name: string, plant_name: string, description: string }[]>();
  const [purchaseGroupDropdown, setPurchaseGroupDropdown] = useState<{ name: string, purchase_group_code: string, purchase_group_name: string, description: string }[]>();
  const [costCenterDropdown, setCostCenterDropdown] = useState<{ name: string, cost_center_code: string, cost_center_name: string, description: string }[]>([]);
  const [glAccountDropdown, setGLAccountDropdown] = useState<{ name: string, gl_account_code: string, gl_account_name: string, description: string }[]>([]);
  const [toEmail, setToEmail] = useState<string>("");
  const [isEmailDialog, setIsEmailDialog] = useState<boolean>(false);
  const router = useRouter();

  const acknowledgeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (PRInquiryData?.company) {
      handleCompanyChange(PRInquiryData?.company);
    }

    if (PRInquiryData?.category_type) {
      fetchProductName(PRInquiryData?.category_type);
    }
  }, [])

  useEffect(() => {
    const needsAsset = tableData?.some(item => item?.need_asset_code && !item?.assest_code);

    if (acknowledgeButtonRef.current) {
      acknowledgeButtonRef.current.disabled = needsAsset;
    }
  }, [tableData]);



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
    const response: AxiosResponse = await requestWrapper({ url: url, data: { data: { cart_id: refno, approve: isApproved, reject: isReject, user: user, comments: comment, cart_product: tableData } }, method: "POST" });
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


  const handleModify = async () => {
    const url = API_END_POINTS?.PurchaseEnquiryModify;
    const updatedTable = tableData?.map((item, index) => {
      return { ...item, row_id: item?.name };
    });
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: { cart_id: refno, fields_to_modify: comment, cart_product: updatedTable } } });
    if (response?.status == 200) {
      alert("Modify Notification Sent Successfully");
      setComment("");
      setIsModifyDialog(false);
      location.reload();
    }
  }


  const handleAcknowledge = async () => {
    const url = API_END_POINTS?.PurchaseEnquiryAcknowledge;
    const response: AxiosResponse = await requestWrapper({ url: url, method: "POST", data: { data: { cart_id: refno, acknowledged_remarks: comment, acknowledged_date: date } } });
    if (response?.status == 200) {
      alert("Acknowledge Sent Successfully");
      setComment("");
      setIsAcknowledgeDialog(false);
      setDate("");
      location.reload();
    }
  }

  const fetchProductName = async (value: string) => {
    const fetchProductNameUrl = API_END_POINTS?.fetchProductNameBasedOnCategory;
    const response: AxiosResponse = await requestWrapper({ url: fetchProductNameUrl, params: { category_type: value } });
    if (response?.status == 200) {
      setProductNameDropdown(response?.data?.message?.data);
    }
  }

  const handleEmailClose = () => {
    setIsEmailDialog(false);
    setIsModifyDialog(false);
    setIsAcknowledgeDialog(false);
  }

  const handleComment = (value: string) => {
    setComment(value)
  }

  const { designation } = useAuth()

  const handleTableInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTableData((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], [name]: value };
      }
      return updated;
    });
  }

  // const handleTableCheck = (index: number, checked:boolean) => {
  //   setTableData((prev) => {
  //     const updated = [...prev];
  //     if (updated[index]) {
  //       updated[index] = { ...updated[index],isAssestCode: checked };
  //     }
  //     return updated;
  //   });
  // }

  const handleCompanyChange = async (value: string) => {
    const url = `${API_END_POINTS?.InquiryDropdownsBasedOnCompany}?comp=${value}`
    const response: AxiosResponse = await requestWrapper({ url: url, method: "GET" });
    if (response?.status == 200) {
      setPlantDropdown(response?.data?.message?.plants?.data);
      setPurchaseGroupDropdown(response?.data?.message?.purchase_groups?.data);
      setCostCenterDropdown(response?.data?.message?.cost_centers?.data);
      setGLAccountDropdown(response?.data?.message?.gl_accounts?.data);
    }
  }

  const handleTableCheckChange = (index: number, check: boolean) => {
    // const { name, value } = e.target;
    setTableData((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = { ...updated[index], need_asset_code: check };
      }
      return updated;
    });
  }

  const handleClose = () => {
    setIsDialog(false);
    setIsAcknowledgeDialog(false);
    setIsModifyDialog(false);
    setToEmail("");
  }

  const handleAddionalFlow = async () => {
    const response: AxiosResponse = await requestWrapper({ url: API_END_POINTS?.InquiryAddtionalApproval, method: "GET", params: { email_id: toEmail, purchase_enquiry_id: refno } });
    if (response?.status == 200) {
      alert("Added additional approval successfully");
      handleEmailClose();
    }
  }

  const today = new Date().toISOString().split("T")[0];

  console.log(PRInquiryData)
  console.log(productNameDropdown, "this is dropdown");

  return (
    <div className="flex flex-col bg-white rounded-lg p-2 max-h-[90vh] w-full">
      <h1 className="border-b-2 sticky top-0 bg-white text-lg font-semibold z-30">
        Purchase Enquiry
      </h1>
      <div className="grid grid-cols-3 gap-6 p-3">
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">User</h1>
          <Input placeholder="" name='user' onChange={(e) => { handleFieldChange(false, e) }} value={formData?.user ?? user ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Cart Use
          </h1>
          <Select disabled value={formData?.cart_use ?? ""} onValueChange={(value) => { handleSelectChange(value, "cart_use", false) }}>
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
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">Cart Date</h1>
          <Input placeholder="" name='cart_date' onChange={(e) => { handleFieldChange(false, e) }} value={formData?.cart_date ?? currentDate?.toLocaleDateString() ?? ""} disabled />
        </div>
        <div className="col-span-1">
          <h1 className="text-[12px] font-normal text-[#626973] pb-2">
            Category Type
          </h1>
          <Select disabled value={formData?.category_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "category_type", false); fetchProductName(value) }}>
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
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-2">
            Company
          </h1>
          <Select disabled value={formData?.company ?? ""} onValueChange={(value) => { handleSelectChange(value, "company", false); handleCompanyChange(value); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {designation == "Purchase Team" ? AllcompanyDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                )) : companyDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* <Input value={formData?.company ?? ""} disabled/> */}
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-2">
            Purchase Type
          </h1>
          <Select disabled value={formData?.purchase_type ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_type", false) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {purchaseTypeDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.purchase_requisition_type_name} - {item?.description}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-2">
            Plant
          </h1>
          <Select disabled value={formData?.plant ?? ""} onValueChange={(value) => { handleSelectChange(value, "plant", false) }}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {plantDropdown?.map((item, index) => (
                  <SelectItem key={index} value={item?.name}>{item?.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-2">
            Purchase Group
          </h1>
          <Select disabled value={formData?.purchase_group ?? ""} onValueChange={(value) => { handleSelectChange(value, "purchase_group", false) }}>
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
            Cost Center
          </h1>
          <Select
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
          </Select>
        </div>

        {/* G/L Account */}
        <div className="col-span-1">
          <h1 className="text-[14px] font-normal text-[#000000] pb-2">
            G/L Account
          </h1>
          <Select
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
          </Select>
        </div>
        {PRInquiryData?.acknowledged_date && (
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">Early Delivery Date</h1>
            <Input placeholder="" value={PRInquiryData?.acknowledged_date} disabled />
          </div>
        )}
        {
          PRInquiryData?.second_stage_approval_by &&
          <div className="col-span-1">
            <h1 className="text-[12px] font-normal text-[#626973] pb-2">Second Stage Approval Email</h1>
            <Input placeholder="" value={PRInquiryData?.second_stage_approval_by} disabled />
          </div>
        }
        {
          designation != "Enquirer" && PRInquiryData?.hod_approved && !PRInquiryData?.second_stage_approved ?
            <div className='flex items-end'>
              <Button className={`py-2.5 ${PRInquiryData?.purchase_requisition_form_created ? "hidden" : ""}`} variant={"nextbtn"} size={"nextbtnsize"} onClick={(e) => { setIsEmailDialog(true) }}>Additional Approval</Button>
            </div> :
            <div></div>
        }
      </div>
      <div className='pb-4'>
        <h1 className="border-b-2 sticky top-0 bg-white text-lg font-semibold z-30">
          Purchase Enquiry Items
        </h1>
        <div className="shadow- bg-[#f6f6f7] mt-4 p-4 rounded-2xl">
          <Table className="max-h-40">
            <TableHeader className="text-center">
              <TableRow className="bg-[#DDE8FE] text-[#2568EF] text-[14px] hover:bg-[#DDE8FE] text-center text-nowrap">
                <TableHead className="w-[100px]">Sr No.</TableHead>
                <TableHead className="text-center">Is Assest Code ?</TableHead>
                <TableHead className="text-center">Assest Code</TableHead>
                <TableHead className="text-center">Product Name</TableHead>
                <TableHead className="text-center">Product Price</TableHead>
                <TableHead className="text-center">UOM</TableHead>
                <TableHead className="text-center">Lead Time</TableHead>
                <TableHead className="text-center">Product Quantity</TableHead>
                <TableHead className="text-center">User Specification</TableHead>
                <TableHead className="text-center">Attachment</TableHead>
                <TableHead className="text-center">Final Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-center">
              {tableData?.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className={`flex justify-center`}><Input type='checkbox' onChange={(e) => { handleTableCheckChange(index, e.target.checked) }} disabled={(PRInquiryData?.purchase_team && item?.assest_code == "") ? false : true} checked={item?.need_asset_code} className='w-5' /></TableCell>
                  <TableCell className='text-center'>{item?.assest_code}</TableCell>
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
                  <TableCell>{item?.product_price}</TableCell>
                  <TableCell>{item?.uom}</TableCell>
                  <TableCell>{item?.lead_time}</TableCell>
                  <TableCell>{item?.product_quantity}</TableCell>
                  <TableCell>{item?.user_specifications}</TableCell>
                  <TableCell><Link href={item?.attachment?.url ?? ""}>{item?.attachment?.file_name}</Link></TableCell>
                  <TableCell className='flex justify-center'>
                    <Input disabled={PRInquiryData?.purchase_team_approved == Boolean(0) && PRInquiryData?.purchase_team == Boolean(1) ? false : true} value={tableData[index]?.final_price_by_purchase_team ?? 0} name='final_price_by_purchase_team' onChange={(e) => { handleTableInput(index, e) }} className={`text-center w-28 ${PRInquiryData?.purchase_team_acknowledgement ? "" : "hidden"}`} />
                  </TableCell>
                  {/* <TableCell className='flex justify-center'><Input className='text-center w-28' type='checked' onChange={(e)=>{handleTableCheck(index,e.target.checked)}}/></TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {/* purchase team approval buttons */}
      {(PRInquiryData?.purchase_team == Boolean(0) || PRInquiryData?.asked_to_modify == Boolean(0)) && PRInquiryData?.rejected == Boolean(0) && (
          <div className={`flex justify-end pr-4 pb-4 gap-4 ${designation != "Enquirer" ? "" : "hidden"}`}>
            <Button variant={"nextbtn"} size={"nextbtnsize"} className={`py-2.5 hover:bg-white hover:text-black ${PRInquiryData?.purchase_team_acknowledgement ? "hidden" : ""}`} onClick={() => { setIsModifyDialog(true) }}>Modify</Button>

            {
              PRInquiryData?.purchase_team_acknowledgement == Boolean(1) ?
                <Button variant={"nextbtn"} size={"nextbtnsize"} className={`py-2.5 hover:bg-white hover:text-black ${PRInquiryData?.purchase_team_approved == Boolean(0) ? "" : "hidden"}`} onClick={() => { setIsApproved(true); setIsDialog(true) }}>Approve</Button>
                :
                <Button variant={"nextbtn"} size={"nextbtnsize"} className='py-2.5 hover:bg-white hover:text-black' ref={acknowledgeButtonRef} onClick={() => { setIsAcknowledgeDialog(true) }}>Acknowledge</Button>
            }
            {
              <Button variant={"nextbtn"} size={"nextbtnsize"} className={`py-2.5 hover:bg-white hover:text-black ${designation != "Enquirer" && PRInquiryData?.purchase_team_approved == Boolean(0) ? "" : "hidden"}`} onClick={() => { setIsReject(true); setIsDialog(true) }}>Reject</Button>
            }
          </div>
      )}

      {isDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
          <Comment_box handleClose={handleClose} Submitbutton={handleApproval} handleComment={handleComment} />
        </div>
      }
      {isModifyDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
          <Comment_box handleClose={handleClose} Submitbutton={handleModify} handleComment={handleComment} />
        </div>
      }
      {isAcknowledgeDialog &&
        <div className="absolute z-50 flex pt-10 items-center justify-center inset-0 bg-black bg-opacity-50">
          <Comment_box className='' handleClose={handleClose} Submitbutton={handleAcknowledge} handleComment={handleComment}>
            <div className="">
              <h1 className="text-[12px] font-normal text-[#626973] pb-2">Expected Delivery</h1>
              <Input className='w-44' type='Date' onChange={(e) => { setDate(e.target.value) }} min={today} />
              <div className='pt-3 italic'>
                <h1 className='text-[10px] bg-slate-400 font-mono'>Disclaimer: The Expected Delivery Date can be changed based on the Purchase Order and Purchase Requisition.</h1>
              </div>
            </div>
          </Comment_box>
        </div>
      }
      {
        isEmailDialog &&
        <PopUp handleClose={handleEmailClose} headerText='Additional Flow' isSubmit={true} Submitbutton={handleAddionalFlow}>
          <div className="col-span-1 py-4 ">
            <h1 className="text-[14px] font-normal text-[#000000] pb-2">
              To Email
            </h1>
            <Input onChange={(e) => { setToEmail(e.target.value) }} value={toEmail ?? ""} />
          </div>
        </PopUp>
      }
    </div>
  )
}

export default PRInquiryForm