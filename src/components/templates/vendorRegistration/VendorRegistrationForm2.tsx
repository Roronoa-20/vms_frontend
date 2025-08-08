'use client'
import { Input } from "@/components/ui/input";
import {useState} from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../atoms/select";
import { TcompanyNameBasedDropdown, TpurchaseOrganizationBasedDropdown, TReconsiliationDropdown, TvendorRegistrationDropdown, VendorRegistrationData } from "@/src/types/types";
import API_END_POINTS from "@/src/services/apiEndPoints";
import requestWrapper from "@/src/services/apiCall";
import { useVendorStore } from '../../../store/VendorRegistrationStore';
import { AxiosResponse } from "axios";
import { Button } from "../../atoms/button";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { handleSubmit } from "./utility";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../atoms/table";
import { EyeIcon, Trash2 } from "lucide-react";
import { TtableData } from "../../pages/VendorRegistration";

interface Props {
  incoTermsDropdown:TvendorRegistrationDropdown["message"]["data"]["incoterm_master"]
  companyDropdown:TvendorRegistrationDropdown["message"]["data"]["company_master"]
  currencyDropdown:TvendorRegistrationDropdown["message"]["data"]["currency_master"]
  formData:Partial<VendorRegistrationData>
  handlefieldChange:(e:React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)=>void
      handleSelectChange:(value:any,name:string)=>void
  tableData:TtableData[]
  setTableData:React.Dispatch<React.SetStateAction<TtableData[]>>
  handleSubmit:()=>void
  multiVendor:any
}


const VendorRegistration2 = ({incoTermsDropdown,companyDropdown,currencyDropdown,formData,handlefieldChange,handleSelectChange,setTableData,tableData,handleSubmit,multiVendor}:Props) => {
  // const { data, updateField,updateVendorTypes, resetForm } = useVendorStore();
  const [companyBasedDropdown,setCompanyBasedDropdown] = useState<TcompanyNameBasedDropdown["message"]["data"]>();
  const [purchaseOrganizationBasedDropdown,setPurchaseOrganizationBasedDropdown] = useState<TpurchaseOrganizationBasedDropdown["message"]["all_account_groups"]>()
  const [reconciliationDropdown,setReconciliationDropdown] = useState<TReconsiliationDropdown["message"]["data"]>([])
  const [singleTableData,setSingleTableData] = useState<TtableData | null>(null);
  const router = useRouter();
  const handleCompanyDropdownChange = async(value:string)=>{
    // handleSelectChange(value,'company_name');
    setSingleTableData((prev:any)=>({...prev,company_name:value}));
    const url = API_END_POINTS?.companyBasedDropdown;
    const response = await requestWrapper({url:url,method:"GET",params:{company_name:value}})
    const data:TcompanyNameBasedDropdown = response?.status == 200?response?.data:"";
    setCompanyBasedDropdown(data?.message?.data);
    fetchReconciliationAccount(value);
  }

  const handlePurchaseOrganizationDropdownChange = async(value:string)=>{
    // handleSelectChange(value,'purchase_organization');
    setSingleTableData((prev:any)=>({...prev,purchase_organization:value}));
    const url = API_END_POINTS?.purchaseGroupBasedDropdown;
    const response = await requestWrapper({url:url,method:"POST",data:{data:{purchase_organization:value,vendor_types:multiVendor}}})
    const data:TpurchaseOrganizationBasedDropdown = response?.status == 200?response?.data:"";
    setPurchaseOrganizationBasedDropdown(data?.message?.all_account_groups);
    if(data?.message?.org_type == "Domestic"){
      handleSelectChange('INR','order_currency');
    }else{
      handleSelectChange('','order_currency');
    }
  }

  const fetchReconciliationAccount = async (value:string)=>{
    const reconsiliationUrl = API_END_POINTS?.reconsiliationDropdown;
      const ReconciliationdropDownApi:AxiosResponse = await requestWrapper({url:reconsiliationUrl,method:"POST",data:{data:{company:value}}});
      const reconciliationDropdown:TReconsiliationDropdown["message"]["data"] = ReconciliationdropDownApi?.status == 200 ? ReconciliationdropDownApi?.data?.message?.data : ""
      setReconciliationDropdown(reconciliationDropdown);
  }

  const handleAdd = async()=>{
    const multiVendorType = await Promise.all(multiVendor?.map((item:any)=>({
      vendor_type:item
    })))
    setTableData((prev:any) => ([...prev, { ...singleTableData, vendor_types: [...multiVendorType] }]))
    setSingleTableData(null);
  }

    const handleRowDelete = (index: number) => {
    // Remove the contact at the given index from the contactDetail store
    const updatedContacts = tableData.filter((_, itemIndex) => itemIndex !== index);
    setTableData([]);
    updatedContacts.forEach((item:any) => setTableData(item));
  }

  return (
    <div>
      <h1 className="text-[20px] font-medium pb-1 leading-[24px] text-[#03111F] border-b border-slate-500">
        Purchase Team Details
      </h1>
      <div className="px-10 grid grid-cols-4">
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
        <div className="flex items-center pt-3">
          <h1 className="text-[15px] text-nowrap font-normal text-[#626973]">
            Check Double Invoice
          </h1>
          <Input type="checkbox" disabled checked={true} className="h-5" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 p-5">
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Company Name
          </h1>
          <Select required={true} onValueChange={(value)=>{handleCompanyDropdownChange(value)}} value={singleTableData?.company_name ?? ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Company Name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyDropdown ?
                  companyDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Organization
          </h1>
          <Select required onValueChange={(value)=>{handlePurchaseOrganizationDropdownChange(value)}} value={singleTableData?.purchase_organization??""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Purchase Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?.purchase_organizations ?
                  companyBasedDropdown?.purchase_organizations?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Account Group
          </h1>
          <Select required value={singleTableData?.account_group ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,account_group:value}));}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Account Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  purchaseOrganizationBasedDropdown ?
                  purchaseOrganizationBasedDropdown?.map((item)=>(

                    <SelectItem value={item?.name} key={item?.name}>{item?.account_group_description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Purchase Group
          </h1>
          <Select required value={singleTableData?.purchase_group ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,purchase_group:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Purchase Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?
                  companyBasedDropdown?.purchase_groups?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Terms Of Payment
          </h1>
          <Select required value={singleTableData?.terms_of_payment ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,terms_of_payment:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Terms Of Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  companyBasedDropdown?.terms_of_payment ?
                  companyBasedDropdown?.terms_of_payment?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.description}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Order Currency
          </h1>
          <Select required value={singleTableData?.order_currency ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,order_currency:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Order Currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  currencyDropdown ?
                  currencyDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col">
          <h1 className="text-[12px] font-normal text-[#626973] pb-3">
            Inco Terms
          </h1>
          <Select required value={singleTableData?.incoterms ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,incoterms:value}))}}>
            <SelectTrigger>
              <SelectValue placeholder="Select Inco Terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {
                  incoTermsDropdown ? 
                  incoTermsDropdown?.map((item)=>(
                    <SelectItem value={item?.name} key={item?.name}>{item?.name}</SelectItem>
                  )):
                  <div className="text-center">No Value</div>
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
                <h1 className="text-[12px] font-normal text-[#626973] pb-3">
                  Reconciliation Account
                </h1>
                {/* <Input placeholder="" disabled defaultValue={OnboardingDetail?.reconciliation_account}/> */}
                <Select value={singleTableData?.reconciliation_account ?? ""} onValueChange={(value)=>{setSingleTableData((prev:any)=>({...prev,reconciliation_account:value}))}} required={true}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {
                                  reconciliationDropdown?.map((item,index)=>(
                                    <SelectItem key={index} value={item?.name}>{item?.reconcil_description}</SelectItem>
                                  ))
                                }
                              </SelectGroup>
                            </SelectContent>
                          </Select>
              </div>
      </div>
      <div className="flex justify-end mb-4"><Button className="bg-blue-400 hover:bg-blue-400" onClick={()=>{handleAdd()}}>Add</Button></div>
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
                  <TableHead className="text-center">Company</TableHead>
                  <TableHead className="text-center">Purchase Organization</TableHead>
                  <TableHead className="text-center">Account Group</TableHead>
                  <TableHead className="text-center">Purchase Group</TableHead>
                  <TableHead className="text-center">Terms Of Payment</TableHead>
                  <TableHead className="text-center">Order Currency</TableHead>
                  <TableHead className="text-center">Inco Terms</TableHead>
                  <TableHead className="text-center">Reconciliation Account</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-center">
                {tableData?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index +1}</TableCell>
                    <TableCell>{item?.company_name}</TableCell>
                    <TableCell>{item?.purchase_organization}</TableCell>
                    <TableCell>{item?.account_group}</TableCell>
                    <TableCell>{item?.purchase_group}</TableCell>
                    <TableCell>{item?.terms_of_payment}</TableCell>
                    <TableCell>{item?.order_currency}</TableCell>
                    <TableCell>{item?.incoterms}</TableCell>
                    <TableCell>{item?.reconciliation_account}</TableCell>
                    <TableCell><Trash2 className="text-red-400 cursor-pointer" onClick={()=>{handleRowDelete(index)}}></Trash2></TableCell>
                    {/* <TableCell><div className='flex gap-4 justify-center items-center'>
                        <EyeIcon className='cursor-pointer'/>
                        </div>
                        </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
      <div className="flex justify-end gap-3">
        <Button className="bg-blue-400 hover:bg-blue-400">Cancel</Button>
        <Button id="submitButton" type="submit" className="bg-blue-400 hover:bg-blue-400" onClick={()=>{handleSubmit()}}>Submit</Button>
      </div>
    </div>
  );
};

export default VendorRegistration2;

